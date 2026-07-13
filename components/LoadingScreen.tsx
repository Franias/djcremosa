"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * LoadingScreen — Y2K boot splash that recreates the Windows 95 / 98 launch
 * aesthetic: brand logo centred, a chunky 3D-beveled progress bar filling
 * 0 → 100% with animated diagonal stripes, then a fade-out.
 *
 * - Shown once per browser tab (sessionStorage flag `cremosa-splash-seen`).
 *   Once dismissed it never reappears until sessionStorage is cleared.
 * - User can skip early by pressing any key or clicking the splash — the
 *   bar jumps to 100% and the fade-out plays immediately.
 *
 * Why no react95 dep: the splash needs ~6 utility classes we already have,
 * and adding react95 would balloon the static-export bundle for a feature
 * that runs once per session.
 */

const SESSION_KEY = "cremosa-splash-seen";
const FILL_MS = 1500;
const FADE_MS = 280;

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  // Decide on mount: was this tab already shown the splash?
  const [visible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadySeen) return false;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  });
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  // Drive the progress bar from 0 → 100% over FILL_MS, then trigger fade.
  useEffect(() => {
    if (!visible || done) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / FILL_MS);
      // easeOutCubic so the bar decelerates near 100% (matches Win9x feel)
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(eased * 100);
      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setFading(true);
        setTimeout(() => setDone(true), FADE_MS);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, done]);

  // Skip handler — any keypress or click on the splash dismisses it.
  useEffect(() => {
    if (!visible || fading || done) return;
    const skip = () => {
      setSkipped(true);
      setProgress(100);
      setFading(true);
      setTimeout(() => setDone(true), FADE_MS);
    };
    const onKey = (e: KeyboardEvent) => {
      // Avoid hijacking browser shortcuts the user might actually need.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, fading, done]);

  if (done || !visible) return null;

  const src1200 = `${site.basePath}/splash/cremosa-splash-1200.png`;
  const src600 = `${site.basePath}/splash/cremosa-splash-600.png`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando Cremosa — pressione qualquer tecla para pular"
      onClick={() => {
        if (!fading && !done) {
          setSkipped(true);
          setProgress(100);
          setFading(true);
          setTimeout(() => setDone(true), FADE_MS);
        }
      }}
      className="fixed inset-0 z-[100] grid place-items-center px-4 cursor-pointer select-none"
      style={{
        background: "#008080", // classic Win9x teal desktop
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-xl">
        {/* Logo — picture element for responsive src set */}
        <picture>
          <source media="(min-width: 640px)" srcSet={src1200} />
          <img
            src={src600}
            alt="Cremosa"
            width={600}
            height={185}
            className="w-full max-w-md h-auto"
            style={{ imageRendering: "pixelated" }}
          />
        </picture>

        {/* Win95-style progress window */}
        <div className="w-full max-w-md">
          <div className="win95-bevel-out bg-[#c0c0c0] p-1">
            <div className="win95-bevel-in bg-[#c0c0c0] p-4 flex flex-col gap-3">
              <p className="win-status-text text-black">
                {skipped ? "Pulando Cremosa.exe…" : "Iniciando Cremosa.exe…"}
              </p>
              <div
                className="win95-progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <div
                  className="win95-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="win-status-text text-black tabular-nums self-end">
                {Math.round(progress).toString().padStart(3, " ")}%
              </p>
            </div>
          </div>

          <p className="win-eyebrow-sm text-center mt-3 text-white">
            {`// ${site.brand.tagline.primary}`}
          </p>
          <p className="win-eyebrow-sm text-center mt-1 text-white/60 animate-pulse">
            pressione qualquer tecla para pular
          </p>
        </div>
      </div>
    </div>
  );
}