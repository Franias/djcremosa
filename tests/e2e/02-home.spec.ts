import { test, expect } from "@playwright/test";

/**
 * 02 — Home page (/?skipGate=1)
 *
 * The home page is now a Win95.com-style "welcome" dialog with
 * 12 desktop icons (4×3 grid) + a press highlights section + an
 * about section (readme + propriedades dialogs). The visible h1
 * is sr-only; the visual hierarchy is established by the welcome
 * dialog's title bar.
 */

test.describe("02 — Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?skipGate=1");
  });

  test("sr-only h1 marks the page as 'Cremosa — Início'", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toContainText("Cremosa");
    await expect(h1).toContainText("Início");
  });

  test("welcome dialog 'cremosa.exe — welcome' is visible", async ({ page }) => {
    const welcome = page.locator("text=cremosa.exe — welcome").first();
    await expect(welcome).toBeVisible();
  });

  test("welcome dialog has 12 desktop icons (4x3 grid)", async ({ page }) => {
    // Each icon is an <a> with class "win95-icon" inside the welcome grid
    const icons = page.locator("a.win95-icon");
    const count = await icons.count();
    expect(count).toBe(12);
  });

  test("all 6 page icons link to the correct routes", async ({ page }) => {
    const expected = [
      { label: "Agenda", href: "/agenda/" },
      { label: "Música", href: "/musica/" },
      { label: "Galeria", href: "/galeria/" },
      { label: "Vídeos", href: "/videos/" },
      { label: "Sobre", href: "/sobre/" },
      { label: "Contato", href: "/contato/" },
    ];

    for (const { label, href } of expected) {
      // The icon is the <a.win95-icon> with `title={label}`.
      const icon = page.locator(`a.win95-icon[title="${label}"]`).first();
      await expect(icon).toBeVisible();
      await expect(icon).toHaveAttribute("href", href);
    }
  });

  test("Booking icon links to mailto:", async ({ page }) => {
    const icon = page.locator('a.win95-icon[title="Booking"]').first();
    await expect(icon).toBeVisible();
    const href = await icon.getAttribute("href");
    expect(href).toMatch(/^mailto:franciellipdias@gmail\.com/);
  });

  test("SoundCloud icon opens soundcloud.com/cremosinha", async ({ page }) => {
    const icon = page.locator('a.win95-icon[title="SoundCloud"]').first();
    await expect(icon).toBeVisible();
    const href = await icon.getAttribute("href");
    expect(href).toBe("https://soundcloud.com/cremosinha");
  });

  test("Instagram icon opens instagram.com/djcremosa", async ({ page }) => {
    const icon = page.locator('a.win95-icon[title="Instagram"]').first();
    await expect(icon).toBeVisible();
    const href = await icon.getAttribute("href");
    expect(href).toBe("https://instagram.com/djcremosa");
  });

  test("SiteNav has 8 link elements (home + 6 pages + booking)", async ({
    page,
  }) => {
    // The desktop nav contains:
    // - 1 home icon (Link to /)
    // - 6 page links
    // - 1 booking mailto link
    const nav = page.locator('nav[aria-label="Principal"]').first();
    const links = nav.locator("a");
    await expect(links).toHaveCount(8);
  });

  test("clicking 'Música' in nav navigates to /musica/", async ({ page }) => {
    await page
      .locator('nav[aria-label="Principal"]')
      .getByRole("link", { name: /música/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/musica\/?$/);
  });

  test("press highlights section shows the destaques window", async ({
    page,
  }) => {
    await page
      .locator("text=cremosa.txt — destaques")
      .first()
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator("text=cremosa.txt — destaques").first(),
    ).toBeVisible();
    // At least one of the 5 highlights
    await expect(page.getByText(/Rap in Cena/).first()).toBeVisible();
  });

  test("about section (readme) renders", async ({ page }) => {
    // The readme dialog is below the fold; scroll to it.
    await page
      .locator("text=cremosa.txt — readme")
      .first()
      .scrollIntoViewIfNeeded();
    const readme = page
      .locator("text=cremosa.txt — readme")
      .first();
    await expect(readme).toBeVisible();
    await expect(
      page
        .getByText(/DJ Cremosa é uma artista da cena de Porto Alegre/i)
        .first(),
    ).toBeVisible();
  });

  test("em destaque section shows the press highlights heading", async ({
    page,
  }) => {
    // "Dez anos na pista, da cena de Porto Alegre pro mundo." is the
    // h2 of the press highlights section.
    await page
      .getByRole("heading", { name: /Dez anos na pista/i, level: 2 })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", {
        name: /Dez anos na pista/i,
        level: 2,
      }),
    ).toBeVisible();
  });

  test("footer is a Win95 status bar with Pronto indicator", async ({
    page,
  }) => {
    await page.locator("footer").scrollIntoViewIfNeeded();
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText(/Pronto/).first()).toBeVisible();
  });

  test("footer has a link to /contato/", async ({ page }) => {
    // The footer is below the fold; scroll to it before asserting.
    await page.locator("footer").scrollIntoViewIfNeeded();
    const footer = page.locator("footer");
    // Next.js renders Link hrefs with a trailing slash when
    // `trailingSlash: true` is set in next.config.ts — match both.
    const contatoLink = footer.locator('a[href="/contato"], a[href="/contato/"]');
    await expect(contatoLink.first()).toBeVisible();
  });

  test("'Fechar ×' on readme dialog hides it and shows a reopen button", async ({
    page,
  }) => {
    await page
      .locator("text=cremosa.txt — readme")
      .first()
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator("text=cremosa.txt — readme").first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /fechar/i }).first().click();
    await expect(
      page.locator("text=cremosa.txt — readme (fechado)").first(),
    ).toBeVisible();
  });

  test("'OK' on propriedades dialog hides it and shows a reopen button", async ({
    page,
  }) => {
    await page
      .locator("text=cremosa — propriedades")
      .first()
      .scrollIntoViewIfNeeded();
    await expect(
      page.locator("text=cremosa — propriedades").first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /^OK$/ }).first().click();
    await expect(
      page.locator("text=cremosa — propriedades (fechado)").first(),
    ).toBeVisible();
  });

  test("'Copiar' button copies manifesto to clipboard", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page
      .locator("text=cremosa.txt — readme")
      .first()
      .scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /copiar/i }).first().click();
    await expect(
      page.getByText(/✓ copiado|copiar ✓/i).first(),
    ).toBeVisible({ timeout: 3_000 });
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toContain("DJ Cremosa");
    expect(clipboardText).toContain("música preta global");
  });

});
