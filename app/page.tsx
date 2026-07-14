import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EventRow } from "@/components/sections/EventRow";
import { Sparkle } from "@/components/sections/Sparkle";
import { Win95Dialog } from "@/components/sections/Win95Dialog";
import { HomeAbout } from "@/components/sections/HomeAbout";
import { PressStartGate } from "@/components/PressStartGate";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { events } from "@/content/events";
import { splitAgenda } from "@/lib/events";
import { site } from "@/lib/site";

/**
 * Win95.com-style welcome dialog. 12 shortcut icons arranged in a
 * 4×3 grid, each linking to a page or external resource.
 */
const WELCOME_ICONS = [
  { glyph: "📅", label: "Agenda", href: "/agenda/", external: false },
  { glyph: "🎵", label: "Música", href: "/musica/", external: false },
  { glyph: "🖼", label: "Galeria", href: "/galeria/", external: false },
  { glyph: "🎞", label: "Vídeos", href: "/videos/", external: false },
  { glyph: "📖", label: "Sobre", href: "/sobre/", external: false },
  { glyph: "✉", label: "Contato", href: "/contato/", external: false },
  { glyph: "💿", label: "Sets", href: "/musica/", external: false },
  { glyph: "📝", label: "Notas", href: "/sobre/", external: false },
  { glyph: "⭐", label: "Destaques", href: "/#destaques", external: false },
  { glyph: "📨", label: "Booking", href: `mailto:${site.contact.email}`, external: true },
  { glyph: "🎧", label: "SoundCloud", href: "https://soundcloud.com/cremosinha", external: true },
  { glyph: "📷", label: "Instagram", href: site.social.instagram?.url ?? "#", external: true },
] as const;

/** Pipe-separated sitemap row — secondary nav, Win95.com-style footer. */
const SITEMAP = [
  { label: "Agenda", href: "/agenda/" },
  { label: "Música", href: "/musica/" },
  { label: "Galeria", href: "/galeria/" },
  { label: "Vídeos", href: "/videos/" },
  { label: "Sobre", href: "/sobre/" },
  { label: "Contato", href: "/contato/" },
  { label: "Booking", href: "/contato/" },
] as const;

export default function HomePage() {
  const { upcoming } = splitAgenda(events);
  const nextThree = upcoming.slice(0, 3);

  return (
    <PressStartGate>
      {/* HERO — Windows95.com-inspired welcome dialog with 4×3 icon grid */}
      <section className="hero grain halftone">
        <div className="shell relative z-10 flex flex-col items-center text-center">
          <h1 className="sr-only">Cremosa — Início</h1>
          {/* Breadcrumb — the page indicator */}
          <p className="win-eyebrow text-bubble mb-8 self-start">
            <span aria-hidden>{"//"}</span>
            Início <span className="opacity-60 mx-1">›</span>{" "}
            {site.brand.tagline.primary}
          </p>

          {/* Welcome dialog — 4×3 icon grid (Win95.com pattern) */}
          <div className="mt-10 w-full max-w-4xl">
            <Win95Window title="cremosa.exe — welcome" controls>
              <div className="bg-win-face p-5 sm:p-7 text-win-ink">
                <p className="win-eyebrow text-win-shadow-deep mb-5 text-center">
                  {"// 12 atalhos · clique pra abrir"}
                </p>
                <ul className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 list-none p-0">
                  {WELCOME_ICONS.map((icon) => (
                    <li key={icon.label} className="flex flex-col items-center">
                      {icon.external ? (
                        <a
                          href={icon.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="win95-icon group no-underline flex flex-col items-center gap-2"
                          data-tooltip={`Abrir ${icon.label} em nova aba`}
                          title={icon.label}
                        >
                          <span
                            aria-hidden
                            className="text-4xl sm:text-5xl win95-bevel-out bg-win-face-2 p-2 group-hover:bg-win-light transition-colors"
                            style={{ imageRendering: "pixelated" }}
                          >
                            {icon.glyph}
                          </span>
                          <span className="win-caption text-center text-win-ink group-hover:text-crimson transition-colors">
                            {icon.label}
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={icon.href}
                          className="win95-icon group no-underline flex flex-col items-center gap-2"
                          data-tooltip={`Ir para ${icon.label}`}
                          title={icon.label}
                        >
                          <span
                            aria-hidden
                            className="text-4xl sm:text-5xl win95-bevel-out bg-win-face-2 p-2 group-hover:bg-win-light transition-colors"
                            style={{ imageRendering: "pixelated" }}
                          >
                            {icon.glyph}
                          </span>
                          <span className="win-caption text-center text-win-ink group-hover:text-crimson transition-colors">
                            {icon.label}
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Status bar — echoes Win95.com footer */}
              <div className="win95-statusbar mt-2">
                <span className="win95-statusbar-segment grow">
                  © 2026 {site.brand.name} · Porto Alegre, RS
                </span>
                <span className="win95-statusbar-segment grow hidden sm:inline">
                  {site.brand.tagline.primary}
                </span>
                <span className="win95-statusbar-segment shrink">
                  v1.0 · 2026
                </span>
              </div>
            </Win95Window>
          </div>

          {/* Pipe-separated link row — secondary nav like the Windows95.com footer */}
          <nav
            aria-label="Mapa do site"
            className="mt-8 max-w-3xl win-body-sm text-cream-dim text-center"
          >
            {SITEMAP.map((label, i) => (
              <span key={label.href + label.label}>
                <Link
                  href={label.href}
                  className="text-cream hover:text-bubble underline underline-offset-2"
                >
                  {label.label}
                </Link>
                {i < SITEMAP.length - 1 && (
                  <span className="opacity-50 mx-2" aria-hidden>
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </section>

      {/* ABOUT DIALOG — manifesto in a Win95 window */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <HomeAbout />
      </section>

      {/* UPCOMING PREVIEW — keep agenda focus */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
          <div className="relative">
            <Sparkle size="sm" className="absolute -top-4 -left-5" />
            <p className="win-eyebrow text-bubble mb-2">
              {"// próximas datas"}
            </p>
          </div>
          <Link href="/agenda" className="no-underline">
            <Win95Button>agenda completa →</Win95Button>
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
          <div className="max-w-xl mx-auto">
            <Win95Dialog
              title="agenda — sistema"
              message="Nada agendado pra esse momento"
              hint={
                <>
                  Segue a Cremosa nas redes pra não perder o próximo anúncio.{" "}
                  <a
                    href={site.social.instagram?.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    @djcremosa
                  </a>
                </>
              }
              actions={[
                {
                  label: "OK",
                  href: site.social.instagram?.url,
                  focused: true,
                },
              ]}
            />
          </div>
        )}
      </section>

      {/* PRESS HIGHLIGHTS — Win95 window containing the list */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <p className="win-eyebrow text-bubble mb-2">{"// em destaque"}</p>
        <h2 className="win-h2 text-cream text-4xl sm:text-5xl leading-tight max-w-2xl mb-10">
          Dez anos na pista, da cena de Porto Alegre pro mundo.
        </h2>

        <Win95Window title="cremosa.txt — destaques" className="max-w-2xl">
          <div className="p-5 bg-win-face text-win-ink">
            <p className="win-caption mb-3 text-win-shadow-deep">
              Última atualização: 2026
            </p>
            <ul className="list-none p-0 grid sm:grid-cols-2 gap-2">
              {site.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 win-body-sm">
                  <span>★</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <p className="win-caption mt-4 pt-3 border-t border-win-shadow-deep/40 text-win-shadow-deep">
              {"// fim do arquivo"}
            </p>
          </div>
        </Win95Window>
      </section>

      {/* SYSTEM FOLDER — contato + onde me achar, lifted from old second footer */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <p className="win-eyebrow text-bubble mb-2">{"// pasta do sistema"}</p>

        <Win95Window title="cremosa — pasta do sistema" controls>
          <div className="p-5 sm:p-6 bg-win-face text-win-ink flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
            <div>
              <Logo size="footer" />
              <p className="text-win-shadow-deep text-sm mt-3 max-w-xs">
                {site.brand.tagline.secondary}
              </p>
              <p className="text-win-shadow-deep win-eyebrow-sm mt-4">
                {site.brand.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-10 text-sm">
              <div>
                <p className="win-eyebrow-sm mb-2">Contato</p>
                <ul className="list-none p-0 flex flex-col gap-1 win-body-sm">
                  <li>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="text-win-ink hover:underline break-all"
                    >
                      {site.contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={site.contact.phoneHref}
                      className="text-win-shadow-deep hover:text-win-ink"
                    >
                      {site.contact.phoneDisplay}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="win-eyebrow-sm mb-2">Onde me achar</p>
                <ul className="list-none p-0 flex flex-col gap-1 win-body-sm">
                  {site.social.instagram && (
                    <li>
                      <a
                        href={site.social.instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-win-ink hover:underline"
                      >
                        Instagram · {site.social.instagram.handle}
                      </a>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/agenda"
                      className="text-win-shadow-deep hover:text-win-ink"
                    >
                      Próximos shows
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Win95Window>
      </section>
    </PressStartGate>
  );
}