"use client";

/**
 * HomeAbout — stateful wrapper around the two home-page about
 * dialogs ("cremosa.txt — readme" and "cremosa — propriedades").
 *
 * - Copiar: copies the manifesto text to the clipboard.
 * - Fechar ×: dismisses the readme dialog. The site still shows
 *   the propriedades dialog next to it.
 * - OK: dismisses the propriedades dialog.
 *
 * Each dismissed dialog can be re-opened via a small "show" button
 * below the remaining dialogs (so the user never loses context).
 */

import { useState } from "react";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

/** Plain-text manifesto we copy to clipboard on the `Copiar` button. */
const MANIFESTO = `DJ Cremosa é uma artista da cena de Porto Alegre que atua desde 2016, conhecida por sets intensos que conectam diferentes vertentes da música preta global.

Sua pesquisa parte do funk brasileiro e se expande por rap, amapiano, house, pop e R&B — pistas marcadas por groove, energia e mistura de estilos.`;

export function HomeAbout() {
  const [showReadme, setShowReadme] = useState(true);
  const [showProps, setShowProps] = useState(true);
  const [justCopied, setJustCopied] = useState(false);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(MANIFESTO);
      } else {
        // Fallback: textarea + execCommand
        const ta = document.createElement("textarea");
        ta.value = MANIFESTO;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setJustCopied(true);
      window.setTimeout(() => setJustCopied(false), 1800);
    } catch {
      /* clipboard blocked — fail silently */
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {showReadme ? (
          <Win95Window title="cremosa.txt — readme" controls>
            <div className="p-5 sm:p-6 bg-win-face text-win-ink">
              <p className="win-eyebrow mb-3 text-win-shadow-deep">
                {`// ${site.brand.location} · desde ${site.brand.activeSince}`}
              </p>
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-7">
                <p className="win-body-sm">
                  DJ Cremosa é uma artista da cena de Porto Alegre que
                  atua desde 2016, conhecida por sets intensos que conectam
                  diferentes vertentes da{" "}
                  <strong>música preta global</strong>.
                </p>
                <p className="win-body-sm">
                  Sua pesquisa parte do{" "}
                  <strong>funk brasileiro</strong> e se expande por rap,
                  amapiano, house, pop e R&amp;B — pistas marcadas por
                  groove, energia e mistura de estilos.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-win-shadow-deep/40 flex justify-end gap-2 items-center">
                {justCopied && (
                  <span className="win-caption text-bubble animate-pulse">
                    ✓ copiado
                  </span>
                )}
                <Win95Button onClick={handleCopy}>
                  {justCopied ? "Copiar ✓" : "Copiar"}
                </Win95Button>
                <Win95Button
                  onClick={() => setShowReadme(false)}
                  focused
                >
                  Fechar ×
                </Win95Button>
              </div>
            </div>
          </Win95Window>
        ) : (
          <button
            type="button"
            onClick={() => setShowReadme(true)}
            className="win95-bevel-out bg-win-face p-[2px] w-full text-left"
          >
            <div className="win95-bevel-deep-in bg-win-face px-4 py-3 text-win-ink win-eyebrow hover:bg-bubble/10">
              cremosa.txt — readme <span className="opacity-60">(fechado)</span> · reabrir
            </div>
          </button>
        )}
      </div>

      {showProps ? (
        <aside>
          <Win95Window title="cremosa — propriedades" controls>
            <div className="p-4 sm:p-5 bg-win-face text-win-ink text-[12px] win-body-sm leading-relaxed">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <dt className="text-win-shadow-deep">Nome:</dt>
                <dd>{site.brand.name}</dd>
                <dt className="text-win-shadow-deep">Cidade:</dt>
                <dd>Porto Alegre, RS</dd>
                <dt className="text-win-shadow-deep">Desde:</dt>
                <dd>{site.brand.activeSince}</dd>
                <dt className="text-win-shadow-deep">Coletivo:</dt>
                <dd>AfroJams (2025→)</dd>
                <dt className="text-win-shadow-deep">Residência:</dt>
                <dd>BatukBaile (2026→)</dd>
              </dl>
              <div className="mt-4 pt-3 border-t border-win-shadow-deep/40 flex justify-end">
                <Win95Button onClick={() => setShowProps(false)} focused>
                  OK
                </Win95Button>
              </div>
            </div>
          </Win95Window>
        </aside>
      ) : (
        <aside>
          <button
            type="button"
            onClick={() => setShowProps(true)}
            className="win95-bevel-out bg-win-face p-[2px] w-full text-left"
          >
            <div className="win95-bevel-deep-in bg-win-face px-4 py-3 text-win-ink win-eyebrow hover:bg-bubble/10">
              cremosa — propriedades (fechado) · reabrir
            </div>
          </button>
        </aside>
      )}
    </div>
  );
}
