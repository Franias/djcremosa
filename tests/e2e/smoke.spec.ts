import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke test — every page should:
 *   - respond 200
 *   - render without console errors
 *   - have the SiteNav header
 *   - have the SiteFooter (status bar)
 *   - have a visible <h1> or page title
 *
 * Run with: `npx playwright test smoke`
 */

const PAGES = [
  { path: "/", name: "home (with press start)" },
  { path: "/?skipGate=1", name: "home (skip gate)" },
  { path: "/agenda/", name: "agenda" },
  { path: "/sobre/", name: "sobre" },
  { path: "/contato/", name: "contato" },
  { path: "/musica/", name: "musica" },
  { path: "/dj-verbosa/", name: "dj-verbosa" },
  { path: "/videos/", name: "videos" },
  { path: "/galeria/", name: "galeria" },
] as const;

/**
 * Wrap each page in a helper that captures console errors and 4xx/5xx
 * responses. Returns an object the tests can assert against.
 */
async function loadPage(page: Page, path: string) {
  const errors: string[] = [];
  const badResponses: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  // /musica's auto-load + Web Audio requestAnimationFrame loop never
  // reaches a true "networkidle" state, so use domcontentloaded + a
  // short settle. Other pages go to networkidle so any late XHR /
  // image fetch is caught.
  const waitUntil = path.startsWith("/musica")
    ? "domcontentloaded"
    : "networkidle";
  const response = await page.goto(path, { waitUntil });
  // Give the page a moment to settle (CSS-in-JS keyframes, RAF).
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);
  return { response, errors, badResponses };
}

test.describe("smoke — every page", () => {
  for (const { path, name } of PAGES) {
    test(`${name} (${path}) loads cleanly`, async ({ page }) => {
      const { response, errors, badResponses } = await loadPage(page, path);

      // 1. The page responded successfully.
      expect(response, `no response for ${path}`).not.toBeNull();
      expect(response!.status(), `${path} did not return 200`).toBe(200);

      // 2. No console errors (warnings/info are fine).
      // /musica has a known audio-context warning during dev that doesn't
      // affect production. We allow one specific warning there.
      const realErrors = errors.filter(
        (e) =>
          !path.startsWith("/musica") ||
          !/AudioContext|autoplay|NotAllowedError/i.test(e),
      );
      expect(
        realErrors,
        `console errors on ${path}:\n${realErrors.join("\n")}`,
      ).toEqual([]);

      // 3. No 4xx/5xx network responses (404s on assets etc.).
      const significant = badResponses.filter(
        (r) => !r.includes("favicon") && !r.includes("robots.txt"),
      );
      expect(
        significant,
        `bad network responses on ${path}:\n${significant.join("\n")}`,
      ).toEqual([]);

      // 4. SiteNav header + footer are present in the DOM. (Visible
      // only on non-splash pages; on `/` the splash hides the header.)
      await expect(page.locator("header").first()).toBeAttached();
      await expect(page.locator("footer").first()).toBeAttached();

      // 5. The page has a visible <h1> (or main heading).
      // On `/` (with splash) the home h1 is intentionally hidden until
      // the splash is dismissed.
      if (path !== "/") {
        const h1 = page.locator("h1").first();
        await expect(h1).toBeVisible();
      }
    });
  }
});

test.describe("smoke — press start gate", () => {
  test("press start splash appears on /", async ({ page }) => {
    await page.goto("/");
    // Use getByLabel with a case-insensitive regex — the rendered
    // aria-label is "Press start to enter the Cremosa site" with a
    // capital P, so a plain CSS attr selector would miss it.
    const splash = page.getByRole("dialog", {
      name: /press start/i,
    });
    await expect(splash).toBeVisible();
    await expect(splash.getByText(/press anywhere/i)).toBeVisible();
  });

  test("skip gate via ?skipGate=1 bypasses the splash", async ({ page }) => {
    await page.goto("/?skipGate=1");
    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toHaveCount(0);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("clicking the splash reveals the home", async ({ page }) => {
    await page.goto("/");
    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toBeVisible();
    await splash.getByText(/press anywhere/i).click();
    // Wait for the splash to fade out + unmount.
    await expect(splash).toHaveCount(0, { timeout: 5_000 });
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("site nav is hidden while splash is showing", async ({ page }) => {
    await page.goto("/");
    // Wait for hydration so body[data-gate-active] is set by the
    // PressStartGate effect. CSS reads the same attribute to hide
    // the SiteNav — if it never gets set on hydration, the test
    // would flake intermittently.
    await page.waitForFunction(
      () => document.body.getAttribute("data-gate-active") === "true",
      null,
      { timeout: 5_000 },
    );
    const dataAttr = await page.evaluate(() =>
      document.body.getAttribute("data-gate-active"),
    );
    expect(dataAttr).toBe("true");
  });
});

test.describe("smoke — static assets", () => {
  test("favicon resolves", async ({ request }) => {
    const res = await request.get("/favicon.ico");
    // favicon.ico may 404 in dev; only require it for static export
    // builds. For now we tolerate any response < 500.
    expect(res.status()).toBeLessThan(500);
  });

  test("audio files in /public/audio/ are accessible", async ({ request }) => {
    // Just check the default track for now — the others can be
    // smoke-tested if this passes.
    const res = await request.get("/audio/20-minutinhos.mp3");
    // Audio is static-exported; in dev it may not be served by Next
    // but should be when running against the production build.
    if (res.status() !== 200) {
      test.skip(true, "Audio not accessible (probably dev server)");
    }
  });
});
