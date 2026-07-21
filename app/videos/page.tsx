import type { Metadata } from "next";
import { YouTubePlayer } from "@/components/sections/YouTubePlayer";
import { YouTubePlaylistPlayer } from "@/components/sections/YouTubePlaylistPlayer";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import {
  afrJamsPlaylist,
  youtubeChannel,
  youtubeVideos,
  type YouTubePlaylist,
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
      <section className="hero grain halftone">
        <div className="shell relative z-10">
          <p className="win-eyebrow win-eyebrow-shadow mb-6">
            {"// lives · sets filmados"}
          </p>

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
        </div>
      </section>

      {/* FEATURED — 3 large YouTube embeds in a Win95 window */}
      <section className="shell py-10 sm:py-14">
        <header className="mb-6 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="win-eyebrow win-eyebrow-shadow mb-2">{"// em destaque"}</p>
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

      {/* AFROJAMS — guest playlist from the collective Cremosa co-founded.
          Playlist embed + Win95 tracklist side-by-side, then a subscribe
          CTA pointing at @AFRXJAMS. */}
      <section className="shell py-10 sm:py-14">
        <header className="mb-6 flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="win-eyebrow win-eyebrow-shadow mb-2">
              {"// temporada afrojams · dj cremosa"}
            </p>
            <h2 className="win-h2 text-win-shadow-deep">
              {afrJamsPlaylist.title}
            </h2>
            <p className="win-body-sm mt-3 max-w-2xl">
              {afrJamsPlaylist.blurb}
            </p>
          </div>
          <a
            href={afrJamsPlaylist.playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <Win95Button focused>↗ ver playlist inteira</Win95Button>
          </a>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Big playlist embed — takes 2 of 3 columns on lg+. */}
          <div className="lg:col-span-2">
            <YouTubePlaylistPlayer playlist={afrJamsPlaylist} />
          </div>

          {/* Tracklist — Win95 window, mirrors the playlist.exe look
              on /musica so the two pages rhyme. */}
          <PlayListWindow
            playlist={afrJamsPlaylist}
          />
        </div>

        {/* Channel footer — subscribe to the @AFRXJAMS channel that
            hosts this playlist. */}
        <div className="mt-6 win95-bevel-out bg-win-face p-[2px] max-w-3xl">
          <div className="win95-bevel-deep-in bg-win-face px-4 py-3 flex items-center gap-3 flex-wrap">
            {afrJamsPlaylist.channel.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={afrJamsPlaylist.channel.avatar}
                alt={`${afrJamsPlaylist.channel.handle} avatar`}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 win95-bevel-out bg-win-face-2 object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="win-body-sm text-win-ink">
                Hospedado em{" "}
                <span className="win-eyebrow-shadow text-bubble">
                  {afrJamsPlaylist.channel.handle}
                </span>
                {" · "}
                {afrJamsPlaylist.channel.name}
              </p>
              <p className="win-caption text-win-shadow-deep mt-0.5">
                canal parceiro · filma os sets ao vivo
              </p>
            </div>
            <a
              href={`${afrJamsPlaylist.channel.url}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline shrink-0"
            >
              <Win95Button>★ Subscribe</Win95Button>
            </a>
          </div>
        </div>
      </section>

      {/* ARCHIVE — rest of the videos in a smaller grid */}
      <section className="shell py-10 sm:py-14">
        <header className="mb-6">
          <p className="win-eyebrow win-eyebrow-shadow mb-2">{"// arquivo"}</p>
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
                        <span className="win-caption win-eyebrow-shadow">
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
        <Win95Window title="cremosa — youtube channel" controls closeable>
          <div className="p-5 bg-win-face text-win-ink">
            <p className="win-eyebrow mb-2 text-win-shadow-deep">
              {"// sobre o canal"}
            </p>
            <p className="win-body-sm leading-relaxed">
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

/**
 * PlayListWindow — Win95-styled tracklist for a YouTube playlist,
 * mirrors the Playlist component on /musica so the two pages rhyme.
 * Each row is an anchor that opens the video inside the playlist on
 * YouTube (so the listener keeps watching from that point).
 *
 * Uses Win95Window with `closeable` so the title-bar × collapses
 * the whole tracklist into a "fechado · reabrir" strip — same
 * pattern as HomeAbout / the rest of the site.
 */
function PlayListWindow({ playlist }: { playlist: YouTubePlaylist }) {
  const tracks = playlist.tracks;
  const title = `afrojams-temp.txt — ${tracks.length} faixas`;
  return (
    <Win95Window title={title} controls closeable>
      {/* Column headers */}
      <div
        className="grid items-center gap-2 px-3 py-1.5 bg-[#d4d0c8] border-b border-win-shadow-deep/40 win-eyebrow text-win-shadow-deep"
        style={{ gridTemplateColumns: "32px 1fr 56px" }}
      >
        <span className="text-right">#</span>
        <span>Título</span>
        <span className="text-right">↗</span>
      </div>

      {/* Track rows — each opens the video inside the playlist. */}
      <ol className="list-none p-0 m-0">
        {tracks.map((t, i) => (
          <li key={t.id}>
            <a
              href={`https://www.youtube.com/watch?v=${t.id}&list=${playlist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left grid items-center gap-2 px-3 py-1.5 win-body-sm tabular-nums transition-colors bg-win-face text-win-ink hover:bg-[#dde9f5] no-underline"
              style={{ gridTemplateColumns: "32px 1fr 56px" }}
            >
              <span className="text-right opacity-70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{t.title}</span>
              <span className="text-right win-eyebrow-shadow">▶</span>
            </a>
          </li>
        ))}
      </ol>

      {/* Status bar */}
      <div className="win95-statusbar mt-1">
        <span className="win95-statusbar-segment grow">
          {`${tracks.length} sets · ${playlist.channel.handle}`}
        </span>
        <span className="win95-statusbar-segment shrink">playlist</span>
      </div>
    </Win95Window>
  );
}