import type { Metadata } from "next";
import Link from "next/link";
import { GenrePills } from "@/components/sections/GenrePills";
import { Notepad } from "@/components/sections/Notepad";
import { Sparkle } from "@/components/sections/Sparkle";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Sobre · ${site.brand.name}`,
  description: `${site.brand.name} — ${site.brand.tagline.secondary} Quem é, de onde veio e como pensa a música.`,
};

const TIMELINE = [
  { year: "2016", body: "Início da carreira em Porto Alegre. A cena noturna da capital é o lugar onde a pista se forma." },
  {
    year: "2023",
    body: "Primeiro destaque nacional: Rap in Cena ao lado do rapper D'Lock.",
    accent: true,
  },
  {
    year: "2024",
    body: "Retorno ao Rap in Cena em carreira solo. Abertura para Rafa Moreira, Baco Exu do Blues e KL Jay.",
    accent: true,
  },
  { year: "2025", body: "Co-funda o coletivo AfroJams com colegas da cena." },
  {
    year: "2026",
    body: "Line-up do Planeta Atlântida via AfroJams. Residência na festa BatukBaile.",
    accent: true,
  },
  { year: "2016 →", body: "Dez anos de sets, pistas e baile. A próxima década começa agora." },
];

export default function SobrePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero grain halftone">
        <div className="shell relative z-10 flex flex-col items-center text-center">
          <p className="win-eyebrow text-bubble mb-4">
            {"// bio · trajetória · manifesto"}
          </p>
          <div className="relative inline-block">
            <Sparkle size="md" className="absolute -top-4 -left-8" />
            <Sparkle size="lg" className="absolute -top-8 left-1/2 -translate-x-1/2" />
            <Sparkle size="sm" className="absolute top-1 -right-8" />
            <h1 className="win-display bubble-strong text-[18vw] sm:text-[10rem]">
              SOBRE
            </h1>
          </div>
          <p className="mt-8 max-w-2xl win-body text-cream-dim">
            Seletora e curadora musical baseada em Porto Alegre. Ativa desde
            2016, construindo pista a partir da música preta global.
          </p>
        </div>
      </section>

      {/* PINK MANIFESTO SECTION — kept as the kit's pink mode */}
      <section className="pink-mode halftone">
        <div className="relative shell py-16 sm:py-24">
          <GenrePills spread={false} />

          <div className="relative z-10 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="win-eyebrow mb-4 ink-dim">
                {"// manifesto · 2026"}
              </p>
              <h2 className="win-h2 ink text-4xl sm:text-6xl">
                Música preta global na pista.
              </h2>
              <div className="mt-10 grid sm:grid-cols-2 gap-8">
                <p className="win-body ink">
                  DJ Cremosa é uma artista da cena de Porto Alegre que atua
                  desde 2016, conhecida por sets intensos que conectam
                  diferentes vertentes da música preta global.
                </p>
                <p className="win-body ink">
                  Sua pesquisa parte do funk brasileiro e se expande por rap,
                  amapiano, house, pop e R&amp;B, criando pistas marcadas por
                  groove, energia e mistura de estilos.
                </p>
              </div>
            </div>

            {/* Sidebar — quick facts in a Win95 properties dialog */}
            <aside>
              <div className="win95-bevel-out bg-[#c0c0c0] p-[2px]">
                <div className="win95-bevel-deep-in bg-[#c0c0c0]">
                  <div className="win95-title">
                    <span>cremosa — propriedades</span>
                    <span className="win95-title-controls" aria-hidden>
                      <span>─</span>
                      <span>□</span>
                      <span className="close">×</span>
                    </span>
                  </div>
                  <div className="win95-bevel-deep-in bg-[#c0c0c0] p-4 text-win-ink">
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 win-body-sm">
                      <dt className="text-win-shadow-deep">Nome:</dt>
                      <dd>Cremosa</dd>
                      <dt className="text-win-shadow-deep">Cidade:</dt>
                      <dd>Porto Alegre, RS</dd>
                      <dt className="text-win-shadow-deep">Desde:</dt>
                      <dd>2016</dd>
                      <dt className="text-win-shadow-deep">Coletivo:</dt>
                      <dd>AfroJams</dd>
                      <dt className="text-win-shadow-deep">Residência:</dt>
                      <dd>BatukBaile</dd>
                      <dt className="text-win-shadow-deep">Setup:</dt>
                      <dd>Pioneer DDJ-200</dd>
                    </dl>
                    <div className="mt-4 pt-3 border-t border-win-shadow-deep/40 flex justify-end">
                      <Link href="/contato" className="no-underline">
                        <span className="win95-button win-button-text">
                          Booking →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* CAREER NOTEPADS — kit page 3 reference */}
      <section className="shell py-16 sm:py-24">
        <p className="win-eyebrow text-bubble mb-2">{"// trajetória"}</p>
        <h2 className="win-h2 text-cream text-4xl sm:text-5xl leading-tight mb-12 max-w-2xl">
          Da cena de Porto Alegre pro line-up do Planeta Atlântida.
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">
          <Notepad title="sobre - Notepad">
            Foi destaque no <strong>Rap in Cena</strong>, apresentando-se ao
            lado do rapper <strong>D&apos;Lock em 2023</strong> e retornando
            ao festival em carreira solo em <strong>2024</strong>. Ao longo da
            sua trajetória, também já abriu shows para artistas como{" "}
            <strong>Rafa Moreira</strong>, <strong>Baco Exu do Blues</strong> e{" "}
            <strong>KL Jay</strong>.
          </Notepad>

          <Notepad title="coletivo - Notepad">
            Em <strong>2025</strong>, iniciou com seus colegas o coletivo{" "}
            <strong>AfroJams</strong>. Em <strong>2026</strong>, integrou o
            line-up do <strong>Planeta Atlântida</strong> através do coletivo
            e assumiu residência na festa <strong>BatukBaile</strong>.
          </Notepad>
        </div>
      </section>

      {/* TIMELINE — file-explorer grid in Win95 windows */}
      <section className="shell py-16 sm:py-24 border-t border-line">
        <p className="win-eyebrow text-bubble mb-2">
          {"// linha do tempo · 2016 → hoje"}
        </p>
        <h2 className="win-h2 text-cream text-4xl sm:text-5xl leading-tight mb-10">
          10 anos construindo pista.
        </h2>

        <ol className="list-none p-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIMELINE.map((t) => (
            <YearCard key={t.year} year={t.year} body={t.body} accent={t.accent} />
          ))}
        </ol>
      </section>

      {/* CTA — Win95 dialog */}
      <section className="shell pb-24">
        <Win95Window title="booking.exe — confirmar" controls>
          <div className="p-6 sm:p-8 bg-win-face text-win-ink text-center">
            <p className="win-eyebrow mb-3">
              {"// quer levar a Cremosa pra sua pista?"}
            </p>
            <p className="win-body mb-6">
              Booking, imprensa, residência — responde em até 72h úteis.
            </p>
            <div className="flex justify-center">
              <Link href="/contato" className="no-underline">
                <Win95Button focused>Falar pelo contato →</Win95Button>
              </Link>
            </div>
          </div>
        </Win95Window>
      </section>
    </>
  );
}

function YearCard({
  year,
  body,
  accent = false,
}: {
  year: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <li
      className={[
        "win95-bevel-out bg-win-face p-[2px]",
        accent ? "shadow-[0_0_0_1px_var(--color-bubble)]" : "",
      ].join(" ")}
    >
      <div className="win95-bevel-deep-in bg-win-face">
        <div className="win95-title" role="presentation">
          <span className="win-title-text">{year}</span>
          <span className="win95-title-controls" aria-hidden>
            <span>─</span>
            <span>□</span>
            <span className="close">×</span>
          </span>
        </div>
        <div className="win95-bevel-deep-in bg-win-face p-4 text-win-ink">
          <p className="win-body-sm">{body}</p>
        </div>
      </div>
    </li>
  );
}