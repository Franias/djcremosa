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
  alternates: { canonical: "/agenda" },
};

type View = "upcoming" | "past" | "all";

function parseView(raw: string | undefined): View {
  return raw === "past" || raw === "all" ? raw : "upcoming";
}

interface AgendaPageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function AgendaPage({ searchParams }: AgendaPageProps) {
  const sp = await searchParams; // Next.js 16: searchParams is a Promise
  const view = parseView(sp.view);

  return (
    <>
      {/* Hero */}
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

      {/* Content */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
        <AgendaView view={view} events={events} />
      </div>
    </>
  );
}
