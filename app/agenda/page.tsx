import { Suspense } from "react";
import type { Metadata } from "next";
import { AgendaView } from "@/components/sections/AgendaView";
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
      <section className="relative overflow-hidden grain">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bubble mb-4">
            // agenda · {new Date().getFullYear()}
          </p>
          <h1 className="font-display text-[18vw] sm:text-[12rem] leading-[0.85] bubble">
            AGENDA
          </h1>
          <p className="mt-6 max-w-2xl text-cream-dim text-base sm:text-lg">
            Próximos shows, festivais e residências. Ingressos pelo link de cada
            data — quando disponível.
          </p>
        </div>
      </section>

      {/* View-driven list — Suspense wraps the client component because
          useSearchParams opt-in triggers a CSR bailout otherwise. */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
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
