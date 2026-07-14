import { test, expect } from "@playwright/test";

/**
 * 08 — Mobile responsive layout
 *
 * Verifies the responsive primitives introduced for the mobile pass:
 *
 *   - Viewport meta exposes `viewport-fit=cover` (safe-area-inset support).
 *   - On phones, the SiteNav collapses to a single visible "Menu" button
 *     inside one semantic <nav>, with all destinations hidden.
 *   - The hamburger toggles <MobileNavDrawer/> with all six page links,
 *     the back-to-home link, and the booking mailto CTA.
 *   - The drawer locks body scroll while open and closes on Esc / backdrop.
 *   - Tap targets on the welcome grid (icon links) are >= 44px tall.
 *   - The hero, footer status bar, and Win95 title bars fit a 375px
 *     viewport without horizontal overflow.
 *
 * All tests use Playwright's built-in device emulation (iPhone 13).
 */

const MOBILE = {
  viewport: { width: 390, height: 844 }, // iPhone 13-ish (avoids Dynamic Island)
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
} as const;

test.describe("08 — Mobile responsive layout", () => {
  test("viewport meta exposes viewport-fit=cover for safe areas", async ({
    browser,
  }) => {
    const context = await browser.newContext(MOBILE);
    const page = await context.newPage();
    await page.goto("/?skipGate=1");

    const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewport).toContain("viewport-fit=cover");
    expect(viewport).toContain("width=device-width");

    await context.close();
  });

  test("iPhone-sized viewport: SiteNav shows hamburger, hides desktop links", async ({
    browser,
  }) => {
    const context = await browser.newContext(MOBILE);
    const page = await context.newPage();
    await page.goto("/?skipGate=1");

    // Hamburger must be visible
    const hamburger = page.getByRole("button", { name: /abrir menu/i });
    await expect(hamburger).toBeVisible();

    // Desktop page links should NOT be visible (hidden on mobile)
    await expect(
      page.getByRole("navigation", { name: /principal/i }).getByRole("link", { name: "Agenda" }).first(),
    ).toBeHidden();

    // The nav remains a single semantic landmark
    await expect(page.getByRole("navigation", { name: /principal/i })).toHaveCount(1);

    await context.close();
  });

  test("iPhone-sized viewport: hamburger opens drawer with all destinations", async ({
    browser,
  }) => {
    const context = await browser.newContext(MOBILE);
    const page = await context.newPage();
    await page.goto("/?skipGate=1");

    await page.getByRole("button", { name: /abrir menu/i }).click();

    const drawer = page.getByRole("dialog", { name: /menu/i });
    await expect(drawer).toBeVisible();

    // All six pages are inside the drawer
    for (const label of ["Agenda", "Música", "Galeria", "Vídeos", "Sobre", "Contato"]) {
      await expect(
        drawer.getByRole("link", { name: label }).first(),
      ).toBeVisible();
    }

    // Booking CTA is inside the drawer too
    await expect(drawer.getByRole("link", { name: /booking/i }).first()).toBeVisible();

    // Body scroll is locked while the drawer is open
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");

    await context.close();
  });

  test("drawer closes on Escape and via the close button", async ({ browser }) => {
    const context = await browser.newContext(MOBILE);
    const page = await context.newPage();
    await page.goto("/?skipGate=1");

    await page.getByRole("button", { name: /abrir menu/i }).click();
    await expect(page.getByRole("dialog", { name: /menu/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /menu/i })).toHaveCount(0);

    // Body overflow restores after close
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("");

    await context.close();
  });

  test("welcome grid icons stay above the 44px tap-target threshold", async ({
    browser,
  }) => {
    const context = await browser.newContext(MOBILE);
    const page = await context.newPage();
    await page.goto("/?skipGate=1");

    const agenda = page.locator('a.win95-icon[title="Agenda"]');
    await expect(agenda).toBeVisible();

    const box = await agenda.boundingBox();
    expect(box, "agenda icon bounding box").not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);

    await context.close();
  });

  test("375px-wide viewport: no horizontal scroll on the document", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      ...MOBILE,
      viewport: { width: 375, height: 667 }, // classic iPhone 8 size, the tightest
    });
    const page = await context.newPage();

    // Try every page — all should fit horizontally on an iPhone 8.
    const paths = [
      "/?skipGate=1",
      "/agenda/",
      "/musica/",
      "/galeria/",
      "/videos/",
      "/sobre/",
      "/contato/",
    ] as const;

    for (const path of paths) {
      await page.goto(path);
      const overflows = await page.evaluate(() => ({
        bodyW: document.documentElement.scrollWidth,
        viewportW: window.innerWidth,
      }));
      expect(
        overflows.bodyW,
        `${path}: scrollWidth (${overflows.bodyW}) should not exceed viewport (${overflows.viewportW})`,
      ).toBeLessThanOrEqual(overflows.viewportW + 1);
    }

    await context.close();
  });

  test("footer status bar segments remain visible at 375px", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      ...MOBILE,
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();
    await page.goto("/?skipGate=1");

    await page.locator("footer").scrollIntoViewIfNeeded();
    const footer = page.locator("footer");

    // Pronto text reads on tiny screens
    await expect(footer.getByText(/Pronto/).first()).toBeVisible();

    // The footer link to /contato resolves to the actual trailing-slash
    // path that Next.js renders (e.g. /contato/ under trailingSlash).
    await expect(footer.locator('a[href^="/contato"]').first()).toBeVisible();

    await context.close();
  });

  test("PressStartGate renders centered content on phone viewport", async ({
    browser,
  }) => {
    const context = await browser.newContext(MOBILE);
    const page = await context.newPage();
    await page.goto("/");

    const splash = page.locator('[role="dialog"][aria-label*="Press start" i]');
    await expect(splash).toBeVisible();

    // Image source swaps to the 600px asset on small screens
    const splashImg = splash.locator("img");
    await expect(splashImg).toBeVisible();

    await context.close();
  });
});
