import { test, expect } from "@playwright/test";

/**
 * 05 — Contato (/contato/)
 *
 * The contato page renders 4 contact cards (Booking, Imprensa, Telefone,
 * Instagram) + a "Solicitar press kit" dialog at the bottom. All CTAs
 * should be mailto: / tel: / external links — no on-page form.
 *
 * The "Imprimir" / "OK" buttons on the agenda instruções dialog are
 * tested in 03-agenda-instructions.spec.ts.
 */

test.describe("05 — Contato", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?skipGate=1");
    await page.goto("/contato/");
  });

  test("sr-only h1 marks the page as 'Contato — Cremosa'", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toContainText("Contato");
  });

  test("shows lede mentioning 72h response time", async ({ page }) => {
    await expect(
      page.getByText(/responde em até\s*72h úteis/i).first(),
    ).toBeAttached();
  });

  test("renders all 4 contact cards", async ({ page }) => {
    // Each card has an eyebrow with the channel name
    await expect(page.getByText(/\/\/ booking/i).first()).toBeVisible();
    await expect(page.getByText(/\/\/ imprensa/i).first()).toBeVisible();
    await expect(page.getByText(/\/\/ telefone/i).first()).toBeVisible();
    await expect(page.getByText(/\/\/ @djcremosa/i).first()).toBeVisible();
  });

  test("Booking card opens mailto: with prefilled subject", async ({ page }) => {
    const bookingLink = page
      .locator("a[href^='mailto:franciellipdias@gmail.com']")
      .first();
    await expect(bookingLink).toBeAttached();
    const href = await bookingLink.getAttribute("href");
    expect(href).toMatch(/^mailto:franciellipdias@gmail\.com/);
    expect(href).toContain("subject=");
  });

  test("Imprensa card opens mailto: with 'Imprensa' subject", async ({
    page,
  }) => {
    // The Imprensa card is the second card in the CARDS array. We
    // find the anchor containing its CTA button (which is also a
    // mailto link with the same href) and check the subject.
    const link = page
      .locator("a[href^='mailto:franciellipdias@gmail.com']")
      .filter({ hasText: /Pedir material/ });
    await expect(link.first()).toBeAttached();
    const href = await link.first().getAttribute("href");
    expect(href).toMatch(/subject=/);
    expect(href).toMatch(/Imprensa/i);
  });

  test("Telefone card uses tel: link with E.164 format", async ({ page }) => {
    const telLink = page.locator("a[href^='tel:+']").first();
    await expect(telLink).toBeAttached();
    const href = await telLink.getAttribute("href");
    // href is rendered as e.g. "tel:+5551993723158" — strip the tel:
    // prefix before checking the +55 51 E.164 pattern.
    const number = href?.replace(/^tel:/, "") ?? "";
    expect(number).toMatch(/^\+55519/);
  });

  test("Instagram card opens instagram.com/djcremosa in new tab", async ({
    page,
  }) => {
    const igLink = page.locator("a[href*='instagram.com/djcremosa']").first();
    await expect(igLink).toBeVisible();
    await expect(igLink).toHaveAttribute("target", "_blank");
    await expect(igLink).toHaveAttribute(
      "href",
      "https://instagram.com/djcremosa",
    );
  });

  test("footer 'Solicitar press kit' dialog has mailto", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const dialog = page
      .locator("text=Solicitar press kit")
      .first();
    await expect(dialog).toBeAttached();
    const mailto = page
      .locator('a[href^="mailto:franciellipdias@gmail.com?subject=Solicitar"]')
      .first();
    await expect(mailto).toBeAttached();
  });
});
