import Link from "next/link";
import { EventRow } from "@/components/sections/EventRow";
import { splitAgenda, type CremosaEvent } from "@/lib/events";

type View = "upcoming" | "past" | "all";

interface AgendaViewProps {
  view: View;
  events: CremosaEvent[];
}

/** Server component — URL-driven filter, no client JS. */
export function AgendaView({ view, events }: AgendaViewProps) {
  const { upcoming, past } = splitAgenda(events);
  const showUpcoming = view === "upcoming" || view === "all";
  const showPast = view === "past" || view === "all";

  return (
    <div className="flex flex-col">
      {/* Filters */}
      <nav
        aria-label="Filtro de agenda"
        className="flex items-center gap-2 sm:gap-4 py-6 border-b border-line"
      >
        <FilterPill
          href="/agenda"
          label="Próximas"
          count={upcoming.length}
          active={view === "upcoming"}
        />
        <FilterPill
          href="/agenda?view=past"
          label="Histórico"
          count={past.length}
          active={view === "past"}
        />
        <FilterPill
          href="/agenda?view=all"
          label="Tudo"
          count={events.length}
          active={view === "all"}
        />
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-cream-dim hidden sm:inline">
          {events.length} shows · ordenado por data
        </span>
      </nav>

      {/* Upcoming */}
      {showUpcoming && (
        <section aria-labelledby="upcoming-heading" className="py-10 sm:py-14">
          <header className="flex items-baseline justify-between gap-4 mb-2">
            <h2
              id="upcoming-heading"
              className="font-display text-3xl sm:text-5xl bubble leading-none"
            >
              Próximas datas
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-dim">
              {upcoming.length} {upcoming.length === 1 ? "show" : "shows"}
            </span>
          </header>
          {upcoming.length === 0 ? (
            <EmptyState
              heading="Nada agendado ainda"
              body="Enquanto isso, segue nas redes pra não perder o próximo anúncio."
              hint="@djcremosa"
            />
          ) : (
            <ul className="list-none p-0">
              {upcoming.map((e) => (
                <li key={e.slug}>
                  <EventRow event={e} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Past */}
      {showPast && (
        <section aria-labelledby="past-heading" className="py-10 sm:py-14">
          <header className="flex items-baseline justify-between gap-4 mb-2">
            <h2
              id="past-heading"
              className="font-display text-3xl sm:text-5xl text-cream leading-none"
            >
              Histórico
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-dim">
              {past.length} {past.length === 1 ? "show" : "shows"}
            </span>
          </header>
          {past.length === 0 ? (
            <EmptyState
              heading="Sem shows anteriores ainda"
              body="O arquivo completa conforme a agenda rola."
            />
          ) : (
            <ul className="list-none p-0">
              {past.map((e) => (
                <li key={e.slug}>
                  {/* Compact mode: hides lineup/note to keep archive scannable. */}
                  <EventRow event={e} compact />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

/* ----------- subcomponents ----------- */

function FilterPill({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={[
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "font-mono text-[11px] uppercase tracking-[0.22em]",
        "border transition-colors",
        active
          ? "bg-cream text-bg border-cream"
          : "border-line text-cream-dim hover:border-bubble hover:text-bubble",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px]",
          active ? "bg-magenta text-cream" : "bg-surface-2 text-cream-dim",
        ].join(" ")}
      >
        {count}
      </span>
    </Link>
  );
}

function EmptyState({
  heading,
  body,
  hint,
}: {
  heading: string;
  body: string;
  hint?: string;
}) {
  return (
    <div className="border border-dashed border-line rounded-lg p-8 text-center">
      <p className="text-cream text-lg">{heading}</p>
      <p className="text-cream-dim text-sm mt-2">{body}</p>
      {hint && (
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mt-3">
          {hint}
        </p>
      )}
    </div>
  );
}
