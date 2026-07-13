import Link from "next/link";
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  formatDate,
  type CremosaEvent,
} from "@/lib/events";
import { Win95Button, Win95Window } from "@/components/ui/win95";

interface EventRowProps {
  event: CremosaEvent;
  /** Compact variant hides lineup/note (for archive mode). */
  compact?: boolean;
}

export function EventRow({ event, compact = false }: EventRowProps) {
  const { day, month, year } = formatDate(event.date);
  const winTitle = `${month} ${day} · ${event.title}`;

  return (
    <Win95Window
      title={winTitle}
      className="mb-3"
      titleExtras={
        <span className="win-eyebrow opacity-80 text-[10px] tracking-[0.18em]">
          {CATEGORY_LABEL[event.category]} · {STATUS_LABEL[event.status]}
        </span>
      }
    >
      <article
        className={[
          "relative grid grid-cols-[88px_1fr] gap-4 sm:gap-6",
          "px-4 sm:px-6 py-5 sm:py-6 bg-win-face text-win-ink",
          event.mock ? "opacity-95" : "",
        ].join(" ")}
        aria-label={`${event.title} em ${event.venue}, ${event.city}`}
      >
        {/* Date column */}
        <div className="flex flex-col items-start pt-1 select-none">
          <span className="win-eyebrow text-win-shadow-deep tracking-[0.18em]">
            {month}
          </span>
          <span className="win-display leading-[0.85] text-[40px] sm:text-[52px] text-win-ink">
            {day}
          </span>
          <span className="win-eyebrow text-win-shadow-deep tracking-[0.18em]">
            {year}
          </span>
        </div>

        {/* Body */}
        <div className="min-w-0 flex flex-col gap-3">
          <header className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              {event.mock && (
                <span className="win-eyebrow border border-win-shadow-deep rounded-sm px-1.5 text-[10px]">
                  Exemplo
                </span>
              )}
              <span
                className={[
                  "win-eyebrow border rounded-sm px-1.5 py-px text-[10px]",
                  "border-win-shadow-deep bg-win-face-2 text-win-ink",
                ].join(" ")}
              >
                {STATUS_LABEL[event.status]}
              </span>
            </div>

            <h3 className="win-h2 text-win-ink text-xl sm:text-2xl">
              {event.title}
            </h3>

            <p className="text-win-shadow-deep win-body-sm">
              <span className="text-win-ink">{event.venue}</span>
              <span className="mx-2">·</span>
              {event.city}
              {event.region && `, ${event.region}`}
              <span className="mx-2">·</span>
              {event.country}
              {event.time && (
                <>
                  <span className="mx-2">·</span>
                  <span className="win-caption">{event.time}</span>
                </>
              )}
              {event.endDate && (
                <>
                  <span className="mx-2">·</span>
                  <span className="win-caption">
                    até {formatDate(event.endDate).full}
                  </span>
                </>
              )}
            </p>
          </header>

          {!compact && (event.lineup || event.note) && (
            <div className="flex flex-col gap-1">
              {event.lineup && event.lineup.length > 0 && (
                <p className="win-body-sm text-win-shadow-deep">
                  <span className="win-eyebrow mr-2 text-[10px]">
                    Line-up:
                  </span>
                  {event.lineup.join(" · ")}
                </p>
              )}
              {event.note && (
                <p className="win-body-sm text-win-shadow-deep italic">
                  {event.note}
                </p>
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
                  className="no-underline"
                >
                  <Win95Button focused>Ingressos →</Win95Button>
                </Link>
              )}
            {event.status === "sold-out" && (
              <span className="win-eyebrow text-win-shadow-deep">
                ★ Esgotado — nos vemos na pista
              </span>
            )}
            {event.status === "cancelled" && (
              <span className="win-eyebrow text-crimson">
                Evento cancelado
              </span>
            )}
            {event.status === "postponed" && (
              <span className="win-eyebrow text-status-warn">
                Nova data em breve
              </span>
            )}
          </div>
        </div>
      </article>
    </Win95Window>
  );
}