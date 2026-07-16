"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Win95Button,
  Win95MenuBar,
  Win95StatusBar,
  Win95Window,
} from "@/components/ui/win95";
import {
  STRUDEL_PATTERNS,
  DEFAULT_STRUDEL_SLUG,
  type StrudelPattern,
} from "@/content/strudel";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * Paint95 — DJ Verbosa page body. Reproduces the jspaint.app
 * layout faithfully (matches `hawwokitty/my-portfolio`'s
 * PaintComp.jsx, which embeds jspaint.app inside a react95
 * Modal).
 *
 * The chrome is exactly the reference:
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  ▣ untitled - Paint (verbosa.exe)    ─  ▢  ?  ×         │  wine title bar
 *   │  Padrão: [clean-breaks-think ▾]  📋 copiar  abrir ↗      │  quick action row
 *   ├──────────────────────────────────────────────────────────┤
 *   │  <u>F</u>icheiro  <u>E</u>ditar  <u>V</u>er  <u>P</u>adrão  <u>A</u>juda│  menu bar
 *   ├──────────┬───────────────────────────────────────────────┤
 *   │ ▢  ▱  ✏ │  setcpm(130/4)                              ▲ │
 *   │ 🪣 💧 🖌 │  samples('github:yaxu/clean-breaks')        ║ │
 *   │ 🔍  ❄  A │  $: s("hh!1")._punchcard()                  ║ │  toolbar + canvas
 *   │ ⌒  ╱  ▭ │  $: s("think")                              ║ │
 *   │ ⬠  ◯  ▢ │    .loopAt(1)                               ║ │
 *   │        ▲│    .slice(8, irand(8)).seg(8)               ║ │
 *   │        ▼│    ._punchcard()                           ◀●━▶│
 *   ├──────────┴───────────────────────────────────────────────┤
 *   │ ▣FG/BG  ■ ■ ■ ■ ■ ■ ■ ■                                  │  color palette
 *   │         ■ ■ ■ ■ ■ ■ ■ ■                                  │
 *   ├──────────────────────────────────────────────────────────┤
 *   │ ◯ Para obter ajuda, faça clique sobre 'Tópicos da       │  status bar
 *   │   ajuda' no menu 'Ajuda'.    519 chars  15 ln  130 bpm  │
 *   └──────────────────────────────────────────────────────────┘
 *
 * Wine title bar via `--win-title-1`/`--win-title-2` CSS
 * variable override — matches jspaint.app's Portuguese locale
 * AND the site's `.player-title` magenta chrome.
 *
 * `"use client"` because it owns tool + palette + clipboard state.
 */

/* ────────────────────────── Paint tools ────────────────────────── */

interface PaintTool {
  id: string;
  glyph: string;
  label: string;
  hint: string;
}

/**
 * 15 classic Paint-95 tools arranged 3 cols × 5 rows. Order
 * mirrors the reference screenshot: select/eraser/pencil |
 * fill/picker/brush | magnifier/spray/text | curve/line/rect
 * | poly/ellipse/rrect.
 */
const PAINT_TOOLS: ReadonlyArray<PaintTool> = [
  { id: "select",    glyph: "▢", label: "Selecionar",   hint: "Ferramenta: Selecionar — marque uma região do canvas." },
  { id: "eraser",    glyph: "▱", label: "Borracha",     hint: "Ferramenta: Borracha — apaga pixels (decorativo)." },
  { id: "pencil",    glyph: "✏", label: "Lápis",        hint: "Ferramenta: Lápis — traço fino, 1px." },
  { id: "fill",      glyph: "🪣", label: "Preencher",    hint: "Ferramenta: Preencher — pinta a área fechada." },
  { id: "pick",      glyph: "💧", label: "Conta-gotas",  hint: "Ferramenta: Conta-gotas — copia a cor sob o cursor." },
  { id: "brush",     glyph: "🖌", label: "Pincel",       hint: "Ferramenta: Pincel — traço mais grosso." },
  { id: "magnifier", glyph: "🔍", label: "Lupa",         hint: "Ferramenta: Lupa — amplia uma região do canvas." },
  { id: "spray",     glyph: "❄", label: "Aerógrafo",    hint: "Ferramenta: Aerógrafo — spray de pixels." },
  { id: "text",      glyph: "A", label: "Texto",        hint: "Ferramenta: Texto — o código Strudel é renderizado aqui." },
  { id: "curve",     glyph: "⌒", label: "Curva",        hint: "Ferramenta: Curva — spline de Bézier." },
  { id: "line",      glyph: "╱", label: "Linha",        hint: "Ferramenta: Linha — desenha uma reta." },
  { id: "rect",      glyph: "▭", label: "Retângulo",    hint: "Ferramenta: Retângulo." },
  { id: "poly",      glyph: "⬠", label: "Polígono",     hint: "Ferramenta: Polígono." },
  { id: "ellipse",   glyph: "◯", label: "Elipse",       hint: "Ferramenta: Elipse." },
  { id: "rrect",     glyph: "▢", label: "Ret. arred.",  hint: "Ferramenta: Retângulo arredondado." },
];

/* ────────────────────────── Color palette ────────────────────────── */

/** Two rows × 8 cols = the classic MS-Paint-95 palette. Order
 *  matches the reference screenshot: dark colors in the top
 *  row, lighter/bright colors in the bottom row. */
const PALETTE: ReadonlyArray<{ name: string; hex: string }> = [
  { name: "Preto",           hex: "#000000" },
  { name: "Cinza escuro",    hex: "#808080" },
  { name: "Vermelho escuro", hex: "#800000" },
  { name: "Oliva",           hex: "#808000" },
  { name: "Verde escuro",    hex: "#008000" },
  { name: "Teal escuro",     hex: "#008080" },
  { name: "Azul marinho",    hex: "#000080" },
  { name: "Roxo",            hex: "#800080" },
  { name: "Branco",          hex: "#ffffff" },
  { name: "Cinza claro",     hex: "#c0c0c0" },
  { name: "Vermelho",        hex: "#ff0000" },
  { name: "Amarelo",         hex: "#ffff00" },
  { name: "Lima",            hex: "#00ff00" },
  { name: "Ciano",           hex: "#00ffff" },
  { name: "Magenta",         hex: "#ff00ff" },
  { name: "Rosa",            hex: "#ffafaf" },
];

/** Wine-red gradient — overrides --win-title-1/--win-title-2 so
 *  the title bar matches jspaint.app's Portuguese locale. Same
 *  colors as the site's `.player-title` magenta chrome. */
const WINE_TITLE_BG = {
  "--win-title-1": "#8a0d1f",
  "--win-title-2": "#d6307a",
} as React.CSSProperties;

/* ────────────────────────── Component ────────────────────────── */

interface Paint95Props {
  /** Initial pattern slug. */
  initialSlug?: string;
}

export function Paint95({ initialSlug }: Paint95Props) {
  /* Pattern + tool + palette + clipboard state. */
  const initialPattern = useMemo<StrudelPattern>(
    () =>
      STRUDEL_PATTERNS.find((p) => p.slug === initialSlug) ??
      STRUDEL_PATTERNS.find((p) => p.slug === DEFAULT_STRUDEL_SLUG) ??
      STRUDEL_PATTERNS[0],
    [initialSlug],
  );

  const [activeSlug, setActiveSlug] = useState<string>(initialPattern.slug);
  const [tool, setTool] = useState<string>("text");
  const [inkColor, setInkColor] = useState<string>(PALETTE[0].hex);
  const [fillColor, setFillColor] = useState<string>(PALETTE[8].hex);
  const [inkIdx, setInkIdx] = useState<number>(0);
  const [fillIdx, setFillIdx] = useState<number>(8);
  const [copied, setCopied] = useState<"idle" | "ok" | "err">("idle");

  const pattern = useMemo(
    () => STRUDEL_PATTERNS.find((p) => p.slug === activeSlug) ?? initialPattern,
    [activeSlug, initialSlug, initialPattern],
  );

  useEffect(() => {
    if (copied === "idle") return;
    const id = setTimeout(() => setCopied("idle"), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pattern.code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = pattern.code;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied("ok");
    } catch {
      setCopied("err");
    }
  }, [pattern.code]);

  const activeTool = PAINT_TOOLS.find((t) => t.id === tool) ?? PAINT_TOOLS[0];
  const lineCount = pattern.code.split("\n").length - 1;
  const charCount = pattern.code.length;

  return (
    
    <Win95Window
      title="DJ Verbosa - Paint (verbosa.exe)"
      controls
      className="w-full"
      style={WINE_TITLE_BG}
      titleExtras={
        <span className="win-eyebrow-sm opacity-80 truncate min-w-0 max-w-[60%]">
          {pattern.note}
        </span>
      }
    >
      {/* ──── Quick action row ────
          Pinned to the top of the Paint body so the user has a
          one-click way to switch patterns + copy + open strudel
          without having to dive into the menus. Win95-style
          "quick action" row that matches the reference's
          utilitarian top-bar pattern. */}
      <div className="win95-bevel-in bg-win-face-2 px-2 py-1 flex flex-wrap items-center gap-2">
        <span className="win-eyebrow-sm text-win-shadow-deep">
          Padrão:
        </span>
        <select
          aria-label="Padrão Strudel"
          value={activeSlug}
          onChange={(e) => setActiveSlug(e.target.value)}
          className={cn(
            "win95-bevel-in bg-win-face text-win-ink",
            "font-pixel text-[14px] px-2 py-0.5 outline-none",
            "min-w-0 grow sm:grow-0 sm:max-w-[16rem] truncate",
          )}
        >
          {STRUDEL_PATTERNS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>

        <span className="grow" />

        <Win95Button onClick={handleCopy} focused={copied !== "idle"}>
          {copied === "ok"
            ? "✓ copiado!"
            : copied === "err"
              ? "✕ falhou"
              : "📋 copiar código"}
        </Win95Button>

        <Link
          href="https://strudel.cc/"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Win95Button>abrir no strudel.cc ↗</Win95Button>
        </Link>
      </div>

      {/* ──── Menu bar ────
          Ficheiro / Editar / Ver / Imagem / Cores / Ajuda —
          the 6-item Portuguese layout matches the reference
          (jspaint.app + the image you shared). "Imagem" and
          "Cores" are decorative no-op menu items; the rest
          keep their handlers. */}
      <Win95MenuBar
        items={[
          { label: "Ficheiro", mnemonic: "f", onClick: handleCopy },
          { label: "Editar",   mnemonic: "e" },
          { label: "Ver",      mnemonic: "v" },
          { label: "Imagem",   mnemonic: "i" },
          { label: "Cores",    mnemonic: "c" },
          { label: "Ajuda",    mnemonic: "a", href: "https://strudel.cc/" },
        ]}
      />

      {/* ──── Toolbar (left) + Canvas (right) row ────
          Mirrors the reference image (2-col tool palette on the
          left, white canvas in the center with vertical + hori-
          zontal scrollbar decorations, vertical scrollbar on the
          toolbar column itself). The 2-col layout matches
          jspaint.app and the Win95 reference — wider cells per
          tool, easier to read. */}
      <div className="bg-win-face p-2 sm:p-3 flex gap-2">
        {/* LEFT TOOLBAR — 2 cols × 8 rows like jspaint (14 tools
            + 1 extra = 15 cells in the 2-col grid, the last cell
            in the last row stays empty so the grid balances). */}
        <div
          aria-label="Ferramentas"
          className="shrink-0 flex gap-0.5"
          style={{ width: "4.25rem" }}
        >
          <div
            className="grow win95-bevel-in bg-win-face-2 p-1 grid gap-1 content-start"
            style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
          >
            {PAINT_TOOLS.map((pt) => {
              const active = tool === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setTool(pt.id)}
                  title={pt.label}
                  aria-label={pt.label}
                  aria-pressed={active}
                  className={cn(
                    "win95-button justify-center px-0 text-[16px] leading-none",
                    "h-8 w-full",
                    active && "outline outline-1 outline-magenta outline-offset-[-3px]",
                  )}
                >
                  <span aria-hidden>{pt.glyph}</span>
                </button>
              );
            })}
          </div>

          {/* Vertical scrollbar on the tool column (decorative —
              the toolbar never overflows, but jspaint.app has
              one and so do we). */}
          <div
            aria-hidden
            className="shrink-0 win95-bevel-in bg-win-face-2 flex flex-col items-stretch"
            style={{ width: "16px", height: "100%" }}
          >
            <span
              className="block win95-bevel-out bg-win-face"
              style={{ height: "32px", margin: "2px 2px 0" }}
            />
            <span className="grow" />
            <span aria-hidden className="win95-button justify-center px-0 h-3" style={{ pointerEvents: "none" }}>▲</span>
            <span aria-hidden className="win95-button justify-center px-0 h-3" style={{ pointerEvents: "none" }}>▼</span>
          </div>
        </div>

        {/* CANVAS — white blank with the Strudel code.
            The code is rendered as a static image (the same MS
            Paint window you shared, with the active pattern's
            code baked into the white blank at /dj-verbosa/strudel-on-
            paint.png). The pattern source is the PNG that PIL
            generated from the same `pattern.code` string we
            ship in `content/strudel.ts`, so the image and the
            "copiar código" button are always in sync.

            The image is generated at 2× scale (1166×1704 px) so the
            code reads at ~20pt on retina displays. We render it
            at its natural size so the code stays legible — the
            `<Win95Window>` chrome around the canvas wraps to the
            image's intrinsic width. If the viewport is narrower
            than the image, the canvas adds a horizontal scrollbar
            so the user can still pan over to read the right edge. */}
        <div className="flex-1 min-w-0 win95-bevel-in bg-[#808080] p-1">
          <div className="win95-bevel-deep-in bg-white flex flex-col overflow-auto">
              {/* The CODE — painted onto the white blank. The image
                  carries the Strudel code for the active pattern, so
                  the "first frame" of the Paint95 window matches the
                  MS Paint reference exactly. Clicking still hits the
                  same `handleCopy` on the parent <button>, but the
                  `copiar código` button is the primary action. The
                  PNG is generated at 2x scale (1166×1704) so the
                  code reads at ~20pt on retina displays. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${site.basePath}/dj-verbosa/strudel-on-paint.png`}
                alt={`Strudel code for ${pattern.title}, painted in MS Paint`}
                title={`${pattern.title} — ${pattern.code.length} chars / ${pattern.code.split("\n").length} lines`}
                className="shrink-0 select-text block"
                style={{
                  imageRendering: "pixelated",
                  height: "auto",
                  maxWidth: "none",
                  display: "block",
                }}
                draggable={false}
                onLoad={(e) => {
                  // After the image loads, scroll the canvas so the
                  // first line of code (at y≈140px in the 1704-tall
                  // image) is at the top of the visible area. The
                  // user lands on the code, not the title bar.
                  const wrap = e.currentTarget.parentElement;
                  if (wrap) wrap.scrollTop = 90;
                }}
              />
              

              {/* Right vertical scrollbar — decorative, matches
                  jspaint.app's right-side canvas scrollbar. */}
              <div
                aria-hidden
                className="shrink-0 win95-bevel-in bg-win-face-2 flex flex-col items-stretch"
                style={{ width: "16px", height: "100%" }}
              >
                <span aria-hidden className="win95-button justify-center px-0 text-[10px]" style={{ height: "16px", pointerEvents: "none" }}>▲</span>
                <span className="grow" />
                <span aria-hidden className="win95-button justify-center px-0 text-[10px]" style={{ height: "16px", pointerEvents: "none" }}>▼</span>
              </div>
            </div>

            {/* Bottom horizontal scrollbar — decorative. */}
            <div
              aria-hidden
              className="win95-bevel-in bg-win-face-2 flex items-stretch h-4 shrink-0"
            >
              <span aria-hidden className="win95-button justify-center px-0 shrink-0" style={{ width: "16px", pointerEvents: "none" }}>◀</span>
              <span className="grow mx-0.5 mt-0.5 mb-0.5 win95-bevel-out bg-win-face" />
              <span aria-hidden className="win95-button justify-center px-0 shrink-0" style={{ width: "16px", pointerEvents: "none" }}>▶</span>
            </div>
            </div>
          </div>

      {/* ──── Color palette row ────
          FG/BG overlap preview on the left, then a 2 × 8 grid
          of color swatches. Left-click sets FG (ink), right-
          click sets BG (fill) — jspaint convention. */}
      <div className="bg-win-face px-2 sm:px-3 pb-2 sm:pb-3">
        <div className="win95-bevel-in bg-win-face-2 px-2 py-1.5 flex items-center gap-2">
          {/* FG/BG overlap preview */}
          <div
            aria-label="Cores de frente e fundo"
            className="shrink-0 win95-bevel-in bg-win-face-2 p-0.5"
            style={{ width: "2.25rem", height: "2.25rem" }}
          >
            <div className="relative w-full h-full">
              <button
                type="button"
                aria-label={`Fundo: ${PALETTE[fillIdx].name}`}
                title={`Fundo: ${PALETTE[fillIdx].name} (clique-direito)`}
                onClick={() => {
                  setInkIdx(fillIdx);
                  setInkColor(fillColor);
                }}
                className="absolute win95-bevel-out"
                style={{ inset: 0, background: fillColor }}
              />
              <button
                type="button"
                aria-label={`Tinta: ${PALETTE[inkIdx].name}`}
                title={`Tinta: ${PALETTE[inkIdx].name} (clique)`}
                onClick={() => {
                  setFillIdx(inkIdx);
                  setFillColor(inkColor);
                }}
                className="absolute win95-bevel-out"
                style={{ inset: "4px 0 0 4px", background: inkColor }}
              />
            </div>
          </div>

          {/* Palette grid — 2 rows × 8 cols */}
          <div
            className="grow grid gap-1"
            style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}
            role="group"
            aria-label="Paleta de cores"
          >
            {PALETTE.map((c, i) => {
              const isInk = inkIdx === i;
              const isFill = fillIdx === i;
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    setInkIdx(i);
                    setInkColor(c.hex);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setFillIdx(i);
                    setFillColor(c.hex);
                  }}
                  title={`${c.name} — clique: tinta · clique-direito: fundo`}
                  aria-label={`${c.name}. Tinta.`}
                  className="win95-bevel-out h-5 sm:h-6 w-full"
                  style={{ background: c.hex }}
                >
                  {isInk && (
                    <span aria-hidden className="block w-full h-full" style={{ border: "1px solid #fff", outline: "1px solid #000", outlineOffset: "-1px" }} />
                  )}
                  {isFill && (
                    <span aria-hidden className="block w-full h-full" style={{ margin: "2px", border: "1px dashed #000" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ──── Status bar ────
          Mirrors jspaint.app's bottom strip: long Portuguese
          help text on the left (matches the reference's
          default message), followed by char/line/bpm readouts
          and the live clock. */}
      <Win95StatusBar clock={true}>
        <span className="win95-statusbar-segment grow truncate">
          {activeTool.hint}
        </span>
        <span className="win95-statusbar-segment shrink tabular-nums hidden md:inline-block">
          {charCount.toLocaleString("pt-BR")} chars
        </span>
        <span className="win95-statusbar-segment shrink tabular-nums hidden lg:inline-block">
          {lineCount} linhas
        </span>
        <span className="win95-statusbar-segment shrink tabular-nums">
          {pattern.bpm ?? "—"} bpm
        </span>
      </Win95StatusBar>
    </Win95Window>
  );
}