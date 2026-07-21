import { test, expect } from "@playwright/test";

/**
 * 10 — DJ Verbosa (/dj-verbosa/)
 *
 * The page renders the MS Paint 95 reference image as a static
 * background and overlays an editable <textarea> on the white
 * canvas area. The user can type/edit the Strudel code directly
 * inside the Paint canvas. No buttons, no interactive chrome.
 *
 * The image used is `${site.basePath}/img/paint95-bg.png` (1089×759,
 * copied from the user's reference screenshot). The selector
 * below uses `*=...paint95-bg.png` so it matches whether the
 * `site.basePath` prefix is empty (dev) or `/djcremosa.exe`
 * (production on GitHub Pages).
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

  test("no Copy / Open buttons are rendered in the paint section", async ({
    page,
  }) => {
    // Per the user's spec — no Copy, no Open, no Padrão selector,
    // no toolbar interactions on the static image. The palette
    // overlay is the ONE exception (clicking a color changes the
    // code font color); it's a separate button, not a Copy/Open
    // chrome button.
    await expect(page.getByRole("button", { name: /copiar código/i }))
      .toHaveCount(0);
    await expect(page.getByRole("link", { name: /abrir no strudel/i }))
      .toHaveCount(0);
  });

  test("clicking a palette cell changes the code font color", async ({
    page,
  }) => {
    // The palette is a transparent button overlay positioned over
    // the 15×2 color cells in the static image. Clicking a cell
    // samples the pixel from an offscreen canvas and updates the
    // textarea's color.
    const palette = page.getByRole("button", {
      name: /paleta de cores do paint 95/i,
    });
    await expect(palette).toBeAttached();
    await palette.scrollIntoViewIfNeeded();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });

    // Default ink color is black.
    const initialColor = await editor.evaluate(
      (el: HTMLTextAreaElement) => getComputedStyle(el).color,
    );
    expect(initialColor).toBe("rgb(0, 0, 0)");

    // Click on the bright-red cell (column 3 of 14, bottom row,
    // #f0371d). Cell center in image coords is x ≈ 141 of 1089
    // (image-fx ≈ 0.1295). The palette button starts at image-fx
    // 0.058 and ends at 0.4646 (button width 0.4066), so
    // button-relative fx = (0.1295 - 0.058) / 0.4066 ≈ 0.176.
    // fy ≈ 0.93 lands on the bottom row (y=667..690 of image).
    const box = await palette.boundingBox();
    expect(box).not.toBeNull();
    await palette.click({
      position: {
        x: box!.width * 0.176,
        y: box!.height * 0.93,
      },
    });
    // Allow React state to flush AND the 120ms color CSS transition
    // to finish (the textarea uses `transition: color 120ms linear`
    // so getComputedStyle would return a mid-animation value if we
    // sampled too early).
    await page.waitForTimeout(250);

    const newColor = await editor.evaluate(
      (el: HTMLTextAreaElement) => getComputedStyle(el).color,
    );
    // Should be a saturated red — not black and not gray.
    expect(newColor).not.toBe("rgb(0, 0, 0)");
    const [r, g, b] = newColor.match(/\d+/g)!.map(Number);
    expect(r).toBeGreaterThan(150);
    expect(g).toBeLessThan(120);
    expect(b).toBeLessThan(120);
  });

  test("column 1 (black/white) and column 2 (gray/gray) are pickable", async ({
    page,
  }) => {
    // The first two columns of the palette are NEUTRAL colors:
    //   • Col 1 — top: BLACK (#000000), bottom: WHITE (#ffffff)
    //   • Col 2 — top: DARK GRAY (#808080), bottom: MEDIUM GRAY (#c0c0c0)
    // These were missed in v1 (button started at image-fx 0.124)
    // and the user asked us to cover them. The palette region was
    // extended to start at 0.058 so these cells are inside the
    // click target, and the saturation filter has an allow-list
    // for the four palette neutrals.
    const palette = page.getByRole("button", {
      name: /paleta de cores do paint 95/i,
    });
    await palette.scrollIntoViewIfNeeded();
    const box = await palette.boundingBox();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const pick = async (bfx: number, bfy: number): Promise<string> => {
      await palette.click({ position: { x: box!.width * bfx, y: box!.height * bfy } });
      // Wait for both React state flush and 120ms CSS transition.
      await page.waitForTimeout(250);
      return editor.evaluate((el: HTMLTextAreaElement) => getComputedStyle(el).color);
    };

    // Helper to convert image-fx → button-relative fx for the
    // documented column centers.
    // button fx = (image fx - 0.058) / (0.4646 - 0.058) = (image fx - 0.058) / 0.4066
    const btnFx = (imgFx: number) => (imgFx - 0.058) / 0.4066;
    // Column 1 mid image-fx ≈ 78 / 1089 = 0.0716 → btn fx ≈ 0.0335
    // Column 2 mid image-fx ≈ 112 / 1089 = 0.1028 → btn fx ≈ 0.110

    // Column 1 top → BLACK. fy=0.4 lands on top row (y=647 of 635..658).
    expect(await pick(btnFx(0.0716), 0.4)).toBe("rgb(0, 0, 0)");
    // Column 1 bottom → WHITE. fy=0.93 lands on bottom row (y=686).
    expect(await pick(btnFx(0.0716), 0.93)).toBe("rgb(255, 255, 255)");
    // Column 2 top → DARK GRAY (#808080).
    expect(await pick(btnFx(0.1028), 0.4)).toBe("rgb(128, 128, 128)");
    // Column 2 bottom → MEDIUM GRAY (#c0c0c0).
    expect(await pick(btnFx(0.1028), 0.93)).toBe("rgb(192, 192, 192)");
  });

  test("palette click keeps focus on the textarea", async ({ page }) => {
    // Clicking a color must NOT steal focus from the textarea, so
    // the user can keep typing without re-clicking back into the
    // canvas. We click on a real color cell (not the row gap) so
    // the click handler fires — if focus shifts, the bug is real.
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    await editor.click();
    await editor.evaluate((el: HTMLTextAreaElement) => {
      el.selectionStart = el.selectionEnd = el.value.length;
    });

    const palette = page.getByRole("button", {
      name: /paleta de cores do paint 95/i,
    });
    await palette.scrollIntoViewIfNeeded();
    const box = await palette.boundingBox();
    await palette.click({
      position: {
        x: box!.width * 0.176,
        y: box!.height * 0.93,
      },
    });

    const focused = await page.evaluate(
      () => document.activeElement?.tagName.toLowerCase(),
    );
    expect(focused).toBe("textarea");
  });

  // ────────────────────────────────────────────────────────────────
  // Toolbar buttons (Star, Eraser, Tinter, Rectangle)
  // ────────────────────────────────────────────────────────────────

  test("Star button toggles the paint-blink animation on the textarea", async ({
    page,
  }) => {
    const star = page.getByRole("button", { name: /estrela/i });
    await star.scrollIntoViewIfNeeded();
    await expect(star).toBeAttached();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });

    // Initially no blink class.
    const beforeClass = await editor.getAttribute("class");
    expect(beforeClass ?? "").not.toContain("animate-paint-blink");

    // Click → animation class is added.
    await star.click();
    await page.waitForTimeout(50);
    const afterOnClass = await editor.getAttribute("class");
    expect(afterOnClass ?? "").toContain("animate-paint-blink");
    await expect(star).toHaveAttribute("aria-pressed", "true");

    // Click again → animation class is removed.
    await star.click();
    await page.waitForTimeout(50);
    const afterOffClass = await editor.getAttribute("class");
    expect(afterOffClass ?? "").not.toContain("animate-paint-blink");
    await expect(star).toHaveAttribute("aria-pressed", "false");
  });

  test("Rectangle button copies the code to the clipboard (Ctrl+C)", async ({
    page,
    context,
  }) => {
    // Mirrors Cmd/Ctrl+C: focus + select all + write to the system
    // clipboard. Playwright needs clipboard-read permission on the
    // browser context to verify the contents.
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const rect = page.getByRole("button", {
      name: /retângulo\s\u2014/iu, // the em-dash after "Retângulo " disambiguates from "Retângulo arredondado"
    });
    await rect.scrollIntoViewIfNeeded();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const valueLen = await editor.evaluate(
      (el: HTMLTextAreaElement) => el.value.length,
    );
    expect(valueLen).toBeGreaterThan(0);

    await rect.click();
    // Both the focus/select and the async clipboard write happen
    // inside the handler — give React + clipboard API a beat.
    await page.waitForTimeout(100);

    // 1. Selection still covers the full value (visual feedback).
    const selection = await editor.evaluate((el: HTMLTextAreaElement) => ({
      start: el.selectionStart,
      end: el.selectionEnd,
    }));
    expect(selection.start).toBe(0);
    expect(selection.end).toBe(valueLen);

    // 2. Focus stayed on the textarea (no button-focus jump).
    const focused = await page.evaluate(
      () => document.activeElement?.tagName.toLowerCase(),
    );
    expect(focused).toBe("textarea");

    // 3. Clipboard contents match the textarea value.
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(await editor.inputValue());
  });

  test("Eraser button toggles between clearing and restoring the code", async ({
    page,
  }) => {
    // User flow per the spec:
    //   1st click → save current code, clear textarea
    //   2nd click → restore the saved code
    // (If the user types something between the two clicks, the next
    // clear snapshots that new content as the restore value —
    // implemented in the textarea's onChange handler.)
    const eraser = page.getByRole("button", { name: /borracha/i });
    await eraser.scrollIntoViewIfNeeded();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const initialValue = await editor.inputValue();
    expect(initialValue.length).toBeGreaterThan(0);

    // First click → empty (snapshotted initialValue).
    await eraser.click();
    await page.waitForTimeout(50);
    expect(await editor.inputValue()).toBe("");

    // Second click → restore the snapshotted value.
    await eraser.click();
    await page.waitForTimeout(50);
    expect(await editor.inputValue()).toBe(initialValue);
  });

  test("Tinter button toggles dark mode (black bg + white text)", async ({
    page,
  }) => {
    const tinter = page.getByRole("button", { name: /tinta/i });
    await tinter.scrollIntoViewIfNeeded();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });

    // Default: transparent bg, black text.
    const before = await editor.evaluate((el: HTMLTextAreaElement) => ({
      bg: getComputedStyle(el).backgroundColor,
      fg: getComputedStyle(el).color,
    }));
    expect(before.bg).toBe("rgba(0, 0, 0, 0)");
    expect(before.fg).toBe("rgb(0, 0, 0)");

    // Tinter on → black bg, white text.
    await tinter.click();
    await page.waitForTimeout(200); // CSS transition is 120ms
    const on = await editor.evaluate((el: HTMLTextAreaElement) => ({
      bg: getComputedStyle(el).backgroundColor,
      fg: getComputedStyle(el).color,
    }));
    expect(on.bg).toBe("rgb(0, 0, 0)");
    expect(on.fg).toBe("rgb(255, 255, 255)");
    await expect(tinter).toHaveAttribute("aria-pressed", "true");

    // Tinter off → restore default.
    await tinter.click();
    await page.waitForTimeout(200);
    const off = await editor.evaluate((el: HTMLTextAreaElement) => ({
      bg: getComputedStyle(el).backgroundColor,
      fg: getComputedStyle(el).color,
    }));
    expect(off.bg).toBe("rgba(0, 0, 0, 0)");
    expect(off.fg).toBe("rgb(0, 0, 0)");
    await expect(tinter).toHaveAttribute("aria-pressed", "false");
  });

  test("Toolbar buttons keep focus on the textarea after click", async ({
    page,
  }) => {
    // Same guarantee we give the palette button: clicking a tool
    // shouldn't steal focus, so the user can keep typing.
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    await editor.click();
    await editor.evaluate((el: HTMLTextAreaElement) => {
      el.selectionStart = el.selectionEnd = el.value.length;
    });

    const tinter = page.getByRole("button", { name: /tinta/i });
    await tinter.scrollIntoViewIfNeeded();
    await tinter.click();
    const focused = await page.evaluate(
      () => document.activeElement?.tagName.toLowerCase(),
    );
    expect(focused).toBe("textarea");
  });

  test("Pigment button cycles the ink color through the rainbow", async ({
    page,
  }) => {
    // The pigment icon sits directly below the eraser (Row 3, Col 1
    // of the toolbar). Each click advances the color through 7
    // ROYGBIV-ish steps (red, orange, yellow, green, blue, indigo,
    // violet). After the 7th click (at violet), the 8th click EXITS
    // rainbow mode and restores the ink color that was active before
    // the cycle started — a "deactivate the change" reset path.
    const pigment = page.getByRole("button", { name: /pigmento/i });
    await pigment.scrollIntoViewIfNeeded();
    await expect(pigment).toBeAttached();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const getColor = () =>
      editor.evaluate((el: HTMLTextAreaElement) => getComputedStyle(el).color);

    const rainbow = [
      "rgb(255, 0, 0)",     // Red
      "rgb(255, 127, 0)",   // Orange
      "rgb(255, 255, 0)",   // Yellow
      "rgb(0, 255, 0)",     // Green
      "rgb(0, 0, 255)",     // Blue
      "rgb(75, 0, 130)",    // Indigo
      "rgb(148, 0, 211)",   // Violet
    ];

    // Initial state = black (the default ink). Clicks 1–7 walk
    // through the rainbow.
    expect(await getColor()).toBe("rgb(0, 0, 0)");
    for (let i = 0; i < rainbow.length; i++) {
      await pigment.click();
      // 120ms CSS transition on the textarea color.
      await page.waitForTimeout(180);
      const c = await getColor();
      expect(
        c,
        `expected rainbow step ${i} (${rainbow[i]}) but got ${c}`,
      ).toBe(rainbow[i]);
    }

    // 8th click resets to the pre-cycle color (default black).
    await pigment.click();
    await page.waitForTimeout(180);
    expect(await getColor()).toBe("rgb(0, 0, 0)");

    // Subsequent clicks start a new cycle from red.
    await pigment.click();
    await page.waitForTimeout(180);
    expect(await getColor()).toBe(rainbow[0]);
  });

  test("Pigment resumes the cycle from the current inkColor", async ({
    page,
  }) => {
    // If the user picks a non-rainbow color from the palette first,
    // the next pigment click should start at the BEGINNING of the
    // cycle (red), not silently do nothing. After clicking once
    // (advancing to orange), it should still proceed normally.
    const pigment = page.getByRole("button", { name: /pigmento/i });
    await pigment.scrollIntoViewIfNeeded();

    // Pick white from the palette (column 1 bottom row). The browser
    // samples it as rgb(255, 255, 255), which is definitely not in
    // our rainbow so the resume-from-start logic is exercised.
    const palette = page.getByRole("button", {
      name: /paleta de cores do paint 95/i,
    });
    await palette.scrollIntoViewIfNeeded();
    const pBox = await palette.boundingBox();
    // Column 1 bottom is at button-relative fx = (0.0716 - 0.058) / 0.4066
    // ≈ 0.0335, fy ≈ 0.93 (bottom row).
    await palette.click({ position: { x: pBox!.width * 0.034, y: pBox!.height * 0.93 } });
    await page.waitForTimeout(200);

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const before = await editor.evaluate((el: HTMLTextAreaElement) => getComputedStyle(el).color);
    expect(before).toBe("rgb(255, 255, 255)");
    expect(
      [
        "rgb(255, 0, 0)",
        "rgb(255, 127, 0)",
        "rgb(255, 255, 0)",
        "rgb(0, 255, 0)",
        "rgb(0, 0, 255)",
        "rgb(75, 0, 130)",
        "rgb(148, 0, 211)",
      ],
    ).not.toContain(before);

    // First click after white → red (idx was -1, so nextIdx = 0).
    await pigment.click();
    await page.waitForTimeout(180);
    expect(
      await editor.evaluate((el: HTMLTextAreaElement) => getComputedStyle(el).color),
    ).toBe("rgb(255, 0, 0)");

    // Second click → orange (idx 0 → 1).
    await pigment.click();
    await page.waitForTimeout(180);
    expect(
      await editor.evaluate((el: HTMLTextAreaElement) => getComputedStyle(el).color),
    ).toBe("rgb(255, 127, 0)");
  });

  test("Magnify button grows the font size proportionally and caps at 100px", async ({
    page,
  }) => {
    // The magnifier icon is at Row 3, Col 2 of the toolbar. Each
    // click multiplies the current size by 1.25 (so growth is
    // proportional — bigger fonts grow by bigger amounts). Capped
    // at FONT_SIZE_MAX = 100px.
    const magnify = page.getByRole("button", { name: /lupinha/i });
    await magnify.scrollIntoViewIfNeeded();
    await expect(magnify).toBeAttached();

    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const getSize = () =>
      editor.evaluate(
        (el: HTMLTextAreaElement) => parseFloat(getComputedStyle(el).fontSize),
      );

    // Initial = 14px (matches the old clamp max).
    expect(await getSize()).toBe(14);

    // First 5 clicks walk through the proportional steps. Math.round
    // rounds .5 up, so the sequence is 14 → 18 → 23 → 29 → 36 → 45.
    const expected = [18, 23, 29, 36, 45];
    for (const px of expected) {
      await magnify.click();
      await page.waitForTimeout(50);
      expect(await getSize(), `expected ${px}px after a magnify click`).toBe(
        px,
      );
    }

    // Click many more times until we hit the cap. From 45 the
    // sequence is 56 → 70 → 88 → 100 — 4 clicks.
    for (let i = 0; i < 4; i++) {
      await magnify.click();
      await page.waitForTimeout(20);
    }
    expect(await getSize()).toBe(100);

    // At the cap, the next click resets to the base (14px) — a
    // "deactivate the change" path. (Multiple past-100 clicks no
    // longer just stay at 100; the first one resets, and subsequent
    // ones re-grow from base.)
    await magnify.click();
    await page.waitForTimeout(50);
    expect(await getSize()).toBe(14);

    // After reset, next click grows from base → 18px.
    await magnify.click();
    await page.waitForTimeout(50);
    expect(await getSize()).toBe(18);
  });


  test("all 16 toolbar buttons are clickable (presence + smoke action)", async ({
    page,
  }) => {
    // Master smoke test: every one of the 16 MS Paint 95 toolbar
    // icons that DJ Verbosa wires up must (a) exist as a button and
    // (b) respond to a click with a deterministic state change.
    //
    // The 16 cells in display order (left column + right column,
    // row by row) — positions confirmed by Python+PIL measurement of
    // /public/img/paint95-bg.png at 1089×759:
    //
    //   Row 1, Col 1  ⭐ Star        blink code (animate-paint-blink)
    //   Row 1, Col 2  ▢  Dashed Rect copy to clipboard
    //   Row 2, Col 1  🧽 Eraser      clear / restore
    //   Row 2, Col 2  🎨 Tinter      dark / light mode
    //   Row 3, Col 1  🖌  Pigment    rainbow cycle + 8th-click reset
    //   Row 3, Col 2  🔍 Magnify    zoom ×1.25 capped at 100px
    //   Row 4, Col 1  ✏️  Pencil     toggle // comment
    //   Row 4, Col 2  🖌  Brush      recent-colors cycle
    //   Row 5, Col 1  💨 Spray      active-line highlight toggle
    //   Row 5, Col 2  🅰  Font       bold / normal toggle
    //   Row 6, Col 1  📏 Line       insert // ──── separator
    //   Row 6, Col 2  〰  Curve      wrap selection in ( )
    //   Row 7, Col 1  ▭  RectEmpty  wrap in // ┌──┐ // │ ... │ // └──┘
    //   Row 7, Col 2  ⏧  Polygon    word-wrap toggle
    //   Row 8, Col 1  ⬭  Ellipse    de-indent (mirror Shift+Tab)
    //   Row 8, Col 2  ▢  Rounded    save / load preset via localStorage
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });

    // Snapshot the initial textarea value so we can restore between
    // smoke actions (some buttons mutate code).
    const initialValue = await editor.inputValue();

    // Each entry: { name, regex-on-aria-label, optional action to
    // verify it ran }. Buttons are matched by partial label so the
    // assertions survive Portuguese copy tweaks.
    const cases: Array<{
      label: RegExp;
      before: (() => Promise<void>) | null;
      after: (() => Promise<void>) | null;
    }> = [
      // Row 1
      { label: /estrela/i, before: null, after: null },
      { label: /retângulo\s—/iu, before: null, after: null },
      // Row 2
      { label: /borracha/i, before: null, after: null },
      { label: /tinta/i, before: null, after: null },
      // Row 3
      { label: /pigmento/i, before: null, after: null },
      { label: /lupinha/i, before: null, after: null },
      // Row 4
      { label: /lápis/i, before: null, after: null },
      { label: /pincel/i, before: null, after: null },
      // Row 5 — NEW buttons (will be missing until implemented)
      { label: /spray/i, before: null, after: null },
      { label: /fonte/i, before: null, after: null },
      // Row 6
      { label: /linha/i, before: null, after: null },
      { label: /curva/i, before: null, after: null },
      // Row 7 — NEW
      { label: /retângulo\svazio|retangulo\svazio/i, before: null, after: null },
      { label: /polígono|poligono/i, before: null, after: null },
      // Row 8
      { label: /elipse/i, before: null, after: null },
      { label: /retângulo\sarredondado|retangulo\sarredondado/i, before: null, after: null },
    ];

    expect(cases.length).toBe(16); // sanity check on the test itself

    const found: string[] = [];
    const missing: string[] = [];
    for (const c of cases) {
      const btn = page.getByRole("button", { name: c.label }).first();
      const visible = await btn
        .isVisible({ timeout: 500 })
        .catch(() => false);
      if (visible) found.push(c.label.source);
      else missing.push(c.label.source);
    }

    expect(
      missing,
      `Missing ${missing.length} toolbar button(s): ${missing.join(", ")}. ` +
        `Found ${found.length}/16. ` +
        `Expected every cell in the 2×8 grid to be wired.`,
    ).toEqual([]);

    // Now click each one in sequence to confirm clicks are received
    // (no "intercepted pointer events" / hidden-element errors).
    // Reset the code before each click so cumulative edits don't
    // confuse downstream actions.
    for (const c of cases) {
      // Restore the initial value via the React state pathway.
      await editor.fill(initialValue);
      const btn = page.getByRole("button", { name: c.label }).first();
      await btn.scrollIntoViewIfNeeded();
      // The "click" itself is the smoke test. We use force:false so
      // Playwright's actionability checks (visible, enabled, stable,
      // receives events) catch any overlap / occluder / pointer-
      // events:none regressions.
      await btn.click({ timeout: 2000 });
    }
  });

  test("Brush button cycles through recent colors (with fallback on fresh page)", async ({
    page,
  }) => {
    // On a fresh page the color history only contains the default
    // "#000000" so the v1 brush was a silent no-op. The v2 brush
    // initializes with a 5-color starter palette on first click so
    // the tool is immediately useful, then cycles through.
    const brush = page.getByRole("button", { name: /^pincel/i });
    await brush.scrollIntoViewIfNeeded();
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const getColor = () =>
      editor.evaluate(
        (el: HTMLTextAreaElement) => getComputedStyle(el).color,
      );

    // Initial = black. First click seeds history with the fallback
    // and shows the first color (red).
    expect(await getColor()).toBe("rgb(0, 0, 0)");
    await brush.click();
    await page.waitForTimeout(200);
    expect(await getColor()).toBe("rgb(255, 0, 0)");

    // Subsequent clicks cycle forward: red → green → blue → yellow
    // → black → red (wraps). The cycle advances by one step per
    // click, so 5 clicks after the first one should return to red.
    const cycle = [
      "rgb(0, 255, 0)",     // green
      "rgb(0, 0, 255)",     // blue
      "rgb(255, 255, 0)",   // yellow
      "rgb(0, 0, 0)",       // black
      "rgb(255, 0, 0)",     // red (wraps)
    ];
    for (const expected of cycle) {
      await brush.click();
      await page.waitForTimeout(200);
      expect(
        await getColor(),
        `expected ${expected} after another brush click`,
      ).toBe(expected);
    }
  });

  test("Spray button toggles the active-line highlight (class + magenta inset)", async ({
    page,
  }) => {
    // `^spray` to disambiguate from any other label containing "spray".
    const spray = page.getByRole("button", { name: /^spray/i });
    await spray.scrollIntoViewIfNeeded();
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });

    // Snapshot the resolved box-shadow so the test catches the
    // common regression where the class is added but the CSS rule
    // is missing (the toggle "does nothing" visually).
    const shadow = () =>
      editor.evaluate(
        (el: HTMLTextAreaElement) => getComputedStyle(el).boxShadow,
      );

    const beforeShadow = await shadow();
    // Baseline state has no paint-line-highlight class AND a
    // transparent box-shadow (none / rgba(..., 0)).
    expect(
      (await editor.getAttribute("class")) ?? "",
    ).not.toContain("paint-line-highlight");
    expect(beforeShadow === "none" || /rgba\(.*,\s*0\)/.test(beforeShadow)).toBe(true);

    // Click → adds the class AND resolves to a magenta inset ring.
    await spray.click();
    await page.waitForTimeout(50);
    expect(
      (await editor.getAttribute("class")) ?? "",
    ).toContain("paint-line-highlight");
    await expect(spray).toHaveAttribute("aria-pressed", "true");
    const onShadow = await shadow();
    // Must contain a magenta-tinted rgba (the `--color-magenta`
    // #d6307a = rgb(214, 48, 122)). Loose match — accepts any
    // opacity — so the test survives future palette tweaks.
    expect(onShadow).toMatch(/214,\s*48,\s*122/);

    // Click again → removes the class AND the ring disappears.
    await spray.click();
    await page.waitForTimeout(50);
    expect(
      (await editor.getAttribute("class")) ?? "",
    ).not.toContain("paint-line-highlight");
    await expect(spray).toHaveAttribute("aria-pressed", "false");
    const offShadow = await shadow();
    expect(offShadow === "none" || /rgba\(.*,\s*0\)/.test(offShadow)).toBe(true);
  });

  test("Font button toggles bold on the textarea (font-weight 400 ↔ 700)", async ({
    page,
  }) => {
    // `^fonte` — the Lupinha aria-label contains the word "fonte"
    // ("zoom da fonte") so a plain /fonte/i match resolves to BOTH
    // buttons. Anchor to the start of the label to disambiguate.
    const font = page.getByRole("button", { name: /^fonte/i });
    await font.scrollIntoViewIfNeeded();
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const getWeight = () =>
      editor.evaluate(
        (el: HTMLTextAreaElement) => getComputedStyle(el).fontWeight,
      );

    // Default 400.
    expect(await getWeight()).toBe("400");

    // Click → bold (700).
    await font.click();
    await page.waitForTimeout(50);
    expect(await getWeight()).toBe("700");
    await expect(font).toHaveAttribute("aria-pressed", "true");

    // Click again → back to normal (2-click reset).
    await font.click();
    await page.waitForTimeout(50);
    expect(await getWeight()).toBe("400");
    await expect(font).toHaveAttribute("aria-pressed", "false");
  });

  test("Line button inserts and removes a // ──── separator (2-click reset)", async ({
    page,
  }) => {
    // The Lápis, Elipse, and Spray aria-labels all contain the word
    // "linha" — anchor to "Linha —" to disambiguate.
    const line = page.getByRole("button", { name: /^linha\s—/i });
    await line.scrollIntoViewIfNeeded();
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const value = () => editor.inputValue();

    const before = await value();
    await line.click();
    await page.waitForTimeout(100);
    const afterInsert = await value();
    expect(afterInsert).toContain("// ─");
    expect(afterInsert.length).toBeGreaterThan(before.length);

    // Click 2 → removes the inserted separator.
    await line.click();
    await page.waitForTimeout(100);
    expect(await value()).toBe(before);
    await expect(line).toHaveAttribute("aria-pressed", "false");
  });

  test("RectEmpty button wraps the selection in an ASCII box (2-click reset)", async ({
    page,
  }) => {
    const rectEmpty = page.getByRole("button", {
      name: /retângulo\svazio/i,
    });
    await rectEmpty.scrollIntoViewIfNeeded();
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const value = () => editor.inputValue();

    // Select a unique substring inside the default code and wrap it.
    // We invoke the button click programmatically (rather than via
    // Playwright's .click() which simulates a real mouse and can
    // shift focus) so the textarea's selectionStart/End survive
    // until the onClick handler reads them. The onMouseDown
    // preventDefault on the button keeps focus stable during a real
    // click too — this is purely belt-and-braces for the test.
    const original = await value();
    const target = "setcpm(130/4)";
    const start = original.indexOf(target);
    const end = start + target.length;

    const out = await page.evaluate(
      async ({ start, end }) => {
        const ta = document.querySelector(
          'textarea[aria-label*="Editor de código"]',
        ) as HTMLTextAreaElement;
        ta.focus();
        ta.setSelectionRange(start, end);
        const btn = document.querySelector(
          'button[aria-label*="Retângulo vazio"]',
        ) as HTMLButtonElement;
        btn.click();
        // Give React time to flush the state update before reading
        // the textarea's resolved value.
        await new Promise((r) => setTimeout(r, 100));
        return {
          value: ta.value,
          sel: [ta.selectionStart, ta.selectionEnd],
        };
      },
      { start, end },
    );
    expect(out.value).toContain("┌");
    expect(out.value).toContain("│ " + target + " │");
    expect(out.value).toContain("└");
    expect(out.value).toContain(target);

    // Click 2 (also programmatic) → restores the original.
    await page.evaluate(async () => {
      const btn = document.querySelector(
        'button[aria-label*="Retângulo vazio"]',
      ) as HTMLButtonElement;
      btn.click();
      await new Promise((r) => setTimeout(r, 100));
    });
    await page.waitForTimeout(50);
    expect(await value()).toBe(original);
    await expect(rectEmpty).toHaveAttribute("aria-pressed", "false");
  });

  test("Polygon button toggles the textarea's word-wrap attribute", async ({
    page,
  }) => {
    const polygon = page.getByRole("button", { name: /polígono|poligono/i });
    await polygon.scrollIntoViewIfNeeded();
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const getWrap = () => editor.getAttribute("wrap");

    // Default = soft (wraps). The button is "active" when wrap is
    // toggled OFF.
    expect(await getWrap()).toBe("soft");

    await polygon.click();
    await page.waitForTimeout(50);
    expect(await getWrap()).toBe("off");
    await expect(polygon).toHaveAttribute("aria-pressed", "true");

    // Click 2 → wraps again.
    await polygon.click();
    await page.waitForTimeout(50);
    expect(await getWrap()).toBe("soft");
    await expect(polygon).toHaveAttribute("aria-pressed", "false");
  });

  test("page renders the standard sections below the editor", async ({
    page,
  }) => {
    // Scope everything to the properties section — there's also a
    // Footer CTA section further down with the same Música/Vídeos
    // links, so .first() alone isn't enough.
    const props = page.locator("#properties-line-dj-verbosa");

    // 3 info cards
    await expect(
      props.getByText(/verbosa\.txt/i).first(),
    ).toBeVisible();
    await expect(
      props.getByText(/como usar/i).first(),
    ).toBeVisible();
    await expect(
      props.getByText(/chrome — explorar/i).first(),
    ).toBeVisible();
    // Música + Vídeos links (scoped to the properties section)
    await expect(
      props.getByRole("link", { name: /Música →/ }),
    ).toBeVisible();
    await expect(
      props.getByRole("link", { name: /Vídeos →/ }),
    ).toBeVisible();
  });

  test("toolbar reference table lists all 16 buttons below the properties section", async ({
    page,
  }) => {
    // The TOOLBAR_REFERENCE card lives in its own section under
    // #toolbar-reference-dj-verbosa, AFTER the properties section.
    const ref = page.locator("#toolbar-reference-dj-verbosa");
    await expect(ref).toBeVisible();
    // The 16 rows of the reference table.
    const rows = ref.locator("tbody tr");
    await expect(rows).toHaveCount(16);
    // The 4 expected columns: Pos. / Ícone / Ação / Reset.
    const headerCells = ref.locator("thead th");
    await expect(headerCells).toHaveCount(4);
    // Spot-check a few rows by their position label so the test
    // catches accidental reorderings.
    for (const pos of ["R1C1", "R4C1", "R6C2", "R8C2"]) {
      await expect(ref.getByText(pos, { exact: true })).toBeVisible();
    }
  });

  test("mobile drawer includes the DJ Verbosa entry", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/?skipGate=1");
    await page.getByRole("button", { name: /abrir menu/i }).click();
    const drawer = page.getByRole("dialog", { name: /menu de navegação/i });
    await expect(drawer.getByText("DJ Verbosa")).toBeVisible();
  });

  // ────────────────────────────────────────────────────────────────
  // File menu (top-left menu bar "File" → dropdown of .txt files)
  // ────────────────────────────────────────────────────────────────
  //
  // The File menu is a real <button> overlaid on the static "File"
  // text in the menu bar of /public/img/paint95-bg.png. Clicking it
  // opens a Win95-style dropdown listing every .txt file from
  // /content/text-files.ts. Selecting a file fetches it from
  // /public/text-files/ and replaces the textarea contents.
  //
  // The test uses accessible roles + names so it survives the visual
  // font and label tweaks (e.g. "afro-jams" is matched by partial
  // text in the menuitem label).

  test("File menu button opens dropdown listing all .txt files", async ({
    page,
  }) => {
    const fileBtn = page.getByRole("button", { name: /menu arquivo/i });
    // Closed at first
    await expect(fileBtn).toHaveAttribute("aria-expanded", "false");
    await expect(fileBtn).toHaveAttribute("aria-haspopup", "menu");

    await fileBtn.click();
    await expect(fileBtn).toHaveAttribute("aria-expanded", "true");

    // The dropdown should be visible with all 6 files
    const menu = page.getByRole("menu", { name: /lista de arquivos/i });
    await expect(menu).toBeVisible();
    // 6 file rows from content/text-files.ts
    const items = menu.getByRole("menuitem");
    await expect(items).toHaveCount(6);

    // Spot-check filenames
    await expect(menu.getByText(/clean-breaks/i)).toBeVisible();
    await expect(menu.getByText(/amapiano-vibe/i)).toBeVisible();
    await expect(menu.getByText(/afro-jams/i)).toBeVisible();
    await expect(menu.getByText(/blank-canvas/i)).toBeVisible();
  });

  test("selecting a file loads its contents into the textarea", async ({
    page,
  }) => {
    const editor = page.getByRole("textbox", {
      name: /editor de código strudel dentro do canvas do paint 95/i,
    });
    const initial = await editor.inputValue();
    expect(initial).not.toContain("AfroJams");

    await page.getByRole("button", { name: /menu arquivo/i }).click();
    await page
      .getByRole("menuitem", { name: /carregar afro-jams/i })
      .click();

    // Menu auto-closes on successful load
    await expect(
      page.getByRole("menu", { name: /lista de arquivos/i }),
    ).toHaveCount(0);

    // Code was replaced with the file's content
    const after = await editor.inputValue();
    expect(after).toContain("AfroJams");
    expect(after).toContain("setcpm(120/4)");
    expect(after).toContain("djembe");
  });

  test("clicking outside the dropdown closes the File menu", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /menu arquivo/i }).click();
    await expect(
      page.getByRole("menu", { name: /lista de arquivos/i }),
    ).toBeVisible();

    // Click on the right side of the page (outside the dropdown)
    await page.mouse.click(1200, 800);
    await expect(
      page.getByRole("menu", { name: /lista de arquivos/i }),
    ).toHaveCount(0);
  });

  test("pressing Escape closes the File menu", async ({ page }) => {
    await page.getByRole("button", { name: /menu arquivo/i }).click();
    await expect(
      page.getByRole("menu", { name: /lista de arquivos/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("menu", { name: /lista de arquivos/i }),
    ).toHaveCount(0);
  });

  test("clicking the File button twice toggles the dropdown", async ({
    page,
  }) => {
    const fileBtn = page.getByRole("button", { name: /menu arquivo/i });
    await fileBtn.click();
    await expect(fileBtn).toHaveAttribute("aria-expanded", "true");
    await fileBtn.click();
    await expect(fileBtn).toHaveAttribute("aria-expanded", "false");
  });
});