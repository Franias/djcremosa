"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { BOOKING_MAILTO, NAV_LINKS } from "@/components/nav/navLinks";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { site } from "@/lib/site";

/**
 * MobileNavDrawer — full-viewport Win95-style navigation drawer for
 * phones. Renders only below 640px (`sm:hidden` on the root). Click
 * backdrop or X to close. Locks body scroll while open. Traps focus
 * so keyboard users stay inside the dialog until dismissed. Auto-
 * closes on route change.
 *
 * Why this stays a separate component: it has stateful client
 * concerns (Esc handler, focus trap, body-scroll lock, route
 * watcher) that would clutter <SiteNav/> if inlined. Kept together
 * so the dependency list is small and the component is easy to
 * reason about.
 */

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc closes the drawer. We don't pass onClose through the
  // focus trap because Esc is a global dialog concern, not a
  // per-focusable concern.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Body scroll lock while open — captured exactly.
  useBodyScrollLock(open);

  // Focus trap — keeps keyboard focus inside the dialog and
  // restores it to the previously-focused element (the hamburger
  // button) on close. Without this, Tab would walk the user out
  // of the drawer into the (still-mounted) SiteNav behind it.
  useFocusTrap(panelRef, open);

  // Auto-close on route change. We track the previous pathname
  // in a ref so the comparison doesn't trigger a setState and
  // doesn't re-run when only `onClose` reference changes.
  const lastPathRef = useRef<string | null>(null);
  useEffect(() => {
    if (open && lastPathRef.current && lastPathRef.current !== pathname) {
      onClose();
    }
    lastPathRef.current = pathname;
  }, [pathname, open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
      id="mobile-nav-drawer-dialog"
      className="fixed inset-0 z-[150] sm:hidden"
    >
      {/* Tap-to-dismiss backdrop. Distinct aria-label from the X
          button so screen readers announce two different controls
          (was the same label before — fix). */}
      <button
        type="button"
        aria-label="Descartar menu"
        onClick={onClose}
        className="absolute inset-0 bg-bg/85 backdrop-blur-sm cursor-default"
      />

      <div
        ref={panelRef}
        className="relative h-full flex flex-col px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]"
      >
        <Win95Window
          title="menu — Cremosa"
          closeable
          onClose={onClose}
          closeLabel="Fechar menu"
          className="flex flex-col grow min-h-0"
        >
          <div className="bg-win-face p-3 flex flex-col gap-2 grow overflow-y-auto">
            <p className="win-eyebrow-sm text-win-shadow-deep px-1 mt-1">
              navegar →
            </p>
            {NAV_LINKS.map((n) => {
              const active = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="no-underline"
                  aria-current={active ? "page" : undefined}
                >
                  <Win95Button
                    active={active}
                    focused={active}
                    block
                    alignStart
                  >
                    {n.label}
                  </Win95Button>
                </Link>
              );
            })}

            <div aria-hidden className="my-2 h-px bg-win-shadow-deep/30 mx-1" />

            <p className="win-eyebrow-sm text-win-shadow-deep px-1">ações →</p>
            <Link href="/" className="no-underline">
              <Win95Button block alignStart>
                ← Início
              </Win95Button>
            </Link>
            <Link
              href={BOOKING_MAILTO(site.contact.bookingEmail)}
              className="no-underline"
            >
              <Win95Button focused block alignStart>
                Booking →
              </Win95Button>
            </Link>
          </div>

          {/* Status bar footer — echoes the desktop bar so the
              navigation metaphor stays consistent. */}
          <div className="win95-statusbar mt-auto">
            <span className="win95-statusbar-segment grow">
              ● menu aberto
            </span>
            <span className="win95-statusbar-segment shrink">
              v1.0 · 2026
            </span>
          </div>
        </Win95Window>
      </div>
    </div>
  );
}
