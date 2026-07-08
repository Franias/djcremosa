import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Contato · ${site.brand.name}` };

export default function ContatoPage() {
  return (
    <>
      <section className="relative overflow-hidden grain">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bubble mb-4">
            // booking · imprensa · geral
          </p>
          <h1 className="font-display text-[18vw] sm:text-[10rem] leading-[0.85] bubble">
            CONTATO
          </h1>
          <p className="mt-6 max-w-2xl text-cream-dim text-base sm:text-lg">
            Pra proposta de show, festival ou residência, manda direto pelo
            email. Resposta em até 72h úteis.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid sm:grid-cols-2 gap-6">
        <a
          href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Proposta de show / booking")}`}
          className="group block border border-line rounded-lg p-6 bg-surface hover:border-bubble transition-colors"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mb-2">
            Booking
          </p>
          <p className="text-cream text-lg sm:text-xl break-all">
            {site.contact.email}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim group-hover:text-bubble transition-colors">
            Abrir app de email →
          </p>
        </a>

        <a
          href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Imprensa / press")}`}
          className="group block border border-line rounded-lg p-6 bg-surface hover:border-bubble transition-colors"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mb-2">
            Imprensa
          </p>
          <p className="text-cream text-lg sm:text-xl break-all">
            {site.contact.email}
          </p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim group-hover:text-bubble transition-colors">
            Solicitar press kit →
          </p>
        </a>

        <a
          href={site.contact.phoneHref}
          className="group block border border-line rounded-lg p-6 bg-surface hover:border-bubble transition-colors"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mb-2">
            Telefone
          </p>
          <p className="text-cream text-lg sm:text-xl">{site.contact.phoneDisplay}</p>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim group-hover:text-bubble transition-colors">
            Ligar →
          </p>
        </a>

        {site.social.instagram && (
          <a
            href={site.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-line rounded-lg p-6 bg-surface hover:border-bubble transition-colors"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mb-2">
              Instagram
            </p>
            <p className="text-cream text-lg sm:text-xl">
              {site.social.instagram.handle}
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim group-hover:text-bubble transition-colors">
              Abrir perfil →
            </p>
          </a>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream-dim border border-dashed border-line rounded-md p-4">
          Formulário completo + captcha entram na fase 2 (Resend + React Email
          ou Formspree). Por enquanto o mailto resolve.
        </p>
      </section>
    </>
  );
}
