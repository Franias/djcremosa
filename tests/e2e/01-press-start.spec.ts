import { test, expect, type Page } from "@playwright/test";

/**
 * 01 — Press Start gate (/)
 *
 * The gate is the very first interaction a visitor has with the
 * site. It must:
 *   - appear on first visit
 *   - hide the SiteNav while active (body[data-gate-active="true"])
 *   - lock body scroll while active
 *   - dismiss on click, Space, or Enter
 *   - persist dismissal in sessionStorage (replay protection)
 *   - be skippable via ?skipGate=1
 */

async function freshContext(page: Page) {
  // Each test gets its own browser context (Playwright default), but
  // sessionStorage is fresh too. We reset to be safe.
  await page.goto("/?skipGate=1");
  await page.evaluate(() => sessionStorage.clear());
}

test.describe("01 — Press Start gate", () => {
  test("splash overlay appears on first visit", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    // The overlay is a dialog with a "press start"-flavored label.
    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toBeVisible();
    await expect(splash.getByText(/press start/i).first()).toBeVisible();
  });

  test("SiteNav header is hidden while splash is active", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    // body[data-gate-active="true"] → CSS hides the SiteNav header
    const dataAttr = await page.evaluate(() =>
      document.body.getAttribute("data-gate-active"),
    );
    expect(dataAttr).toBe("true");

    // The header is in the DOM but visually hidden
    const header = page.locator("header").first();
    await expect(header).toBeAttached();
    // isVisible() returns false for display:none elements
    await expect(header).toBeHidden();
  });

  test("body scroll is locked while splash is active", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });

  test("clicking the splash dismisses it", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toBeVisible();
    await splash.getByText(/press start/i).first().click();

    // After click: fade-out (380ms) then unmount
    await expect(splash).toHaveCount(0, { timeout: 5_000 });

    // The home h1 (CREMOSA bubble) should now be visible
    await expect(page.locator("h1").first()).toBeVisible();

    // Body attribute cleared, scroll restored
    const dataAttr = await page.evaluate(() =>
      document.body.getAttribute("data-gate-active"),
    );
    expect(dataAttr).toBeNull();
  });

  test("Space key dismisses the splash", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toBeVisible();
    await page.keyboard.press("Space");
    await expect(splash).toHaveCount(0, { timeout: 5_000 });
  });

  test("Enter key dismisses the splash", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(splash).toHaveCount(0, { timeout: 5_000 });
  });

  test("?skipGate=1 bypasses the splash", async ({ page }) => {
    await page.goto("/?skipGate=1");

    // No splash, home content directly visible
    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toHaveCount(0);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("splash does not replay after dismissal (sessionStorage)", async ({
    page,
  }) => {
    await page.goto("/?skipGate=1");
    await page.evaluate(() => sessionStorage.clear());
    await page.goto("/");

    // First visit: splash shows
    const splash = page.getByRole("dialog", { name: /press start/i });
    await expect(splash).toBeVisible();
    await splash.getByText(/press start/i).first().click();
    await expect(splash).toHaveCount(0, { timeout: 5_000 });

    // Reload: sessionStorage is preserved across page reloads
    await page.reload();
    const splashAfterReload = page.getByRole("dialog", {
      name: /press start/i,
    });
    await expect(splashAfterReload).toHaveCount(0);
  });

  test("progress bar fills 0 → 100% over ~2s", async ({ page }) => {
    await freshContext(page);
    await page.goto("/");

    // Wait for the progress bar to be present
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();

    // After 1s, it should be partially filled
    await page.waitForTimeout(1_000);
    const midpoint = await progressBar.getAttribute("aria-valuenow");
    expect(midpoint).not.toBe("100");
    expect(midpoint).not.toBe("0");

    // After 2.5s total, it should be at 100
    await page.waitForTimeout(1_500);
    const final = await progressBar.getAttribute("aria-valuenow");
    expect(final).toBe("100");
  });
});
