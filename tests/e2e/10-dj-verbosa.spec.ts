import { test, expect } from "@playwright/test";

/**
 * 10 — DJ Verbosa (/dj-verbosa/)
 *
 * The page renders the MS Paint 95 reference image as a static
 * background and overlays an editable <textarea> on the white
 * canvas area. The user can type/edit the Strudel code directly
 * inside the Paint canvas. No buttons, no interactive chrome.
 *
 * The image used is `/img/paint95-bg.png` (1089×759, copied from
 * the user's reference screenshot).
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

  test("renders the static MS Paint 95 background image", async ({ page }) => {
    const bg = page.locator('img[src*="paint95-bg.png"]');
    await expect(bg).toBeAttached();
    // The image is decorative — it carries no alt text (the
    // textarea is the real accessible element for the canvas).
    await expect(bg).toHaveAttribute("aria-hidden", "true");
    // Natural aspect ratio of the source (1089 × 759) is preserved
    // so the textarea overlay stays aligned at any width.
    const aspect = await bg.evaluate(
      (el) => getComputedStyle(el.parentElement!).aspectRatio,
    );
    expect(aspect).toBe("1089 / 759");
  });

  test("renders the editable textarea in the Paint canvas", async ({
    page,
  }) => {
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    await expect(editor).toBeVisible();
    // Initial value is the first registered Strudel pattern.
    await expect(editor).toHaveValue(/setcpm\(130\/4\)/);
    await expect(editor).toHaveValue(/samples\('github:yaxu\/clean-breaks'\)/);
    await expect(editor).toHaveValue(/\._punchcard\(\)/);
  });

  test("user can edit the Strudel code inside the canvas", async ({
    page,
  }) => {
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    await editor.click();
    // Append a comment + new line to the existing code
    await editor.press("End");
    await editor.press("Control+End");
    await editor.press("Enter");
    await editor.type("// hello from the paint canvas");
    await expect(editor).toHaveValue(/\/\/ hello from the paint canvas/);
  });

  test("Tab key inserts two spaces inside the textarea", async ({
    page,
  }) => {
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    // Place the caret at the very start so the 2 spaces land at
    // the end of the value (which has a trailing newline from the
    // pattern code — the assertion checks the trailing chars).
    await editor.click();
    await editor.evaluate((el: HTMLTextAreaElement) => {
      el.selectionStart = 0;
      el.selectionEnd = 0;
    });
    const before = await editor.inputValue();
    await editor.press("Tab");
    await page.waitForTimeout(50);
    const after = await editor.inputValue();
    expect(after.length).toBe(before.length + 2);
    expect(after.startsWith("  ")).toBe(true);
  });

  test("no interactive buttons are rendered in the paint section", async ({
    page,
  }) => {
    // Per the user's spec — no Copy, no Open, no Padrão selector,
    // no toolbar interactions. The image is static.
    await expect(page.getByRole("button", { name: /copiar código/i }))
      .toHaveCount(0);
    await expect(page.getByRole("link", { name: /abrir no strudel/i }))
      .toHaveCount(0);
  });

  test("page renders the standard sections below the editor", async ({
    page,
  }) => {
    // 3 info cards
    await expect(page.getByText(/verbosa\.txt/i).first()).toBeVisible();
    await expect(page.getByText(/como usar/i).first()).toBeVisible();
    await expect(page.getByText(/chrome — explorar/i).first()).toBeVisible();
    // Música + Vídeos links
    await expect(
      page.getByRole("link", { name: /Música →/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Vídeos →/ }),
    ).toBeVisible();
  });

  test("mobile drawer includes the DJ Verbosa entry", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?skipGate=1");
    await page.getByRole("button", { name: /abrir menu/i }).click();
    const drawer = page.getByRole("dialog", { name: /menu de navegação/i });
    await expect(drawer.getByText("DJ Verbosa")).toBeVisible();
  });
});