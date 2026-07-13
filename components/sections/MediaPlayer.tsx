/**
 * MediaPlayer — vintage Windows-Media-Player-styled card used on page 4
 * of the Midia Kit 2026. Wraps a video thumbnail / image with magenta
 * chrome, transport bar, and the iconic play-triangle overlay.
 *
 *   <MediaPlayer title="DJ SETS — BatukBaile 02.26">
 *     <Image src="/photos/foo.jpg" alt="..." fill />
 *   </MediaPlayer>
 */

import type { ReactNode } from "react";

interface MediaPlayerProps {
  title: string;
  /** Total runtime / timestamp shown in the transport. */
  timecode?: string;
  children: ReactNode;
}

export function MediaPlayer({
  title,
  timecode = "00:42 / 28:13",
  children,
}: MediaPlayerProps) {
  return (
    <div className="player">
      <div className="player-title">
        <span>{title}</span>
        <span className="player-controls" aria-hidden>
          <span>─</span>
          <span>□</span>
          <span style={{ background: "#ff6477", color: "#fff" }}>×</span>
        </span>
      </div>
      <div className="player-screen">
        {children}
        <div className="player-play" aria-hidden />
      </div>
      <div className="player-transport" aria-hidden>
        <span>⏮</span>
        <span>▶</span>
        <span>⏸</span>
        <span>⏭</span>
        <span className="player-transport-track" />
        <span style={{ fontSize: "12px", opacity: 0.8 }}>{timecode}</span>
      </div>
    </div>
  );
}