import Link from "next/link";
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  formatDate,
  type CremosaEvent,
} from "@/lib/events";

interface EventRowProps {
  event: CremosaEvent;
  /** Compact variant hides lineup/note (for archive mode). */
  compact?: boolean;
}

export function EventRow({ event, compact = false }: EventRowProps) {
  const { day, month, year } = formatDate(event.date);
  const isFuture = event.status !== "cancelled" && event.status !== "postponed";

  return (
    <article
      className={[
        "group relative grid grid-cols-[88px_1fr] gap-4 sm:gap-6",
        "border-b border-line py-6 sm:py-8",
        "transition-colors hover:bg-surface/40",
        event.mock ? "opacity-90" : "",
      ].join(" ")}
      aria-label={`${event.title} em ${event.venue}, ${event.city}`}
    >
      {/* Date column */}
      <div className="flex flex-col items-start pt-1 select-none">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-dim">
          {month}
        </span>
        <span
          className={[
            "font-display leading-[0.85] text-[44px] sm:text-[56px]",
            isFuture ? "bubble" : "text-cream-dim",
          ].join(" ")}
        >
          {day}
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] text-cream-dim">
          {year}
        </span>
      </div>

      {/* Body */}
      <div className="min-w-0 flex flex-col gap-3">
        <header className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble">
              {CATEGORY_LABEL[event.category]}
            </span>
            {event.mock && (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-status-warn border border-status-warn/40 rounded-sm px-1.5">
                Exemplo
              </span>
            )}
            <span
              className={[
                "font-mono text-[10px] uppercase tracking-[0.22em] border rounded-sm px-1.5 py-px",
                STATUS_TONE[event.status],
              ].join(" ")}
            >
              {STATUS_LABEL[event.status]}
            </span>
          </div>

          <h3 className="text-cream text-xl sm:text-2xl font-semibold tracking-tight">
            {event.title}
          </h3>

          <p className="text-cream-dim text-sm sm:text-base">
            <span className="text-cream">{event.venue}</span>
            <span className="mx-2 text-line">·</span>
            {event.city}
            {event.region && `, ${event.region}`}
            <span className="mx-2 text-line">·</span>
            {event.country}
            {event.time && (
              <>
                <span className="mx-2 text-line">·</span>
                <span className="font-mono">{event.time}</span>
              </>
            )}
            {event.endDate && (
              <>
                <span className="mx-2 text-line">·</span>
                <span className="font-mono">
                  até {formatDate(event.endDate).full}
                </span>
              </>
            )}
          </p>
        </header>

        {!compact && (event.lineup || event.note) && (
          <div className="flex flex-col gap-1">
            {event.lineup && event.lineup.length > 0 && (
              <p className="text-sm text-cream-dim">
                <span className="text-line font-mono uppercase text-[10px] tracking-[0.22em] mr-2">
                  Line-up
                </span>
                {event.lineup.join(" · ")}
              </p>
            )}
            {event.note && (
              <p className="text-sm text-cream-dim italic">{event.note}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {event.ticketUrl &&
            event.status !== "cancelled" &&
            event.status !== "sold-out" && (
              <Link
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  "font-mono text-[11px] uppercase tracking-[0.22em]",
                  "bg-bubble text-bg hover:bg-bubble-hi",
                  "transition-colors",
                ].join(" ")}
              >
                Ingressos →
              </Link>
            )}
          {event.status === "sold-out" && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim">
              ★ Esgotado — nos vemos na pista
            </span>
          )}
          {event.status === "cancelled" && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-status-down">
              Evento cancelado
            </span>
          )}
          {event.status === "postponed" && (
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-status-warn">
              Nova data em breve
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
