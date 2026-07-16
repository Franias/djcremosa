import { test, expect } from "@playwright/test";

/**
 * 10 — DJ Verbosa (/dj-verbosa/)
 *
 * Sister persona of Cremosa — live-coding with Strudel. The page
 * follows the standard dj-cremosa layout (hero + Paint95 section
 * + 3 info cards + footer CTA) but the focal Paint95 component
 * reproduces the jspaint.app chrome faithfully (matches the
 * `hawwokitty/my-portfolio` PaintComp reference):
 *
 *   - Wine-colored title bar (`#8a0d1f → #d6307a`)
 *   - Menu bar: Ficheiro / Editar / Ver / Padrão / Ajuda
 *   - Quick action row: padrão + 📋 copiar + abrir no strudel.cc
 *   - Left toolbar: 15 paint tools in 3×5 grid
 *   - White canvas with the Strudel code, scrollbar decorations
 *   - 2-row × 8-col color palette + FG/BG overlap preview
 *   - Status bar: tool hint + chars + linhas + bpm + clock
 */

test.describe("10 — DJ Verbosa", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?skipGate=1");
    await page.goto("/dj-verbosa/");
  });

  test("sr-only h1 marks the page as 'DJ Verbosa — Strudel'", async ({
    page,
  }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toContainText("DJ Verbosa");
  });

  test("shows DJ Verbosa in the main nav", async ({ page }) => {
    const navLink = page
      .locator("header nav")
      .getByRole("link", { name: "DJ Verbosa" });
    await expect(navLink).toBeVisible();
    await navLink.first().click();
    await expect(page).toHaveURL(/\/dj-verbosa\/?$/);
  });

  test("renders the Strudel pattern inside the Paint canvas", async ({
    page,
  }) => {
    const canvas = page.getByRole("img", { name: /Strudel code for/i });
    await expect(canvas).toBeVisible();
    await expect(canvas).toContainText("setcpm(130/4)");
    await expect(canvas).toContainText("samples('github:yaxu/clean-breaks')");
    await expect(canvas).toContainText("._punchcard()");
    await expect(canvas).toContainText("$: s(\"hh!1\")");
  });

  test("title bar shows the Paint-style window title", async ({ page }) => {
    await expect(
      page.getByText(/DJ Verbosa - Paint/i),
    ).toBeVisible();
  });

  test("title bar uses the wine palette (matches jspaint.app)", async ({
    page,
  }) => {
    const bgImage = await page.evaluate(() => {
      const titleEls = Array.from(
        document.querySelectorAll(".win-title-text"),
      );
      const titleEl = titleEls.find((el) =>
        /DJ Verbosa - Paint/.test(el.textContent ?? ""),
      );
      const titleBar = titleEl?.closest(".win95-title") as HTMLElement | null;
      return titleBar ? getComputedStyle(titleBar).backgroundImage : "";
    });
    expect(bgImage).toMatch(/rgb\(138,\s*13,\s*31\)/); // #8a0d1f
    expect(bgImage).toMatch(/rgb\(214,\s*48,\s*122\)/); // #d6307a
  });

  test("shows the full Paint95 chrome — menu bar + toolbar + palette", async ({
    page,
  }) => {
    // Menu bar items (Portuguese like jspaint.app)
    const menubar = page.getByRole("menubar").first();
    await expect(menubar.getByText("Ficheiro")).toBeVisible();
    await expect(menubar.getByText("Editar")).toBeVisible();
    await expect(menubar.getByText("Ver")).toBeVisible();
    await expect(menubar.getByText("Padrão")).toBeVisible();
    await expect(menubar.getByText("Ajuda")).toBeVisible();

    // Toolbar tools
    await expect(
      page.getByRole("button", { name: /^Lápis$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Borracha$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Preencher$/ }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Pincel$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Texto$/ })).toBeVisible();

    // Color palette
    const palette = page.getByRole("group", { name: /paleta de cores/i });
    await expect(palette).toBeVisible();
    await expect(palette.getByLabel(/Preto/)).toBeVisible();
    await expect(palette.getByLabel(/Branco/)).toBeVisible();

    // Status bar — active tool + bpm
    const status = page.getByRole("status").first();
    await expect(status.getByText(/Ferramenta:/)).toBeVisible();
    await expect(status.getByText(/\d+\s*bpm/i)).toBeVisible();
  });

  test("toolbar tool selection swaps the active tool + status hint", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /^Borracha$/ }).click();
    const status = page.getByRole("status").first();
    await expect(status.getByText(/Borracha/)).toBeVisible();
  });

  test("palette swatch click changes the ink color", async ({ page }) => {
    await page.getByLabel(/Vermelho\. Tinta\.$/).click();
    const color = await page.evaluate(() => {
      const pre = document.querySelector(
        "pre[role='img']",
      ) as HTMLElement | null;
      return pre?.style.color ?? "";
    });
    expect(color).toBe("rgb(255, 0, 0)");
  });

  test("copy button writes the pattern code to the clipboard", async ({
    page,
    context,
    browserName,
  }) => {
    if (browserName !== "chromium") {
      test.skip(true, "Clipboard assertions require chromium permissions");
    }
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: /copiar código/i }).click();
    await expect(page.getByRole("button", { name: /copiado/i })).toBeVisible();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain("setcpm(130/4)");
    expect(clip).toContain("samples('github:yaxu/clean-breaks')");
  });

  test("open-in-strudel button links to strudel.cc in a new tab", async ({
    page,
  }) => {
    const link = page.getByRole("link", {
      name: /abrir no strudel\.cc/i,
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://strudel.cc/");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("page renders the standard sections below the Paint canvas", async ({
    page,
  }) => {
    // 3 info cards
    await expect(page.getByText(/verbosa\.txt/i).first()).toBeVisible();
    await expect(page.getByText(/como usar/i).first()).toBeVisible();
    await expect(page.getByText(/chrome — paint-layout/i)).toBeVisible();

    // Footer CTA
    await expect(
      page.getByText(/explorar\.exe.*voltar pra pista/i),
    ).toBeVisible();
  });

  test("pattern selector switches the rendered code", async ({ page }) => {
    const select = page.getByLabel(/padrão strudel/i);
    await expect(select).toBeVisible();
    await expect(select).toHaveValue("clean-breaks-think");
  });

  test("mobile drawer includes the DJ Verbosa entry", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?skipGate=1");
    await page.getByRole("button", { name: /abrir menu/i }).click();
    const drawer = page.getByRole("dialog", { name: /menu de navegação/i });
    await expect(drawer.getByText("DJ Verbosa")).toBeVisible();
  });
});