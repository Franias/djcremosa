"use client";

import { useState } from "react";
import { STRUDEL_PATTERNS } from "@/content/strudel";

/**
 * Paint95TextEditor — DJ Verbosa section body.
 *
 * Renders the MS Paint 95 reference image as a static background
 * (`/img/paint95-bg.png`, 1089×759 — copied verbatim from the
 * user's reference) and overlays a transparent `<textarea>` in
 * the white canvas area. No buttons, no toolbar, no palette
 * interactions — the image is static and the canvas is a plain
 * text editor with the Strudel code as the initial value.
 *
 * The textarea boundaries (as % of the source image) line up
 * with the visible white canvas in the reference:
 *
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  File  Edit  View  Image  Options  Help                  │ ← menu (outside textarea)
 *   ├──────┬───────────────────────────────────────────────────┤
 *   │ ▢ ▢ │                                                   │
 *   │ 🪣🖌│   ╔═══════════════════════════════════════════╗   │
 *   │ 🔍 A│   ║                                           ║   │
 *   │ ✏  │   ║   setcpm(130/4)                           ║   │
 *   │ ⌒ ╱│   ║   samples('github:yaxu/clean-breaks')     ║   │  ← textarea overlay
 *   │ ▭ ▭│   ║   ...                                       ║   │     (editable)
 *   │ ◯ ▢│   ║                                           ║   │
 *   │      │   ╚═══════════════════════════════════════════╝   │
 *   ├──────┴───────────────────────────────────────────────────┤
 *   │ ▣FG/BG  ▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪▪  (palette — outside)         │
 *   ├──────────────────────────────────────────────────────────┤
 *   │ For Help, click Help Topics on the Help Menu.            │ ← status (outside)
 *   └──────────────────────────────────────────────────────────┘
 *
 *   textarea: top 4% · left 7.2% · width 88.5% · height 84.3%
 */

const INITIAL_CODE = STRUDEL_PATTERNS[0]?.code ?? "";

export function Paint95TextEditor() {
  const [code, setCode] = useState<string>(INITIAL_CODE);

  return (
    <div
      className="relative w-full mx-auto select-none"
      style={{
        // Aspect ratio matches the source image so the % overlays
        // stay aligned at any container width.
        aspectRatio: "1089 / 759",
        // Cap the width so it doesn't dwarf the rest of the page
        // on ultra-wide monitors. The source is 1089px wide.
        maxWidth: "min(100%, 1400px)",
      }}
    >
      {/*
       * Static MS Paint 95 image. `pointer-events: none` so clicks
       * fall through to the textarea underneath, and `aria-hidden`
       * because the textarea is the real accessible element for
       * the canvas content.
       */}
      <img
        src="/img/paint95-bg.png"
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 w-full h-full select-none pointer-events-none"
      />

      {/*
       * The editable canvas. Transparent background so the image's
       * white canvas shows through. Monospace, black text — the
       * exact "Strudel code painted onto the Paint canvas" effect
       * the user asked for.
       */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        aria-label="Editor de código Strudel dentro do canvas do Paint 95"
        // Insert two spaces on Tab instead of moving focus — basic
        // editor affordance for Strudel indentation.
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const next = code.slice(0, start) + "  " + code.slice(end);
            setCode(next);
            requestAnimationFrame(() => {
              target.selectionStart = target.selectionEnd = start + 2;
            });
          }
        }}
        className="absolute leading-[1.5] outline-none border-0 resize-none"
        style={{
          // Aligned to the white canvas in the image (px measured
          // from the 1089×759 source: left ≈ 78px, top ≈ 30px,
          // right ≈ 1042px, bottom ≈ 670px).
          left: "12.2%",
          top: "7%",
          width: "88.5%",
          height: "84.3%",
          background: "transparent",
          color: "#000",
          padding: "0.5rem 0.6rem",
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(10px, 1.1vw, 14px)",
          // Strip the default browser styling so the textarea
          // blends seamlessly with the canvas.
          appearance: "none",
          WebkitAppearance: "none",
          boxShadow: "none",
          tabSize: 2,
        }}
      />
    </div>
  );
}