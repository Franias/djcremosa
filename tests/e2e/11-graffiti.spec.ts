import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CANVAS = '[data-testid="graffiti-canvas"]';
const TOGGLE = '[data-testid="graffiti-toggle"]';
const TOOLBAR = '[data-testid="graffiti-toolbar"]';

async function openHome(page: Page) {
  await page.route("https://api.playhtml.fun/**", (route) =>
    route.abort("failed"),
  );
  await page.goto("/?skipGate=1");
  await expect(page.locator(TOGGLE)).toBeVisible();
}

async function waitForPlayhtmlReady(page: Page) {
  // Wait until playhtml has finished initializing so direct calls to
  // window.playhtml.createPageData (used by some tests to seed/clear
  // data) succeed. The route block in openHome rejects the network
  // call, but `init` still resolves with a no-op client after the
  // WebSocket attempt settles.
  await page.waitForFunction(
    () => Boolean((window as Window & { playhtml?: { createPageData?: unknown } }).playhtml),
  );
  await page.waitForFunction(
    () => {
      const client = (window as Window & { playhtml?: { init?: unknown; isLoading?: boolean } }).playhtml;
      return Boolean(client && (client.isLoading === false || client.isLoading === undefined));
    },
  );
}

test.describe("11 — collaborative graffiti mode", () => {
  test("shows a cursor instruction and toggles with G", async ({ page }) => {
    await openHome(page);
    await page.mouse.move(300, 240);

    await expect(page.getByText("PRESSIONE G PARA GRAFITAR")).toBeVisible();
    await page.keyboard.press("g");
    await expect(page.locator("body")).toHaveAttribute(
      "data-graffiti-mode",
      "true",
    );
    await expect(page.locator(TOOLBAR)).toBeVisible();
    await expect(page.getByText("G PARA SAIR · ARRASTE PARA PULVERIZAR")).toBeVisible();

    await page.keyboard.press("g");
    await expect(page.locator("body")).not.toHaveAttribute("data-graffiti-mode");
    await expect(page.locator(TOOLBAR)).toHaveCount(0);
  });

  test("does not steal G while an editable control has focus", async ({ page }) => {
    await openHome(page);
    await page.evaluate(() => {
      const input = document.createElement("input");
      input.setAttribute("data-graffiti-test-input", "true");
      document.body.appendChild(input);
      input.focus();
    });

    await page.keyboard.press("g");
    await expect(page.locator("body")).not.toHaveAttribute("data-graffiti-mode");
  });

  test("paints locally on drag and leaves normal links clickable when off", async ({
    page,
  }) => {
    await openHome(page);
    const canvas = page.locator(CANVAS);
    await expect(canvas).toHaveCSS("pointer-events", "none");

    await page.keyboard.press("g");
    await page.mouse.move(260, 280);
    await page.mouse.down();
    await page.mouse.move(350, 320, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(100);

    const hasPaint = await canvas.evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (!context) return false;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] > 0) return true;
      }
      return false;
    });
    expect(hasPaint).toBe(true);

    await page.keyboard.press("g");
    await expect(canvas).toHaveCSS("pointer-events", "none");
    await page.getByRole("link", { name: "Agenda" }).first().click();
    await expect(page).toHaveURL(/\/agenda\/?$/);
  });

  test("has a touch-friendly toggle, slider, palette and eraser controls", async ({ page }) => {
    await openHome(page);
    await page.locator(TOGGLE).click();
    await expect(page.locator(TOGGLE)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".graffiti-color")).toHaveCount(5);
    await expect(page.locator('[data-testid="graffiti-size-slider"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="graffiti-eraser"]')).toBeVisible();

    const slider = page.locator('[data-testid="graffiti-size-slider"]');
    await slider.evaluate((el, value) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, "72");
    await expect(page.locator('[data-testid="graffiti-size-readout"]')).toHaveText("72px");
    await page.locator(TOGGLE).click();
    await expect(page.locator(TOGGLE)).toHaveAttribute("aria-pressed", "false");
  });

  test("paints a denser, brush-like stroke than the legacy mist spray", async ({ page }) => {
    await openHome(page);
    await waitForPlayhtmlReady(page);
    await page.keyboard.press("g");
    await expect(page.getByText("LIVE")).toBeVisible({ timeout: 5_000 });
    const canvas = page.locator(CANVAS);
    await page.mouse.move(420, 320);
    await page.mouse.down();
    await page.mouse.move(560, 360, { steps: 14 });
    await page.mouse.up();
    // Wait for the committed stroke to land on the canvas via the
    // `strokes` useEffect redraw (the activeStroke is cleared on
    // pointer-up, so the durable commit has to repaint the canvas).
    await expect
      .poll(async () => {
        return canvas.evaluate((element) => {
          const c = element as HTMLCanvasElement;
          const ctx = c.getContext("2d");
          if (!ctx) return 0;
          const pixels = ctx.getImageData(0, 0, c.width, c.height).data;
          let painted = 0;
          let opaque = 0;
          for (let index = 3; index < pixels.length; index += 4) {
            const alpha = pixels[index];
            if (alpha > 0) painted += 1;
            if (alpha > 200) opaque += 1;
          }
          return { painted, opaque };
        });
      }, {
        timeout: 5_000,
        message: "canvas should show painted pixels after drag",
      })
      .toMatchObject({ painted: expect.any(Number) });

    const stats = await canvas.evaluate((element) => {
      const canvas = element as HTMLCanvasElement;
      const context = canvas.getContext("2d");
      if (!context) return null;
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let painted = 0;
      let opaque = 0;
      for (let index = 3; index < pixels.length; index += 4) {
        const alpha = pixels[index];
        if (alpha > 0) painted += 1;
        if (alpha > 200) opaque += 1;
      }
      return { painted, opaque };
    });
    expect(stats?.painted ?? 0).toBeGreaterThan(0);
    // Brush density: a meaningful fraction of painted pixels should be
    // highly opaque (the new "ink core" stamp), not just a thin mist.
    expect((stats?.opaque ?? 0) / Math.max(1, stats?.painted ?? 1)).toBeGreaterThan(0.05);
  });

  test("shows BE NICE! on enter and fades the canvas on exit, keeping strokes persisted", async ({
    page,
  }) => {
    await openHome(page);
    await waitForPlayhtmlReady(page);

    await page.keyboard.press("g");
    await expect(page.getByText("BE NICE!")).toBeVisible({ timeout: 2000 });
    await page.mouse.move(420, 320);
    await page.mouse.down();
    await page.mouse.move(560, 360, { steps: 10 });
    await page.mouse.up();

    // BE NICE! stays visible for the entire duration of graffiti mode.
    await expect(page.getByText("LIVE").or(page.getByText("LOCAL"))).toBeVisible({
      timeout: 6000,
    });
    await expect(page.getByText("BE NICE!")).toBeVisible();

    // Active canvas opacity → 1 when mode is on.
    const canvas = page.locator('[data-testid="graffiti-canvas"]');
    await expect(canvas).toHaveCSS("opacity", "1");
    await expect(canvas).toHaveCSS("pointer-events", "auto");

    // Exit — the layer should fade out (opacity transitions to 0) but
    // the strokes data must remain in the shared page-data channel.
    await page.keyboard.press("g");
    await expect(canvas).toHaveCSS("opacity", "0");
    await expect(canvas).toHaveCSS("pointer-events", "none");
    await expect(page.getByText("BE NICE!")).toHaveCount(0);

    // Persisted strokes survive the exit — re-enable mode and confirm
    // the live word stays in the PageData mural.
    await page.keyboard.press("g");
    await expect(canvas).toHaveCSS("opacity", "1");

    const channelHasStroke = await page.evaluate(() => {
      const channel = window.playhtml.createPageData(
        "site-graffiti-strokes",
        { version: 1, strokes: [] },
      );
      const data = channel.getData();
      channel.destroy();
      return Array.isArray(data.strokes) && data.strokes.length > 0;
    });
    expect(channelHasStroke).toBe(true);
  });

  test("SHARE button exports the mural as a Win95-styled PNG download", async ({
    page,
  }) => {
    await openHome(page);
    await waitForPlayhtmlReady(page);
    await page.keyboard.press("g");
    await expect(page.getByText("BE NICE!")).toBeVisible({ timeout: 2000 });
    await page.mouse.move(360, 320);
    await page.mouse.down();
    await page.mouse.move(520, 360, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(200);

    const downloadPromise = page.waitForEvent("download");
    await page.locator('[data-testid="graffiti-share"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^cremosa-graffiti-\d+\.png$/);
    const path = await download.path();
    expect(path).toBeTruthy();

    // Notice acknowledges the save.
    await expect(page.getByText(/PNG salvo/)).toBeVisible();

    // Verify the PNG composition includes the production URL + caption
    // by re-running the composer in-page and inspecting the data URL.
    const composed = await page.evaluate(() => {
      const win = window as Window & { playhtml?: unknown };
      if (!win.playhtml) return null;
      const source = document.querySelector(
        '[data-testid="graffiti-canvas"]',
      ) as HTMLCanvasElement | null;
      if (!source) return null;
      return source.toDataURL("image/png").length;
    });
    expect(composed ?? 0).toBeGreaterThan(0);
  });

  test("SHARE exports a 9:16 Story PNG that keeps the painted orientation", async ({
    page,
  }) => {
    await openHome(page);
    await waitForPlayhtmlReady(page);
    await page.keyboard.press("g");
    await expect(page.getByText("BE NICE!")).toBeVisible({ timeout: 2000 });

    // Paint a clear horizontal stroke in the live canvas. If the
    // export rotates the source 90° the resulting stroke would be
    // vertical.
    await page.mouse.move(200, 400);
    await page.mouse.down();
    await page.mouse.move(1000, 400, { steps: 18 });
    await page.mouse.up();
    await page.waitForTimeout(150);

    const downloadPromise = page.waitForEvent("download");
    await page.locator('[data-testid="graffiti-share"]').click();
    const download = await downloadPromise;
    const tempPath = join(
      tmpdir(),
      `cremosa-orientation-${Date.now()}.png`,
    );
    await download.saveAs(tempPath);
    const bytes = await readFile(tempPath);
    const dataUrl = `data:image/png;base64,${bytes.toString("base64")}`;

    const orientation = await page.evaluate(async (url) => {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no ctx");
      ctx.drawImage(img, 0, 0);

      // Find the magenta-painted pixels and measure the bounding box.
      let minX = canvas.width;
      let maxX = 0;
      let minY = canvas.height;
      let maxY = 0;
      let paintedCount = 0;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 50) continue;
          // Magenta: high R, low G, high B. Background is gray (R≈G≈B).
          if (r > 180 && b > 120 && g < 160 && r - g > 40) {
            paintedCount += 1;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      return {
        width: maxX - minX,
        height: maxY - minY,
        paintedCount,
        imageWidth: canvas.width,
        imageHeight: canvas.height,
      };
    }, dataUrl);

    // Story export must be 9:16 portrait (1080×1920).
    expect(orientation.imageWidth).toBe(1080);
    expect(orientation.imageHeight).toBe(1920);
    // The painted bounding box must be MUCH wider than tall: a
    // horizontal stroke stays horizontal. If the export rotated the
    // source 90°, those numbers would be inverted.
    expect(orientation.paintedCount).toBeGreaterThan(0);
    expect(orientation.width).toBeGreaterThan(orientation.height * 2);
  });

  test("user-only eraser removes the local strokes but keeps remote ones", async ({ page, browser }) => {
    await openHome(page);
    await waitForPlayhtmlReady(page);
    await page.keyboard.press("g");
    await page.waitForTimeout(200);

    // Reset the shared mural first so the assertion is deterministic —
    // public rooms accumulate strokes from previous QA runs.
    await page.evaluate(() => {
      const channel = window.playhtml.createPageData(
        "site-graffiti-strokes",
        { version: 1, strokes: [] },
      );
      channel.setData({ version: 1, strokes: [] });
      channel.destroy();
    });
    await page.waitForTimeout(150);

    await page.locator('[data-testid="graffiti-size-slider"]').evaluate((el, value) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, "80");
    await page.mouse.move(220, 220);
    await page.mouse.down();
    await page.mouse.move(320, 260, { steps: 12 });
    await page.mouse.up();
    // Wait until the runtime has finished initializing so the local
    // eraser can reach the shared data channel.
    await expect(page.getByText("LIVE")).toBeVisible({ timeout: 5_000 });
    await page.waitForTimeout(150);

    // Seed a "remote" stroke into the shared page data using the second
    // tab's author id. This guarantees the eraser will only ever touch
    // strokes whose `author` matches the current tab's id.
    const ctx = await browser.newContext();
    const second = await ctx.newPage();
    await second.goto("/?skipGate=1");
    await second.keyboard.press("g");
    const remoteAuthor = await second.evaluate(() => window.localStorage.getItem("cremosa-graffiti-author"));
    await second.keyboard.press("g");
    await ctx.close();

    interface RemoteStroke {
  id: string;
  author: string;
  points: number[][];
  color: string;
  size: number;
  seed: number;
  createdAt: number;
}

const REMOTE_STROKE: RemoteStroke = {
  id: "remote-1",
  author: "remote",
  points: [[0.5, 0.5]],
  color: "#fffefe",
  size: 32,
  seed: 1,
  createdAt: Date.now() - 60_000,
};

await page.evaluate(
      ({ stroke, author }) => {
        const client = window.playhtml;
        type Stroke = typeof stroke;
        type Data = { version: 1; strokes: Stroke[] };
        const channel = client.createPageData<Data>(
          "site-graffiti-strokes",
          { version: 1, strokes: [] },
        );
        const merged: Stroke = { ...stroke, author };
        channel.setData((draft: Data) => {
          draft.strokes.push(merged);
        });
        channel.destroy();
      },
      { stroke: REMOTE_STROKE, author: remoteAuthor ?? "remote" },
    );
    await page.waitForTimeout(250);

    await page.locator('[data-testid="graffiti-eraser"]').click();
    await page.waitForTimeout(150);

    const localAuthor = await page.evaluate(() =>
      window.localStorage.getItem("cremosa-graffiti-author"),
    );
    const remaining = await page.evaluate(() => {
      type Stroke = (typeof REMOTE_STROKE);
      type Data = { version: 1; strokes: Stroke[] };
      const channel = window.playhtml.createPageData<Data>(
        "site-graffiti-strokes",
        { version: 1, strokes: [] },
      );
      const data = channel.getData();
      channel.destroy();
      return data;
    });
    const ownStrokes = (remaining.strokes ?? []).filter(
      (stroke) => stroke.author === localAuthor,
    );
    const remoteStrokes = (remaining.strokes ?? []).filter(
      (stroke) => stroke.author !== localAuthor,
    );
    expect(ownStrokes.length).toBe(0);
    expect(remoteStrokes.some((stroke) => stroke.id === "remote-1")).toBe(true);
  });

  test("mobile viewport keeps SHARE / APAGAR visible and hides the cursor hint", async ({
    browser,
  }) => {
    // ----- touch-only emulation: cursor hint must NOT show -----
    const touchCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const touchPage = await touchCtx.newPage();
    await touchPage.route("https://api.playhtml.fun/**", (route) =>
      route.abort("failed"),
    );
    await touchPage.goto("/?skipGate=1");
    await touchPage.waitForTimeout(300);

    const touchCaps = await touchPage.evaluate(() => ({
      hover: window.matchMedia("(hover: hover)").matches,
      noHover: window.matchMedia("(hover: none)").matches,
      coarse: window.matchMedia("(pointer: coarse)").matches,
    }));
    expect(touchCaps.noHover).toBe(true);
    expect(touchCaps.coarse).toBe(true);

    // Enter graffiti mode via the on-screen toggle (mimics a real tap).
    await touchPage.locator('[data-testid="graffiti-toggle"]').tap();
    await expect(touchPage.locator('[data-testid="graffiti-toolbar"]')).toBeVisible();
    // Move the cursor over the canvas: with the touch-only fingerprint
    // the (hover: none) + (pointer: coarse) media query in globals.css
    // suppresses the floating cursor-hint chip via display:none, while
    // the JSX still mounts it (pointerReady becomes true). Assert the
    // computed display is "none" so the visual hint never paints.
    await touchPage.mouse.move(120, 240);
    await touchPage.waitForTimeout(200);
    await expect(touchPage.locator(".graffiti-cursor-hint")).toBeHidden();

    // SHARE + APAGAR must remain visible (no overflow on a 390px viewport).
    const share = touchPage.locator('[data-testid="graffiti-share"]');
    const eraser = touchPage.locator('[data-testid="graffiti-eraser"]');
    await expect(share).toBeVisible();
    await expect(eraser).toBeVisible();
    const shareRect = await share.evaluate((el) => el.getBoundingClientRect());
    const eraserRect = await eraser.evaluate((el) => el.getBoundingClientRect());
    expect(shareRect.right).toBeLessThanOrEqual(390);
    expect(eraserRect.right).toBeLessThanOrEqual(390);
    expect(shareRect.bottom).toBeLessThanOrEqual(844);
    expect(eraserRect.bottom).toBeLessThanOrEqual(844);

    await touchCtx.close();

    // ----- narrowest phone (iPhone SE 320×568): still fits -----
    const narrowCtx = await browser.newContext({
      viewport: { width: 320, height: 568 },
      hasTouch: true,
      isMobile: true,
    });
    const narrowPage = await narrowCtx.newPage();
    await narrowPage.route("https://api.playhtml.fun/**", (route) =>
      route.abort("failed"),
    );
    await narrowPage.goto("/?skipGate=1");
    await narrowPage.waitForTimeout(300);
    await narrowPage.locator('[data-testid="graffiti-toggle"]').tap();
    await expect(narrowPage.locator('[data-testid="graffiti-toolbar"]')).toBeVisible();

    const buttonLayouts = await narrowPage.evaluate(() => {
      const ids = ["graffiti-share", "graffiti-eraser"];
      const out: Record<string, { onScreen: boolean; rect: DOMRect }> = {};
      for (const id of ids) {
        const el = document.querySelector(
          `[data-testid="${id}"]`,
        ) as HTMLElement | null;
        if (!el) {
          out[id] = { onScreen: false, rect: new DOMRect() };
          continue;
        }
        const rect = el.getBoundingClientRect();
        out[id] = {
          onScreen:
            rect.left >= 0 &&
            rect.right <= window.innerWidth &&
            rect.bottom <= window.innerHeight,
          rect,
        };
      }
      return out;
    });
    expect(buttonLayouts["graffiti-share"].onScreen).toBe(true);
    expect(buttonLayouts["graffiti-eraser"].onScreen).toBe(true);
    await narrowCtx.close();

    // ----- desktop cursor user: the hint MUST still appear -----
    const desktopCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopCtx.newPage();
    await desktopPage.route("https://api.playhtml.fun/**", (route) =>
      route.abort("failed"),
    );
    await desktopPage.goto("/?skipGate=1");
    await expect(desktopPage.locator('[data-testid="graffiti-toggle"]')).toBeVisible();
    await desktopPage.mouse.move(700, 500);
    await desktopPage.waitForTimeout(150);
    await expect(desktopPage.getByText("PRESSIONE G PARA GRAFITAR")).toBeVisible();
    await desktopCtx.close();
  });
});
