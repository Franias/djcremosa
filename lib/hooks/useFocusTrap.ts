"use client";

import { useEffect, useRef } from "react";

/**
 * useFocusTrap — keeps keyboard focus inside the container while
 * `active` is true. Required for `aria-modal="true"` dialogs so
 * Tab/Shift+Tab don't escape into the surrounding chrome.
 *
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(ref, open);
 *
 * Strategy:
 *   - On mount: remember the element that had focus, focus the
 *     first focusable descendant of the trap container.
 *   - On Tab inside the container: cycle to first/last focusable
 *     element so focus never leaves.
 *   - On unmount or `active → false`: restore focus to the
 *     remembered element so the user resumes where they were
 *     (e.g. the hamburger button that opened the drawer).
 *
 * `focusableSelector` enumerates the interactive elements we
 * consider. We include `[tabindex]` explicitly (not just `tabindex=0`)
 * so elements with `tabindex=-1` are excluded.
 */
const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  active: boolean,
  focusableSelector: string = FOCUSABLE,
): void {
  // Remember the element that had focus before we trapped, so we
  // can restore it on close. Stored in a ref (not state) because
  // we read it inside cleanup and don't want to re-render.
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    // Capture what was focused before mount so we can restore on close.
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;

    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

    // Initial focus — prefer the first focusable in the container,
    // fall back to the container itself (which gets tabindex=-1).
    const initial = focusables()[0];
    if (initial) {
      initial.focus();
    } else {
      container.tabIndex = -1;
      container.focus();
    }

    // Cycle Tab/Shift+Tab inside the container.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (!current) return;

      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Esc is handled separately by the dialog itself (we don't want
    // every trapped element to also close on Esc). The dialog owns
    // that policy.

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      const restore = restoreRef.current;
      if (restore && typeof restore.focus === "function") {
        restore.focus();
      }
    };
  }, [active, ref, focusableSelector]);
}
