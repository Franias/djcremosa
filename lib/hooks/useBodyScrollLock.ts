"use client";

import { useEffect } from "react";

/**
 * useBodyScrollLock — sets `document.body.style.overflow = "hidden"`
 * while `active` is true and restores the previous value on cleanup.
 *
 * Used by full-screen overlays that should not allow background
 * scrolling (the press-start splash, mobile nav drawer, modal
 * dialogs). We capture the prior overflow value in a ref so we
 * restore exactly what was there, including the empty string
 * (no inline style) — something a constant `""` restore would
 * overwrite.
 *
 * The previous-value pattern also matters for iOS Safari: in some
 * cases the page already had `overflow: hidden` set by another
 * component (e.g. a previously-mounted drawer), and overwriting
 * with `""` would unexpectedly re-enable scroll on the body.
 *
 * Guarded by `typeof window` so SSR doesn't try to access
 * `document.body`.
 */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [active]);
}
