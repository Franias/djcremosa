import { Suspense } from "react";
import type { Metadata } from "next";
import { AgendaView } from "@/components/sections/AgendaView";
import { Sparkle } from "@/components/sections/Sparkle";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { events } from "@/content/events";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Agenda · ${site.brand.name}`,
  description: `Próximas datas e histórico de shows de ${site.brand.name}. ${site.brand.location}.`,
  openGraph: {
    title: `Agenda · ${site.brand.name}`,
    description: `Próximas datas e histórico de shows de ${site.brand.name}.`,
    type: "website",
  },
  alternates: { canonical: "/agenda/" },
};

/**
 * Static page rendered to HTML at build time.
 *
 * The view filter (`?view=upcoming|past|all`) is handled by the `AgendaView`
 * client component which reads `useSearchParams()`. Under static export
 * (`next.config.ts → output: 'export'`) we cannot read `searchParams` on the
 * server, hence the Suspense boundary wrapping the view-aware UI.
 */
export default function AgendaPage() {
  return (
    <>
      {/* Hero — fully static */}
      <section className="hero grain halftone">
        <div className="shell relative z-10 flex flex-col items-center text-center">
          <p className="win-eyebrow text-bubble mb-4">
            {`// agenda · ${new Date().getFullYear()}`}
          </p>
          <div className="relative inline-block">
            <Sparkle size="md" className="absolute -top-5 -left-7 hidden sm:block" />
            <Sparkle size="lg" className="absolute -top-8 left-1/2 -translate-x-1/2 hidden sm:block" />
            <Sparkle size="sm" className="absolute top-2 -right-6 hidden sm:block" />
            <h1 className="win-display bubble-strong text-[18vw] sm:text-[12rem]">
              AGENDA
            </h1>
          </div>

          <div className="mt-10 max-w-3xl w-full">
            <Win95Window title="agenda — instruções" controls>
              <div className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <p className="win-body-sm">
                  Próximos shows, festivais e residências. Ingressos pelo link
                  de cada data — quando disponível. Usa os filtros acima pra
                  navegar entre próximas, histórico ou tudo.
                </p>
                <div className="flex gap-2 shrink-0">
                  <Win95Button>Imprimir</Win95Button>
                  <Win95Button focused>OK</Win95Button>
                </div>
              </div>
            </Win95Window>
          </div>
        </div>
      </section>

      {/* View-driven list — Suspense wraps the client component because
          useSearchParams opt-in triggers a CSR bailout otherwise. */}
      <div className="shell pb-24">
        <Suspense fallback={<AgendaSkeleton />}>
          <AgendaView events={events} />
        </Suspense>
      </div>
    </>
  );
}

/** Static fallback that mirrors the upcoming-only state — shown briefly on
 *  slow devices while the client hydrates. */
function AgendaSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden>
      <div className="flex items-center gap-4 py-6 border-b border-line">
        <div className="h-9 w-28 rounded-full bg-surface-2 animate-pulse" />
        <div className="h-9 w-28 rounded-full bg-surface-2 animate-pulse" />
        <div className="h-9 w-24 rounded-full bg-surface-2 animate-pulse" />
      </div>
      <div className="py-10">
        <div className="h-12 w-72 bg-surface-2 rounded animate-pulse mb-8" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="border-b border-line py-8 grid grid-cols-[88px_1fr] gap-6"
          >
            <div className="space-y-2">
              <div className="h-3 w-10 bg-surface-2 rounded animate-pulse" />
              <div className="h-14 w-16 bg-surface-2 rounded animate-pulse" />
              <div className="h-3 w-12 bg-surface-2 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-24 bg-surface-2 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-surface-2 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-surface-2 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
