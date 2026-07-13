import type { Metadata } from "next";
import { YouTubePlayer } from "@/components/sections/YouTubePlayer";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import {
  youtubeChannel,
  youtubeVideos,
} from "@/content/youtube";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Vídeos · ${site.brand.name}`,
  description: `Vídeos, lives e sets filmados de ${site.brand.name}. YouTube: ${youtubeChannel.handle}.`,
};

// Top three featured videos — show full-size embeds in a hero grid.
const FEATURED_IDS = ["2o0d2s5WBuA", "EEaDRLWC3Ds", "LxOZZ7YF6e8"];
const FEATURED = FEATURED_IDS.map(
  (id) => youtubeVideos.find((v) => v.id === id)!,
);

export default function VideosPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden grain halftone">
        <div className="shell relative z-10">
          <p className="win-eyebrow text-bubble mb-4">
            {"// lives · sets filmados · entrevistas"}
          </p>
          <div className="relative inline-block">
            <h1 className="win-display bubble-strong text-[18vw] sm:text-[10rem] leading-[0.85]">
              VÍDEOS
            </h1>
          </div>

          {/* Channel header card — banner + avatar + subscribe CTA. */}
          <div className="mt-10 win95-bevel-out bg-win-face p-[2px] max-w-3xl">
            <div className="win95-bevel-deep-in bg-win-face">
              {/* Banner strip — YouTube's 2120×??? banner, displayed
                  in 16:5 ratio. Glow dropshadow for the magenta vibe. */}
              <div className="relative aspect-[16/5] overflow-hidden bg-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeChannel.banner}
                  alt={`${youtubeChannel.handle} channel banner`}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    filter:
                      "saturate(0.85) contrast(1.05) drop-shadow(0 0 12px rgba(214,48,122,0.25))",
                  }}
                />
                {/* CRT scanlines overlay — same as the visualizer */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(0,0,0,0.30) 0px, rgba(0,0,0,0.30) 1px, transparent 1px, transparent 3px)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
              {/* Avatar + meta + subscribe row */}
              <div className="flex flex-wrap items-center gap-4 px-4 sm:px-5 py-4 bg-win-face">
                <div className="win95-bevel-out bg-win-face p-[3px] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={youtubeChannel.avatar}
                    alt={`${youtubeChannel.handle} avatar`}
                    width={88}
                    height={88}
                    loading="eager"
                    decoding="async"
                    className="block w-[88px] h-[88px] object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="win-title-text text-win-ink">CREMOSA</p>
                  <p className="win-eyebrow text-win-shadow-deep mt-0.5">
                    {youtubeChannel.handle}
                  </p>
                  <p className="win-caption text-win-shadow-deep mt-2">
                    {youtubeVideos.length} vídeos · canal ativo
                  </p>
                </div>
                <a
                  href={youtubeChannel.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline shrink-0"
                >
                  <Win95Button focused>
                    <span style={{ color: "var(--color-cream)" }}>★ Subscribe</span>
                  </Win95Button>
                </a>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-2xl win-body text-cream-dim">
            {youtubeVideos.length} sets filmados. Clica em qualquer thumbnail
            pra tocar dentro do player — ou abre direto no YouTube.
          </p>
        </div>
      </section>

      {/* FEATURED — 3 large YouTube embeds in a Win95 window */}
      <section className="shell py-10 sm:py-14">
        <header className="mb-6 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="win-eyebrow text-bubble mb-2">{"// em destaque"}</p>
            <h2 className="win-h2 text-cream text-3xl sm:text-4xl">
              Mais recentes
            </h2>
          </div>
          <a
            href={youtubeChannel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Win95Button>ver canal completo ↗</Win95Button>
          </a>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {FEATURED.map((video, i) => (
            <div
              key={video.id}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <YouTubePlayer
                video={video}
                title={`youtube.exe — ${i === 0 ? "principal" : `set ${i + 1}`}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ARCHIVE — rest of the videos in a smaller grid */}
      <section className="shell py-10 sm:py-14 border-t border-line">
        <header className="mb-6">
          <p className="win-eyebrow text-bubble mb-2">{"// arquivo"}</p>
          <h2 className="win-h2 text-cream text-3xl sm:text-4xl">
            Todos os vídeos
          </h2>
        </header>

        <ul className="list-none p-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {youtubeVideos.map((video) => (
            <li key={video.id}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline group"
              >
                <article className="win95-bevel-out bg-win-face p-[2px] transition-shadow group-hover:shadow-[0_0_0_2px_var(--color-bubble)]">
                  <div className="win95-bevel-deep-in bg-win-face">
                    <div className="win95-title" role="presentation">
                      <span className="win-title-text truncate">
                        {`${youtubeChannel.handle} · ${video.id}`}
                      </span>
                      <span className="win95-title-controls" aria-hidden>
                        <span>─</span>
                        <span>□</span>
                        <span className="close">×</span>
                      </span>
                    </div>
                    <div className="win95-bevel-deep-in bg-win-face p-4 text-win-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        className="block w-full aspect-video object-cover mb-3"
                      />
                      <p className="win-body-sm leading-snug line-clamp-2 min-h-[2.5em]">
                        {video.title}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="win-caption text-win-shadow-deep">
                          youtube.com
                        </span>
                        <span className="win-caption text-bubble">
                          ▶ assistir
        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* FOOTER NOTE — about the channel */}
      <section className="shell pb-24">
        <Win95Window title="cremosa — youtube channel" controls>
          <div className="p-5 bg-win-face text-win-ink">
            <p className="win-eyebrow mb-2 text-win-shadow-deep">
              {"// sobre o canal"}
            </p>
            <p className="win-body-sm leading-relaxed">
              Os vídeos vivem no YouTube porque é onde a audiência já está —
              cada set fica gravado em HD, com data e link永久 compartilhável.
              Quando algum vídeo novo sair, ele aparece aqui automaticamente
              (via o canal{" "}
              <a
                href={youtubeChannel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bubble hover:underline"
              >
                {youtubeChannel.handle}
              </a>
              ).
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              <a
                href={youtubeChannel.subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Win95Button>★ Subscribe</Win95Button>
              </a>
              <a
                href={youtubeChannel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Win95Button focused>↗ abrir canal</Win95Button>
              </a>
            </div>
          </div>
        </Win95Window>
      </section>
    </>
  );
}