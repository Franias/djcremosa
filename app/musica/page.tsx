"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { MediaVisualizer } from "@/components/sections/MediaVisualizer";
import {
  Win95Button,
  Win95Window,
} from "@/components/ui/win95";
import {
  buildRigFromFile,
  buildRigFromUrl,
  disposeAudio,
  resumeAudio,
  type AudioRig,
} from "@/lib/audio";
import { tracks, type SoundCloudTrack } from "@/content/soundcloud";

type AnyRig = AudioRig;

interface NowPlaying {
  title: string;
  slug: string;
  source: "library" | "upload";
}

export default function MusicaPage() {
  const [rig, setRig] = useState<AnyRig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0); // seconds
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const autoLoaded = useRef(false);
  // Auto-play on first user interaction with the page (click / keydown /
  // touchstart). Counts as the gesture browsers require for audio.
  const autoPlayed = useRef(false);

  // Auto-load a featured track on first mount so the visualizer runs
  // on real FFT data immediately. We pick the first track in the
  // library — easy to change via DEFAULT_SLUG below.
  const DEFAULT_SLUG = tracks[0]?.slug ?? "baguncinha-frita-2";
  const defaultTrack =
    tracks.find((t) => t.slug === DEFAULT_SLUG) ?? tracks[0];

  useEffect(() => {
    if (autoLoaded.current) return;
    if (!defaultTrack) return;
    autoLoaded.current = true;
    void (async () => {
      await resumeAudio();
      const newRig = buildRigFromUrl(defaultTrack.audioSrc, defaultTrack.title);
      setRig((prev) => {
        if (prev) disposeAudio(prev);
        return newRig;
      });
      setNowPlaying({ title: defaultTrack.title, slug: defaultTrack.slug, source: "library" });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-play on first user interaction. Listens once for the first
  // pointer / keydown / touchstart, then unsubscribes. The rig must
  // exist (auto-loaded above) for this to do anything.
  useEffect(() => {
    const handler = () => {
      if (autoPlayed.current) return;
      autoPlayed.current = true;
      // Find the current audio element from state via the closure
      // — we'll reach through setRig's updater to call play on it.
      setRig((prev) => {
        if (prev) {
          prev.audio.play().catch(() => {
            /* ignore autoplay rejection */
          });
        }
        return prev;
      });
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
    };
    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    window.addEventListener("touchstart", handler, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, []);

  /* ──────────── Rig lifecycle ──────────── */

  // Dispose previous rig when a new one is set, or on unmount.
  useEffect(() => {
    return () => {
      if (rig) disposeAudio(rig);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rig]);

  // Wire up audio element events for the active rig.
  useEffect(() => {
    if (!rig) return;
    const audio = rig.audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onLoaded = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [rig]);

  /* ──────────── Player controls ──────────── */

  const loadFromUrl = useCallback(async (src: string, title: string, slug: string) => {
    await resumeAudio();
    const newRig = buildRigFromUrl(src, title);
    setRig((prev) => {
      if (prev) disposeAudio(prev);
      return newRig;
    });
    setNowPlaying({ title, slug, source: "library" });
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);
    // Autoplay after the audio element has loaded enough data.
    newRig.audio.addEventListener(
      "canplay",
      () => {
        newRig.audio.play().catch(() => {
          /* ignore — user can hit play manually */
        });
      },
      { once: true },
    );
  }, []);

  const loadFromFile = useCallback(async (file: File) => {
    await resumeAudio();
    const newRig = buildRigFromFile(file);
    setRig((prev) => {
      if (prev) disposeAudio(prev);
      return newRig;
    });
    setNowPlaying({ title: file.name, slug: file.name, source: "upload" });
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);
    newRig.audio.addEventListener(
      "canplay",
      () => {
        newRig.audio.play().catch(() => {
          /* ignore */
        });
      },
      { once: true },
    );
  }, []);

  const togglePlay = useCallback(async () => {
    if (!rig) return;
    await resumeAudio();
    if (isPlaying) {
      rig.audio.pause();
    } else {
      rig.audio.play().catch(() => {
        /* ignore */
      });
    }
  }, [rig, isPlaying]);

  const seek = useCallback(
    (fraction: number) => {
      if (!rig || !duration) return;
      const t = Math.max(0, Math.min(1, fraction)) * duration;
      // eslint-disable-next-line react-hooks/immutability
      rig.audio.currentTime = t;
      setProgress(fraction);
    },
    [rig, duration],
  );

  const stop = useCallback(() => {
    if (!rig) return;
    // Mutating HTMLMediaElement properties is the correct API; the
    // "immutability" rule flags any state-derived mutation but here
    // it's the only way to drive the audio element.
    rig.audio.pause();
    // eslint-disable-next-line react-hooks/immutability
    rig.audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [rig]);

  /* ──────────── Drag & drop ──────────── */

  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        dragCounter.current += 1;
        setDragActive(true);
      }
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setDragActive(false);
      }
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith("audio/")) {
        loadFromFile(file);
      }
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [loadFromFile]);

  return (
    <>
      {/* HERO */}
      <section className="hero grain halftone">
        <div className="shell relative z-10">
          <h1 className="sr-only">Música — Cremosa</h1>
          <p className="win-eyebrow text-bubble mb-6">
            <span aria-hidden>{"//"}</span>
            Início <span className="opacity-60 mx-1">›</span> Música
          </p>
          <p className="mt-6 max-w-2xl win-body text-cream-dim">
            {tracks.length} sets no arquivo. Clica numa faixa abaixo ou arrasta
            qualquer MP3 aqui — o visualizador pulsa com a música em tempo real
            via Web Audio API.
          </p>
        </div>
      </section>

      {/* PLAYER + VISUALIZER */}
      <section className="shell py-10 sm:py-14">
        <Win95Window
          title="cremosa — visualizador.exe"
          controls
          titleExtras={
            <span className="win-eyebrow-sm opacity-80">
              {nowPlaying
                ? `${isPlaying ? "▶ playing" : "❚❚ paused"} · ${nowPlaying.title}`
                : "❚❚ idle · drop an mp3"}
            </span>
          }
        >
          <div className="bg-win-face p-3 sm:p-4">
            {/* Drop-zone overlay */}
            {dragActive && (
              <div
                aria-hidden
                className="absolute inset-3 z-20 grid place-items-center win95-bevel-in border-2 border-dashed border-bubble bg-win-face/90 backdrop-blur-sm pointer-events-none"
                style={{ borderColor: "var(--color-bubble)" }}
              >
                <div className="text-center px-6">
                  <p className="win-eyebrow text-bubble mb-1 text-[18px]">
                    drop to load
                  </p>
                  <p className="win-body-sm text-win-ink">
                    arquivos .mp3 / .wav / .ogg / .m4a
                  </p>
                </div>
              </div>
            )}

            <MediaVisualizer
              analyser={rig?.analyser ?? null}
              playing={isPlaying}
              initialMode="spectrum"
            />

            {/* Transport row */}
            <div className="mt-3 win95-bevel-in bg-bg p-3 sm:p-4">
              {/* Now playing + scrubber */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={[
                    "win-display text-[20px] leading-none shrink-0",
                    isPlaying ? "text-bubble animate-pulse" : "text-win-shadow-deep",
                  ].join(" ")}
                >
                  {isPlaying ? "▶" : "❚❚"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="win-body-sm text-cream truncate">
                    {nowPlaying
                      ? nowPlaying.title
                      : "nenhuma faixa carregada — escolha abaixo ou arraste um MP3"}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="win-eyebrow-sm text-cream-dim tabular-nums">
                      {fmt(currentTime)}
                    </span>
                    {/* Scrubber */}
                    <div
                      className="flex-1 win95-bevel-in bg-win-face h-3 cursor-pointer relative"
                      role="slider"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress * 100)}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        seek((e.clientX - rect.left) / rect.width);
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-bubble"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <span className="win-eyebrow-sm text-cream-dim tabular-nums">
                      {fmt(duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transport buttons */}
              <div className="flex flex-wrap gap-1.5">
                <Win95Button
                  focused={!rig || !isPlaying}
                  onClick={togglePlay}
                  disabled={!rig}
                >
                  {isPlaying ? "❚❚ Pause" : "▶ Play"}
                </Win95Button>
                <Win95Button onClick={stop} disabled={!rig}>
                  ⏹ Stop
                </Win95Button>
                <span className="grow" />
                <Win95Button onClick={() => fileInputRef.current?.click()}>
                  📁 Carregar MP3…
                </Win95Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) loadFromFile(file);
                  }}
                />
              </div>
            </div>
          </div>
        </Win95Window>
      </section>

      {/* PLAYLIST — Win95 list view below the visualizer */}
      <section className="shell py-10 sm:py-14 border-t border-line">
        <p className="win-eyebrow text-bubble mb-4">
          {"// clica pra tocar"}
        </p>

        <Playlist
          tracks={tracks}
          currentSlug={nowPlaying?.slug ?? null}
          isPlaying={isPlaying}
          onPlay={(t) => loadFromUrl(t.audioSrc, t.title, t.slug)}
        />
      </section>

      {/* FOOTER NOTE — how it works */}
      <section className="shell pb-24">
        <Win95Window title="about — visualizador" controls>
          <div className="p-5 bg-win-face text-win-ink">
            <p className="win-eyebrow mb-3 text-win-shadow-deep">
              {"// como funciona"}
            </p>
            <p className="win-body-sm">
              O visualizador lê dados FFT reais via Web Audio API. Cada frame
              (60fps), um AnalyserNode captura 128 bins de frequência do áudio
              carregado e alimenta as barras em tempo real. O mesmo array
              também dirige o osciloscópio (dados time-domain) e os medidores
              VU (média dos bins graves).
            </p>
            <p className="win-body-sm mt-3">
              Arrasta qualquer MP3 aqui pra tocar — o arquivo carrega
              direto do disco e alimenta o AnalyserNode em tempo real.
            </p>
          </div>
        </Win95Window>
      </section>
    </>
  );
}

/** Format seconds as MM:SS for the transport display. */
function fmt(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/* ─────────────────────────── Playlist ─────────────────────────── */

/**
 * Playlist — Win95 list-view player. Renders the catalogue as a dense
 * table with columns: #, status, title, genre, duration. Currently
 * playing row gets a magenta accent + "▶" indicator + brighter text.
 * Click any row to load + play that track.
 *
 * Sits below the visualizer on /musica. Designed to read like a
 * classic Winamp playlist window.
 */
interface PlaylistProps {
  tracks: SoundCloudTrack[];
  currentSlug: string | null;
  isPlaying: boolean;
  onPlay: (track: SoundCloudTrack) => void;
}

function Playlist({ tracks, currentSlug, isPlaying, onPlay }: PlaylistProps) {
  const totalSec = tracks.reduce(
    (acc, t) => acc + (t.durationSec ?? 0),
    0,
  );

  return (
    <div className="win95-bevel-out bg-win-face p-[2px]">
      <div className="win95-bevel-deep-in bg-win-face">
        {/* Title bar */}
        <div className="win95-title" role="presentation">
          <span className="win-title-text">
            playlist.txt — {tracks.length} faixas · {fmt(totalSec)} total
          </span>
          <span className="win95-title-controls" aria-hidden>
            <span>─</span>
            <span>□</span>
            <span className="close">×</span>
          </span>
        </div>

        {/* Column headers */}
        <div
          className="grid items-center gap-2 px-3 py-1.5 bg-[#d4d0c8] border-b border-win-shadow-deep/40 win-eyebrow text-win-shadow-deep"
          style={{ gridTemplateColumns: "32px 24px 1fr 80px 56px" }}
        >
          <span className="text-right">#</span>
          <span />
          <span>Título</span>
          <span>Gênero</span>
          <span className="text-right tabular-nums">Dur.</span>
        </div>

        {/* Track rows */}
        <ol className="list-none p-0 m-0">
          {tracks.map((t, i) => {
            const active = t.slug === currentSlug;
            return (
              <li key={t.slug}>
                <button
                  type="button"
                  onClick={() => onPlay(t)}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "w-full text-left grid items-center gap-2 px-3 py-1.5",
                    "win-body-sm tabular-nums transition-colors",
                    active
                      ? "bg-magenta text-cream"
                      : "bg-win-face text-win-ink hover:bg-[#dde9f5]",
                  ].join(" ")}
                  style={{ gridTemplateColumns: "32px 24px 1fr 80px 56px" }}
                >
                  <span className="text-right opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={[
                      "text-center",
                      active
                        ? "text-cream animate-pulse"
                        : "text-bubble opacity-0 group-hover:opacity-100",
                    ].join(" ")}
                    aria-hidden
                  >
                    {active ? (isPlaying ? "▶" : "❚❚") : "▶"}
                  </span>
                  <span className="truncate lowercase">
                    {t.title}
                  </span>
                  <span className="win-caption text-win-shadow-deep truncate">
                    {t.context}
                  </span>
                  <span
                    className={[
                      "text-right tabular-nums",
                      active ? "text-cream" : "text-win-shadow-deep",
                    ].join(" ")}
                  >
                    {fmt(t.durationSec ?? 0)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Footer status */}
        <div className="win95-statusbar mt-1">
          <span className="win95-statusbar-segment grow">
            {tracks.length} tracks · {fmt(totalSec)} · soundcloud
          </span>
          <span className="win95-statusbar-segment shrink">
            {currentSlug
              ? isPlaying
                ? "▶ playing"
                : "❚❚ paused"
              : "idle"}
          </span>
        </div>
      </div>
    </div>
  );
}