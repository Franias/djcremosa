"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

/**
 * VisitCounter — desktop-style icon that, when clicked, opens a
 * Win95-framed modal showing the live visitor count.
 *
 * Layout in the page (where it's mounted):
 *
 *   [ 👥 ]
 *   visitantes.exe       ← desktop icon, matches WelcomeIcon pattern
 *
 * Modal opened on click:
 *
 *   ┌─ visitantes.exe ────────── × ┐
 *   │ BEM VINDO AO MEU SITE         │
 *   │ Parabéns! Você é meu          │
 *   │ visitante de nº: 001248       │
 *   └───────────────────────────────┘
 *
 * Architecture:
 *
 *   - `<VisitCounter>` renders just the icon button (matches the
 *     visual rhythm of the home-page `WelcomeIcon` tiles).
 *   - Clicking the icon sets `open=true`, which mounts `<Modal>`
 *     via `createPortal(..., document.body)` so it sits above the
 *     rest of the chrome regardless of stacking context.
 *   - The Modal mounts only after hydration (`mounted` flag) to
 *     avoid SSR `document is not defined` errors.
 *   - Body scroll lock + focus trap + ESC handler all follow the
 *     `MobileNavDrawer` pattern (see `lib/hooks/`).
 *   - Clicking the backdrop or the × button closes the modal.
 *
 * Site is a static export to GitHub Pages, so the persistent total
 * lives in an external serverless endpoint (a Cloudflare Worker,
 * Supabase Edge Function, etc.). The endpoint URL is wired through
 * `process.env.NEXT_PUBLIC_VISIT_COUNTER_URL` and read at runtime.
 *
 *   GET  <url>     → { "count": 1248 }
 *   POST <url>     → { "count": 1249 }
 *
 * Counting rule: **one increment per browser every 24h**, gated by
 * a timestamp in `localStorage` (`cremosa-visit-recorded-at`).
 * Recargas entre páginas e navegações internas não inflam o
 * número; quem volta no dia seguinte soma +1.
 *
 * Sizing:
 *   - `size="default"` (compact): react95 PNG at h-10 w-10, label
 *     below, with a Win95 beveled gray frame behind the icon.
 *     `w-full` so it fills the parent column.
 *     Used in tight spots like the HomeAbout aside.
 *   - `size="hero"` (oversized, frameless): react95 PNG at h-12 w-12
 *     (h-14 on sm+) with no beveled frame. Fixed `w-32` (climbs to
 *     w-40 / w-48 on lg/xl). Lives next to the figure on desktop
 *     where it has dedicated horizontal room.
 *   - `size="compact-hero"` (frameless + fills column): no gray
 *     frame, but `w-full` so it fits a 3-col mobile icon grid.
 *     Same icon size as `hero` — just a different width strategy.
 *     Used in the mobile Win95 welcome dialog.
 */
export function VisitCounter({
  size = "default",
}: {
  size?: "default" | "hero" | "compact-hero";
} = {}) {
  const [count, setCount] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_VISIT_COUNTER_URL;
    if (!url) return;

    const STORAGE_KEY = "cremosa-visit-recorded-at";
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const last = Number(window.localStorage.getItem(STORAGE_KEY) ?? 0);
    const shouldCount = !last || Date.now() - last > ONE_DAY_MS;

    const headers = { "Content-Type": "application/json" };

    async function refresh(): Promise<void> {
      try {
        const res = await fetch(url as string, {
          method: "GET",
          cache: "no-store",
          headers,
        });
        if (!res.ok) return;
        const json = (await res.json()) as { count?: number };
        if (typeof json.count === "number" && Number.isFinite(json.count)) {
          setCount(json.count);
        }
      } catch {
        /* offline / CORS / endpoint down — keep placeholder */
      }
    }

    async function bump(): Promise<void> {
      try {
        const res = await fetch(url as string, {
          method: "POST",
          cache: "no-store",
          headers,
        });
        if (res.ok) {
          window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
          const json = (await res.json()) as { count?: number };
          if (
            typeof json.count === "number" &&
            Number.isFinite(json.count)
          ) {
            setCount(json.count);
            return;
          }
        }
      } catch {
        /* fall through to plain GET */
      }
      await refresh();
    }

    if (shouldCount) {
      void bump();
    } else {
      void refresh();
    }
  }, []);

  const isHero = size === "hero";
  const isCompactHero = size === "compact-hero";
  const noFrame = isHero || isCompactHero;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="visit-counter"
        data-visit-count={count ?? "loading"}
        aria-label="Abrir contador de visitantes"
        data-tooltip="nº visitantes"
        title="visitantes.exe"
        className={
          "win95-icon group flex flex-col items-center no-context tap-target bg-transparent border-0 p-0 cursor-pointer " +
          (isHero
            ? "gap-2 sm:gap-3 w-32 lg:w-40 xl:w-48"
            : "gap-1.5 sm:gap-2 w-full")
        }
      >
        <span
          aria-hidden
          className={
            // Hero & compact-hero: no gray frame, transparent
            // background (matches the WelcomeIcon style). Default:
            // Win95 beveled gray frame around the icon.
            (noFrame
              ? "p-2 sm:p-3"
              : "win95-bevel-out bg-win-face-2 group-hover:bg-win-light transition-colors p-1.5 sm:p-2")
          }
          style={{ imageRendering: "pixelated" }}
        >
          {/* React95 PNG icon (`@react95/icons`, replicated under
              `public/icons/win95/`). Same source used by the home
              page's WelcomeIcon tiles, so the desktop chrome is
              uniformly Win95-pixel. Native size is 32×32; the
              hero variant scales up to ~56px. */}
          <img
            src={`${site.basePath}/icons/win95/user.png`}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            className={noFrame ? "block h-12 w-12 sm:h-14 sm:w-14" : "block h-10 w-10"}
            style={{ imageRendering: "pixelated" }}
          />
        </span>
        <span
          className={
            "font-pixel text-center text-xs sm:text-base uppercase tracking-[0.16em] sm:tracking-[0.18em] leading-tight max-w-[7rem] text-win-ink! group-hover:text-win-title-2! transition-colors " +
            (isHero ? "text-xs sm:text-sm" : "")
          }
        >
          visitantes.exe
        </span>
      </button>

      <Modal open={open} count={count} onClose={() => setOpen(false)} />
    </>
  );
}

/* ───────────────────── modal subcomponent ───────────────────── */

interface ModalProps {
  open: boolean;
  count: number | null;
  onClose: () => void;
}

function Modal({ open, count, onClose }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useBodyScrollLock(open);
  useFocusTrap(panelRef, open);

  // SSR safety: createPortal needs `document.body`. On the server
  // `document` is undefined, so we skip rendering entirely. Once
  // the component hydrates on the client, `document` is defined
  // and the portal mounts normally.
  if (!open || typeof document === "undefined") return null;

  const display =
    count === null ? "----" : count.toString().padStart(6, "0");

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-counter-modal-title"
      data-testid="visit-counter-modal"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Tap-to-dismiss backdrop. Distinct aria-label from the X
          button so screen readers announce two different controls. */}
      <button
        type="button"
        aria-label="Fechar contador de visitantes"
        onClick={onClose}
        className="absolute inset-0 bg-bg/85 backdrop-blur-sm cursor-default border-0"
      />

      <div
        ref={panelRef}
        className="relative max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Win95Window
          title="visitantes.exe"
          controls
          closeable
          onClose={onClose}
          closeLabel="Fechar"
        >
          <div
            className="px-4 py-3 sm:px-5 sm:py-4 bg-win-face text-win-ink flex flex-col gap-1 items-center text-center select-none"
            data-testid="visit-counter-modal-content"
          >
            <span
              data-testid="visit-counter-welcome"
              className="win-eyebrow-sm text-win-shadow-deep uppercase tracking-[0.18em]"
            >
              bem vindo ao meu site
            </span>
            <span
              data-testid="visit-counter-message"
              className="win-body-sm text-win-ink leading-snug"
            >
              Parabéns! Você é meu visitante de nº:{" "}
              <span
                data-testid="visit-counter-value"
                className="tabular-nums font-pixel"
                suppressHydrationWarning
              >
                {display}
              </span>
            </span>
          </div>
        </Win95Window>
      </div>
    </div>,
    document.body,
  );
}