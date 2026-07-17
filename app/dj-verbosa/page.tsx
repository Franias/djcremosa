import type { Metadata } from "next";
import Link from "next/link";
import { Paint95TextEditor } from "@/components/sections/Paint95TextEditor";
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
          Static MS Paint 95 image as background, with an
          editable <textarea> overlaid on the white canvas
          area (the user types/edits the Strudel code right
          inside the Paint canvas). No buttons, no toolbar,
          no palette interactions — just the image + a
          text editor, exactly as the user asked. */}
      <section className="shell py-8 sm:py-12">
        <Paint95TextEditor />
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
                Em vez de mixar faixas prontas, Verbosa compõe o set com{" "}
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

          <Win95Window title="chrome — explorar.cfg" controls>
            <div className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <p className="win-body-sm max-w-2xl">
                Verbosa é Verbosa, mas a Cremosa também toca.
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

        {/* Footer CTA — keep the user inside the site if they want
            <div className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <p className="win-body-sm max-w-2xl">
                Verbosa é Verbosa, mas a Cremosa também toca.
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

        {/* Footer CTA — keep the user inside the site if they want
            to see what Verbosa paints in the physical world (the
            sets, mixes and photos over in Música + Galeria). */}
      </section>
    </>
  );
}