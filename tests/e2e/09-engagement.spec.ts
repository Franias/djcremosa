import { test, expect, type Page } from "@playwright/test";

/**
 * 09 — Engagement widgets (footer countdown + visit counter)
 *
 * The footer countdown is rendered by `<FooterCountdown>` from the
 * shared `Win95StatusBar`. It picks the next confirmed/non-cancelled
 * event from `content/events.ts` and ticks every 30 s.
 *
 * The visit counter is rendered by `<VisitCounter>` from inside the
 * propriedades dialog on the home page. It calls
 * `NEXT_PUBLIC_VISIT_COUNTER_URL` (GET/POST) and falls back to
 * `VISITAS: ----` when the env var is missing or the endpoint is
 * unreachable.
 *
 * Both widgets are SSR-safe: the server renders the placeholder and
 * the client hydrates with the real value, so the first paint must
 * match. We assert the placeholder first, then await the real value.
 */

const COUNTDOWN_SELECTOR = '[data-testid="footer-countdown"]';
const COUNTER_SELECTOR = '[data-testid="visit-counter"]';
const COUNTER_VALUE_SELECTOR = '[data-testid="visit-counter-value"]';
const COUNTER_WELCOME_SELECTOR = '[data-testid="visit-counter-welcome"]';
const COUNTER_MESSAGE_SELECTOR = '[data-testid="visit-counter-message"]';

/**
 * Some environments expose the env var through a .env.local that
 * Playwright does not load by default. We mock the counter endpoint
 * via `page.route` and force-bump the localStorage flag so the
 * component treats this session as a fresh visitor and POSTs.
 */
async function mockCounterEndpoint(
  page: Page,
  options: { get?: number; post?: number } = {},
): Promise<void> {
  let total = options.get ?? 0;
  await page.route("**/counter.test/**", async (route, request) => {
    if (request.method() === "POST") {
      total = (options.post ?? total + 1);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: total }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ count: total }),
    });
  });
}

test.describe("09a — Footer countdown", () => {
  test("footer renders a countdown link that points to /agenda/", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    const link = page.locator(COUNTDOWN_SELECTOR).first();
    await expect(link).toBeVisible();
    // Anchor wraps the segment, href resolved by Next with trailing
    // slash when `trailingSlash: true`.
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/agenda\/?$/);
  });

  test("countdown shows a dd:hh:mm-shaped value after hydration", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    const link = page.locator(COUNTDOWN_SELECTOR).first();
    // Allow up to 2 ticks (≈ 60s) for the countdown to swap the
    // placeholder. In practice the first tick happens within ~30s
    // of page load, but we extend the timeout to keep CI stable.
    await expect(link).toHaveText(/^\d{2}:\d{2}:\d{2}$/, { timeout: 90_000 });
  });

  test("countdown is hidden on small viewports to protect footer rhythm", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 800 } });
    const page = await ctx.newPage();
    await page.goto("/?skipGate=1");
    const link = page.locator(COUNTDOWN_SELECTOR).first();
    // Either detached or hidden via Tailwind `hidden md:inline`.
    const visible = await link.isVisible();
    expect(visible).toBe(false);
    await ctx.close();
  });

  test("clicking the countdown navigates to /agenda/", async ({ page }) => {
    await page.goto("/?skipGate=1");
    await page.locator(COUNTDOWN_SELECTOR).first().click();
    await expect(page).toHaveURL(/\/agenda\/?$/);
  });
});

test.describe("09b — Visit counter", () => {
  test("renders the welcome + congratulations copy and a placeholder value when env var is unset", async ({
    page,
  }) => {
    // The test runner does not set NEXT_PUBLIC_VISIT_COUNTER_URL,
    // so the component must render the placeholder and never POST.
    let postSeen = false;
    await page.route("**/counter.test/**", async (route, request) => {
      if (request.method() === "POST") postSeen = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 0 }),
      });
    });
    await page.goto("/?skipGate=1");
    const counter = page.locator(COUNTER_SELECTOR).first();
    const welcome = page.locator(COUNTER_WELCOME_SELECTOR).first();
    const message = page.locator(COUNTER_MESSAGE_SELECTOR).first();
    const value = page.locator(COUNTER_VALUE_SELECTOR).first();
    await expect(counter).toBeVisible();
    await expect(welcome).toHaveText(/bem vindo ao meu site/i);
    await expect(message).toContainText(/Parabéns! Você é meu visitante nº:/i);
    await expect(value).toHaveText(/^---$/);
    // Welcome message renders statically, so it's visible immediately
    // without waiting for any endpoint.
    expect(postSeen).toBe(false);
  });

  test("renders the visitor number as 000123 after the endpoint returns a number", async ({
    page,
  }) => {
    await mockCounterEndpoint(page, { get: 123, post: 124 });
    // We can't directly inject the env var into the page, but the
    // component only calls fetch when `process.env.NEXT_PUBLIC_*` is
    // truthy. Stub `window.process` to simulate that condition.
    // Pre-seed the localStorage flag so the component treats this
    // session as a returning visitor and does a plain GET (skipping
    // the POST that would otherwise bump to 124).
    await page.addInitScript(() => {
      // @ts-expect-error -- intentional dev-only shim
      window.process = { env: { NEXT_PUBLIC_VISIT_COUNTER_URL: "https://counter.test/visits" } };
      window.localStorage.setItem(
        "cremosa-visit-recorded-at",
        String(Date.now()),
      );
    });
    await page.goto("/?skipGate=1");
    const value = page.locator(COUNTER_VALUE_SELECTOR).first();
    await expect(value).toHaveText(/^000123$/, { timeout: 10_000 });
  });

  test("does not POST twice within the 24h window for the same browser", async ({
    page,
  }) => {
    await mockCounterEndpoint(page, { get: 7, post: 8 });
    await page.addInitScript(() => {
      // @ts-expect-error -- intentional dev-only shim
      window.process = { env: { NEXT_PUBLIC_VISIT_COUNTER_URL: "https://counter.test/visits" } };
      // Pre-seed the localStorage flag so the component treats this
      // session as a returning visitor (within the 24h window).
      window.localStorage.setItem(
        "cremosa-visit-recorded-at",
        String(Date.now()),
      );
    });
    let posts = 0;
    await page.route("**/counter.test/**", async (route, request) => {
      if (request.method() === "POST") posts += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 7 }),
      });
    });
    await page.goto("/?skipGate=1");
    await page.waitForTimeout(1500); // allow any rogue POST to fire
    expect(posts).toBe(0);
  });

  test("POSTs when the localStorage flag is older than 24h", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      // @ts-expect-error -- intentional dev-only shim
      window.process = { env: { NEXT_PUBLIC_VISIT_COUNTER_URL: "https://counter.test/visits" } };
      const ONE_DAY = 24 * 60 * 60 * 1000;
      window.localStorage.setItem(
        "cremosa-visit-recorded-at",
        String(Date.now() - ONE_DAY * 2),
      );
    });
    let posts = 0;
    await page.route("**/counter.test/**", async (route, request) => {
      if (request.method() === "POST") posts += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 42 }),
      });
    });
    await page.goto("/?skipGate=1");
    await expect
      .poll(() => posts, { timeout: 10_000 })
      .toBeGreaterThanOrEqual(1);
  });

  test("endpoint failures keep the placeholder and never throw to the console", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      // @ts-expect-error -- intentional dev-only shim
      window.process = { env: { NEXT_PUBLIC_VISIT_COUNTER_URL: "https://counter.test/visits" } };
    });
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    await page.route("**/counter.test/**", (route) => route.abort("failed"));
    await page.goto("/?skipGate=1");
    const value = page.locator(COUNTER_VALUE_SELECTOR).first();
    await expect(value).toHaveText(/^----$/);
    expect(
      consoleErrors.filter((e) => /counter|visit/i.test(e)),
      `unexpected console errors:\n${consoleErrors.join("\n")}`,
    ).toEqual([]);
  });

  test("counter sits below the propriedades dialog on the home page", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    // The propriedades dialog and the counter share the same <aside>.
    const aside = page.locator("aside").filter({ hasText: "propriedades" }).first();
    await aside.scrollIntoViewIfNeeded();
    // The counter lives AFTER the dialog title in DOM order.
    const title = aside.locator("text=cremosa — propriedades").first();
    const counter = aside.locator(COUNTER_SELECTOR).first();
    const titleBox = await title.boundingBox();
    const counterBox = await counter.boundingBox();
    expect(titleBox, "propriedades title box").not.toBeNull();
    expect(counterBox, "counter box").not.toBeNull();
    expect(counterBox!.y).toBeGreaterThan(titleBox!.y);
  });
});