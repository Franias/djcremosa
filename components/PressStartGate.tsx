"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Sparkle } from "@/components/sections/Sparkle";
import { site } from "@/lib/site";

/**
 * PressStartGate — wraps the home page with a full-viewport splash.
 * While active:
 *   - Big Cremosa logo centred
 *   - Win95 progress bar filling 0→100% over ~3s (decorative — the
 *     page is already loaded, the bar just sets the "booting up" mood)
 *   - "PRESS START" text below — entire splash is the click target,
 *     not just the text
 *   - Hidden SiteNav (via body[data-gate-active])
 *
 * Dismissed by: click anywhere, Space, Enter.
 * Persisted via sessionStorage so it doesn't replay per tab.
 * URL escape hatch: ?skipGate=1 to skip.
 */

const SESSION_KEY = "cremosa-pressed-start";
const FILL_MS = 2000;
const FADE_MS = 380;

interface PressStartGateProps {
  children: ReactNode;
  allowSkip?: boolean;
}

export function PressStartGate({ children, allowSkip = true }: PressStartGateProps) {
  // Hydration fix: on the server, window is undefined and the
  // initialiser returns false → splash renders. On the client mount
  // we then decide based on `?skipGate=1` and sessionStorage. This
  // creates a server/client mismatch that React 19 reports as a
  // hydration error. We side-step it by ALWAYS starting in
  // "not-decided" state and deciding in an effect instead.
  const [decided, setDecided] = useState<boolean>(false);
  useEffect(() => {
    if (allowSkip) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("skipGate") === "1") {
        setDecided(true);
        return;
      }
    }
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      setDecided(true);
    }
  }, [allowSkip]);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  const start = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setFading(true);
    setTimeout(() => setDecided(true), FADE_MS);
  }, []);

  // While the splash is visible:
  //  - tag the body so global CSS can hide the SiteNav header
  //  - lock body scroll so background page can't bleed through
  //  - drive the loading bar via requestAnimationFrame
  useEffect(() => {
    if (decided) return;

    document.body.setAttribute("data-gate-active", "true");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - t0) / FILL_MS);
      const eased = 1 - Math.pow(1 - ratio, 3); // easeOutCubic
      setProgress(eased * 100);
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.removeAttribute("data-gate-active");
      document.body.style.overflow = prevOverflow;
    };
  }, [decided]);

  // URL escape hatch (re-eval on hash/search change).
  // `popstate` fires when the user navigates back/forward or when
  // the search params change programmatically.
  useEffect(() => {
    if (!allowSkip) return;
    const check = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("skipGate") === "1" && !decided) {
        setDecided(true);
      }
    };
    check();
    window.addEventListener("popstate", check);
    return () => window.removeEventListener("popstate", check);
  }, [allowSkip, decided]);

  // Keyboard: Space / Enter starts.
  useEffect(() => {
    if (decided) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decided, start]);

  return (
    <>
      {children}
      {!decided && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Press start to enter the Cremosa site"
          onClick={start}
          className="fixed inset-0 z-[200] grid place-items-center px-4 cursor-pointer select-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 0%, rgba(214,48,122,0.22) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 90% 30%, rgba(255,111,163,0.16) 0%, transparent 55%), #008080",
            opacity: fading ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease-out`,
          }}
        >
          <div className="flex flex-col items-center gap-8 sm:gap-10 w-full max-w-3xl">
            {/* Big Cremosa logo — significantly larger than the
                existing splash / boot screen so it dominates the page. */}
            <picture>
              <source
                media="(min-width: 640px)"
                srcSet={`${site.basePath}/splash/cremosa-splash-1200.png`}
              />
              <img
                src={`${site.basePath}/splash/cremosa-splash-600.png`}
                alt="Cremosa"
                width={1200}
                height={369}
                className="w-full max-w-3xl h-auto drop-shadow-[0_0_40px_rgba(255,111,163,0.55)]"
                style={{ imageRendering: "pixelated" }}
              />
            </picture>

            {/* Win95 progress bar — pure decorative, the page is
                already loaded. Just sets the "booting up" mood. */}
            <div className="w-full max-w-md">
              <p className="win-eyebrow text-white mb-2 text-center">
                Iniciando Cremosa.exe…
              </p>
              <div className="win95-bevel-out bg-win-face p-[3px]">
                <div className="win95-bevel-deep-in bg-win-face p-[2px]">
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
                </div>
              </div>
              <p className="win-eyebrow tabular-nums text-white/70 mt-2 text-right">
                {Math.round(progress).toString().padStart(3, " ")}%
              </p>
            </div>

            {/* "Press Start" — just text, the whole splash is the
                click target. Magenta glow pulses to draw the eye. */}
            <p
              className="win-eyebrow text-center"
            >Press anywhere to play
            </p>
            <style>{`
              @keyframes pressstart-pulse {
                0%, 100% {
                  opacity: 1;
                  text-shadow: 0 0 20px rgba(255,111,163,0.9), 0 0 40px rgba(255,111,163,0.55), 0 4px 12px rgba(0,0,0,0.6);
                }
                50% {
                  opacity: 0.78;
                  text-shadow: 0 0 30px rgba(255,111,163,1), 0 0 60px rgba(255,111,163,0.7), 0 0 90px rgba(255,111,163,0.4), 0 4px 12px rgba(0,0,0,0.6);
                }
              }
            `}</style>

            {/* Bottom hints */}
            <div className="text-center space-y-1">
              <p className="win-eyebrow text-white">
                {`// ${site.brand.tagline.primary}`}
              </p>
              <p className="win-caption text-white/60 animate-pulse">
                pressione qualquer tecla · ou toque na tela
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}