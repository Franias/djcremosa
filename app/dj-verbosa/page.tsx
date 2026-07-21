import type { Metadata } from "next";
import Link from "next/link";
import { Paint95TextEditor } from "@/components/sections/Paint95TextEditor";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

/**
 * Toolbar reference data — the 16 interactive icons in the left
 * toolbar of the static MS Paint 95 image. Displayed in a table
 * below the "properties-line-dj-verbosa" section so the user has
 * a textual guide alongside the visual interface.
 *
 * Columns:
 *   pos    — (row, column) in the 2×8 grid (matches the static
 *            image's icon positions, measured with Python+PIL)
 *   icon   — quick visual mnemonic (emojis mirror the painted
 *            icons; not a pixel-perfect representation)
 *   action — what the button does on click
 *   reset  — how the 2-click reset works (or "—" for one-shots)
 */
const TOOLBAR_REFERENCE: ReadonlyArray<{
  pos: string;
  icon: string;
  action: string;
  reset: string;
}> = [
  { pos: "R1C1", icon: "⭐", action: "Piscar o código (toggle)", reset: "clique 2" },
  {
    pos: "R1C2",
    icon: "▢",
    action: "Copiar o código pro clipboard (Ctrl+C)",
    reset: "—",
  },
  {
    pos: "R2C1",
    icon: "🧽",
    action: "Limpar o código / restaurar",
    reset: "clique 2",
  },
  {
    pos: "R2C2",
    icon: "🎨",
    action: "Modo escuro (fundo preto, letras brancas)",
    reset: "clique 2",
  },
  {
    pos: "R3C1",
    icon: "🖌",
    action: "Ciclo de cores do arco-íris (7 cores)",
    reset: "8º clique",
  },
  {
    pos: "R3C2",
    icon: "🔍",
    action: "Aumentar o zoom da fonte (×1.25, max 100px)",
    reset: "no máx.",
  },
  {
    pos: "R4C1",
    icon: "✏️",
    action: "Comentar / descomentar linha(s) com //",
    reset: "clique 2",
  },
  {
    pos: "R4C2",
    icon: "🖌",
    action: "Ciclo pelas últimas 5 cores usadas",
    reset: "—",
  },
  {
    pos: "R5C1",
    icon: "💨",
    action: "Destaque da linha ativa (toggle)",
    reset: "clique 2",
  },
  {
    pos: "R5C2",
    icon: "🅰",
    action: "Alternar texto normal ↔ negrito",
    reset: "clique 2",
  },
  {
    pos: "R6C1",
    icon: "📏",
    action: "Inserir separador // ────── no cursor",
    reset: "clique 2",
  },
  {
    pos: "R6C2",
    icon: "〰",
    action: "Envolver seleção em parênteses ()",
    reset: "—",
  },
  {
    pos: "R7C1",
    icon: "▭",
    action: "Envolver seleção em box de comentário",
    reset: "clique 2",
  },
  {
    pos: "R7C2",
    icon: "⏧",
    action: "Alternar quebra de linha (word-wrap)",
    reset: "clique 2",
  },
  {
    pos: "R8C1",
    icon: "⬭",
    action: "De-indentar (remove 2 espaços)",
    reset: "—",
  },
  {
    pos: "R8C2",
    icon: "▢",
    action: "Salvar / restaurar preset no localStorage",
    reset: "clique 2",
  },
];

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
          Wrapped in a Win95Window with the same chrome as
          the rest of the site (title bar with × close →
          reabrir strip), so it reads as a peer of the
          readme / how-to / chrome / toolbar windows below.
          The static MS Paint 95 image + editable <textarea>
          overlay sits inside, just like before — the window
          chrome doesn't change the editor behavior. */}
      <section className="shell py-8 sm:py-12">
        <Win95Window
          title="DJ Verbosa - Paint (verbosa.exe)"
          controls
          closeable
        >
          <Paint95TextEditor />
        </Win95Window>
      </section>

      {/* ABOUT / HOW-TO / SHORTCUTS — three info cards like
          the other pages. The Paint95 section above is the star;
          these fill in the editorial context. */}
      <section className="shell pb-16 sm:pb-24" id="properties-line-dj-verbosa">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <Win95Window title="verbosa.txt — readme" controls closeable>
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

          <Win95Window title="como usar — help.html" controls closeable>
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

          <Win95Window title="chrome — explorar.cfg" controls closeable>
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
      </section>

      {/* TOOLBAR REFERENCE — every icon on the left toolbar is
          clickable. This card documents all 16 positions (2 cols ×
          8 rows) so the user can find the right tool without
          guessing. Position is given as (row, col) in the original
          MS Paint 95 image. The "Reset" column tells you how the
          2-click reset works: most are simple on/off toggles; a
          few cycle or accumulate. The palette (separate strip at
          the bottom) and the magnifier (zoom) are explained in
          their own rows. */}
      <section
        className="shell pb-16 sm:pb-24"
        id="toolbar-reference-dj-verbosa"
        aria-label="Referência dos botões da barra de ferramentas do Paint 95"
      >
        <Win95Window title="toolbar.map — help.html" controls closeable>
          <div className="p-4 sm:p-5 bg-win-face text-win-ink">
            <p className="win-eyebrow mb-2 text-win-shadow-deep">
              {"// atalhos da barra do paint"}
            </p>
            <p className="win-body-sm mb-3">
              Os 16 ícones da barra esquerda (2 colunas × 8 linhas)
              são interativos. Clica em cada um pra usar. A maioria
              tem <strong>reset de 2 cliques</strong> — clica de novo
              pra desfazer. Os 5 marcados com <em>—</em> são one-shot
              (copiar, parênteses, de-indentar).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full win-body-sm border-collapse">
                <thead>
                  <tr className="text-left border-b border-win-shadow-deep/40">
                    <th className="py-1 pr-3 font-normal opacity-70">Pos.</th>
                    <th className="py-1 pr-3 font-normal opacity-70">Ícone</th>
                    <th className="py-1 pr-3 font-normal opacity-70">Ação</th>
                    <th className="py-1 font-normal opacity-70">Reset</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOLBAR_REFERENCE.map((row) => (
                    <tr
                      key={row.pos}
                      className="border-b border-win-shadow/20 last:border-b-0"
                    >
                      <td className="py-1 pr-3 font-mono opacity-80">
                        {row.pos}
                      </td>
                      <td className="py-1 pr-3 text-base">{row.icon}</td>
                      <td className="py-1 pr-3">{row.action}</td>
                      <td className="py-1 opacity-70">{row.reset}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="win-body-sm mt-3 opacity-80">
              <strong>Atalhos do teclado:</strong> <code>Tab</code> indenta
              2 espaços · <code>Shift+Tab</code> remove 2 espaços (mesmo
              que a elipse).
            </p>
          </div>
        </Win95Window>
      </section>

      {/* FOOTER CTA — keep the user inside the site if they want
          to see what Verbosa paints in the physical world (the
          sets, mixes and photos over in Música + Vídeos). */}
  
    </>
  );
}