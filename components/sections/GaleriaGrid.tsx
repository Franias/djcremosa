"use client";

import { useEffect, useState } from "react";
import { Sparkle } from "@/components/sections/Sparkle";
import {
  Win95Button,
  Win95ProgressBar,
  Win95Window,
} from "@/components/ui/win95";
import { photos, photoSrc, type GaleriaPhoto } from "@/content/photos";

type Filter = GaleriaPhoto["context"] | "all";

const CONTEXT_LABELS: Record<GaleriaPhoto["context"], string> = {
  show: "Show",
  residencia: "Residência",
  coletivo: "Coletivo",
  backstage: "Bastidores",
};

export function GaleriaGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<GaleriaPhoto | null>(null);

  const visible =
    filter === "all" ? photos : photos.filter((p) => p.context === filter);

  // Close lightbox on Esc + lock body scroll while open.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <>
      {/* HERO */}
      <section className="hero grain halftone">
        <div className="shell relative z-10 flex flex-col items-center text-center">
          <p className="win-eyebrow text-bubble mb-4">
            {"// pista · bastidores · retratos"}
          </p>
          <div className="relative inline-block">
            <Sparkle size="md" className="absolute -top-5 -left-7 hidden sm:block" />
            <Sparkle size="lg" className="absolute -top-8 left-1/3 hidden sm:block" />
            <Sparkle size="sm" className="absolute top-1 -right-6 hidden sm:block" />
            <h1 className="win-display bubble-strong text-[18vw] sm:text-[10rem]">
              GALERIA
            </h1>
          </div>
          <p className="mt-6 max-w-2xl win-body text-cream-dim">
            Mosaico das fotos de pista, retrato e bastidor. Clique em qualquer
            imagem pra abrir em tela cheia.
          </p>
        </div>
      </section>

      {/* FILTER PILLS */}
      <section className="shell pt-10 sm:pt-14">
        <div
          role="tablist"
          aria-label="Filtrar galeria por contexto"
          className="flex flex-wrap items-center gap-2 border-b border-line pb-4"
        >
          <FilterChip
            label="Tudo"
            count={photos.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {(Object.keys(CONTEXT_LABELS) as GaleriaPhoto["context"][]).map(
            (ctx) => (
              <FilterChip
                key={ctx}
                label={CONTEXT_LABELS[ctx]}
                count={photos.filter((p) => p.context === ctx).length}
                active={filter === ctx}
                onClick={() => setFilter(ctx)}
              />
            ),
          )}
          <span className="ml-auto win-eyebrow text-cream-dim text-[10px] hidden sm:inline">
            {visible.length} {visible.length === 1 ? "foto" : "fotos"}
          </span>
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="shell py-10 sm:py-14">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]"
          style={{ gridAutoFlow: "dense" }}
        >
          {visible.map((p) => (
            <Tile
              key={p.slug}
              photo={p}
              onOpen={() => setActive(p)}
              rowSpan={p.span?.row}
              colSpan={p.span?.col}
            />
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {active && <Lightbox photo={active} onClose={() => setActive(null)} />}
    </>
  );
}

/* ───────────────────────── subcomponents ───────────────────────── */

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Win95Button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      active={active}
      focused={active}
    >
      {label}
      <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] border border-win-shadow-deep bg-win-face text-win-ink">
        {count}
      </span>
    </Win95Button>
  );
}

function Tile({
  photo,
  onOpen,
  rowSpan,
  colSpan,
}: {
  photo: GaleriaPhoto;
  onOpen: () => void;
  rowSpan?: number;
  colSpan?: number;
}) {
  const style: React.CSSProperties = {};
  if (rowSpan && rowSpan > 1) style.gridRow = `span ${rowSpan}`;
  if (colSpan && colSpan > 1) style.gridColumn = `span ${colSpan}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Abrir foto: ${photo.caption}`}
      className="group relative text-left focus:outline-none win95-bevel-out bg-win-face p-[2px] transition-shadow hover:shadow-[0_0_0_2px_var(--color-bubble)]"
      style={style}
    >
      <div className="win95-bevel-deep-in bg-win-face">
        <div className="win95-title" role="presentation">
          <span className="win-eyebrow truncate tracking-[0.18em] text-[10px]">
            {CONTEXT_LABELS[photo.context]} · {photo.caption}
          </span>
          <span className="win95-title-controls" aria-hidden>
            <span>─</span>
            <span>□</span>
            <span className="close">×</span>
          </span>
        </div>
        <div className="relative win95-bevel-deep-in bg-win-face overflow-hidden">
          <img
            src={photoSrc(photo.slug, 800)}
            alt={photo.caption}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />

          {/* Hover overlay — bubble tint + scanline */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, rgba(214,48,122,0.35) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Footer strip — credit */}
          <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-bg/80 backdrop-blur-sm flex items-center justify-between text-cream">
            <span className="win-eyebrow truncate tracking-[0.18em] text-[10px]">
              foto · {photo.credit}
            </span>
            <span className="win-eyebrow text-bubble text-[10px]">→ abrir</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function Lightbox({
  photo,
  onClose,
}: {
  photo: GaleriaPhoto;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // While the image is loading, animate the Win95 progress bar 0 → 95%
  // (cap short of 100 so the onLoad event has a moment to land).
  // `photo.slug` is the dep so the effect re-runs when a new photo opens.
  // Initial state resets to 0/false automatically because the lightbox
  // remounts via conditional rendering — so we don't need to set them
  // inside the effect.
  const photoSlug = photo.slug;
  useEffect(() => {
    const start = performance.now();
    const DURATION = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / DURATION);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.min(95, eased * 100));
      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [photoSlug]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8 bg-bg/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-12 right-0">
          <Win95Button onClick={onClose} focused>
            Fechar ×
          </Win95Button>
        </div>

        <Win95Window title={`${photo.caption}.jpg`} controls>
          <div className="relative bg-bg min-h-[200px] sm:min-h-[360px]">
            {/* Win95 progress bar — visible until image loads */}
            {!loaded && (
              <div className="absolute inset-0 grid place-items-center p-6">
                <div className="w-full max-w-md flex flex-col gap-2">
                  <p className="win-eyebrow text-bubble text-center text-[12px]">
                    Carregando imagem…
                  </p>
                  <Win95ProgressBar value={progress} label="Carregando imagem" />
                  <p className="win-eyebrow tabular-nums text-cream-dim text-center text-[11px]">
                    {Math.round(progress).toString().padStart(3, " ")}%
                  </p>
                </div>
              </div>
            )}
            <img
              src={photoSrc(photo.slug, 1600)}
              alt={photo.caption}
              onLoad={() => {
                setLoaded(true);
                setProgress(100);
              }}
              className={[
                "w-full h-auto max-h-[80vh] object-contain transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          </div>
          <div className="win95-statusbar" aria-hidden>
            <span className="win95-statusbar-segment grow">
              {photo.context.toUpperCase()} · {photo.caption}
            </span>
            <span className="win95-statusbar-segment shrink">foto</span>
            <span className="win95-statusbar-segment shrink">
              {photo.credit}
            </span>
          </div>
        </Win95Window>
      </div>
    </div>
  );
}