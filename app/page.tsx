import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EventRow } from "@/components/sections/EventRow";
import { Sparkle } from "@/components/sections/Sparkle";
import { VisitCounter } from "@/components/sections/VisitCounter";
import { Win95Dialog } from "@/components/sections/Win95Dialog";
import { HomeAbout } from "@/components/sections/HomeAbout";
import { PressStartGate } from "@/components/PressStartGate";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { events } from "@/content/events";
import { cn } from "@/lib/cn";
import { splitAgenda } from "@/lib/events";
import { site } from "@/lib/site";


/**
 * Welcome icons — Win95.com-style desktop shortcuts. Each entry
 * has an `icon` (the react95 PNG — see `public/icons/win95/`)
 * and a `label` shown below. The icons are split into two
 * desktop-side columns around the hero figure:
 *
 *   - `leftSide: true`  → placed on the LEFT of the figure
 *   - `leftSide: false` → placed on the RIGHT of the figure
 *
 * The "visitantes.exe" VisitCounter tile is rendered EXPLICITLY in
 * the right column (replacing the old Destaques entry) so its
 * modal-trigger button sits in the desktop chrome right alongside
 * the other Win95 pixel icons — not at the top of the left column.
 *
 * The icons themselves come from `@react95/icons` (the same set
 * used by react95.io). Sourced on disk so the static export stays
 * dependency-free — the PNGs are 32×32 native Win95 .ico art.
 */
const WELCOME_ICONS = [
  { icon: `${site.basePath}/icons/win95/calendar.png`,    label: "Agenda",     href: "/agenda/",                           external: false, leftSide: true  },
  { icon: `${site.basePath}/icons/win95/media-audio.png`, label: "Música",     href: "/musica/",                           external: false, leftSide: true  },
  { icon: `${site.basePath}/icons/win95/camera.png`,      label: "Galeria",    href: "/galeria/",                          external: false, leftSide: true  },
  { icon: `${site.basePath}/icons/win95/media-video.png`, label: "Vídeos",     href: "/videos/",                           external: false, leftSide: true  },
  { icon: `${site.basePath}/icons/win95/help-book.png`,   label: "Sobre",      href: "/sobre/",                            external: false, leftSide: true  },
  { icon: `${site.basePath}/icons/win95/mail.png`,        label: "Contato",    href: "/contato/",                          external: false, leftSide: true  },
  { icon: `${site.basePath}/icons/win95/media-cd.png`,    label: "Sets",       href: "/musica/",                           external: false, leftSide: false },
  { icon: `${site.basePath}/icons/win95/media-audio.png`, label: "SoundCloud", href: "https://soundcloud.com/cremosinha",   external: true,  leftSide: false },
  { icon: `${site.basePath}/icons/win95/camera.png`,      label: "Instagram",  href: site.social.instagram?.url ?? "#",    external: true,  leftSide: false },
  { icon: `${site.basePath}/icons/win95/joystick.png`,    label: "Twitch",     href: site.social.twitch?.url ?? "#",       external: true,  leftSide: false },
  { icon: `${site.basePath}/icons/win95/media-video.png`, label: "TikTok",     href: site.social.tiktok?.url ?? "#",       external: true,  leftSide: false },
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
      <section className=" grain halftone">
        <div className="shell relative z-10 flex flex-col items-center text-center">
          <h1 className="sr-only">Cremosa — Início</h1>
          {/* Welcome banner — decorative Y2K-style glitter header above
              the figure row. `max-w-3xl` keeps it from overpowering the
              figure; `h-auto` preserves the 480×281 aspect ratio. AT-
              invisible because the page already has an sr-only h1 with
              the site's real identity ("Cremosa — Início"). */}

          {/* Desktop welcome chip — small AT-readable label that echoes
              the Win9x title-bar motif so the home page has a stable
              "cremosa.exe — welcome" anchor visible across all
              breakpoints. The mobile `md:hidden` Win95Window above
              (which contains the same text in its title-bar) takes
              over on phones. We deliberately keep this `text-win-ink`
              (black) on a transparent Win95 bevel so it visually
              anchors the hero row instead of competing with the
              flanking pixel icons. */}
          <p className="win-eyebrow text-win-shadow-deep mb-3 sm:mb-4 text-center">
            {"// cremosa.exe — welcome"}
          </p>
          
          {/* Hero — figure in the middle, desktop icons on the two sides.
              On `md+` the row is `icons-left | figure | icons-right`. We
              use CSS Grid (3 explicit tracks, `1fr auto 1fr`) instead
              of flexbox so the figure column stays anchored to the
              viewport center even when the two icon columns have
              different intrinsic widths (the right column is wider
              because `visitantes.exe` + `SoundCloud` push it past the
              left column's `Galeria / Vídeos / Sobre`). With flex,
              `flex-1` lets the figure absorb leftover space asymmet-
              rically and the visual center drifts leftward; with
              grid, both `1fr` tracks take equal share and the `auto`
              figure sits exactly between them. VisitCounter opens
              the right column at the TOP (top-of-column bookend,
              classic Win95 counter position). On phones the row
              collapses to a stacked column (figure first) and the
              icons fall into a 3-col grid below — flanking would be
              unreadable on a portrait viewport. */}
          {/* Hero — figure in the middle, desktop icons on the two sides.
              Three CSS Grid tracks, all explicit so the columns stay
              symmetric regardless of their content width:

              - left:   `8rem` (128px) on `lg+`, `7rem` (112px) on `md`
              - figure: `minmax(0, 1fr)` (fills leftover, capped at
                        `max-w-5xl` by the figure's own class)
              - right:  same width as left, mirrored

              Both side columns get the same `w-*` class so the figure
              always sits at the geometric center of the row. The
              previous `1fr auto 1fr` layout was letting the columns
              overflow the tracks asymmetrically — the right column
              grew to 192px (because VisitCounter's `w-32` set the
              column's intrinsic width) while the left column stayed
              at 65px (just the icon's width). With explicit equal
              widths, the figure stays centered at every breakpoint
              from md to 8K.

              Below `md` the row collapses to a single column and
              the mobile stacked grid below takes over (already
              responsive: 2/3/4 cols at 320/380/640px). */}
          <div className="grid grid-cols-1 md:grid-cols-[7rem_minmax(0,1fr)_7rem] lg:grid-cols-[8rem_minmax(0,1fr)_8rem] items-center gap-3 md:gap-4 lg:gap-6 w-full">
            {/* Left side — the 6 page shortcuts that point inside the
                site. `justify-self-stretch` + the explicit `7rem` /
                `8rem` track makes the column's BOX the same width
                on both sides; `items-center` inside the column
                centers each icon. */}
            <div className="hidden md:flex flex-col items-center gap-2 lg:gap-3 justify-self-stretch w-full">
              {WELCOME_ICONS.filter((icon) => icon.leftSide).map((icon) => (
                <WelcomeIcon key={icon.label} {...icon} />
              ))}
            </div>

            <figure className="p-6 w-full md:w-auto md:max-w-5xl mx-auto">
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

            {/* Right side — `visitantes.exe` (VisitCounter, replaces the
                old Destaques entry) opens the column at the TOP, then
                the 5 `rightSide` shortcuts follow (Sets first, then
                SoundCloud, Instagram, Twitch, TikTok). Same
                `justify-self-stretch w-full` so the column box is
                visually identical to the left side. */}
            <div className="hidden md:flex flex-col items-center gap-2 lg:gap-3 justify-self-stretch w-full">
              <VisitCounter size="hero" />
              {WELCOME_ICONS.filter((icon) => !icon.leftSide).map((icon) => (
                <WelcomeIcon key={icon.label} {...icon} />
              ))}
            </div>
          </div>

          {/* Mobile icon grid — phones can't fit an icon-column beside
              the figure, so we show the icons in a responsive grid
              right below the figure. Order mirrors the desktop
              columns: 6 left-side icons first, then the right-side
              sequence (visitantes.exe → Sets → SoundCloud → …).
              VisitCounter is the FIRST right-side item so the
              counter sits in the same relative slot as on desktop.

              The grid sits DIRECTLY on the pink halftone background
              (no Win95Window wrapper, no `bg-win-face`) so the
              icons keep their transparent backgrounds — exactly the
              same look as the desktop flanking columns. A small
              eyebrow chip repeats the `cremosa.exe — welcome` title
              above the grid for symmetry with the desktop hero chip.

              Responsive column count:
              - 320px → 2 cols (Galaxy Fold cover, iPhone SE 1)
              - 380px → 3 cols (iPhone 12, 13, 14)
              - sm (640px) → 4 cols (large phones, small tablets)
              - md (768px) → hidden, desktop flanking takes over */}
          <div className="md:hidden w-full mt-6 hero">
            <p className="win-eyebrow text-win-shadow-deep mb-3 text-center">
              {"// 12 atalhos"}
            </p>
            <ul className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-5 sm:gap-y-6 list-none p-0">
              {/* Left side anchors first (Agenda → Contato) */}
              {WELCOME_ICONS.filter((i) => i.leftSide).map((icon) => (
                <li key={icon.label} className="flex flex-col items-center">
                  <WelcomeIcon {...icon} />
                </li>
              ))}
              {/* Right side starts with visitantes.exe (counter) —
                  same visual slot as on desktop, just stacked into
                  the responsive grid for portrait viewports. */}
              <li className="flex flex-col items-center w-full">
                <VisitCounter size="compact-hero" />
              </li>
              {/* Then the remaining 5 right-side anchors (Sets, then
                  SoundCloud → TikTok). */}
              {WELCOME_ICONS.filter((i) => !i.leftSide).map((icon) => (
                <li key={icon.label} className="flex flex-col items-center">
                  <WelcomeIcon {...icon} />
                </li>
              ))}
            </ul>
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

          {/* "Internet royalty" accent strip — decorative badge below the
              booking CTA. Sized `max-w-sm` so it reads as a small flourish
              rather than competing with the booking window above. Decorative
              (alt=""); the booking CTA already carries the message here. */}
          <img
            src={`${site.basePath}/photos/internet-royalty.gif`}
            alt=""
            width={480}
            height={201}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full max-w-sm mx-auto mt-6 sm:mt-8 mb-6 sm:mb-8"
            style={{ imageRendering: "pixelated" }}
          />

          {/* The desktop `cremosa.exe — welcome` 4×3 grid used to live
              here, but the icon set now flanks the figure above (see
              the hero row). On phones the icons fall into a stacked
              grid that already lives right under the figure. No
              second Win95Window needed on desktop — keeps the
              page from repeating itself. */}

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

/* WelcomeIcon — a single desktop-icon tile in the home-page layout.
   Renders a react95 PNG icon (sourced from `public/icons/win95/`)
   with the label below — same look as `<VisitCounter size="hero">`,
   no gray bevel frame. External destinations render as
   `<a target="_blank">`; same-origin routes use Next's `<Link>`.
   The tile is a full tap-target on phones (≥44px tall) and on
   hover (pointer devices) the label flips to the crimson hover
   color. Touch devices never see the hover.

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
  icon: string;
  label: string;
  href: string;
  external: boolean;
}

function WelcomeIcon({ icon, label, href, external }: WelcomeIconProps) {
  const tooltip = external
    ? `Abrir ${label} em nova aba`
    : `Ir para ${label}`;
  // Common className spans both branches so the JSX below stays
  // readable. `cn()` filters out falsy branches for us.
  const linkClass = cn(
    "win95-icon group no-underline no-context",
    "flex flex-col items-center gap-1.5",
    "tap-target",
  );
  // No gray bevel frame — same look as `<VisitCounter size="hero">`,
  // so the desktop chrome reads as one consistent set of pixel
  // icons flanking the figure. Label color matches the VisitCounter
  // visitors.exe pattern: black (`text-win-ink`) by default, classic
  // Win95 title-blue (`text-win-title-2` = #1084d0) on hover.
  //
  // We deliberately AVOID `.win-caption` here: that utility sets
  // `color: var(--color-cream-dim)` and is unlayered in globals.css,
  // which beats Tailwind v4's `@layer utilities` cascade. The
  // `!important` (`!`) modifier forces the win-ink color to land.
  const labelClass =
    "font-pixel text-center text-xs sm:text-base uppercase tracking-[0.16em] sm:tracking-[0.18em] leading-tight max-w-[7rem] text-win-ink! group-hover:text-win-title-2! transition-colors";

  const body = (
    <>
      <span aria-hidden className="p-1.5" style={{ imageRendering: "pixelated" }}>
        {/* The native PNG is 32×32; `h-12 w-12` (48px) on the
            flanking hero columns matches the visual footprint of
            the VisitCounter hero tile. `imageRendering: pixelated`
            keeps the 1-bit Win95 art crisp at 2× and beyond. */}
        <img
          src={icon}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          className="block h-12 w-12 transition-transform group-hover:-translate-y-0.5"
          style={{ imageRendering: "pixelated" }}
        />
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