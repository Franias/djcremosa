"use client";

import { useState } from "react";
import { Win95Window, Win95Button } from "@/components/ui/win95";
import { youtubeEmbedUrl, type YouTubeVideo } from "@/content/youtube";

/**
 * YouTubePlayer — renders a YouTube embed inside a Win95 window
 * chrome. Uses the lite-embed pattern: shows the video thumbnail
 * with a big ▶ play button until the user clicks. Once clicked,
 * we mount the actual iframe. This avoids loading 8 iframes at once
 * (which would slow the page and drain battery) and keeps the
 * initial paint fast.
 *
 * On click of the play button: setPlaying(true) and the iframe
 * loads with autoplay=1. The thumbnail is unmounted.
 */

interface YouTubePlayerProps {
  video: YouTubeVideo;
  /** Optional override of the window title. */
  title?: string;
}

export function YouTubePlayer({ video, title }: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const winTitle = title ?? `youtube.exe — ${truncate(video.title, 40)}`;

  return (
    <Win95Window title={winTitle} controls closeable>
      <div className="bg-bg p-1">
        {/* 16:9 aspect-ratio container so the thumbnail / iframe
            sizes consistently. */}
        <div className="relative aspect-video bg-black win95-bevel-deep-in overflow-hidden">
          {playing ? (
            <iframe
              src={`${youtubeEmbedUrl(video.id)}&autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Reproduzir ${video.title}`}
              className="absolute inset-0 group block cursor-pointer"
            >
              {/* Thumbnail — YouTube's own hqdefault.jpg, hosted
                  on ytimg so it bypasses our bundle. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              {/* Magenta tint on hover — same treatment as the kit's
                  editorial photo treatment. */}
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
            </button>
          )}
        </div>

        {/* Caption / action row */}
        <div className="mt-2 win95-bevel-out bg-win-face px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          <p className="win-body-sm text-win-ink leading-snug flex-1 min-w-0 truncate">
            {video.title}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
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

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}