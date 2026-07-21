import type { Metadata } from "next";

import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contato · ${site.brand.name}`,
  description: `Booking, imprensa e contato geral de ${site.brand.name}. Resposta em até 72h úteis.`,
};

const CARDS = [
  {
    eyebrow: "// booking",
    title: "Proposta de show",
    body: site.contact.email,
    cta: "Abrir app de email →",
    href: `mailto:${site.contact.email}?subject=${encodeURIComponent("Proposta de show / booking")}`,
  },
  {
    eyebrow: "// imprensa",
    title: "Solicitar press kit",
    body: site.contact.email,
    cta: "Pedir material →",
    href: `mailto:${site.contact.email}?subject=${encodeURIComponent("Imprensa / press")}`,
  },
  {
    eyebrow: "// telefone",
    title: "Ligar agora",
    body: site.contact.phoneDisplay,
    cta: "Discar →",
    href: site.contact.phoneHref,
  },
] as const;

export default function ContatoPage() {
  return (
    <>
      {/* HERO — kit-page-5 glitched "contato" treatment */}
      <section className="hero grain scanlines">
        <div className="shell relative z-10">
          <h1 className="sr-only">Contato — Cremosa</h1>
          <p className="win-eyebrow win-eyebrow-shadow mb-6">
            <span aria-hidden>{"//"}</span>
            Início <span className="opacity-60 mx-1">›</span> Contato
          </p>
          <p className="mt-6 max-w-2xl win-body">
            Pra proposta de show, festival ou residência, mande mensagem! Resposta em até <span className="win-eyebrow-shadow">72h úteis</span>.
          </p>
        </div>
      </section>

      {/* CONTACT WINDOWS — Win95 dialogs */}
      <section className="shell py-16 grid sm:grid-cols-2 gap-6">
        {CARDS.map((c) => (
          <a
            key={c.eyebrow}
            href={c.href}
            className="no-underline group block"
          >
            <Win95Window
              title={c.title}
              className="transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-bubble)]"
            >
              <div className="p-5 bg-win-face text-win-ink">
                <p className="win-eyebrow mb-3">{c.eyebrow}</p>
                <p className="win-body-sm break-all">{c.body}</p>
                <div className="mt-4 flex justify-end">
                  <Win95Button focused>{c.cta}</Win95Button>
                </div>
              </div>
            </Win95Window>
          </a>
        ))}

        {site.social.instagram && (
          <a
            href={site.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline group block"
          >
            <Win95Window
              title="Instagram"
              className="transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-bubble)]"
            >
              <div className="p-5 bg-win-face text-win-ink">
                <p className="win-eyebrow mb-3">{"// @djcremosa"}</p>
                <p className="win-body-sm">{site.social.instagram.handle}</p>
                <div className="mt-4 flex justify-end">
                  <Win95Button focused>Abrir perfil →</Win95Button>
                </div>
              </div>
            </Win95Window>
          </a>
        )}

        {site.social.twitch && (
          <a
            href={site.social.twitch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline group block"
          >
            <Win95Window
              title="Twitch"
              className="transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-bubble)]"
            >
              <div className="p-5 bg-win-face text-win-ink">
                <p className="win-eyebrow mb-3">{"// twitch.tv/djcremosa"}</p>
                <p className="win-body-sm">{site.social.twitch.handle}</p>
                <div className="mt-4 flex justify-end">
                  <Win95Button focused>Abrir canal →</Win95Button>
                </div>
              </div>
            </Win95Window>
          </a>
        )}

        {site.social.tiktok && (
          <a
            href={site.social.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline group block"
          >
            <Win95Window
              title="TikTok"
              className="transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-bubble)]"
            >
              <div className="p-5 bg-win-face text-win-ink">
                <p className="win-eyebrow mb-3">{"// @cremosinh4"}</p>
                <p className="win-body-sm">{site.social.tiktok.handle}</p>
                <div className="mt-4 flex justify-end">
                  <Win95Button focused>Abrir perfil →</Win95Button>
                </div>
              </div>
            </Win95Window>
          </a>
        )}
      </section>

      {/* PRESS KIT REQUEST — Win95 dialog */}
      <section className="shell pb-24">
        <Win95Window title="Solicitar press kit.exe" controls closeable>
          <div className="p-5 sm:p-6 bg-win-face text-win-ink flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
            <div>
              <p className="win-eyebrow mb-1">{"// mídia kit 2026"}</p>
              <p className="win-body-sm max-w-xl">
                Fotos em alta resolução, bio completa pt-BR/EN e material de
                divulgação. Manda email e a gente responde em até 72h úteis.
              </p>
            </div>
            <a
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Solicitar press kit")}`}
              className="no-underline shrink-0"
            >
              <Win95Button focused>Solicitar →</Win95Button>
            </a>
          </div>
        </Win95Window>
      </section>
    </>
  );
}