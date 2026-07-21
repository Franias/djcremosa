"use client";

import { useState } from "react";
import { Win95Window, Win95Button } from "@/components/ui/win95";
import { youtubePlaylistEmbedUrl } from "@/content/youtube";
import type { YouTubePlaylist } from "@/content/youtube";

/**
 * YouTubePlaylistPlayer — Win95-chromed lite-embed for a YouTube
 * playlist. Mirrors `YouTubePlayer` but with `videoseries?list=…`
 * instead of a single video id so the embedded iframe plays the
 * whole list (next/prev buttons baked in).
 *
 * Lite-embed pattern: shows a thumbnail + a big ▶ button until the
 * user clicks. Once clicked, the actual iframe mounts with
 * autoplay=1. The thumbnail is unmounted.
 *
 * Renders only the embed surface. The tracklist and the "open on
 * YouTube" CTA are composed by the page so they can sit beside the
 * player in a 2-column grid.
 */
interface YouTubePlaylistPlayerProps {
  playlist: YouTubePlaylist;
  /** Override the Win95 window title. Defaults to the playlist title. */
  title?: string;
}

export function YouTubePlaylistPlayer({
  playlist,
  title,
}: YouTubePlaylistPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const winTitle = title ?? `youtube playlist.exe — ${shortTitle(playlist.title)}`;
  const coverThumbnail = `https://i.ytimg.com/vi/${playlist.coverVideoId}/mqdefault.jpg`;

  return (
    <Win95Window title={winTitle} controls closeable>
      <div className="bg-bg p-1">
        <div className="relative aspect-video bg-black win95-bevel-deep-in overflow-hidden">
          {playing ? (
            <iframe
              src={`${youtubePlaylistEmbedUrl(playlist.id)}&autoplay=1`}
              title={playlist.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Reproduzir playlist ${playlist.title}`}
              className="absolute inset-0 group block cursor-pointer"
            >
              {/* Cover thumbnail — YouTube's mqdefault.jpg (320×180)
                  matches the 16:9 of the embed so no letterboxing. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverThumbnail}
                alt={playlist.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {/* Magenta tint on hover — same treatment as YouTubePlayer. */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(214,48,122,0.4) 100%)",
                }}
              />
              {/* Play button — chunky Win95 bevel + magenta. */}
              <div className="absolute inset-0 grid place-items-center">
                <span
                  className="win95-bevel-out bg-magenta group-hover:bg-bubble transition-colors grid place-items-center"
                  style={{
                    width: 78,
                    height: 56,
                    boxShadow:
                      "0 0 0 4px rgba(0,0,0,0.55), 0 8px 32px rgba(0,0,0,0.45)",
                  }}
                  aria-hidden
                >
                  <span
                    className="block"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "14px solid transparent",
                      borderBottom: "14px solid transparent",
                      borderLeft: "22px solid var(--color-cream)",
                      marginLeft: 6,
                    }}
                  />
                </span>
              </div>
              {/* Playlist badge — top right corner. */}
              <div
                className="absolute top-3 right-3 px-2.5 py-1 win95-bevel-out text-cream win-eyebrow-sm tabular-nums"
                style={{ background: "rgba(10,6,6,0.85)" }}
              >
                {playlist.count} sets
              </div>
              {/* Channel handle — bottom left, on a dark plate for
                  contrast with bright thumbnails. */}
              <div
                className="absolute bottom-3 left-3 px-2.5 py-1 win95-bevel-out text-cream win-eyebrow-sm"
                style={{ background: "rgba(10,6,6,0.85)" }}
              >
                {playlist.channel.handle}
              </div>
            </button>
          )}
        </div>

        {/* Caption + open-on-YouTube row */}
        <div className="mt-2 win95-bevel-out bg-win-face px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          <p className="win-body-sm text-win-ink leading-snug flex-1 min-w-0 truncate">
            {playlist.title}
          </p>
          <a
            href={playlist.playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline shrink-0"
          >
            <Win95Button focused>↗ YouTube</Win95Button>
          </a>
        </div>
      </div>
    </Win95Window>
  );
}

/** Compact the playlist title for the window chrome (e.g. "AFROJAMS · TEMPORADAS — DJ Cremosa" → "AFROJAMS"). */
function shortTitle(s: string): string {
  // First segment is usually the channel/collection name before any
  // "—" or "·" separator.
  const parts = s.split(/[—·]/);
  return parts[0]?.trim() || s;
}
