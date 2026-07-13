import type { Metadata } from "next";
import { MediaPlayer } from "@/components/sections/MediaPlayer";

import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Vídeos · ${site.brand.name}`,
  description: `Lives, aftermovies e entrevistas de ${site.brand.name}. Hospedagem no YouTube pra não pesar a página.`,
};

const PLACEHOLDERS = [
  {
    title: "DJ SETS — BatukBaile 02.26",
    time: "01:24 / 58:42",
    caption: "Residência BatukBaile · Porto Alegre",
  },
  {
    title: "DJ SETS — Rap in Cena 2024",
    time: "00:18 / 36:11",
    caption: "Rap in Cena · Porto Alegre · 2024",
  },
  {
    title: "DJ SETS — Planeta Atlântida 2026",
    time: "02:05 / 44:30",
    caption: "Planeta Atlântida · via coletivo AfroJams",
  },
];

export default function VideosPage() {
  return (
    <>
      {/* HERO — kit-page-4 DJ SETS treatment */}
      <section className="hero grain halftone scanlines">
        <div className="shell relative z-10">
          <h1 className="sr-only">Vídeos — Cremosa</h1>
          <p className="win-eyebrow text-bubble mb-6">
            <span aria-hidden>// </span>
            Início <span className="opacity-60 mx-1">›</span> Vídeos
          </p>
          <p className="mt-6 max-w-2xl win-body text-cream-dim">
            Lives, aftermovies de festival e entrevistas. Embeds do YouTube
            com poster otimizado — não pesa a página.
          </p>
        </div>
      </section>

      {/* PLAYERS GRID — vintage Media Player chrome */}
      <section className="shell py-16 sm:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLACEHOLDERS.map((p) => (
            <article key={p.title} className="flex flex-col gap-3">
              <MediaPlayer title={p.title} timecode={p.time}>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-crimson-deep via-magenta to-crimson"
                />
              </MediaPlayer>
              <p className="win-eyebrow text-cream-dim">{p.caption}</p>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <Win95Window title="media-player — propriedades" controls>
            <div className="p-5 bg-win-face text-win-ink">
              <p className="win-eyebrow mb-2">{"// vídeo"}</p>
              <p className="win-body-sm">
                Em breve: filtro por tipo (live, aftermovie, entrevista) e embed
                direto do YouTube com poster otimizado. Por enquanto os slots
                acima mostram o chrome — substituem pelo vídeo real assim que
                os links chegarem.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Win95Button focused>Abrir no YouTube ↗</Win95Button>
                <Win95Button>Copiar link</Win95Button>
                <Win95Button>Detalhes</Win95Button>
              </div>
            </div>
          </Win95Window>
        </div>
      </section>
    </>
  );
}