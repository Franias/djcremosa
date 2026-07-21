import { Win95Button, Win95Window } from "@/components/ui/win95";
import type { ReactNode } from "react";

/**
 * Win95Dialog — reusable system-dialog shape for empty states, hero
 * metadata blocks, and other "modal-feeling" content that should live
 * inside a proper Win95 window rather than a flat rounded card.
 *
 *   <Win95Dialog
 *     title="agenda"
 *     message="Nada agendado ainda"
 *     hint="@djcremosa"
 *     actions={[{ label: "OK", onClick }, { label: "Cancelar" }]}
 *   />
 *
 * Variants:
 *   - default  : centered message + actions
 *   - info     : small info dialog (single OK button)
 *   - warning  : warning dialog (yellow ⚠ icon + bold message)
 *   - error    : error dialog (red ✕ icon + bold message)
 */

export type Win95DialogVariant = "default" | "info" | "warning" | "error";

interface DialogAction {
  label: string;
  onClick?: () => void;
  href?: string;
  focused?: boolean;
}

interface Win95DialogProps {
  title: string;
  /** Main message (bold-ish in dialog style). */
  message: ReactNode;
  /** Sub-message / explanation below. */
  hint?: ReactNode;
  /** Actions row at the bottom. Defaults to [{ label: "OK" }]. */
  actions?: DialogAction[];
  variant?: Win95DialogVariant;
  className?: string;
}

const VARIANT_ICONS: Record<Win95DialogVariant, { glyph: string; bg: string }> = {
  default: { glyph: "i", bg: "bg-win-face-2" },
  info: { glyph: "i", bg: "bg-win-face-2" },
  warning: { glyph: "!", bg: "bg-yellow-300" },
  error: { glyph: "✕", bg: "bg-crimson" },
};

export function Win95Dialog({
  title,
  message,
  hint,
  actions = [{ label: "OK" }],
  variant = "default",
  className,
}: Win95DialogProps) {
  const icon = VARIANT_ICONS[variant];
  return (
    <Win95Window title={title} controls closeable className={className}>
      <div className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div
            aria-hidden
            className={[
              "shrink-0 mt-0.5",
              "w-8 h-8 win95-bevel-in grid place-items-center",
              "win-button-text text-[20px] leading-none text-win-ink",
              icon.bg,
              variant === "error" ? "text-white" : "",
            ].join(" ")}
          >
            {icon.glyph}
          </div>
          <div className="min-w-0 flex-1">
            <p className="win-button-text leading-snug">{message}</p>
            {hint && (
              <p className="mt-2 win-body-sm text-win-shadow-deep">
                {hint}
              </p>
            )}
          </div>
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-win-shadow-deep/40">
            {actions.map((a) => {
              const button = (
                <Win95Button focused={a.focused} onClick={a.onClick}>
                  {a.label}
                </Win95Button>
              );
              return a.href ? (
                <a key={a.label} href={a.href} className="no-underline">
                  {button}
                </a>
              ) : (
                <span key={a.label}>{button}</span>
              );
            })}
          </div>
        )}
      </div>
    </Win95Window>
  );
}