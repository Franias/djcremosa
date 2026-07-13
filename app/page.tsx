import Link from "next/link";
import { Logo } from "@/components/Logo";
import { EventRow } from "@/components/sections/EventRow";
import { GenrePills } from "@/components/sections/GenrePills";
import { Sparkle } from "@/components/sections/Sparkle";
import { Win95Dialog } from "@/components/sections/Win95Dialog";
import { PressStartGate } from "@/components/PressStartGate";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { events } from "@/content/events";
import { splitAgenda } from "@/lib/events";
import { site } from "@/lib/site";

const DESKTOP_ICONS = [
  { glyph: "📀", label: "Sets", href: "/musica/" },
  { glyph: "📝", label: "Notas", href: "/sobre/" },
  { glyph: "📅", label: "Agenda", href: "/agenda/" },
  { glyph: "🎞", label: "Vídeos", href: "/videos/" },
  { glyph: "🖼", label: "Galeria", href: "/galeria/" },
] as const;

export default function HomePage() {
  const { upcoming } = splitAgenda(events);
  const nextThree = upcoming.slice(0, 3);

  return (
    <PressStartGate>
      {/* HERO — breadcrumb + lede + CTA + desktop icons */}
      <section className="hero grain halftone">
        <div className="shell relative z-10">
          <h1 className="sr-only">Cremosa — Início</h1>
          {/* Breadcrumb */}
          <p className="win-eyebrow text-bubble mb-6">
            <span aria-hidden>// </span>
            Início <span className="opacity-60 mx-1">›</span>{" "}
            {site.brand.tagline.primary}
          </p>

          {/* Genre pills — horizontal row */}
          <GenrePills spread={false} />

          {/* Lede */}
          <p className="mt-2 max-w-xl win-body text-cream">
            {site.brand.tagline.secondary}
          </p>

          {/* CTAs — Win95 buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/agenda" className="no-underline">
              <Win95Button focused>Ver agenda →</Win95Button>
            </Link>
            {site.social.instagram && (
              <a
                href={site.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Win95Button>{site.social.instagram.handle}</Win95Button>
              </a>
            )}
          </div>

          {/* Desktop icons strip — Midia Kit page 3 reference */}
          <div className="mt-14 w-full">
            <ul className="flex flex-wrap items-end gap-4 sm:gap-6 list-none p-0 max-w-2xl">
              {DESKTOP_ICONS.map((icon) => (
                <li key={icon.label}>
                  <Link
                    href={icon.href}
                    className="flex flex-col items-center gap-1 group no-underline"
                  >
                    <span
                      aria-hidden
                      className="text-3xl sm:text-4xl win95-bevel-out bg-win-face p-1.5 group-hover:bg-win-face-2 transition-colors"
                      style={{ imageRendering: "pixelated" }}
                    >
                      {icon.glyph}
                    </span>
                    <span className="win-caption group-hover:text-bubble transition-colors">
                      {icon.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ABOUT DIALOG — manifesto in a Win95 window */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Win95Window title="cremosa.txt — readme" controls>
              <div className="p-5 sm:p-6 bg-win-face text-win-ink">
                <p className="win-eyebrow mb-3 text-win-shadow-deep">
                  {`// ${site.brand.location} · desde ${site.brand.activeSince}`}
                </p>
                <div className="grid sm:grid-cols-2 gap-5 sm:gap-7">
                  <p className="win-body-sm">
                    DJ Cremosa é uma artista da cena de Porto Alegre que atua
                    desde 2016, conhecida por sets intensos que conectam
                    diferentes vertentes da{" "}
                    <strong>música preta global</strong>.
                  </p>
                  <p className="win-body-sm">
                    Sua pesquisa parte do{" "}
                    <strong>funk brasileiro</strong> e se expande por rap,
                    amapiano, house, pop e R&amp;B — pistas marcadas por groove,
                    energia e mistura de estilos.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-win-shadow-deep/40 flex justify-end gap-2">
                  <Win95Button>Copiar</Win95Button>
                  <Win95Button focused>Fechar ×</Win95Button>
                </div>
              </div>
            </Win95Window>
          </div>

          <aside>
            <Win95Window title="propriedades" controls>
              <div className="p-4 sm:p-5 bg-win-face text-win-ink win-body-sm">
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  <dt className="text-win-shadow-deep">Nome</dt>
                  <dd>{site.brand.name}</dd>
                  <dt className="text-win-shadow-deep">Cidade</dt>
                  <dd>Porto Alegre, RS</dd>
                  <dt className="text-win-shadow-deep">Ativa desde</dt>
                  <dd>{site.brand.activeSince}</dd>
                  <dt className="text-win-shadow-deep">Setup</dt>
                  <dd>Pioneer DDJ-200</dd>
                  <dt className="text-win-shadow-deep">Coletivo</dt>
                  <dd>AfroJams (2025→)</dd>
                  <dt className="text-win-shadow-deep">Residência</dt>
                  <dd>BatukBaile (2026→)</dd>
                </dl>
                <div className="mt-4 pt-3 border-t border-win-shadow-deep/40 flex justify-end">
                  <Win95Button focused>OK</Win95Button>
                </div>
              </div>
            </Win95Window>
          </aside>
        </div>
      </section>

      {/* UPCOMING PREVIEW — keep agenda focus */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
          <div className="relative">
            <Sparkle size="sm" className="absolute -top-4 -left-5" />
            <p className="win-eyebrow text-bubble mb-2">
              {"// próximas datas"}
            </p>
            <h2 className="win-h2 bubble text-4xl sm:text-6xl leading-none">
              Em rota
            </h2>
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
        <h2 className="win-h2 text-cream text-4xl sm:text-5xl leading-tight max-w-2xl mb-10">
          Contato, agenda e onde me achar.
        </h2>

        <Win95Window title="cremosa — pasta do sistema" controls>
          <div className="p-5 sm:p-6 bg-win-face text-win-ink flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
            <div>
              <Logo size="footer" />
              <p className="text-win-shadow-deep text-sm mt-3 max-w-xs">
                {site.brand.tagline.secondary}
              </p>
              <p className="text-win-shadow-deep win-eyebrow mt-4 text-[10px]">
                {site.brand.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-10 text-sm">
              <div>
                <p className="win-eyebrow mb-2 text-[10px]">Contato</p>
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
                <p className="win-eyebrow mb-2 text-[10px]">Onde me achar</p>
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