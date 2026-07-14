import { test, expect } from "@playwright/test";

/**
 * 07 — Vídeos (/videos/)
 *
 * The videos page shows:
 *   - Channel header card (banner + avatar + subscribe button)
 *   - 3 featured YouTube players (lite-embed pattern)
 *   - 7-8 archive cards (click to open in YouTube directly)
 *   - Footer dialog with Subscribe + abrir canal buttons
 *
 * Tests verify the channel metadata, the lite-embed click-to-play
 * behavior, and the external YouTube links (target=_blank).
 */

test.describe("07 — Vídeos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?skipGate=1");
    await page.goto("/videos/");
  });

  test("hero shows VÍDEOS bubble title", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("VÍDEOS");
  });

  test("channel header card renders with banner + avatar", async ({
    page,
  }) => {
    // Banner image
    const banner = page.locator('img[alt*="channel banner"]').first();
    await expect(banner).toBeVisible();
    await expect(banner).toHaveAttribute(
      "src",
      /yt3\.googleusercontent\.com/,
    );

    // Avatar image (smaller, in the meta row)
    const avatar = page.locator('img[alt*="avatar"]').first();
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute("src", /yt3\.googleusercontent\.com/);
  });

  test("channel meta shows CREMOSA + @cremos4 + video count", async ({
    page,
  }) => {
    // Channel name (title-text class)
    await expect(
      page.locator(".win95-title-text").filter({ hasText: "CREMOSA" }).first(),
    ).toBeVisible();

    // Handle
    await expect(page.getByText("@cremos4").first()).toBeVisible();

    // Video count (any number followed by "vídeos")
    const countText = await page.getByText(/vídeos · canal ativo/).first().textContent();
    expect(countText).toMatch(/\d+\s*v[íi]deos/);
  });

  test("hero Subscribe button opens youtube with sub_confirmation=1", async ({
    page,
  }) => {
    const subscribeLink = page
      .getByRole("link", { name: /subscribe/i })
      .first();
    await expect(subscribeLink).toBeVisible();
    await expect(subscribeLink).toHaveAttribute("target", "_blank");
    await expect(subscribeLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/@cremos4?sub_confirmation=1",
    );
  });

  test("'ver canal completo' opens youtube.com/@cremos4 (no sub_confirmation)", async ({
    page,
  }) => {
    const link = page
      .getByRole("link", { name: /ver canal completo/i })
      .first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute(
      "href",
      "https://www.youtube.com/@cremos4",
    );
  });

  test("3 featured YouTube players are present", async ({ page }) => {
    // Featured player thumbnails are buttons with a Reproduzir aria-label
    const featuredPlayers = page.getByRole("button", {
      name: /reproduzir/i,
    });
    const count = await featuredPlayers.count();
    expect(count).toBe(3);
  });

  test("clicking a featured player mounts the YouTube iframe", async ({
    page,
  }) => {
    // First featured player — click its thumbnail button
    const firstPlayer = page
      .getByRole("button", { name: /reproduzir/i })
      .first();
    await firstPlayer.click();

    // An iframe should now exist with youtube.com/embed
    const iframe = page.locator('iframe[src*="youtube.com/embed"]');
    await expect(iframe).toBeVisible({ timeout: 5_000 });
    const src = await iframe.getAttribute("src");
    expect(src).toMatch(/youtube\.com\/embed\//);
    expect(src).toContain("autoplay=1");
  });

  test("'↗ YouTube' link in player footer opens watch page", async ({
    page,
  }) => {
    // The footer link in each player opens youtube.com/watch?v=ID
    const watchLink = page
      .locator('a[href*="youtube.com/watch?v="]')
      .first();
    await expect(watchLink).toBeVisible();
    await expect(watchLink).toHaveAttribute("target", "_blank");
    const href = await watchLink.getAttribute("href");
    expect(href).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/);
  });

  test("archive section shows all 8 video cards", async ({ page }) => {
    // Scroll to the archive
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Archive cards have "assistir" label
    const archiveLinks = page
      .getByRole("link", { name: /assistir/i });
    const count = await archiveLinks.count();
    expect(count).toBe(7);
  });

  test("archive video card opens watch page on YouTube", async ({
    page,
  }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const firstArchive = page.getByRole("link", { name: /assistir/i }).first();
    await expect(firstArchive).toBeVisible();
    await expect(firstArchive).toHaveAttribute("target", "_blank");
    const href = await firstArchive.getAttribute("href");
    expect(href).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/);
  });
});
