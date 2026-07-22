import type { PageDataChannel } from "playhtml";

export const GRAFFITI_DATA_CHANNEL = "site-graffiti-strokes";
export const GRAFFITI_PRESENCE_CHANNEL = "site-graffiti-active-stroke";

/** Keep the public mural useful and bounded even if it is used for years. */
export const MAX_GRAFFITI_STROKES = 320;
export const MAX_GRAFFITI_POINTS = 128;
export const MAX_GRAFFITI_PREVIEW_POINTS = 24;
export const MAX_STROKES_PER_MINUTE = 40;

/** Author identification so the per-browser eraser only removes its own
 *  strokes without touching other visitors' paintings. */
export const GRAFFITI_AUTHOR_KEY = "cremosa-graffiti-author";
export const GRAFFITI_AUTHOR_LENGTH = 12;

export const GRAFFITI_COLORS = [
  "#c8152e",
  "#d6307a",
  "#ff6fa3",
  "#ffb3cf",
  "#fffefe",
] as const;

/** Spray size range used by the toolbar slider (CSS pixels). */
export const GRAFFITI_SIZE_MIN = 8;
export const GRAFFITI_SIZE_MAX = 96;
export const GRAFFITI_SIZE_DEFAULT = 40;
export const GRAFFITI_SIZE_STEP = 2;

export type GraffitiPoint = [x: number, y: number];

export interface GraffitiStroke {
  id: string;
  /** Stable per-browser identifier of whoever painted the stroke. */
  author: string;
  points: GraffitiPoint[];
  color: string;
  size: number;
  seed: number;
  createdAt: number;
}

export interface GraffitiData {
  version: 1;
  strokes: GraffitiStroke[];
}

export interface GraffitiPreview {
  id: string;
  active: true;
  author: string;
  points: GraffitiPoint[];
  color: string;
  size: number;
  seed: number;
}

export type GraffitiDataChannel = PageDataChannel<GraffitiData>;

export const EMPTY_GRAFFITI_DATA: GraffitiData = {
  version: 1,
  strokes: [],
};

const COLOR_SET = new Set<string>(GRAFFITI_COLORS);

function isPoint(value: unknown): value is GraffitiPoint {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    Number.isFinite(value[0]) &&
    typeof value[1] === "number" &&
    Number.isFinite(value[1])
  );
}

function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function clampSize(value: number): number {
  if (!Number.isFinite(value)) return GRAFFITI_SIZE_DEFAULT;
  return Math.max(
    GRAFFITI_SIZE_MIN,
    Math.min(GRAFFITI_SIZE_MAX, Math.round(value)),
  );
}

function sanitizeAuthor(value: unknown): string {
  if (typeof value !== "string") return "anon";
  return value.slice(0, GRAFFITI_AUTHOR_LENGTH).replace(/[^a-z0-9]/gi, "") || "anon";
}

function sanitizePoints(value: unknown, limit: number): GraffitiPoint[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isPoint)
    .slice(-limit)
    .map(([x, y]) => [clampUnit(x), clampUnit(y)] as GraffitiPoint);
}

function sanitizeStroke(value: unknown): GraffitiStroke | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<GraffitiStroke>;
  const points = sanitizePoints(candidate.points, MAX_GRAFFITI_POINTS);
  if (
    typeof candidate.id !== "string" ||
    points.length === 0 ||
    typeof candidate.color !== "string" ||
    !COLOR_SET.has(candidate.color) ||
    typeof candidate.size !== "number" ||
    !Number.isFinite(candidate.size) ||
    typeof candidate.seed !== "number" ||
    !Number.isFinite(candidate.seed)
  ) {
    return null;
  }

  return {
    id: candidate.id.slice(0, 80),
    author: sanitizeAuthor(candidate.author),
    points,
    color: candidate.color,
    size: clampSize(candidate.size),
    seed: Math.floor(candidate.seed),
    createdAt:
      typeof candidate.createdAt === "number" && Number.isFinite(candidate.createdAt)
        ? candidate.createdAt
        : Date.now(),
  };
}

/** Sanitize public shared data before it reaches the canvas renderer. */
export function sanitizeGraffitiData(value: unknown): GraffitiData {
  if (!value || typeof value !== "object") return EMPTY_GRAFFITI_DATA;
  const candidate = value as Partial<GraffitiData>;
  const strokes = Array.isArray(candidate.strokes)
    ? candidate.strokes
        .map(sanitizeStroke)
        .filter((stroke): stroke is GraffitiStroke => stroke !== null)
        .slice(-MAX_GRAFFITI_STROKES)
    : [];

  return { version: 1, strokes };
}

export function sanitizeGraffitiPreview(value: unknown): GraffitiPreview | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<GraffitiPreview>;
  const points = sanitizePoints(candidate.points, MAX_GRAFFITI_PREVIEW_POINTS);
  if (
    candidate.active !== true ||
    typeof candidate.id !== "string" ||
    points.length === 0 ||
    typeof candidate.color !== "string" ||
    !COLOR_SET.has(candidate.color) ||
    typeof candidate.size !== "number" ||
    !Number.isFinite(candidate.size) ||
    typeof candidate.seed !== "number" ||
    !Number.isFinite(candidate.seed)
  ) {
    return null;
  }

  return {
    active: true,
    id: candidate.id.slice(0, 80),
    author: sanitizeAuthor(candidate.author),
    points,
    color: candidate.color,
    size: clampSize(candidate.size),
    seed: Math.floor(candidate.seed),
  };
}

/** Deterministic pseudo-random generator so every visitor sees the same spray. */
function random(seed: number): () => number {
  let state = (seed | 0) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
}

function drawSprayStamp(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  nextRandom: () => number,
): void {
  // Dense brush: more particles, larger core, higher alpha floor,
  // tighter spread. Determinism is preserved via the same seeded PRNG.
  const particles = Math.max(28, Math.round(size * 1.6));
  for (let index = 0; index < particles; index += 1) {
    const angle = nextRandom() * Math.PI * 2;
    const radial = Math.sqrt(nextRandom());
    const distance = radial * size * 0.7;
    // Two-layer particle radii: most are a fine mist, a small share
    // are heavier pigment dabs that anchor the stroke visually.
    const isCore = nextRandom() < 0.32;
    const radius = isCore
      ? 0.95 + nextRandom() * Math.max(1.2, size / 12)
      : 0.55 + nextRandom() * Math.max(0.8, size / 22);
    context.globalAlpha = isCore
      ? 0.55 + nextRandom() * 0.35
      : 0.28 + nextRandom() * 0.32;
    context.fillStyle = color;
    context.beginPath();
    context.arc(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      radius,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  // Center dab so consecutive stamps fuse into a continuous brush stroke.
  context.globalAlpha = 0.85;
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, Math.max(0.8, size / 14), 0, Math.PI * 2);
  context.fill();
}

/** Paint one normalized stroke onto a viewport-sized canvas. */
export function drawGraffitiStroke(
  context: CanvasRenderingContext2D,
  stroke: Pick<GraffitiStroke, "points" | "color" | "size" | "seed">,
  width: number,
  height: number,
): void {
  if (stroke.points.length === 0) return;
  const nextRandom = random(stroke.seed);
  const points = stroke.points.map(([x, y]) => [x * width, y * height] as const);

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";

  const paintPoint = (x: number, y: number) => {
    drawSprayStamp(context, x, y, stroke.size, stroke.color, nextRandom);
  };

  paintPoint(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    const [fromX, fromY] = points[index - 1];
    const [toX, toY] = points[index];
    const distance = Math.hypot(toX - fromX, toY - fromY);
    const steps = Math.max(
      1,
      Math.ceil(distance / Math.max(3, stroke.size / 4)),
    );
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      paintPoint(
        fromX + (toX - fromX) * progress,
        fromY + (toY - fromY) * progress,
      );
    }
  }

  context.restore();
  context.globalAlpha = 1;
}

/** Random base36 author id, length-preserving and stable across reloads. */
export function generateGraffitiAuthorId(): string {
  let id = "";
  while (id.length < GRAFFITI_AUTHOR_LENGTH) {
    id += Math.floor(Math.random() * 36 ** 8).toString(36);
  }
  return id.slice(0, GRAFFITI_AUTHOR_LENGTH);
}

const SHARE_CAPTION = "CONTRATE @DJCREMOSA PARA SEU SHOW";
const SHARE_SITE_URL = "franias.github.io/djcremosa.exe";
const SHARE_LOCATION = "Porto Alegre, RS — Brasil";
const SHARE_SINCE = "2016";

/**
 * Compose the current painted mural as a share-ready PNG.
 *
 * Output format:
 *  - Outer Win95-styled frame with chunky bevels (matches the rest of
 *    the site: light/face/shadow tokens).
 *  - Brand-blue title bar reading "graffiti.exe · CREMOSA".
 *  - The painted mural is blitted into the inset drawing area at its
 *    native viewport size.
 *  - A Win95 status bar (footer) mirrors the live `SiteFooter` with
 *    Pronto/location, brand + since year, event countdown + Booking.
 *  - A blue framed caption strip carries "CONTRACT CREMOSA FOR YOU SHOW"
 *    and the production URL `franias.github.io/djcremosa.exe`.
 *
 * Resolves to a PNG Blob the caller can save via `<a download>` or
 * pass to `navigator.share({ files: [...] })`.
 */
export async function composShareImage(
  source: HTMLCanvasElement,
  options: { title?: string } = {},
): Promise<{ blob: Blob; filename: string; dataUrl: string }> {
  const sourceWidth = source.width;
  const sourceHeight = source.height;
  const cssWidth = sourceWidth / (source.dataset.pixelRatio
    ? Number(source.dataset.pixelRatio)
    : 1);
  const cssHeight = sourceHeight / (source.dataset.pixelRatio
    ? Number(source.dataset.pixelRatio)
    : 1);

  const outerPadding = 24;
  const titleBarHeight = 38;
  const captionBarHeight = 96;
  const statusBarHeight = 34;
  const canvasWidth = Math.round(cssWidth + outerPadding * 2);
  const canvasHeight = Math.round(
    cssHeight +
      outerPadding * 2 +
      titleBarHeight +
      statusBarHeight +
      captionBarHeight,
  );

  const off = document.createElement("canvas");
  off.width = canvasWidth;
  off.height = canvasHeight;
  const context = off.getContext("2d");
  if (!context) {
    throw new Error("could not acquire 2d context for share canvas");
  }

  // Win95 palette resolved locally so the share image is portable.
  const winFace = "#c0c0c0";
  const winFace2 = "#d4d0c8";
  const winLight = "#ffffff";
  const winShadow = "#808080";
  const winShadowDeep = "#404040";
  const winInk = "#000000";
  const titleBlue = "#000080";
  const titleBlueAccent = "#1084d0";
  const captionBlue = "#0a4f9e";
  const captionBlueAccent = "#5aa9e6";

  context.fillStyle = winFace;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  context.fillStyle = winShadowDeep;
  context.fillRect(0, 0, canvasWidth, outerPadding);
  context.fillRect(0, canvasHeight - outerPadding, canvasWidth, outerPadding);
  context.fillRect(0, 0, outerPadding, canvasHeight);
  context.fillStyle = winLight;
  context.fillRect(canvasWidth - outerPadding, 0, outerPadding, canvasHeight);
  context.fillRect(0, 0, canvasWidth, outerPadding);
  context.fillRect(0, canvasHeight - outerPadding, canvasWidth, outerPadding);
  context.fillRect(0, 0, outerPadding, canvasHeight);

  context.fillStyle = winFace2;
  context.fillRect(
    outerPadding,
    outerPadding,
    canvasWidth - outerPadding * 2,
    canvasHeight - outerPadding * 2,
  );

  // Brand-blue title bar gradient (matches the live site chrome).
  const titleGradient = context.createLinearGradient(
    0,
    outerPadding,
    0,
    outerPadding + titleBarHeight,
  );
  titleGradient.addColorStop(0, titleBlueAccent);
  titleGradient.addColorStop(1, titleBlue);
  context.fillStyle = titleGradient;
  context.fillRect(
    outerPadding,
    outerPadding,
    canvasWidth - outerPadding * 2,
    titleBarHeight,
  );

  context.fillStyle = winLight;
  context.font =
    'bold 18px "VT323", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  context.textBaseline = "middle";
  context.fillText(
    options.title ?? "graffiti.exe · CREMOSA",
    outerPadding + 14,
    outerPadding + titleBarHeight / 2 + 1,
  );

  const controlY = outerPadding + titleBarHeight / 2 - 7;
  const controlX = canvasWidth - outerPadding - 18 * 3 - 8;
  context.fillStyle = winFace;
  context.fillRect(controlX, controlY, 16, 14);
  context.fillRect(controlX + 18, controlY, 16, 14);
  context.fillRect(controlX + 36, controlY, 16, 14);
  context.fillStyle = winShadowDeep;
  context.fillRect(controlX, controlY + 14, 16, 2);
  context.fillRect(controlX + 18, controlY + 14, 16, 2);
  context.fillRect(controlX + 36, controlY + 14, 16, 2);
  context.fillStyle = winShadow;
  context.fillRect(controlX + 14, controlY, 2, 14);
  context.fillRect(controlX + 32, controlY, 2, 14);
  context.fillRect(controlX + 50, controlY, 2, 14);

  const wellX = outerPadding + 8;
  const wellY = outerPadding + titleBarHeight + 8;
  const wellW = canvasWidth - outerPadding * 2 - 16;
  const wellH = cssHeight;
  context.fillStyle = winShadowDeep;
  context.fillRect(wellX - 1, wellY - 1, wellW + 2, wellH + 2);
  // Gray canvas surface (Win95 face) — the painted mural sits on a
  // chalky gray rectangle so even an empty export reads as a clear
  // drawing area instead of a white paper sheet.
  context.fillStyle = winFace;
  context.fillRect(wellX, wellY, wellW, wellH);
  // Subtle inner highlight + outer shadow tracks for the Win95 bevel.
  context.fillStyle = winLight;
  context.fillRect(wellX, wellY, wellW, 1);
  context.fillRect(wellX, wellY, 1, wellH);
  context.fillStyle = winFace2;
  context.fillRect(wellX, wellY + wellH - 1, wellW, 1);
  context.fillRect(wellX + wellW - 1, wellY, 1, wellH);

  context.drawImage(
    source,
    0,
    0,
    sourceWidth,
    sourceHeight,
    wellX,
    wellY,
    wellW,
    wellH,
  );

  // Win95 status bar footer mirroring the live `SiteFooter.tsx`.
  const statusY = wellY + wellH + 14;
  const statusX = outerPadding + 4;
  const statusW = canvasWidth - outerPadding * 2 - 8;
  drawWin95StatusBar(
    context,
    statusX,
    statusY,
    statusW,
    statusBarHeight,
    SHARE_LOCATION,
    SHARE_SINCE,
    SHARE_SITE_URL,
    { winFace, winFace2, winLight, winShadow, winShadowDeep, winInk },
  );

  const captionY = statusY + statusBarHeight + 10;
  const captionX = outerPadding + 8;
  const captionW = canvasWidth - outerPadding * 2 - 16;
  const captionGradient = context.createLinearGradient(
    0,
    captionY,
    0,
    captionY + captionBarHeight - 16,
  );
  captionGradient.addColorStop(0, captionBlueAccent);
  captionGradient.addColorStop(1, captionBlue);
  context.fillStyle = captionGradient;
  context.fillRect(captionX - 4, captionY - 4, captionW + 8, captionBarHeight - 8);

  context.fillStyle = winShadowDeep;
  context.fillRect(
    captionX,
    captionY + captionBarHeight - 12,
    captionW,
    2,
  );
  context.fillStyle = winLight;
  context.fillRect(captionX, captionY, captionW, 2);

  context.fillStyle = winLight;
  context.font =
    'bold 26px "VT323", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    SHARE_CAPTION,
    captionX + captionW / 2,
    captionY + captionBarHeight / 2 - 4,
  );

  context.fillStyle = winFace;
  context.font = '12px "VT323", ui-monospace, monospace';
  context.fillText(
    `${SHARE_SITE_URL} · ${new Date().toISOString().slice(0, 10)}`,
    captionX + captionW / 2,
    captionY + captionBarHeight - 22,
  );

  context.textAlign = "start";

  const blob: Blob = await new Promise((resolve, reject) => {
    off.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("toBlob returned null")),
      "image/png",
    );
  });
  const dataUrl = off.toDataURL("image/png");
  const filename = `cremosa-graffiti-${Date.now()}.png`;
  return { blob, filename, dataUrl };
}

interface Win95Palette {
  winFace: string;
  winFace2: string;
  winLight: string;
  winShadow: string;
  winShadowDeep: string;
  winInk: string;
}

function drawWin95StatusBar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  location: string,
  since: string,
  siteUrl: string,
  palette: Win95Palette,
): void {
  const { winFace, winLight, winShadowDeep, winInk } = palette;

  context.fillStyle = winShadowDeep;
  context.fillRect(x, y, width, height);
  context.fillStyle = winLight;
  context.fillRect(x + 1, y + 1, width - 2, height - 2);

  const pad = 2;
  const segments: { label: string; weight: number }[] = [
    { label: `\u25cf Pronto \u00b7 ${location}`, weight: 1.4 },
    { label: `Cremosa \u00b7 desde ${since}`, weight: 1 },
    { label: `Next show \u00b7 ${siteUrl}`, weight: 1.2 },
    { label: "Booking \u2192", weight: 0.8 },
  ];
  const totalWeight = segments.reduce(
    (sum, segment) => sum + segment.weight,
    0,
  );
  const innerX = x + 1 + pad;
  const innerY = y + 1 + pad;
  const innerW = width - 2 - pad * 2;
  const innerH = height - 2 - pad * 2;
  let segmentX = innerX;
  context.textBaseline = "middle";
  context.textAlign = "left";
  for (const segment of segments) {
    const segmentWidth = Math.max(
      60,
      Math.floor((innerW * segment.weight) / totalWeight) - 1,
    );
    context.fillStyle = winShadowDeep;
    context.fillRect(segmentX, innerY, segmentWidth, innerH);
    context.fillStyle = winFace;
    context.fillRect(segmentX + 1, innerY + 1, segmentWidth - 2, innerH - 2);
    context.fillStyle = winInk;
    context.font =
      '12px "VT323", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
    const label = fitSegmentLabel(context, segment.label, segmentWidth - 8);
    context.fillText(label, segmentX + 4, innerY + innerH / 2 + 1);
    segmentX += segmentWidth;
  }
  context.textAlign = "start";
}

function fitSegmentLabel(
  context: CanvasRenderingContext2D,
  label: string,
  maxWidth: number,
): string {
  if (context.measureText(label).width <= maxWidth) return label;
  const ellipsis = "\u2026";
  let trimmed = label;
  while (
    trimmed.length > 1 &&
    context.measureText(`${trimmed}${ellipsis}`).width > maxWidth
  ) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}${ellipsis}`;
}

export const SHARE_IMAGE_CAPTION = SHARE_CAPTION;
export const SHARE_IMAGE_SITE_URL = SHARE_SITE_URL;

const STORY_DIMENSIONS = { width: 1080, height: 1920 } as const;

/**
 * Compose the current painted mural as an Instagram Story PNG
 * (1080×1920, 9:16 portrait).
 *
 * Layout — top to bottom:
 *  1. Brand-blue Win95 title bar (`graffiti.exe · CREMOSA`).
 *  2. The mural blitted into the middle band with a "contain" fit so
 *     the painted strokes keep their original orientation (no 90°
 *     rotation, no crop). Whitespace inside the band inherits the
 *     white interior of the Win95 well.
 *  3. Brand-blue caption strip with "CONTRACT CREMOSA FOR YOU SHOW"
 *     plus the production URL stamp.
 *  4. Win95 status bar mirroring the live `SiteFooter`.
 */
export async function composShareStoryImage(
  source: HTMLCanvasElement,
  options: { title?: string } = {},
): Promise<{ blob: Blob; filename: string; dataUrl: string }> {
  const palette = storyPalette();
  const off = document.createElement("canvas");
  off.width = STORY_DIMENSIONS.width;
  off.height = STORY_DIMENSIONS.height;
  const context = off.getContext("2d");
  if (!context) {
    throw new Error("could not acquire 2d context for story canvas");
  }

  const titleBarHeight = 96;
  const captionHeight = 200;
  const statusHeight = 110;
  const sidePadding = 32;
  const middleBandY = titleBarHeight + 24;
  const middleBandH =
    STORY_DIMENSIONS.height - titleBarHeight - captionHeight - statusHeight - 72;
  const middleBandX = sidePadding;
  const middleBandW = STORY_DIMENSIONS.width - sidePadding * 2;

  // Background — Win95 face fill (any remaining unlettered area looks
  // like a clean gray window).
  context.fillStyle = palette.winFace;
  context.fillRect(0, 0, STORY_DIMENSIONS.width, STORY_DIMENSIONS.height);

  // Win95 outer bevel frame.
  drawWin95OuterBevel(context, STORY_DIMENSIONS.width, STORY_DIMENSIONS.height, palette);

  // Story inner face area (slightly darker for the window interior).
  context.fillStyle = palette.winFace2;
  context.fillRect(8, 8, STORY_DIMENSIONS.width - 16, STORY_DIMENSIONS.height - 16);

  // Title bar — brand-blue gradient spanning the full width with the
  // Window minimize/maximize/close controls on the right.
  drawWin95TitleBar(
    context,
    0,
    0,
    STORY_DIMENSIONS.width,
    titleBarHeight,
    options.title ?? "graffiti.exe · CREMOSA",
    palette,
  );

  // Sunken well where the rotated mural lives.
  context.fillStyle = palette.winShadowDeep;
  context.fillRect(middleBandX - 2, middleBandY - 2, middleBandW + 4, middleBandH + 4);
  // Gray Win95 face — so even an empty mural reads as a clear
  // drawing surface instead of a white paper sheet.
  context.fillStyle = palette.winFace;
  context.fillRect(middleBandX, middleBandY, middleBandW, middleBandH);
  context.fillStyle = palette.winLight;
  context.fillRect(middleBandX, middleBandY, middleBandW, 2);
  context.fillRect(middleBandX, middleBandY, 2, middleBandH);
  context.fillStyle = palette.winFace2;
  context.fillRect(middleBandX, middleBandY + middleBandH - 2, middleBandW, 2);
  context.fillRect(middleBandX + middleBandW - 2, middleBandY, 2, middleBandH);

  // Contain-fit the mural into the middle band keeping the painted
  // orientation intact (no rotation) so a horizontal stroke in the
  // live canvas stays horizontal in the export.
  drawFittedMuralInto(context, source, middleBandX, middleBandY, middleBandW, middleBandH);

  // Brand-blue caption strip at the bottom with CONTRACT CREMOSA +
  // URL stamp.
  drawStoryCaption(context, middleBandY + middleBandH + 24, palette);

  // Win95 status bar footer mirroring the live SiteFooter.
  drawWin95StatusBar(
    context,
    sidePadding,
    STORY_DIMENSIONS.height - statusHeight - sidePadding,
    STORY_DIMENSIONS.width - sidePadding * 2,
    statusHeight,
    SHARE_LOCATION,
    SHARE_SINCE,
    SHARE_SITE_URL,
    palette,
  );

  const blob: Blob = await new Promise((resolve, reject) => {
    off.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("toBlob returned null")),
      "image/png",
    );
  });
  return {
    blob,
    filename: `cremosa-graffiti-${Date.now()}.png`,
    dataUrl: off.toDataURL("image/png"),
  };
}

interface StoryPalette {
  winFace: string;
  winFace2: string;
  winLight: string;
  winShadow: string;
  winShadowDeep: string;
  winInk: string;
  titleBlue: string;
  titleBlueAccent: string;
  captionBlue: string;
  captionBlueAccent: string;
}

function storyPalette(): StoryPalette {
  return {
    winFace: "#c0c0c0",
    winFace2: "#d4d0c8",
    winLight: "#ffffff",
    winShadow: "#808080",
    winShadowDeep: "#404040",
    winInk: "#000000",
    titleBlue: "#000080",
    titleBlueAccent: "#1084d0",
    captionBlue: "#0a4f9e",
    captionBlueAccent: "#5aa9e6",
  };
}

function drawWin95OuterBevel(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: StoryPalette,
): void {
  const pad = 8;
  context.fillStyle = palette.winShadowDeep;
  context.fillRect(0, 0, width, pad);
  context.fillRect(0, height - pad, width, pad);
  context.fillRect(0, 0, pad, height);
  context.fillStyle = palette.winLight;
  context.fillRect(width - pad, 0, pad, height);
  context.fillRect(0, 0, width, pad);
  context.fillRect(0, height - pad, width, pad);
  context.fillRect(0, 0, pad, height);
}

function drawWin95TitleBar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  palette: StoryPalette,
): void {
  const gradient = context.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, palette.titleBlueAccent);
  gradient.addColorStop(1, palette.titleBlue);
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);

  context.fillStyle = palette.winLight;
  context.font =
    'bold 36px "VT323", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  context.textBaseline = "middle";
  context.fillText(title, x + 24, y + height / 2 + 2);

  // Win95 window control boxes
  const controlH = height / 2 - 8;
  const controlW = 32;
  const controlY = y + height / 2 - controlH / 2;
  const totalControlW = controlW * 3 + 16;
  let controlX = x + width - 24 - totalControlW;
  for (let index = 0; index < 3; index += 1) {
    context.fillStyle = palette.winFace;
    context.fillRect(controlX, controlY, controlW, controlH);
    context.fillStyle = palette.winShadowDeep;
    context.fillRect(controlX, controlY + controlH, controlW, 4);
    context.fillStyle = palette.winShadow;
    context.fillRect(controlX + controlW, controlY, 4, controlH);
    controlX += controlW + 8;
  }
}

function drawFittedMuralInto(
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  // The mural must keep the orientation the user painted in (no
  // rotation) — rotating 90° makes a horizontal stroke look vertical
  // in the export, which is jarring. We blit the source straight into
  // the band using a "contain" fit: scale uniformly until one
  // dimension matches the band, then center the result. The remaining
  // whitespace inherits the band's white interior so the result looks
  // like a polaroid sitting in the Story chrome.
  const sourceWidth = source.width;
  const sourceHeight = source.height;
  if (sourceWidth <= 0 || sourceHeight <= 0) return;

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let drawW: number;
  let drawH: number;
  if (sourceRatio > targetRatio) {
    drawW = width;
    drawH = width / sourceRatio;
  } else {
    drawH = height;
    drawW = height * sourceRatio;
  }
  const drawX = x + (width - drawW) / 2;
  const drawY = y + (height - drawH) / 2;
  context.drawImage(source, 0, 0, sourceWidth, sourceHeight, drawX, drawY, drawW, drawH);
}

function drawStoryCaption(
  context: CanvasRenderingContext2D,
  y: number,
  palette: StoryPalette,
): void {
  const height = 200;
  const x = 32;
  const width = STORY_DIMENSIONS.width - 64;
  const gradient = context.createLinearGradient(x, y, x, y + height);
  gradient.addColorStop(0, palette.captionBlueAccent);
  gradient.addColorStop(1, palette.captionBlue);
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);

  context.fillStyle = palette.winShadowDeep;
  context.fillRect(x, y + height - 6, width, 6);
  context.fillStyle = palette.winLight;
  context.fillRect(x, y, width, 4);

  context.fillStyle = palette.winLight;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font =
    'bold 56px "VT323", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';
  context.fillText(SHARE_CAPTION, x + width / 2, y + height / 2 - 14);

  context.fillStyle = palette.winFace;
  context.font = '24px "VT323", ui-monospace, monospace';
  context.fillText(
    `${SHARE_SITE_URL} · ${new Date().toISOString().slice(0, 10)}`,
    x + width / 2,
    y + height - 36,
  );
  context.textAlign = "start";
}
