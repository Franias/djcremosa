import type { Metadata } from "next";
import Link from "next/link";
import { Paint95 } from "@/components/sections/Paint95";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

/**
 * DJ Verbosa — sister persona of Cremosa. The verbose twin: where
 * Cremosa curates with records and instincts, Verbosa paints with
 * live code.
 *
 * Standard page structure (matches the rest of the dj-cremosa
 * site): a small hero, the Paint95 section as the focal point,
 * three info cards, and a footer CTA. The reference
 * (`hawwokitty/my-portfolio`'s PaintComp.jsx, which embeds
 * jspaint.app in an iframe) drives the Paint95 chrome — wine
 * title bar, full toolbar, palette, status bar.
 *
 * Server wrapper — exports the page metadata and defers all
 * interaction (tool selection, copy, palette clicks) to the
 * Paint95 client component. Required because Next.js 16 forbids
 * exporting `metadata` from a `"use client"` file.
 */

export const metadata: Metadata = {
  title: `DJ Verbosa · ${site.brand.name}`,
  description:
    "A Verbosa é a irmã verbosa da Cremosa — live-coding com Strudel. Padrões abertos pra rodar em strudel.cc, pintados num canvas de Paint 95.",
};

export default function DjVerbosaPage() {
  return (
    <>
      {/* HERO — minimal so the Paint95 section below gets the spotlight */}
      <section className="hero grain halftone">
        <div className="shell relative z-10">
          <h1 className="sr-only">DJ Verbosa — Strudel</h1>
          <p className="win-eyebrow win-eyebrow-shadow mb-6">
            <span aria-hidden>{"//"}</span>
            Início <span className="opacity-60 mx-1">›</span> DJ Verbosa
          </p>
          <p className="mt-6 max-w-2xl win-body">
            A irmã verbosa da Cremosa — onde o set vira <em>código</em>.
            Clica em <em>copiar</em>, cola no{" "}
            <a
              href="https://strudel.cc/"
              target="_blank"
              rel="noopener noreferrer"
              className="win-eyebrow-shadow hover:text-bubble-hi underline-offset-2"
            >
              strudel.cc
            </a>{" "}
            e aperta <span className="win-eyebrow-shadow">Ctrl/⌘ + Enter</span>{" "}
            pra rodar.
          </p>
        </div>
      </section>

      {/* PAINT95 SECTION — the focal point of the page.
          Full-width within the shell, big enough to show the
          Strudel code comfortably with the full jspaint.app
          chrome around it. */}
      <section className="shell py-8 sm:py-12">
        <img
                src={`${site.basePath}/dj-verbosa/strudel-on-paint.png`}
                alt={`Strudel code for, painted in MS Paint`}
                className="grow m-0 w-full h-auto select-text block"
                style={{ imageRendering: "pixelated", objectFit: "contain", maxHeight: "420px" }}
                draggable={false}
              />
      </section>

      {/* ABOUT / HOW-TO / SHORTCUTS — three info cards like
          the other pages. The Paint95 section above is the star;
          these fill in the editorial context. */}
      <section className="shell pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <Win95Window title="verbosa.txt — readme" controls>
            <div className="p-4 sm:p-5 bg-win-face text-win-ink">
              <p className="win-eyebrow mb-2 text-win-shadow-deep">
                {"// o que é isso?"}
              </p>
              <p className="win-body-sm">
                Verbosa é a persona de <strong>live-code</strong> da Cremosa.
                Em vez de mixar faixas prontas, Verbosa escreve o set em tempo
                real com{" "}
                <a
                  href="https://strudel.cc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win-eyebrow-shadow hover:text-bubble-hi"
                >
                  Strudel
                </a>
                , um port de TidalCycles pra JavaScript que roda inteiro no
                browser.
              </p>
              <p className="win-body-sm mt-3">
                O código tá pintado no canvas em branco, em fonte monoespaçada
                preta — clica em <strong>📋 copiar código</strong> pra levar pro
                strudel.cc.
              </p>
            </div>
          </Win95Window>

          <Win95Window title="como usar — help.html" controls>
            <div className="p-4 sm:p-5 bg-win-face text-win-ink">
              <p className="win-eyebrow mb-2 text-win-shadow-deep">
                {"// passo a passo"}
              </p>
              <ol className="list-none p-0 m-0 grid gap-2 win-body-sm">
                <li className="flex items-start gap-2">
                  <span className="win-eyebrow-shadow shrink-0">1.</span>
                  <span>
                    Clica em{" "}
                    <strong className="win-eyebrow-shadow">
                      📋 copiar código
                    </strong>{" "}
                    na barra do Paint.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="win-eyebrow-shadow shrink-0">2.</span>
                  <span>
                    Abre{" "}
                    <a
                      href="https://strudel.cc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="win-eyebrow-shadow hover:text-bubble-hi"
                    >
                      strudel.cc
                    </a>{" "}
                    numa aba nova.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="win-eyebrow-shadow shrink-0">3.</span>
                  <span>
                    Apaga o código de exemplo, cola o seu e aperta{" "}
                    <strong className="win-eyebrow-shadow">Ctrl/⌘ + Enter</strong>{" "}
                    pra rodar.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="win-eyebrow-shadow shrink-0">4.</span>
                  <span>
                    Quer parar? Aperta{" "}
                    <strong className="win-eyebrow-shadow">Ctrl/⌘ + .</strong>{" "}
                    (silencia tudo).
                  </span>
                </li>
              </ol>
            </div>
          </Win95Window>

          <Win95Window title="chrome — paint-layout.cfg" controls>
            <div className="p-4 sm:p-5 bg-win-face text-win-ink">
              <p className="win-eyebrow mb-2 text-win-shadow-deep">
                {"// anatomia do Paint"}
              </p>
              <p className="win-body-sm mb-3">
                O layout segue o jspaint.app (português) — a versão
                que o repositório{" "}
                <a
                  href="https://github.com/hawwokitty/my-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win-eyebrow-shadow hover:text-bubble-hi"
                >
                  hawwokitty/my-portfolio
                </a>{" "}
                embute num modal:
              </p>
              <ul className="list-none p-0 m-0 grid gap-1 win-body-sm">
                <li>▸ Title bar vinho + min/max/close</li>
                <li>▸ Menu bar: <em>Ficheiro · Editar · Ver · Padrão · Ajuda</em></li>
                <li>▸ Barra de ação rápida (padrão + copiar + abrir)</li>
                <li>▸ Toolbar esquerda: 15 ferramentas (3 × 5)</li>
                <li>▸ Canvas branco com a fonte monoespaçada</li>
                <li>▸ Paleta de 16 cores + FG/BG</li>
                <li>▸ Barra de status com ferramenta + chars + bpm</li>
              </ul>
              <p className="win-body-sm mt-3 text-win-shadow-deep">
                Clica nas ferramentas ou nas cores — só pra sentir
                o chrome. O Strudel roda no{" "}
                <a
                  href="https://strudel.cc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="win-eyebrow-shadow hover:text-bubble-hi"
                >
                  strudel.cc
                </a>
                .
              </p>
            </div>
          </Win95Window>
        </div>

        {/* Footer CTA — keep the user inside the site if they want
            to see what Verbosa paints in the physical world (the
            sets, mixes and photos over in Música + Galeria). */}
        <div className="mt-8 sm:mt-10">
          <Win95Window title="explorar.exe — voltar pra pista" controls>
            <div className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <p className="win-body-sm max-w-2xl">
                Verbosa é Verbosa, mas a Cremosa também toca com discos.
                Confere os sets finalizados e os vídeos das pistas.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Link href="/musica/" className="no-underline">
                  <Win95Button>Música →</Win95Button>
                </Link>
                <Link href="/videos/" className="no-underline">
                  <Win95Button>Vídeos →</Win95Button>
                </Link>
              </div>
            </div>
          </Win95Window>
        </div>
      </section>
    </>
  );
}