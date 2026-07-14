"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EventRow } from "@/components/sections/EventRow";
import { Win95Dialog } from "@/components/sections/Win95Dialog";
import { Win95Button } from "@/components/ui/win95";
import { splitAgenda, type CremosaEvent } from "@/lib/events";

type View = "upcoming" | "past" | "all";

function parseView(raw: string | null | undefined): View {
  return raw === "past" || raw === "all" ? raw : "upcoming";
}

interface AgendaViewProps {
  events: CremosaEvent[];
}

/**
 * Client component — reads the agenda view from the URL search params so it
 * works under static export (output: 'export') where the server can't read
 * `searchParams` at request time.
 *
 * Pair with `<Suspense>` at the page level so the static HTML is fully
 * rendered before the search-param-aware UI hydrates.
 */
export function AgendaView({ events }: AgendaViewProps) {
  const sp = useSearchParams();
  const view = parseView(sp.get("view"));

  const { upcoming, past } = splitAgenda(events);
  const showUpcoming = view === "upcoming" || view === "all";
  const showPast = view === "past" || view === "all";

  return (
    <div className="flex flex-col">
      {/* Filters */}
      <nav
        aria-label="Filtro de agenda"
        className="flex items-center gap-2 sm:gap-3 py-6 border-b border-line"
      >
        <FilterPill
          href="/agenda/?view=upcoming"
          label="Próximas"
          count={upcoming.length}
          active={view === "upcoming"}
        />
        <FilterPill
          href="/agenda/?view=past"
          label="Histórico"
          count={past.length}
          active={view === "past"}
        />
        <FilterPill
          href="/agenda/?view=all"
          label="Tudo"
          count={events.length}
          active={view === "all"}
        />
        <span className="ml-auto win-eyebrow-sm hidden sm:inline">
          {events.length} shows · ordenado por data
        </span>
      </nav>

      {/* Upcoming */}
      {showUpcoming && (
        <section aria-labelledby="upcoming-heading" className="py-10 sm:py-14">
          <header className="flex items-baseline justify-between gap-4 mb-2">
            <span className="win-eyebrow-sm">
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
            <span className="win-eyebrow-sm ">
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
    <Link href={href} scroll={false} className="no-underline">
      <Win95Button active={active} focused={active}>
        {label}
        <span
          className={[
            "inline-flex items-center justify-center min-w-5 h-5 px-1.5 win-eyebrow-sm border",
            active
              ? "border-win-shadow-deep bg-win-face text-win-ink"
              : "border-win-shadow-deep bg-win-face text-win-ink",
          ].join(" ")}
        >
          {count}
        </span>
      </Win95Button>
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
    <div className="max-w-xl">
      <Win95Dialog
        title="agenda — sistema"
        message={heading}
        hint={
          <>
            {body}
            {hint && (
              <>
                {" "}
                Segue lá:{" "}
                <a
                  href="https://instagram.com/djcremosa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {hint}
                </a>
                .
              </>
            )}
          </>
        }
        actions={[
          {
            label: "OK",
            href: "https://instagram.com/djcremosa",
            focused: true,
          },
        ]}
      />
    </div>
  );
}
