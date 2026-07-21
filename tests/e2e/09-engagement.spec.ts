import { test, expect } from "@playwright/test";

/**
 * 09 — Engagement widgets (footer countdown + visit counter)
 *
 * The footer countdown is rendered by `<FooterCountdown>` from the
 * shared `Win95StatusBar`. It picks the next confirmed/non-cancelled
 * event from `content/events.ts` and ticks every 30 s.
 *
 * The visit counter is rendered by `<VisitCounter>` on the home page.
 * It uses playhtml page data for the persistent total and playhtml presence
 * for the live "online agora" value. The browser-local timestamp prevents
 * duplicate increments within 24 hours.
 *
 * Both widgets are SSR-safe: the visitor runtime loads playhtml only after
 * hydration, while the modal remains usable if the cloud service is down.
 */

const COUNTDOWN_SELECTOR = '[data-testid="footer-countdown"]';
const COUNTER_SELECTOR = '[data-testid="visit-counter"]';
const COUNTER_VALUE_SELECTOR = '[data-testid="visit-counter-value"]';
const COUNTER_WELCOME_SELECTOR = '[data-testid="visit-counter-welcome"]';
const COUNTER_MESSAGE_SELECTOR = '[data-testid="visit-counter-message"]';

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

  test("countdown shows a dd:hh:mm:ss-shaped value after hydration", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    const link = page.locator(COUNTDOWN_SELECTOR).first();
    // Allow up to 2 ticks (≈ 60s) for the countdown to swap the
    // placeholder. In practice the first tick happens within ~30s
    // of page load, but we extend the timeout to keep CI stable.
    await expect(link).toHaveText(/^\d{2}:\d{2}:\d{2}:\d{2}$/, {
      timeout: 90_000,
    });
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
  test("opens visitantes.exe with persistent total and live online count", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    const counter = page.locator(COUNTER_SELECTOR).first();
    await expect(counter).toBeVisible();

    await counter.click();
    const modal = page.locator('[data-testid="visit-counter-modal"]');
    await expect(modal).toBeVisible();
    await expect(
      page.locator(COUNTER_WELCOME_SELECTOR),
    ).toHaveText(/bem vindo ao meu site/i);
    await expect(
      page.locator(COUNTER_MESSAGE_SELECTOR),
    ).toContainText(/Parabéns! Você é meu visitante de nº:/i);
    await expect(
      page.locator(COUNTER_VALUE_SELECTOR),
    ).toHaveText(/^\d{6}$/);
    await expect(
      page.locator('[data-testid="visit-counter-online"]'),
    ).toHaveText(/online agora:\s+\d{2}/i);
  });

  test("does not increment again while the browser is inside the 24h window", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "cremosa-visit-recorded-at",
        String(Date.now()),
      );
    });
    await page.goto("/?skipGate=1");
    await page.locator(COUNTER_SELECTOR).first().click();
    await expect(
      page.locator(COUNTER_VALUE_SELECTOR),
    ).toHaveText(/^\d{6}$/);
  });

  test("shows two live presences when two browser tabs are open", async ({
    browser,
  }) => {
    const firstContext = await browser.newContext();
    const secondContext = await browser.newContext();
    const first = await firstContext.newPage();
    const second = await secondContext.newPage();
    await Promise.all([
      first.goto("/?skipGate=1"),
      second.goto("/?skipGate=1"),
    ]);
    await first.waitForTimeout(3500);
    await second.waitForTimeout(1000);

    await first.locator(COUNTER_SELECTOR).first().click();
    await expect(
      first.locator('[data-testid="visit-counter-online"]'),
    ).toHaveText(/online agora:\s+0[2-9]/i);
    await firstContext.close();
    await secondContext.close();
  });

  test("keeps the visitor modal usable when the cloud service is unavailable", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    await page.route("https://api.playhtml.fun/**", (route) =>
      route.abort("failed"),
    );
    await page.goto("/?skipGate=1");
    await page.locator(COUNTER_SELECTOR).first().click();
    await expect(
      page.locator('[data-testid="visit-counter-modal"]'),
    ).toBeVisible();
    expect(
      consoleErrors.filter((error) => /visitor|playhtml|realtime/i.test(error)),
      `unexpected realtime console errors:\n${consoleErrors.join("\n")}`,
    ).toEqual([]);
  });

  test("renders the visitor counter tile on the home page", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    const counters = page.locator(COUNTER_SELECTOR);
    await expect(counters.first()).toBeVisible();
    await expect(counters).toHaveCount(2);
  });
});
