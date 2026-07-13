"use client";

import { useEffect, useRef } from "react";
import { widgetUrl } from "@/content/soundcloud";

/**
 * SoundCloudPlayer — embeds a SoundCloud Widget Player iframe and
 * exposes its play/pause state via a callback. Uses the official
 * Widget API (`SC.Widget`) loaded inside the iframe via the onload
 * hook — we reach it by writing a tiny loader URL into the iframe
 * via the iframe's `src` + a global window-scoped handshake.
 *
 * For real-time spectrum data the iframe is cross-origin and we
 * can't access its audio graph — but the play/pause state + track
 * metadata is enough to drive a "playing vs paused" pulse on the
 * visualizer, which is the honest path on a static export.
 *
 * Usage:
 *   <SoundCloudPlayer
 *     permalink="https://soundcloud.com/cremosinha/..."
 *     onPlayStateChange={(isPlaying) => setIsPlaying(isPlaying)}
 *   />
 */

interface SoundCloudPlayerProps {
  permalink: string;
  /** Aspect ratio of the iframe (height / width). default 1/1 (square). */
  aspect?: "square" | "tall" | "wide";
  /** Whether to use the visual (large artwork) layout. */
  visual?: boolean;
  /** Hide the "buy" / link icons. */
  hideRelated?: boolean;
  /** Notify parent of play/pause transitions. */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Notify parent of track changes (loads metadata). */
  onTrackChange?: (track: { title: string; user: string }) => void;
  /** Optional class passthrough (e.g. for Win95Window wrapping). */
  className?: string;
}

const ASPECT_CLASSES: Record<NonNullable<SoundCloudPlayerProps["aspect"]>, string> = {
  square: "aspect-square",
  tall: "aspect-[3/4]",
  wide: "aspect-[16/9]",
};

export function SoundCloudPlayer({
  permalink,
  aspect = "wide",
  visual = false,
  hideRelated = true,
  onPlayStateChange,
  onTrackChange,
  className,
}: SoundCloudPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<unknown>(null);

  // Build the iframe URL once.
  const src = widgetUrl(permalink, {
    visual,
    hideRelated,
    autoPlay: false,
  });

  // Wire up the SC.Widget when the iframe is ready. SoundCloud fires
  // a postMessage handshake once the Widget API is loaded.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data !== "string") return;
      // SoundCloud posts strings like 'widget.cbox.delegate...' etc.
      // We just listen for the ready event.
      if (e.data.indexOf("widget.iframe.read") >= 0) return;
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Poll for the SC.Widget inside the iframe (cross-origin safe via
  // iframe.contentWindow.SC). We can't get the audio buffer, but we
  // can detect state transitions.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let widget: { bind: (event: string, cb: (data: unknown) => void) => void; getCurrentSound?: (cb: (s: { title?: string; user?: { username?: string } }) => void) => void } | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    function attach() {
      // Re-read iframe ref each tick — TypeScript also needs the local
      // null check below to keep the narrow inside the closure.
      const el: HTMLIFrameElement | null = iframeRef.current;
      if (!el) {
        pollId = setTimeout(attach, 200);
        return;
      }
      const win = el.contentWindow as (Window & { SC?: { Widget: (el: HTMLIFrameElement) => unknown } }) | null;
      if (!win || !win.SC || cancelled) {
        pollId = setTimeout(attach, 200);
        return;
      }
      try {
        widget = win.SC.Widget(el) as typeof widget;
        widgetRef.current = widget;
        widget?.bind("play", () => onPlayStateChange?.(true));
        widget?.bind("pause", () => onPlayStateChange?.(false));
        widget?.bind("finish", () => onPlayStateChange?.(false));
        // Load current track metadata once available.
        widget?.getCurrentSound?.((s) => {
          if (s?.title) {
            onTrackChange?.({
              title: s.title,
              user: s.user?.username ?? "DJ CREMOSA",
            });
          }
        });
      } catch (err) {
        // Cross-origin or blocked — silent fail. Visualizer stays in
        // idle animation.
        console.warn("SoundCloudWidget attach failed:", err);
      }
    }
    attach();

    return () => {
      cancelled = true;
      if (pollId) clearTimeout(pollId);
    };
  }, [permalink, onPlayStateChange, onTrackChange]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title="SoundCloud player"
      width="100%"
      height={visual ? "450" : "166"}
      className={[ASPECT_CLASSES[aspect], className].filter(Boolean).join(" ")}
      allow="autoplay"
      loading="lazy"
      style={{
        border: 0,
        display: "block",
        ...(aspect === "wide" && !visual ? { height: 166 } : {}),
      }}
    />
  );
}