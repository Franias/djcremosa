import Link from "next/link";
import { EventRow } from "@/components/sections/EventRow";
import { events } from "@/content/events";
import { splitAgenda } from "@/lib/events";
import { site } from "@/lib/site";

export default function HomePage() {
  const { upcoming } = splitAgenda(events);
  const nextThree = upcoming.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-20 pb-24 sm:pt-32 sm:pb-36">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-bubble mb-6">
            // {site.brand.tagline.primary}
          </p>
          <h1 className="font-display text-[22vw] sm:text-[14rem] leading-[0.82] bubble">
            CREM<br className="sm:hidden" />
            <span className="sm:inline">OSA</span>
          </h1>
          <p className="mt-8 max-w-xl text-cream text-lg sm:text-2xl font-medium">
            {site.brand.tagline.secondary}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/agenda"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bubble text-bg font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-bubble-hi transition-colors"
            >
              Ver agenda →
            </Link>
            {site.social.instagram && (
              <a
                href={site.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-line text-cream hover:border-bubble hover:text-bubble font-mono text-[11px] uppercase tracking-[0.22em] transition-colors"
              >
                {site.social.instagram.handle}
              </a>
            )}
          </div>
        </div>

        {/* Faint brand axes on the sides (echo of the press kit layout) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-3 sm:left-6 hidden sm:flex flex-col justify-center"
        >
          <span className="rotate-180 font-mono text-[10px] tracking-[0.4em] text-cream-dim/40 [writing-mode:vertical-rl]">
            SELETORA · CURADORIA · DISCOTECAGEM
          </span>
        </div>
      </section>

      {/* UPCOMING PREVIEW */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
        <header className="flex items-baseline justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bubble mb-2">
              // próximas datas
            </p>
            <h2 className="font-display text-4xl sm:text-6xl bubble leading-none">
              Em rota
            </h2>
          </div>
          <Link
            href="/agenda"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-dim hover:text-bubble transition-colors"
          >
            agenda completa →
          </Link>
        </header>

        {nextThree.length > 0 ? (
          <ul className="list-none p-0">
            {nextThree.map((e) => (
              <li key={e.slug}>
                <EventRow event={e} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-cream-dim">
            Sem datas confirmadas no momento. Aguarda o próximo anúncio.
          </p>
        )}
      </section>

      {/* PRESS HIGHLIGHTS */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24 border-t border-line">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bubble mb-2">
          // em destaque
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-cream leading-tight max-w-2xl">
          Dez anos na pista, da cena de Porto Alegre pro mundo.
        </h2>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3 list-none p-0">
          {site.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-3 border border-line rounded-md px-4 py-3 bg-surface"
            >
              <span className="text-bubble mt-0.5">★</span>
              <span className="text-cream text-sm sm:text-base">{h}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
