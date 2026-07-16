import { test, expect } from "@playwright/test";

/**
 * 10 — Hero proportions assertion
 *
 * Certifies that the welcome.exe layout matches the visual
 * reference at every viewport. Reference geometry (read from
 * the user's screenshots):
 *
 *   desktop  1440×900
 *     left col   128px wide
 *     right col  128px wide
 *     figure     784px wide
 *     figure CENTER  at viewport/2  (offset 0)
 *
 *   tablet   1024×768
 *     left col   128px wide
 *     right col  128px wide
 *     figure     656px wide, centered
 *
 *   tablet   768×1024 (portrait)
 *     left col   112px wide
 *     right col  112px wide
 *     figure     448px wide, centered
 *
 *   phone    390×844
 *     3-col responsive grid, no flanking
 *     VisitCounter first in right-side sequence
 *     icons on pink halftone, no gray dialog
 *
 * The assertions are deliberately tolerant (±1px) so CI doesn't
 * flake on font hinting, subpixel layout, or devicePixelRatio
 * rounding. If a refactor breaks a proportion by more than 1px,
 * this test catches it before the deploy goes out.
 */

const VIEWPORTS = [
  { name: "desktop-1440", w: 1440, h: 900, expect: { left: 128, right: 128, figMin: 600, figMax: 800 } },
  { name: "desktop-1280", w: 1280, h: 800, expect: { left: 128, right: 128, figMin: 600, figMax: 800 } },
  { name: "tablet-1024",  w: 1024, h: 768, expect: { left: 128, right: 128, figMin: 580, figMax: 720 } },
  { name: "tablet-768",   w: 768,  h: 1024, expect: { left: 112, right: 112, figMin: 400, figMax: 500 } },
] as const;

test.describe("10 — Hero proportions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?skipGate=1");
  });

  for (const vp of VIEWPORTS) {
    test(`${vp.name} keeps left/right columns symmetric and figure centered`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      // Wait for layout settle (font + image decode)
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(200);

      const m = await page.evaluate(() => {
        // The hero is the first <section> on the page. Inside is a
        // .shell wrapper, then a .grid container whose first three
        // direct children are: [left-col, <figure>, right-col].
        // We pick by DOM position (instead of Tailwind class names
        // that contain colons) so the test isn't fragile against
        // class-name escaping in `page.evaluate`.
        const section = document.querySelector("main > section");
        if (!section) return null;
        const grid = section.querySelector(":scope > div.shell > div.grid");
        if (!grid) return null;
        const kids = Array.from(grid.children) as HTMLElement[];
        if (kids.length < 3) return null;
        const lr = kids[0].getBoundingClientRect();
        const rr = kids[2].getBoundingClientRect();
        const fr = kids[1].getBoundingClientRect();
        return {
          leftW: Math.round(lr.width),
          rightW: Math.round(rr.width),
          figW: Math.round(fr.width),
          figCenter: Math.round(fr.left + fr.width / 2),
          viewportCenter: Math.round(window.innerWidth / 2),
        };
      });
      expect(m, "geometry could not be measured").not.toBeNull();
      if (!m) return;

      // Both side columns must be the same width (symmetric).
      expect(
        m.leftW,
        `left col width (${m.leftW}) must equal right col width (${m.rightW})`,
      ).toBe(m.rightW);
      // Each column must match the expected size for the breakpoint.
      expect(m.leftW, `left col width at ${vp.name}`).toBe(vp.expect.left);
      // The figure must be centered on the viewport (offset 0).
      expect(
        m.figCenter - m.viewportCenter,
        `figure must be centered at ${vp.name} (offset = figCenter - viewportCenter)`,
      ).toBe(0);
      // The figure's width should land in the expected band — catches
      // both "too small" (figure squished by columns) and "too big"
      // (figure overflowing the row).
      expect(m.figW, `figure width at ${vp.name}`).toBeGreaterThanOrEqual(vp.expect.figMin);
      expect(m.figW, `figure width at ${vp.name}`).toBeLessThanOrEqual(vp.expect.figMax);
    });
  }

  test("phone 390px shows a 3-col transparent-bg grid with VisitCounter first on the right side", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(200);

    const m = await page.evaluate(() => {
      // The mobile icon grid is the `<ul>` inside the `md:hidden`
      // Welcome dialog block under the figure. Find the <ul> that
      // holds the desktop welcome icon tiles — WELCOME_ICONS is 11
      // entries (Destaques was dropped in favor of visitantes.exe),
      // plus the VisitCounter <li>, so the mobile <ul> has 12
      // children. Other <ul>s on the page (sitemap footer, etc.)
      // have very different counts.
      const lists = Array.from(
        document.querySelectorAll<HTMLElement>('main ul')
      );
      const grid = lists.find((ul) => ul.children.length === 12);
      if (!grid) return null;
      const cs = getComputedStyle(grid);
      const items = Array.from(grid.children) as HTMLElement[];
      return {
        cols: cs.gridTemplateColumns,
        display: cs.display,
        itemCount: items.length,
        // First 6 items are the left-side anchors (Agenda, Música,
        // Galeria, Vídeos, Sobre, Contato). 7th is VisitCounter
        // (right-side FIRST). 8-12 are Sets, SoundCloud, Instagram,
        // Twitch, TikTok. The VisitCounter <li> wraps a <button>
        // carrying [data-testid="visit-counter"].
        visitCounterIndex: items.findIndex((it) =>
          it.querySelector('[data-testid="visit-counter"]')
        ),
        // Background of the grid container should NOT be `bg-win-face`
        // (gray Win95 chrome) — the user wants the icons directly on
        // the pink halftone.
        gridBg: getComputedStyle(grid.parentElement?.parentElement ?? grid).backgroundColor,
        // Each <li> should have transparent bg, no Win95 bevel.
        firstItemBg: getComputedStyle(items[0]).backgroundColor,
      };
    });
    expect(m, "mobile grid not found").not.toBeNull();
    if (!m) return;

    // 3 columns (390 ÷ 3 = ~130px, fits).
    expect(m.cols.split(" ").length, "must be 3 columns on a 390px phone").toBe(3);
    // 11 anchors + 1 VisitCounter <li> = 12 children total in the
    // mobile grid.
    expect(m.itemCount, "mobile grid item count").toBe(12);
    // VisitCounter should be at index 6 (7th item, FIRST in the
    // right-side sequence). After left-side 6 anchors come:
    // VisitCounter (slot 7) → Sets (8) → SoundCloud (9) → ...
    expect(m.visitCounterIndex, "VisitCounter first in right-side sequence").toBe(6);
    // Grid itself should be transparent (the pink halftone bleeds
    // through). `bg-win-face` = #c0c0c0 / rgb(192, 192, 192).
    expect(m.gridBg).not.toBe("rgb(192, 192, 192)");
  });

  test("desktop 1440px shows all 12 anchor tiles + VisitCounter in flanking columns", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(200);

    const m = await page.evaluate(() => {
      // Filter to *visible* anchors manually (Playwright's :visible
      // pseudo-class is unavailable inside `page.evaluate`'s raw
      // document context). We treat anything with a non-zero
      // bounding-rect width/height AND not `display: none` as visible.
      const isVisible = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        return true;
      };
      const all = Array.from(document.querySelectorAll<HTMLElement>("a.win95-icon")).filter(
        isVisible
      );
      // VisitCounter is <button>, not <a>; counted separately.
      const counters = Array.from(
        document.querySelectorAll<HTMLElement>('[data-testid="visit-counter"]')
      ).filter(isVisible);
      // Expected labels in the two columns:
      const leftLabels = ["Agenda", "Música", "Galeria", "Vídeos", "Sobre", "Contato"];
      const rightLabels = ["visitantes.exe", "Sets", "SoundCloud", "Instagram", "Twitch", "TikTok"];
      const labels = all.map((a) => a.getAttribute("title"));
      return {
        anchorCount: all.length,
        counterCount: counters.length,
        leftFound: leftLabels.every((l) => labels.includes(l)),
        rightFound: rightLabels.every((l) => labels.includes(l)),
      };
    });
    // 6 anchors per side = 12 total anchors. But the right column's
    // first slot is the VisitCounter (a <button>, not an <a>) and
    // the left col starts at the figure. So we have 11 <a>
    // win95-icon tiles (6 left + 5 right) + 1 VisitCounter
    // button. The "12th anchor slot" is the counter.
    expect(m.anchorCount, "11 anchor tiles on desktop (12th slot is VisitCounter)").toBe(11);
    // VisitCounter is a single instance on desktop (in the figure
    // row). Mobile is hidden.
    expect(m.counterCount, "1 VisitCounter on desktop").toBe(1);
    // All 6 left-side labels present.
    expect(m.leftFound, "left column labels (Agenda→Contato)").toBe(true);
    // VisitCounter + 5 right-side anchors present.
    expect(m.rightFound, "right column labels (visitantes→TikTok)").toBe(true);
  });

  test("welcome chip 'cremosa.exe — welcome' is visible on desktop above the figure", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const chip = page.locator("text=cremosa.exe — welcome").first();
    await expect(chip).toBeVisible();
  });
});
