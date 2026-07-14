import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EventRow } from "@/components/sections/EventRow";
import { Sparkle } from "@/components/sections/Sparkle";
import { Win95Dialog } from "@/components/sections/Win95Dialog";
import { HomeAbout } from "@/components/sections/HomeAbout";
import { PressStartGate } from "@/components/PressStartGate";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { events } from "@/content/events";
import { cn } from "@/lib/cn";
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
  { glyph: "⭐", label: "Destaques", href: "/#destaques", external: false },
  { glyph: "🎧", label: "SoundCloud", href: "https://soundcloud.com/cremosinha", external: true },
  { glyph: "📷", label: "Instagram", href: site.social.instagram?.url ?? "#", external: true },
  { glyph: "🕹", label: "Twitch", href: site.social.twitch?.url ?? "#", external: true },
  { glyph: "🎬", label: "TikTok", href: site.social.tiktok?.url ?? "#", external: true },
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
          {/* Welcome banner — decorative Y2K-style glitter header above
              the figure row. `max-w-3xl` keeps it from overpowering the
              figure; `h-auto` preserves the 480×281 aspect ratio. AT-
              invisible because the page already has an sr-only h1 with
              the site's real identity ("Cremosa — Início"). */}
          
          {/* Hero figure with party GIFs flanking — flex row from md up,
              stacked on phones (GIFs hidden via `hidden md:block`). The
              figure uses `flex-1 min-w-0` so it shrinks to make room for
              the GIFs while keeping its `max-w-5xl` cap on wider screens. */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 lg:gap-6 w-full">
            {/* Left GIF — decorative, hidden from AT */}
            <div className="hidden md:block win95-bevel-out p-[2px] shrink-0">
              <img
                src={`${site.basePath}/photos/party-like-its-2002.gif`}
                alt=""
                width={500}
                height={228}
                loading="lazy"
                decoding="async"
                className="block h-auto w-32 lg:w-40 xl:w-48"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <figure className="p-6 w-full md:flex-1 md:min-w-0 md:max-w-5xl">
              <div className="win95-bevel-out bg-win-face p-[2px] overflow-hidden">
                <Image
                  src={`${site.basePath}/photos/cremosa-home.jpg`}
                  alt="Cremosa em um retrato promocional com a marca CREMOSA"
                  width={1057}
                  height={655}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  preload
                  className="block h-auto w-full"
                />
              </div>
            </figure>

            {/* Right GIF — decorative, hidden from AT (intentionally not
                a duplicate `alt` to signal symmetry without repetition) */}
            <div
              className="hidden md:block win95-bevel-out p-[2px] shrink-0"
              aria-hidden
            >
              <img
                src={`${site.basePath}/photos/party-like-its-2002.gif`}
                alt=""
                width={500}
                height={228}
                loading="lazy"
                decoding="async"
                className="block h-auto w-32 lg:w-40 xl:w-48"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>
          {/* Breadcrumb — the page indicator */}
          <section className="shell">
            <Win95Window title="booking.exe — confirmar" controls>
              <div className="p-6 sm:p-8 bg-win-face text-win-ink text-center">
                <p className="win-eyebrow mb-3">
                  {"// quer levar a Cremosa pra sua pista?"}
                </p>
                <p className="win-body mb-6">
                  Booking, imprensa, residência — resposta em até 72h úteis.
                </p>
                <div className="flex justify-center">
                  <Link href="/contato" className="no-underline">
                    <Win95Button focused>Contatar →</Win95Button>
                  </Link>
                </div>
              </div>
            </Win95Window>
          </section>

          {/* Welcome dialog — 4×3 icon grid (Win95.com pattern) */}
          <div className="mt-6 sm:mt-10 w-full max-w-4xl">
            <Win95Window title="cremosa.exe — welcome" controls>
              <div className="bg-win-face p-4 sm:p-7 text-win-ink">
                <p className="win-eyebrow text-win-shadow-deep mb-4 sm:mb-5 text-center">
                  {"// 12 atalhos · toque pra abrir"}
                </p>
                {/* Grid: 3 cols on phones (icons stay >44px tap-target),
                    4 cols from sm (640px). The sm:gap-x-5 widens the
                    columns slightly to use the extra horizontal room. */}
                <ul className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 sm:gap-x-5 gap-y-5 sm:gap-y-6 list-none p-0">
                  {WELCOME_ICONS.map((icon) => (
                    <li key={icon.label} className="flex flex-col items-center">
                      <WelcomeIcon {...icon} />
                    </li>
                  ))}
                </ul>
              </div>
              {/* Status bar — echoes Win95.com footer */}
              <div className="win95-statusbar mt-2">
                <span className="win95-statusbar-segment grow">
                  © 2026 {site.brand.name} · POA, RS
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
            className="mt-6 sm:mt-8 max-w-3xl win-body-sm text-cream-dim text-center"
          >
            {SITEMAP.map((label, i) => (
              <span key={label.href + label.label}>
                <Link
                  href={label.href}
                  className="text-cream hover:win-eyebrow-shadow underline underline-offset-2"
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
      <section className="shell py-12  ">
        <HomeAbout />
      </section>

      {/* UPCOMING PREVIEW — keep agenda focus */}
      <section className="shell py-12 border-line">
        <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="relative">
            <Sparkle size="sm" className="absolute -top-4 -left-5" />
            <p className="win-eyebrow win-eyebrow-shadow mb-2">
              {"// próximas datas"}
            </p>
          </div>
          <Link href="/agenda" className="no-underline self-start sm:self-auto">
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

      {/* HAPPY FACE BANNER — decorative kaomoji strip between agenda
          and press sections. `max-w-3xl` matches the welcome banner so
          the two visual flourishes feel like a matched set. `mx-auto`
          centers it within the shell container. Decorative (alt=""),
          page already has an sr-only h1 with real site identity. */}
      <section className="shell py-12 ">
        <img
          src={`${site.basePath}/photos/happy-face.gif`}
          alt=""
          width={452}
          height={100}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full max-w-3xl mx-auto"
          style={{ imageRendering: "pixelated" }}
        />
      </section>

      {/* PRESS HIGHLIGHTS — Win95 window containing the list */}
      {/* <section className="shell py-12 sm:py-24">
        <p className="win-eyebrow win-eyebrow-shadow mb-2">{"// em destaque"}</p>
        <h2 className="win-h2 text-cream text-3xl sm:text-5xl leading-tight max-w-2xl mb-8 sm:mb-10">
          Dez anos na pista, da cena de Porto Alegre pro mundo.
        </h2>

        <Win95Window title="cremosa.txt — destaques" className="max-w-2xl">
          <div className="p-4 sm:p-5 bg-win-face text-win-ink">
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
      </section> */}

      {/* SYSTEM FOLDER — contato + onde me achar, lifted from old second footer */}
      <section className="shell py-12 sm:py-16">
        <p className="win-eyebrow win-eyebrow-shadow mb-2">{"// pasta do sistema"}</p>

        <Win95Window title="cremosa — pasta do sistema" controls>
          <div className="p-4 sm:p-6 bg-win-face text-win-ink flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
            <div>
              <Logo size="footer" />
              <p className="text-win-shadow-deep text-sm mt-3 max-w-xs">
                {site.brand.tagline.secondary}
              </p>
              <p className="text-win-shadow-deep win-eyebrow-sm mt-4">
                {site.brand.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:gap-10 text-sm">
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
                  {site.social.twitch && (
                    <li>
                      <a
                        href={site.social.twitch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-win-ink hover:underline"
                      >
                        Twitch · {site.social.twitch.handle}
                      </a>
                    </li>
                  )}
                  {site.social.tiktok && (
                    <li>
                      <a
                        href={site.social.tiktok.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-win-ink hover:underline"
                      >
                        TikTok · {site.social.tiktok.handle}
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

/* WelcomeIcon — a single tile in the home-page desktop icon grid.
   External destinations render as <a target="_blank">; same-origin
   routes use Next's <Link>. The tile is a full tap-target on phones
   (≥44px tall) and on hover (pointer devices) the icon bg flips to
   the win-light color. Touch devices never see the hover.

   Tooltip strategy:
     - `data-tooltip` is the long description ("Ir para Agenda").
       Picked up by `.win95-icon::after` on hover (no-op on touch).
     - `title={label}` is the short label that AT and the browser
       use as the native tooltip. Kept as the bare label so existing
       tests that select via `[title="Agenda"]` continue to pass.
     - `aria-label={label}` re-states the label for screen readers
       so they don't have to walk the icon + caption combo.
   We previously duplicated the long and short strings, but keeping
   them separate is intentional: native browser tooltip vs. CSS. */
interface WelcomeIconProps {
  glyph: string;
  label: string;
  href: string;
  external: boolean;
}

function WelcomeIcon({ glyph, label, href, external }: WelcomeIconProps) {
  const tooltip = external
    ? `Abrir ${label} em nova aba`
    : `Ir para ${label}`;
  // Common className spans both branches so the JSX below stays
  // readable. `cn()` filters out falsy branches for us.
  const linkClass = cn(
    "win95-icon group no-underline no-context",
    "flex flex-col items-center gap-1.5 sm:gap-2",
    "tap-target",
  );
  const iconBoxClass =
    "text-3xl sm:text-5xl win95-bevel-out bg-win-face-2 p-1.5 sm:p-2 group-hover:bg-win-light transition-colors";
  const labelClass =
    "win-caption text-center text-win-ink group-hover:text-crimson transition-colors leading-tight";

  const body = (
    <>
      <span aria-hidden className={iconBoxClass} style={{ imageRendering: "pixelated" }}>
        {glyph}
      </span>
      <span className={labelClass}>{label}</span>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        data-tooltip={tooltip}
        aria-label={label}
        title={label}
      >
        {body}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={linkClass}
      data-tooltip={tooltip}
      aria-label={label}
      title={label}
    >
      {body}
    </Link>
  );
}