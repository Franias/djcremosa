"use client";

import { useEffect, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Win95-styled UI primitives — single file so the Win95 look stays
 * cohesive. Implemented as styled wrappers, not new DOM nodes, so the
 * rendered tree remains semantic.
 *
 * Tokens live in app/globals.css (`--win-*`). All primitives use the
 * same `var(--font-pixel)` (VT323) so it reads as MS Sans Serif.
 *
 *   <Win95Window title="agenda — Cremosa">
 *     …content…
 *   </Win95Window>
 *
 *   <Win95Button onClick={…}>Abrir</Win95Button>
 *   <Win95Button variant="primary" active>Confirmar</Win95Button>
 *
 *   <Win95StatusBar>
 *     <span>Pronto</span>
 *     <span>DJ Cremosa</span>
 *   </Win95StatusBar>
 */

/* ─────────────────────────── Window ─────────────────────────── */

interface Win95WindowProps extends HTMLAttributes<HTMLDivElement> {
  /** Title-bar label (kept short, the way Win9x title bars were). */
  title?: string;
  /** Show the minimize/maximize/close controls on the title bar. */
  controls?: boolean;
  /** Optional node to render in the title-bar slot beside the title. */
  titleExtras?: ReactNode;
  /**
   * Promote the title-bar × to a real <button> that fires `onClose`.
   * Use when the window is interactive (e.g. a modal drawer or a
   * dismissible card). Leave `controls=true` for visual only.
   * Implies controls are shown. The first two (─, □) stay decorative.
   */
  closeable?: boolean;
  /** Fires when the user clicks the title-bar ×. */
  onClose?: () => void;
  /** Accessible label for the close button (default "Fechar"). */
  closeLabel?: string;
}

export function Win95Window({
  title,
  controls = true,
  closeable = false,
  titleExtras,
  className,
  children,
  onClose,
  closeLabel,
  ...rest
}: Win95WindowProps) {
  // `closeable` implies controls are visible. Keep the visual ─ / □
  // glyphs from `.win95-title-controls`; only the final × is wired.
  const showControls = controls || closeable;
  return (
    <div
      className={cn("win95-bevel-out bg-win-face p-[2px]", className)}
      {...rest}
    >
      <div className="win95-bevel-deep-in bg-win-face">
        {(title || showControls) && (
          <div className="win95-title" role="presentation">
            <span className="flex items-center gap-2 min-w-0 flex-1 truncate">
              <span className="win-title-text truncate">{title}</span>
              {titleExtras && (
                <span className="win-eyebrow-sm opacity-80 truncate shrink min-w-0 max-w-[60%]">
                  {titleExtras}
                </span>
              )}
            </span>
            {showControls && (
              <span className="win95-title-controls">
                {closeable ? (
                  <>
                    <span aria-hidden>─</span>
                    <span aria-hidden>□</span>
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label={closeLabel ?? "Fechar"}
                      className="close"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="contents" aria-hidden>
                    <span>─</span>
                    <span>□</span>
                    <span className="close">×</span>
                  </span>
                )}
              </span>
            )}
          </div>
        )}
        <div className="win95-bevel-deep-in bg-win-face">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Button ─────────────────────────── */

interface Win95ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Active / pressed state, like a pinned toolbar toggle. */
  active?: boolean;
  /** Add a magenta inner border (like a focused/selected button). */
  focused?: boolean;
  /** Stretch to fill the parent's width (use inside column layouts). */
  block?: boolean;
  /** Align label to the left; pair with `block` for menu-item style. */
  alignStart?: boolean;
}

export function Win95Button({
  active = false,
  focused = false,
  block = false,
  alignStart = false,
  className,
  children,
  type,
  ...rest
}: Win95ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      data-active={active ? "true" : undefined}
      className={cn(
        "win95-button",
        focused && "outline outline-1 outline-magenta outline-offset-[-3px]",
        block && "w-full",
        alignStart && "justify-start text-left",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Link variant — renders an <a> with the same Win95 styling. */
export function Win95Link(
  props: AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean;
    focused?: boolean;
    block?: boolean;
    alignStart?: boolean;
  },
) {
  const {
    active = false,
    focused = false,
    block = false,
    alignStart = false,
    className,
    children,
    ...rest
  } = props;
  return (
    <a
      data-active={active ? "true" : undefined}
      className={cn(
        "win95-button no-underline",
        focused && "outline outline-1 outline-magenta outline-offset-[-3px]",
        block && "w-full",
        alignStart && "justify-start text-left",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ─────────────────────────── StatusBar ─────────────────────────── */

interface Win95StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Auto-rendered clock segment on the right (HH:MM). */
  clock?: boolean;
}

export function Win95StatusBar({
  clock = true,
  className,
  children,
  ...rest
}: Win95StatusBarProps) {
  return (
    <div
      role="status"
      aria-label="Barra de status"
      className={["win95-statusbar", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
      {clock && <ClockSegment />}
    </div>
  );
}

function ClockSegment() {
  // Suppress hydration: clock is computed on the client. The initial
  // placeholder renders identically on server + client.
  return (
    <span className="win95-statusbar-segment shrink" suppressHydrationWarning>
      <ClockLive />
    </span>
  );
}

function ClockLive() {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const tick = () => setNow(formatClock(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now}</span>;
}

function formatClock(d: Date): string {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/* ─────────────────────────── MenuBar ─────────────────────────── */

export interface Win95MenuItem {
  label: string;
  /** Letter to underline (mnemonic like File→<u>F</u>ile). */
  mnemonic?: string;
  href?: string;
  onClick?: () => void;
}

interface Win95MenuBarProps {
  items: Win95MenuItem[];
  className?: string;
}

export function Win95MenuBar({ items, className }: Win95MenuBarProps) {
  return (
    <nav
      role="menubar"
      aria-label="Menu"
      className={["win95-menubar", className].filter(Boolean).join(" ")}
    >
      {items.map((it) => {
        const renderLabel = () => {
          if (!it.mnemonic) return it.label;
          const idx = it.label
            .toLowerCase()
            .indexOf(it.mnemonic.toLowerCase());
          if (idx < 0) return it.label;
          return (
            <>
              {it.label.slice(0, idx)}
              <u>{it.label[idx]}</u>
              {it.label.slice(idx + 1)}
            </>
          );
        };
        const content = (
          <span className="win95-menubar-item">{renderLabel()}</span>
        );
        if (it.href) {
          return (
            <a
              key={it.label}
              href={it.href}
              role="menuitem"
              className="no-underline"
            >
              {content}
            </a>
          );
        }
        return (
          <button
            key={it.label}
            type="button"
            role="menuitem"
            onClick={it.onClick}
            className="text-left"
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────── Field (sunken input) ─────────────────────────── */

interface Win95FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Optional label rendered to the left, like a dialog field. */
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function Win95Field({
  label,
  size = "md",
  className,
  ...rest
}: Win95FieldProps) {
  const pad =
    size === "sm"
      ? "px-2 py-1 text-xs"
      : size === "lg"
        ? "px-3 py-2 text-base"
        : "px-2 py-1 text-sm";
  return (
    <label className="flex items-center gap-2">
      {label && <span className="font-pixel text-xs text-cream">{label}</span>}
      <input
        className={[
          "win95-bevel-in bg-win-face text-win-ink",
          "font-pixel",
          pad,
          "outline-none focus:outline-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
    </label>
  );
}

/* ─────────────────────────── ProgressBar ─────────────────────────── */

interface Win95ProgressBarProps {
  /** 0 – 100 */
  value: number;
  className?: string;
  label?: string;
}

export function Win95ProgressBar({
  value,
  className,
  label = "Progresso",
}: Win95ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      className={["win95-progress-track", className].filter(Boolean).join(" ")}
    >
      <div className="win95-progress-bar" style={{ width: `${v}%` }} />
    </div>
  );
}