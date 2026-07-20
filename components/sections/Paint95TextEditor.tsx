"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { STRUDEL_PATTERNS } from "@/content/strudel";

/**
 * Paint95TextEditor — DJ Verbosa section body.
 *
 * Renders the MS Paint 95 reference image as a static background
 * (`${site.basePath}/img/paint95-bg.png`, 1089×759 — copied verbatim
 * from the user's reference) and overlays a transparent `<textarea>`
 * in the white canvas area.
 *
 * NOTE: the img src uses `site.basePath` (not a bare `/img/...`)
 * because Next.js only auto-prefixes basePath for `_next/*` assets
 * and `<Link>` hrefs. Raw `<img>` tags pointing at the `public/`
 * folder need the prefix manually, otherwise the asset 404s on
 * GitHub Pages (see obs-2026-07-19-raw-lt-img-src-gt-in-paint95...).
 *
 * ─────────────────────────────────────────────────────────────────
 *  INVISIBLE OVERLAYS (click targets)
 * ─────────────────────────────────────────────────────────────────
 *
 *  1. **Palette** — the 14×2 color grid at the bottom. Clicking a
 *     cell samples the pixel from an offscreen canvas copy of the
 *     image and updates the textarea's text color.
 *
 *  2. **Toolbar buttons** — four icons on the left toolbar are now
 *     interactive. Each transparent `<button>` is positioned over
 *     a specific MS Paint icon and wired to a code behavior:
 *
 *       ┌─ row 1, col 1 ░░░ STAR  ░░░ blink code effect
 *       ├─ row 1, col 2 ░░░ RECT  ░░░ copy all code to clipboard
 *       ├─ row 2, col 1 ░░░ ERASE  ░░░ clear/restore (toggle)
 *       └─ row 2, col 2 ░░░ TINT  ░░░ toggle dark mode (black bg, white text)
 *
 *     The 2×2 cluster sits at the top of the toolbar (rows 1+2,
 *     cols 1+2). Measurements are from the 1089×759 PNG (Python+PIL).
 *     The buttons are sized smaller than the cells for a 1px
 *     breathing room around each click target so adjacent icons
 *     don't bleed into each other.
 *
 *  All buttons use `onMouseDown preventDefault()` so the click
 *  doesn't steal focus from the textarea — the user can keep
 *  typing immediately after interacting with any of them.
 *
 * ─────────────────────────────────────────────────────────────────
 *  STATE
 * ─────────────────────────────────────────────────────────────────
 *   • code         — the textarea contents (Strudel pattern + edits)
 *   • inkColor     — current font color, set by palette clicks
 *   • savedCode    — last non-empty code value (used by eraser to restore)
 *   • darkMode     — true when the canvas should be black with white text
 *   • blinking     — true when the textarea should animate `paint-blink`
 *   • isCleared    — true when the eraser has emptied the textarea
 *                    (so the next eraser click knows to restore, not clear)
 *
 * ─────────────────────────────────────────────────────────────────
 *  LAYOUT
 * ─────────────────────────────────────────────────────────────────
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  File  Edit  View  Image  Options  Help                  │ ← menu
 *   ├──────┬───────────────────────────────────────────────────┤
 *   │ ⭐ ▢ │                                                   │
 *   │ 🧽 ▢│   ╔═══════════════════════════════════════════╗   │
 *   │ 🖌 🔍│   ║                                           ║   │
 *   │ 🖌 ▢│   ║   setcpm(130/4)                           ║   │
 *   │ 🎨 ▢│   ║   samples('github:yaxu/clean-breaks')     ║   │  ← textarea
 *   │ ─ ⌒ │   ║   ...                                       ║   │     (editable)
 *   │ ▭ ▭│   ║                                           ║   │
 *   │ ⬭ ▭│   ╚═══════════════════════════════════════════╝   │
 *   ├──────┴───────────────────────────────────────────────────┤
 *   │ ⬛⬜  ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪  (palette)                  │
 *   ├──────────────────────────────────────────────────────────┤
 *   │ For Help, click Help Topics on the Help Menu.            │ ← status
 *   └──────────────────────────────────────────────────────────┘
 */

const INITIAL_CODE = STRUDEL_PATTERNS[0]?.code ?? "";

// Palette region as fractions of the source image (1089 × 759).
// 14 columns (B/W + G/G + 12 colors) × 2 rows. Left edge sits at
// image x=62, just past the FG/BG indicator.
const PALETTE_REGION = {
  left: 0.058,
  top: 0.8366,
  right: 0.4646,
  bottom: 0.9091,
} as const;

// Toolbar button positions. Each is a rectangle in image-fraction
// coordinates. Sized slightly smaller than the actual icon (~10% on
// each side) so adjacent icons don't bleed into each other.
//
// The 4 buttons form a 2×2 cluster at the TOP of the toolbar (user
// confirmed these positions in a follow-up screenshot — the original
// mapping had Rectangle and Tinter at Rows 5/7, the user said they
// sit adjacent to Star and Eraser instead):
//
//   Icon        Image bbox (x0, y0, x1, y1)        fractions
//   ─────────────────────────────────────────────────────────────────
//   ⭐ Star      (2, 47)..(56, 95)              → row 1, col 1
//   ▢ Rectangle  (58, 47)..(104, 95)            → row 1, col 2
//   🧽 Eraser    (2, 95)..(56, 143)             → row 2, col 1
//   🎨 Tinter    (58, 95)..(104, 143)           → row 2, col 2
//
// Cell 1 image-fx ≈ 0.002..0.051, cell 2 image-fx ≈ 0.053..0.095.
// Cell 1 image-fy (rows 1–2) ≈ 0.062..0.189.
// Cell 2 image-fx (rows 1–3) ≈ 0.053..0.095.
// Width + height: ~4.6% × ~5.7% each — leaves a small margin so the
// clicks don't bleed into each other.
type ToolId =
  | "star"
  | "eraser"
  | "tinter"
  | "rect"
  | "pigment"
  | "magnify"
  | "pencil"
  | "brush"
  | "curve"
  | "ellipse"
  | "rounded"
  | "spray"
  | "font"
  | "line"
  | "rectEmpty"
  | "polygon";

interface ToolBtn {
  id: ToolId;
  label: string;
  ariaLabel: string;
  /** Fraction of container for the button rect. */
  rect: { top: number; left: number; width: number; height: number };
}

// Rainbow palette — 7 colors cycled by the Pigment button. Lives
// alongside `isPickedColor` and the other code-state constants.
const RAINBOW_COLORS: readonly string[] = [
  "#ff0000", // Red
  "#ff7f00", // Orange
  "#ffff00", // Yellow
  "#00ff00", // Green
  "#0000ff", // Blue
  "#4b0082", // Indigo
  "#9400d3", // Violet
] as const;

// Font-zoom constants for the Magnify button.
// FONT_SIZE_BASE matches the responsive clamp max we used before
// (14px) so the un-zoomed default looks identical. FONT_SIZE_MAX is
// the hard cap the user requested ("stop at 100px"). ZOOM_STEP is the
// proportional growth factor — each click multiplies the current size
// by ZOOM_STEP so bigger fonts grow by bigger amounts.
const FONT_SIZE_BASE = 14;
const FONT_SIZE_MAX = 100;
const ZOOM_STEP = 1.25;

// localStorage key for the Rounded-Rectangle "save preset" feature.
// Namespaced so it doesn't collide with anything else in localStorage.
const PRESET_STORAGE_KEY = "dj-verbosa.code-preset";

// Max number of distinct ink colors the Brush (recent colors)
// remembers. Cycling past this length drops the oldest one.
const COLOR_HISTORY_MAX = 5;

// Fallback color history used by the Brush the first time it's
// clicked on a fresh page (before the user has picked anything from
// the static palette). Without this the brush was a silent no-op
// on first use — the original "click twice to reset" UX only worked
// after the user had at least one palette pick in history. The 5
// here are common console colors so cycling is immediately useful.
//
// Order matters: history[0] is the FIRST color shown, then each
// click advances to history[1], history[2], etc. The order is
// red → green → blue → yellow → black so the first click of a
// fresh page lands on red (the most useful starting point).
const BRUSH_FALLBACK_HISTORY: readonly string[] = [
  "#ff0000", // red
  "#00ff00", // green
  "#0000ff", // blue
  "#ffff00", // yellow
  "#000000", // black
];

// Separator inserted by the Line tool at the cursor. 20 dashes make
// it visually obvious in the textarea. 2-click reset: the next
// click on Line removes it (positions tracked in state).
const LINE_SEPARATOR = "\n// ────────────────────\n";

const TOOLBAR_BUTTONS: ToolBtn[] = [
  {
    id: "star",
    label: "ESTRELA",
    ariaLabel:
      "Estrela — piscar o código Strudel. Clica de novo pra parar.",
    // Row 1, Col 1 — image (2..56, 47..95) → fx 0.002..0.051, fy 0.062..0.125
    rect: { top: 0.068, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "rect",
    label: "RETÂNGULO",
    ariaLabel:
      "Retângulo — copia o código todo pro clipboard (Cmd/Ctrl + C equivalente).",
    // Row 1, Col 2 — image (58..104, 47..95) → fx 0.053..0.095, fy 0.062..0.125
    rect: { top: 0.068, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "eraser",
    label: "BORRACHA",
    ariaLabel:
      "Borracha — limpar o código. Clica de novo pra recuperar.",
    // Row 2, Col 1 — image (2..56, 95..143) → fx 0.002..0.051, fy 0.125..0.188
    rect: { top: 0.13, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "tinter",
    label: "TINTA",
    ariaLabel:
      "Tinta — alternar entre modo claro e modo escuro (fundo preto, letras brancas).",
    // Row 2, Col 2 — image (58..104, 95..143) → fx 0.053..0.095, fy 0.125..0.188
    rect: { top: 0.13, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "pigment",
    label: "PIGMENTO",
    ariaLabel:
      "Pigmento — clica pra ciclar pelas cores do arco-íris (vermelho, laranja, amarelo, verde, azul, anil, violeta).",
    // Row 3, Col 1 — image (2..56, 143..191) → fx 0.002..0.051, fy 0.188..0.252
    // Sits directly BELOW the eraser (Row 2 Col 1) — the big MS
    // Paint brush icon, which is the most "pigment-applying" tool.
    rect: { top: 0.194, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "magnify",
    label: "LUPINHA",
    ariaLabel:
      "Lupinha — clica pra aumentar o zoom da fonte (proporcional 1.25×). Para em 100px.",
    // Row 3, Col 2 — image (58..104, 143..191) → fx 0.053..0.095, fy 0.188..0.252
    // The classic MS Paint magnifier, right of the pigment brush.
    rect: { top: 0.194, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "pencil",
    label: "LÁPIS",
    ariaLabel:
      "Lápis — clica pra comentar ou descomentar a linha (ou seleção). Marca/desmarca com //.",
    // Row 4, Col 1 — image (2..56, 191..239) → fx 0.002..0.051, fy 0.252..0.315
    // Pen on checkered background — standard MS Paint pen/select.
    rect: { top: 0.258, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "brush",
    label: "PINCEL",
    ariaLabel:
      "Pincel — clica pra percorrer as últimas cores usadas (até 5).",
    // Row 4, Col 2 — image (58..104, 191..239) → fx 0.053..0.095, fy 0.252..0.315
    // Green-handled dropper/brush — color picker in MS Paint.
    rect: { top: 0.258, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "curve",
    label: "CURVA",
    ariaLabel:
      "Curva — envolve a seleção (ou insere) em parênteses (), útil pra agrupar sub-patterns Strudel.",
    // Row 6, Col 2 — image (58..104, 291..339) → fx 0.053..0.095, fy 0.383..0.446
    // Wavy curve icon.
    rect: { top: 0.390, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "ellipse",
    label: "ELIPSE",
    ariaLabel:
      "Elipse — clica pra remover 2 espaços (ou 1) do início da linha/seleção (mesmo que Shift+Tab).",
    // Row 8, Col 1 — image (2..56, 393..441) → fx 0.002..0.051, fy 0.517..0.581
    // Ellipse/cloud icon.
    rect: { top: 0.523, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "rounded",
    label: "RET. ARREDONDADO",
    ariaLabel:
      "Retângulo arredondado — salva o código atual no localStorage do navegador. Clica de novo pra restaurar (e apagar o preset).",
    // Row 8, Col 2 — image (58..104, 393..441) → fx 0.053..0.095, fy 0.517..0.581
    // Rounded rectangle icon.
    rect: { top: 0.523, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "spray",
    label: "SPRAY",
    ariaLabel:
      "Spray — clica pra alternar o destaque da linha ativa (uma borda magenta sutil aparece no canvas).",
    // Row 5, Col 1 — image (2..56, 243..291) → fx 0.002..0.051, fy 0.320..0.383
    // Spray-can icon (blue dots).
    rect: { top: 0.326, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "font",
    label: "FONTE",
    ariaLabel:
      "Fonte — clica pra alternar entre texto normal e negrito.",
    // Row 5, Col 2 — image (58..104, 243..291) → fx 0.053..0.095, fy 0.320..0.383
    // "A" font-editor icon.
    rect: { top: 0.326, left: 0.056, width: 0.046, height: 0.057 },
  },
  {
    id: "line",
    label: "LINHA",
    ariaLabel:
      "Linha — clica pra inserir um separador // ──── no cursor. Clica de novo pra remover.",
    // Row 6, Col 1 — image (2..56, 293..339) → fx 0.002..0.051, fy 0.386..0.446
    // Diagonal straight line.
    rect: { top: 0.390, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "rectEmpty",
    label: "RETÂNGULO VAZIO",
    ariaLabel:
      "Retângulo vazio — clica pra envolver a seleção num box de comentário ASCII (// ┌──┐ // │ ... │ // └──┘). Clica de novo pra remover.",
    // Row 7, Col 1 — image (2..56, 343..391) → fx 0.002..0.051, fy 0.452..0.515
    // Empty rectangle outline.
    rect: { top: 0.457, left: 0.005, width: 0.046, height: 0.057 },
  },
  {
    id: "polygon",
    label: "POLÍGONO",
    ariaLabel:
      "Polígono — clica pra alternar a quebra de linha do textarea (word-wrap on/off).",
    // Row 7, Col 2 — image (58..104, 343..391) → fx 0.053..0.095, fy 0.452..0.515
    // Polygon / L-shape.
    rect: { top: 0.457, left: 0.056, width: 0.046, height: 0.057 },
  },
];

// Allow the palette's neutral cells (black/white/grays) to pick to

// Allow the palette's neutral cells (black/white/grays) to pick to
// their respective color even though they're near-gray pixels that
// the saturation filter would otherwise reject.
const NEUTRAL_CELL_COLORS = new Set<string>([
  "#000000", // column 1 top — black
  "#ffffff", // column 1 bottom — white
  "#808080", // column 2 top — dark gray
  "#c0c0c0", // column 2 bottom — medium gray
]);

function rgbKey(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function isPickedColor(r: number, g: number, b: number): boolean {
  if (NEUTRAL_CELL_COLORS.has(rgbKey(r, g, b))) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 35) return false; // near-gray (border / row gap)
  if (max < 40) return false; // too dark — guards the cell borders
  return true;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function Paint95TextEditor() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [inkColor, setInkColor] = useState<string>("#000000");
  const [savedCode, setSavedCode] = useState<string>(INITIAL_CODE);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [blinking, setBlinking] = useState<boolean>(false);
  const [isCleared, setIsCleared] = useState<boolean>(false);
  // Brush (recent colors) — capped at COLOR_HISTORY_MAX distinct picks.
  // Most recent first; clicking Brush cycles to the next-most-recent.
  const [colorHistory, setColorHistory] = useState<string[]>(["#000000"]);
  // Pigment reset state — track the pre-rainbow color and the current
  // rainbow step so the 8th click (after cycling all 7 colors) can
  // restore the original ink color. step === -1 means we're outside
  // the rainbow; step in [0..6] indexes into RAINBOW_COLORS.
  const [previousInkColor, setPreviousInkColor] = useState<string | null>(
    null,
  );
  const [rainbowStep, setRainbowStep] = useState<number>(-1);
  // Rounded-rectangle preset — true when there's a saved snapshot in
  // localStorage the user can recall. Drives the "this preset is set"
  // ring state.
  const [hasPreset, setHasPreset] = useState<boolean>(false);
  // Spray — active-line highlight toggle. When on, the textarea
  // gets a subtle inset box-shadow so the user can see the mode is
  // active. 2-click reset is just the toggle itself.
  const [highlightLine, setHighlightLine] = useState<boolean>(false);
  // Font — bold/normal toggle. Drives the textarea's font-weight.
  const [bold, setBold] = useState<boolean>(false);
  // Line — tracks the last inserted `// ────` separator so the next
  // click on Line removes it. null means no active separator.
  const [lastSeparator, setLastSeparator] = useState<{
    start: number;
    end: number;
  } | null>(null);
  // RectEmpty — tracks the last box-comment wrap so the next click
  // restores the original (unwrapped) text. Stores the original slice
  // so we can put it back exactly even if the user edits elsewhere.
  const [lastWrap, setLastWrap] = useState<{
    start: number;
    end: number;
    original: string;
  } | null>(null);
  // Polygon — word-wrap toggle. Default true (wraps); toggling sets
  // the textarea's `wrap` attribute to "off" so long lines scroll
  // horizontally instead.
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  // Font zoom — starts at FONT_SIZE_BASE (matches the old responsive
  // clamp max of 14px so the unzoomed state looks identical). Each
  // magnifier click multiplies by ZOOM_STEP (1.25) for a proportional
  // increase; capped at FONT_SIZE_MAX so the code can't outgrow the
  // canvas.
  const [fontSize, setFontSize] = useState<number>(FONT_SIZE_BASE);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sampleReady = useRef(false);

  // Bake the static image into an offscreen canvas so palette clicks
  // can sample the exact pixel under the cursor. Keeps the pickable
  // colors in sync with the PNG.
  useEffect(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const draw = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      sampleReady.current = true;
    };

    if (img.complete && img.naturalWidth > 0) draw();
    else img.addEventListener("load", draw);
    return () => img.removeEventListener("load", draw);
  }, []);

  // Preset hydration — on mount, if there's a saved snippet in
  // localStorage, restore it as the initial code (otherwise fall back
  // to INITIAL_CODE). Also flag hasPreset for the Rounded-Rectangle
  // button's active ring.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(PRESET_STORAGE_KEY);
      if (stored !== null) {
        setCode(stored);
        setHasPreset(true);
      }
    } catch {
      // localStorage unavailable (private mode, quota, etc.) — fall
      // back to INITIAL_CODE and skip preset behavior.
    }
  }, []);

  // ── Palette handler ─────────────────────────────────────────
  const handlePalettePick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!sampleReady.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const imgRect = img.getBoundingClientRect();
    const fx = (e.clientX - imgRect.left) / imgRect.width;
    const fy = (e.clientY - imgRect.top) / imgRect.height;
    if (
      fx < PALETTE_REGION.left ||
      fx > PALETTE_REGION.right ||
      fy < PALETTE_REGION.top ||
      fy > PALETTE_REGION.bottom
    ) {
      return;
    }
    const x = fx * img.naturalWidth;
    const y = fy * img.naturalHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    try {
      const data = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = data;
      if (!isPickedColor(r, g, b)) return;
      const hex = rgbToHex(r, g, b);
      setInkColor(hex);
      // Push to Brush history — most recent first, deduplicated,
      // capped at COLOR_HISTORY_MAX distinct entries.
      setColorHistory((prev) => {
        const filtered = prev.filter((c) => c !== hex);
        filtered.unshift(hex);
        return filtered.slice(0, COLOR_HISTORY_MAX);
      });
    } catch {
      // local same-origin image — won't happen
    }
  };

  // ── Toolbar handlers ────────────────────────────────────────
  const handleStarClick = () => setBlinking((b) => !b);

  // Pigment — cycle inkColor through the rainbow palette (red →
  // orange → yellow → green → blue → indigo → violet → red).
  // If the current inkColor isn't in the rainbow (e.g. the user
  // picked something from the static palette first), start from
  // red so the cycle is predictable.
  // Pigment — click advances through the rainbow (red → orange →
  // yellow → green → blue → indigo → violet), one color per click.
  // After the 7th click (at violet), the 8th click EXITS rainbow
  // mode and restores the ink color that was active before the
  // cycle started — a "deactivate the change" reset path. Subsequent
  // clicks re-enter the cycle from red.
  const handlePigmentClick = () => {
    if (rainbowStep === -1) {
      // Entering rainbow — snapshot the current color so the 8th
      // click can restore it.
      setPreviousInkColor(inkColor);
      setInkColor(RAINBOW_COLORS[0]);
      setRainbowStep(0);
      return;
    }
    if (rainbowStep === RAINBOW_COLORS.length - 1) {
      // Last color — next click resets to before-pigment ink color.
      if (previousInkColor !== null) setInkColor(previousInkColor);
      setPreviousInkColor(null);
      setRainbowStep(-1);
      return;
    }
    // Middle of cycle — advance one step.
    const next = rainbowStep + 1;
    setInkColor(RAINBOW_COLORS[next]);
    setRainbowStep(next);
  };

  // Magnify — zoom the font size by ZOOM_STEP (1.25×), capped at
  // FONT_SIZE_MAX. Proportional growth: a 14px font jumps to 18,
  // then 22, then 28, etc., until the 100px ceiling. At the ceiling,
  // the next click RESETS to FONT_SIZE_BASE — a "deactivate the
  // change" path. After reset, clicks start the cycle over from base.
  const handleMagnifyClick = () => {
    setFontSize((s) => {
      if (s >= FONT_SIZE_MAX) return FONT_SIZE_BASE;
      return Math.min(Math.round(s * ZOOM_STEP), FONT_SIZE_MAX);
    });
  };

  // Rectangle — select all + copy to clipboard (Cmd/Ctrl+C).
  // The user wanted both behaviors in a single click: the selection
  // gives visual feedback (text highlighted) AND the clipboard gets
  // the code so they can paste it directly into strudel.cc or anywhere
  // else. We focus the textarea first so the selection highlight is
  // visible, then use the async Clipboard API with a document.execCommand
  // fallback for older browsers / insecure contexts (GitHub Pages
  // served over HTTPS, so the async API should be available, but
  // we keep the fallback for robustness).
  const handleRectClick = async () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.select();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ta.value);
      } else {
        // Fallback for browsers without the async Clipboard API.
        ta.setSelectionRange(0, ta.value.length);
        document.execCommand("copy");
      }
    } catch {
      // Clipboard write blocked (e.g. insecure context). The selection
      // is still visible so the user can hit Cmd/Ctrl+C themselves.
    }
  };

  const handleEraserClick = () => {
    if (!isCleared) {
      // First click: snapshot current code, then clear.
      setSavedCode(code);
      setCode("");
      setIsCleared(true);
    } else {
      // Second click: restore the snapshot (fall back to the
      // initial pattern if we somehow have nothing to restore).
      setCode(savedCode || INITIAL_CODE);
      setIsCleared(false);
    }
  };

  const handleTinterClick = () => setDarkMode((d) => !d);

  // Pencil — toggle line comment on the current line(s) or selection.
  // If ALL non-empty lines in the range already start with `//`,
  // remove the markers. Otherwise, prepend `// ` to each non-empty
  // line. Works on single-line selections (cursor on one line) or
  // multi-line selections (selects a range of lines).
  const toggleLineComment = (lines: string[], startLine: number, endLine: number) => {
    const selLines = lines.slice(startLine, endLine + 1);
    const allCommented = selLines.every(
      (l) => l.trim() === "" || /^\s*\/\/ ?/.test(l),
    );
    let charsAdded = 0;
    let charsRemoved = 0;
    const newLines = lines.map((l, i) => {
      if (i < startLine || i > endLine) return l;
      if (allCommented) {
        // Remove `// ` prefix, preserving any leading whitespace.
        const m = l.match(/^(\s*)\/\/ ?(.*)$/);
        if (m) {
          charsRemoved += l.length - (m[1].length + m[2].length);
          return m[1] + m[2];
        }
        return l;
      } else {
        // Add `// ` prefix. Skip empty / whitespace-only lines so we
        // don't litter the file with `// ` for blank rows.
        if (l.trim() === "") return l;
        charsAdded += 3;
        return "// " + l;
      }
    });
    return { lines: newLines, delta: charsAdded - charsRemoved };
  };

  const findLineRange = (
    lines: string[],
    start: number,
    end: number,
  ): { startLine: number; endLine: number } => {
    let startLine = 0;
    let endLine = lines.length - 1;
    let pos = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length;
      const after = pos + lineLen;
      if (startLine === 0 && pos <= start && start <= after) {
        startLine = i;
      }
      if (pos <= end && end <= after) {
        endLine = i;
        break;
      }
      pos += lineLen + 1; // +1 for \n
    }
    return { startLine, endLine };
  };

  const handlePencilClick = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const lines = code.split("\n");
    const { startLine, endLine } = findLineRange(lines, start, end);
    const { lines: newLines, delta } = toggleLineComment(
      lines,
      startLine,
      endLine,
    );
    const newValue = newLines.join("\n");
    setCode(newValue);
    requestAnimationFrame(() => {
      const newStart = Math.max(0, start + delta);
      const newEnd = Math.max(newStart, end + delta);
      ta.setSelectionRange(newStart, newEnd);
    });
  };

  // Brush — cycle through the recent-colors history. Each click
  // advances one step: shows the NEXT color in the queue, then moves
  // the previous one to the back. So click 1 shows red, click 2
  // shows green, click 3 shows blue, etc. On a fresh page (no
  // palette picks yet), initializes with a starter palette so the
  // button is immediately useful — the v1 handler returned silently
  // here, which made the brush feel broken.
  const handleBrushClick = () => {
    if (colorHistory.length <= 1) {
      // First click: seed the cycle and show the first color.
      setColorHistory([...BRUSH_FALLBACK_HISTORY]);
      setInkColor(BRUSH_FALLBACK_HISTORY[0]); // red
      return;
    }
    // history[0] is the current color; history[1] is the next.
    // Shift left so the next becomes the new current.
    const [, next, ...rest] = colorHistory;
    const current = colorHistory[0];
    setColorHistory([next, ...rest, current]);
    setInkColor(next);
  };

  // Curve — wrap the current selection (or insert an empty pair at
  // the cursor) in parentheses. After insertion, the caret lands
  // between the parens so the user can keep typing without moving.
  const handleCurveClick = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const value = ta.value;
    const selected = value.slice(start, end);
    if (selected) {
      const newValue = `${value.slice(0, start)}(${selected})${value.slice(end)}`;
      setCode(newValue);
      requestAnimationFrame(() => {
        ta.setSelectionRange(start + 1, end + 1);
      });
    } else {
      const newValue = `${value.slice(0, start)}()${value.slice(end)}`;
      setCode(newValue);
      requestAnimationFrame(() => {
        ta.setSelectionRange(start + 1, start + 1);
      });
    }
  };

  // Ellipse — remove up to 2 leading spaces from each line in the
  // current line range (single line or multi-line selection). Same
  // logic as Shift+Tab on the textarea. Indent direction matches the
  // existing Tab keypress behavior (2 spaces).
  const handleDeindent = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const lines = code.split("\n");
    const { startLine, endLine } = findLineRange(lines, start, end);
    const newLines = lines.map((l, i) =>
      i >= startLine && i <= endLine ? l.replace(/^ {1,2}/, "") : l,
    );
    const newValue = newLines.join("\n");
    setCode(newValue);
    let shift = 0;
    for (let i = startLine; i <= endLine; i++) {
      const oldLead = lines[i].match(/^ {1,2}/)?.[0].length ?? 0;
      const newLead = newLines[i].match(/^ {0,2}/)?.[0].length ?? 0;
      shift += oldLead - newLead;
    }
    requestAnimationFrame(() => {
      ta.setSelectionRange(
        Math.max(0, start - shift),
        Math.max(0, end - shift),
      );
    });
  };

  // Rounded — save/load a code preset via localStorage. First click
  // snapshots the current code; subsequent click restores it and
  // clears the snapshot (one-shot recall). Has a magenta ring on
  // the button while the preset is set so the user knows about it.
  const handleRoundedClick = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(PRESET_STORAGE_KEY);
      if (stored !== null) {
        // Recall + clear
        setCode(stored);
        window.localStorage.removeItem(PRESET_STORAGE_KEY);
        setHasPreset(false);
      } else {
        window.localStorage.setItem(PRESET_STORAGE_KEY, code);
        setHasPreset(true);
      }
    } catch {
      // localStorage unavailable — silently no-op
    }
  };

  // Spray — toggle the active-line highlight mode. The visual is
  // a subtle inset box-shadow on the textarea (set via className
  // below) so the user can see the mode is active.
  const handleSprayClick = () => setHighlightLine((h) => !h);

  // Font — bold/normal toggle. Drives the textarea's font-weight.
  const handleFontClick = () => setBold((b) => !b);

  // Line — insert a `// ────` separator at the cursor on first click;
  // remove the previously-inserted separator on the second click.
  // Positions are tracked in `lastSeparator` so the remove operation
  // is exact even if the user edited the rest of the code.
  const handleLineClick = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    if (lastSeparator) {
      // Click 2: remove the last separator.
      const newValue =
        code.slice(0, lastSeparator.start) + code.slice(lastSeparator.end);
      setCode(newValue);
      setLastSeparator(null);
      requestAnimationFrame(() => {
        ta.setSelectionRange(
          lastSeparator.start,
          lastSeparator.start,
        );
      });
      return;
    }
    // Click 1: insert at cursor.
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newValue =
      code.slice(0, start) + LINE_SEPARATOR + code.slice(end);
    setCode(newValue);
    setLastSeparator({ start, end: start + LINE_SEPARATOR.length });
    requestAnimationFrame(() => {
      const newCursor = start + LINE_SEPARATOR.length;
      ta.setSelectionRange(newCursor, newCursor);
    });
  };

  // RectEmpty — wrap the selection in an ASCII box comment on first
  // click; restore the original (unwrapped) text on second click.
  // If the selection is empty, inserts a placeholder ("text") so the
  // box is well-formed.
  const handleRectEmptyClick = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    if (lastWrap) {
      // Click 2: unwrap — put the original text back.
      const newValue =
        code.slice(0, lastWrap.start) +
        lastWrap.original +
        code.slice(lastWrap.end);
      setCode(newValue);
      setLastWrap(null);
      requestAnimationFrame(() => {
        ta.setSelectionRange(
          lastWrap.start,
          lastWrap.start + lastWrap.original.length,
        );
      });
      return;
    }
    // Click 1: wrap the selection.
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const original = code.slice(start, end) || "text";
    const dashRun = "─".repeat(Math.max(2, original.length + 2));
    const wrapped = [
      "", // leading newline
      `// ┌${dashRun}┐`,
      `// │ ${original} │`,
      `// └${dashRun}┘`,
      "", // trailing newline
    ].join("\n");
    const newValue = code.slice(0, start) + wrapped + code.slice(end);
    setCode(newValue);
    setLastWrap({
      start,
      end: start + wrapped.length,
      original,
    });
    requestAnimationFrame(() => {
      // Place cursor inside the box (on the inner text).
      const innerStart = start + wrapped.indexOf(original);
      ta.setSelectionRange(innerStart, innerStart + original.length);
    });
  };

  // Polygon — word-wrap toggle. Default wraps (true); click switches
  // to horizontal scrolling for very long lines.
  const handlePolygonClick = () => setWordWrap((w) => !w);

  // Active toolbar ids that need an "is on" visual ring.
  const activeTools = new Set<ToolId>();
  if (blinking) activeTools.add("star");
  if (darkMode) activeTools.add("tinter");
  if (isCleared) activeTools.add("eraser");
  if (hasPreset) activeTools.add("rounded");
  if (highlightLine) activeTools.add("spray");
  if (bold) activeTools.add("font");
  if (lastSeparator) activeTools.add("line");
  if (lastWrap) activeTools.add("rectEmpty");
  if (!wordWrap) activeTools.add("polygon"); // active when wrap is OFF (the user toggled it)

  return (
    <div
      className="relative w-full mx-auto select-none"
      style={{
        aspectRatio: "1089 / 759",
        maxWidth: "min(100%, 1400px)",
      }}
    >
      {/* Static MS Paint 95 image — decorative. pointer-events: none so
          clicks fall through to the overlay buttons / textarea. */}
      <img
        ref={imgRef}
        src={`${site.basePath}/img/paint95-bg.png`}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 w-full h-full select-none pointer-events-none"
      />

      {/* Editable canvas. Transparent so the image's white canvas shows
          through. Dark mode swaps bg/fg to black/white. Blinking adds a
          cursor-style opacity flash via the `paint-blink` keyframes in
          globals.css. */}
      <textarea
        ref={textareaRef}
        value={code}
        wrap={wordWrap ? "soft" : "off"}
        onChange={(e) => {
          setCode(e.target.value);
          // If the user types after clearing, they're writing new code —
          // exit the cleared state so the next eraser click clears again.
          if (isCleared && e.target.value !== "") setIsCleared(false);
        }}
        spellCheck={false}
        aria-label="Editor de código Strudel dentro do canvas do Paint 95"
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            if (e.shiftKey) {
              // Shift+Tab — de-indent (mirror the Ellipse button).
              // Inline the same de-indent logic so the keyboard
              // shortcut works without needing to ref through the
              // component closure.
              const lines = code.split("\n");
              let startLine = 0;
              let endLine = lines.length - 1;
              let pos = 0;
              for (let i = 0; i < lines.length; i++) {
                const ll = lines[i].length;
                const after = pos + ll;
                if (startLine === 0 && pos <= start && start <= after)
                  startLine = i;
                if (pos <= end && end <= after) {
                  endLine = i;
                  break;
                }
                pos += ll + 1;
              }
              const newLines = lines.map((l, i) =>
                i >= startLine && i <= endLine
                  ? l.replace(/^ {1,2}/, "")
                  : l,
              );
              const newValue = newLines.join("\n");
              let shift = 0;
              for (let i = startLine; i <= endLine; i++) {
                const oldLead = lines[i].match(/^ {1,2}/)?.[0].length ?? 0;
                const newLead = newLines[i].match(/^ {0,2}/)?.[0].length ?? 0;
                shift += oldLead - newLead;
              }
              setCode(newValue);
              requestAnimationFrame(() => {
                target.setSelectionRange(
                  Math.max(0, start - shift),
                  Math.max(0, end - shift),
                );
              });
            } else {
              const next = code.slice(0, start) + "  " + code.slice(end);
              setCode(next);
              requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 2;
              });
            }
          }
        }}
        className={`absolute leading-[1.5] outline-none border-0 resize-none${
          blinking ? " animate-paint-blink" : ""
        }${highlightLine ? " paint-line-highlight" : ""}`}
        // The wrap attribute is HTML-only (not a React prop), so we
        // spread it onto the <textarea> directly. Polygon's toggle
        // flips this between "soft" (default) and "off".
        style={{
          left: "12.2%",
          top: "7%",
          width: "88.5%",
          height: "75%",
          // Dark mode swaps the canvas to a black ink-block; the
          // picked inkColor is overridden with white so the code
          // reads against the new background.
          background: darkMode ? "#000000" : "transparent",
          color: darkMode ? "#ffffff" : inkColor,
          caretColor: darkMode ? "#ffffff" : inkColor,
          padding: "0.5rem 0.6rem",
          fontFamily: "var(--font-mono)",
          // Magnify button scales this proportionally (1.25× per
          // click, capped at FONT_SIZE_MAX = 100px). Replaces the
          // previous responsive `clamp(10px, 1.1vw, 14px)` since
          // the user wants explicit zoom control.
          fontSize: `${fontSize}px`,
          // Font (Row 5, Col 2) — bold/normal toggle.
          fontWeight: bold ? 700 : 400,
          appearance: "none",
          WebkitAppearance: "none",
          boxShadow: "none",
          tabSize: 2,
          transition:
            "color 120ms linear, caret-color 120ms linear, background-color 120ms linear",
        }}
      />

      {/* Toolbar buttons — transparent overlays on specific MS Paint
          icons. onMouseDown preventDefault keeps focus on the textarea. */}
      {TOOLBAR_BUTTONS.map((btn) => {
        const isActive = activeTools.has(btn.id);
        return (
          <button
            key={btn.id}
            type="button"
            onClick={
              btn.id === "star"
                ? handleStarClick
                : btn.id === "eraser"
                ? handleEraserClick
                : btn.id === "tinter"
                ? handleTinterClick
                : btn.id === "pigment"
                ? handlePigmentClick
                : btn.id === "magnify"
                ? handleMagnifyClick
                : btn.id === "pencil"
                ? handlePencilClick
                : btn.id === "brush"
                ? handleBrushClick
                : btn.id === "curve"
                ? handleCurveClick
                : btn.id === "ellipse"
                ? handleDeindent
                : btn.id === "rounded"
                ? handleRoundedClick
                : btn.id === "spray"
                ? handleSprayClick
                : btn.id === "font"
                ? handleFontClick
                : btn.id === "line"
                ? handleLineClick
                : btn.id === "rectEmpty"
                ? handleRectEmptyClick
                : btn.id === "polygon"
                ? handlePolygonClick
                : handleRectClick
            }
            onMouseDown={(e) => e.preventDefault()}
            aria-label={btn.ariaLabel}
            aria-pressed={isActive}
            data-active={isActive ? "true" : undefined}
            className={`absolute cursor-pointer hover:bg-white/15 active:bg-white/30`}transition-colors
            style={{
              top: `${btn.rect.top * 100}%`,
              left: `${btn.rect.left * 100}%`,
              width: `${btn.rect.width * 100}%`,
              height: `${btn.rect.height * 100}%`,
              background: "transparent",
              border: 0,
              padding: 0,
              margin: 0,
            }}
          />
        );
      })}

      {/* Palette click target — transparent button over the 14×2
          color cells. onMouseDown preventDefault keeps focus on the
          textarea. Keyboard focus still works (Tab). */}
      <button
        type="button"
        onClick={handlePalettePick}
        onMouseDown={(e) => e.preventDefault()}
        aria-label={`Paleta de cores do Paint 95 — clica pra trocar a cor do código. Cor atual ${inkColor}.`}
        className="absolute cursor-crosshair"
        style={{
          left: `${PALETTE_REGION.left * 100}%`,
          top: `${PALETTE_REGION.top * 100}%`,
          width: `${(PALETTE_REGION.right - PALETTE_REGION.left) * 100}%`,
          height: `${(PALETTE_REGION.bottom - PALETTE_REGION.top) * 100}%`,
          background: "transparent",
          border: 0,
          padding: 0,
          margin: 0,
        }}
      />

      {/* Offscreen canvas — static image is drawn here so palette
          clicks can sample the exact pixel under the cursor. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ display: "none" }}
      />

      {/* Screen-reader live region announcing the current state of
          the toggle tools (eraser cleared, dark mode, blink). The
          rectangle button is one-shot and announces its own copy
          result via the implicit "Copied" feedback in the selection. */}
      <div
        aria-live="polite"
        className="sr-only"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
        }}
      >
        {isCleared
          ? "Código limpo. Clica a borracha de novo pra recuperar."
          : ""}
        {darkMode ? "Modo escuro ativo." : ""}
        {blinking ? "Piscada do código ativa." : ""}
      </div>
    </div>
  );
}
