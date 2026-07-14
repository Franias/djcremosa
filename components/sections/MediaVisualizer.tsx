"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createBeatDetector } from "@/lib/beatDetection";

/**
 * MediaVisualizer — animated WMP-style visualizer with three modes:
 *
 *   - spectrum   : 64 vertical pixel bars (the classic Winamp/WMP look)
 *   - oscilloscope : horizontal waveform line (left→right, scrolling)
 *   - vu         : dual analog VU meters with peak hold
 *
 * **Two animation sources:**
 *
 *   1. **Real audio** (preferred): pass an `analyser: AnalyserNode` and
 *      the visualizer drives every bar / waveform / needle from actual
 *      FFT data via `requestAnimationFrame`. The playback state still
 *      comes from the `playing` prop.
 *
 *   2. **Idle CSS animation** (fallback): when no analyser is provided,
 *      bars use deterministic per-bar keyframe loops (the spectrum has a
 *      bell-curve envelope; the oscilloscope scrolls a sine mix; the VU
 *      needle sweeps). Looks great as a static visual hook, costs zero
 *      CPU.
 *
 * The visualizer mounts as a server component but the FFT loop lives in
 * a client island — see `MediaVisualizerClient` below.
 */

type Mode = "spectrum" | "oscilloscope" | "vu";

const BAR_COUNT = 64;

interface MediaVisualizerProps {
  /** Initial mode; user can switch via the radio buttons below. */
  initialMode?: Mode;
  className?: string;
  /**
   * AnalyserNode from the Web Audio API. When provided, drives every
   * visualization from real frequency data. When null, falls back to
   * the idle CSS animation.
   */
  analyser?: AnalyserNode | null;
  /**
   * Playback state — `true` when audio is actively playing, `false`
   * when paused / stopped. Affects idle-mode animation amplitude.
   */
  playing?: boolean;
}

export function MediaVisualizer({
  initialMode = "spectrum",
  className,
  analyser = null,
  playing = false,
}: MediaVisualizerProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  return (
    <div className={className}>
      {/* Visualizer canvas */}
      <div
        className="relative win95-bevel-in bg-bg aspect-video overflow-hidden"
        aria-label="Visualizador de áudio"
      >
        <MediaVisualizerClient
          analyser={analyser}
          playing={playing}
          mode={mode}
          onModeChange={setMode}
        />

        {/* CRT scanlines overlay — kit page 4 reference */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)",
          }}
        />
        {/* Slight magenta wash to merge with the WMP palette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(214,48,122,0.25) 0%, rgba(0,0,0,0.6) 90%)",
          }}
        />
      </div>

      {/* Mode switcher — sits OUTSIDE the canvas (otherwise the
          absolutely-positioned spectrum/oscilloscope/VU layers would
          overlay it). Full-width Win95 button row that mirrors the
          transport bar's Play/Stop/Carregar buttons. */}
      <ModeSwitcher current={mode} onChange={setMode} />
    </div>
  );
}

/**
 * Inner overlay that flashes magenta on each beat. Using a separate
 * component with `trigger` as the React key forces a remount on each
 * increment, so the CSS animation re-fires cleanly.
 */
function BeatFlash({ trigger }: { trigger: number }) {
  return (
    <div
      key={trigger}
      aria-hidden
      className="absolute inset-0 pointer-events-none beat-flash"
    >
      <style>{`
        .beat-flash {
          animation: beat-flash 320ms ease-out;
        }
        @keyframes beat-flash {
          0%   { background: rgba(255,111,163,0); box-shadow: inset 0 0 0 0 rgba(255,111,163,0); }
          10%  { background: rgba(255,111,163,0.30); box-shadow: inset 0 0 80px 8px rgba(255,111,163,0.55); }
          100% { background: rgba(255,111,163,0); box-shadow: inset 0 0 0 0 rgba(255,111,163,0); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── Client island ─────────────────────────── */

interface ClientProps {
  analyser: AnalyserNode | null;
  playing: boolean;
  mode: Mode;
  onModeChange: (m: Mode) => void;
}

/**
 * Picks the visualisation mode based on the *initial* mode and the
 * analyser availability. When the user has no audio loaded, we hide
 * the mode switcher (idle fallback handles itself via CSS).
 */
function MediaVisualizerClient({
  analyser,
  playing,
  mode,
  onModeChange,
}: ClientProps) {

  // Live FFT data — populated by the RAF loop below.
  const [freq, setFreq] = useState<Float32Array>(() => new Float32Array(64));
  const [time, setTime] = useState<Float32Array>(() => new Float32Array(64));
  const [bpm, setBpm] = useState<number>(NaN);
  const [beatFlash, setBeatFlash] = useState(0);
  const rafRef = useRef<number>(0);
  const lastBeatFlashRef = useRef(0);

  useEffect(() => {
    if (!analyser) return;

    // Buffers allocated once per analyser.
    const freqBuf = new Uint8Array(analyser.frequencyBinCount);
    const timeBuf = new Uint8Array(analyser.fftSize);

    // Beat detector — spectral flux over the same bins we're drawing.
    const detector = createBeatDetector({
      threshold: 1.45,
      cooldownMs: 200,
      onBeat: () => {
        // Throttle the on-screen flash so visual kicks don't double-fire.
        const now = performance.now();
        if (now - lastBeatFlashRef.current < 120) return;
        lastBeatFlashRef.current = now;
        setBeatFlash((n) => n + 1);
      },
      onBpmChange: (next) => setBpm(next),
    });

    const tick = () => {
      // Read frequency data first (beat detector needs it pristine).
      analyser.getByteFrequencyData(freqBuf);

      // Down-sample for the visualisation.
      const out = new Float32Array(BAR_COUNT);
      const step = freqBuf.length / BAR_COUNT;
      for (let i = 0; i < BAR_COUNT; i++) {
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);
        let sum = 0;
        for (let j = start; j < end; j++) sum += freqBuf[j];
        out[i] = sum / (end - start) / 255; // 0..1
      }
      setFreq(out);

      // Time-domain data for the oscilloscope.
      analyser.getByteTimeDomainData(timeBuf);
      const tOut = new Float32Array(64);
      const tStep = timeBuf.length / 64;
      for (let i = 0; i < 64; i++) {
        const v = timeBuf[Math.floor(i * tStep)] / 128 - 1; // -1..1
        tOut[i] = v;
      }
      setTime(tOut);

      // Beat detector — uses raw frequency buffer for spectral flux.
      detector.push(freqBuf);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      detector.reset();
    };
  }, [analyser]);

  return (
    <>
      {mode === "spectrum" &&
        (analyser ? (
          <SpectrumBarsRealtime freq={freq} />
        ) : (
          <SpectrumBarsIdle playing={playing} />
        ))}
      {mode === "oscilloscope" &&
        (analyser ? (
          <OscilloscopeRealtime time={time} />
        ) : (
          <OscilloscopeIdle playing={playing} />
        ))}
      {mode === "vu" &&
        (analyser ? (
          <VuMetersRealtime freq={freq} />
        ) : (
          <VuMetersIdle playing={playing} />
        ))}

      {/* Mode switcher lives outside the canvas — see MediaVisualizer. */}

      {/* BPM readout — appears once enough beats have fired. */}
      {analyser && (
        <div className="absolute top-2 right-3 z-10 win95-bevel-in bg-win-face text-win-ink px-2 py-0.5 win-eyebrow-sm tabular-nums">
          {Number.isFinite(bpm) ? `${Math.round(bpm)} BPM` : "-- BPM"}
        </div>
      )}

      {/* Beat flash — fires on every detected beat. */}
      <BeatFlash trigger={beatFlash} />
    </>
  );
}

/* ─────────────────────────── Mode switcher ─────────────────────────── */

const MODE_BUTTONS: ReadonlyArray<{ value: Mode; label: string; aria: string }> = [
  { value: "spectrum", label: "Spectrum", aria: "Modo spectrum — barras" },
  { value: "oscilloscope", label: "Scope", aria: "Modo osciloscópio" },
  { value: "vu", label: "VU", aria: "Modo medidores VU" },
];

function ModeSwitcher({
  current,
  onChange,
}: {
  current: Mode;
  onChange: (m: Mode) => void;
}) {
  // The switcher is rendered as a real Win95 button group rather than
  // a set of tiny 16×16 radio cells so the click target matches the
  // rest of the player chrome (Play / Stop / Carregar MP3…). The
  // active option flips to the pressed Win95 look so the selection
  // stays obvious at a glance, and the row gets its own keyboard
  // semantics (`role="radiogroup"`) for screen readers.
  return (
    <div
      role="radiogroup"
      aria-label="Modo do visualizador"
      className="mt-3 flex flex-wrap items-center justify-center gap-2"
    >
      {MODE_BUTTONS.map(({ value, label, aria }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={aria}
            data-active={active ? "true" : undefined}
            onClick={() => onChange(value)}
            className="win95-button min-w-[96px]"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Spectrum — realtime ─────────────────────────── */

function SpectrumBarsRealtime({ freq }: { freq: Float32Array }) {
  return (
    <div
      className="absolute inset-0 grid items-end gap-px px-2 py-3"
      style={{ gridTemplateColumns: `repeat(${BAR_COUNT}, minmax(0, 1fr))` }}
      aria-hidden
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const h = Math.max(0.04, freq[i] ?? 0);
        return (
          <div
            key={i}
            style={{
              height: `${h * 100}%`,
              background:
                "linear-gradient(180deg, var(--color-bubble-hi) 0%, var(--color-bubble) 35%, var(--color-magenta) 70%, var(--color-crimson-deep) 100%)",
              boxShadow: "0 0 4px rgba(255, 111, 163, 0.6)",
              width: "100%",
              transition: "height 60ms linear",
              imageRendering: "pixelated",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Spectrum — idle (CSS fallback) ─────────────────────────── */

function SpectrumBarsIdle({ playing }: { playing?: boolean }) {
  const bars = useMemo(() => {
    const out: { height: number; delay: number; duration: number }[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      const t = i / (BAR_COUNT - 1);
      const bell = Math.exp(-Math.pow((t - 0.15) / 0.35, 2));
      const baseHeight = 0.18 + 0.82 * bell;
      const jitter = 0.85 + 0.3 * Math.sin(i * 1.91);
      out.push({
        height: baseHeight * jitter,
        delay: (i * 38) % 1200,
        duration: playing ? 600 + ((i * 53) % 700) : 800 + ((i * 53) % 700),
      });
    }
    return out;
  }, [playing]);

  return (
    <div
      className="absolute inset-0 grid items-end gap-px px-2 py-3"
      style={{ gridTemplateColumns: `repeat(${BAR_COUNT}, minmax(0, 1fr))` }}
      aria-hidden
    >
      {bars.map((b, i) => (
        <div
          key={i}
          className="viz-bar"
          style={
            {
              "--target-h": `${Math.max(0.06, b.height) * 100}%`,
              animationDelay: `${b.delay}ms`,
              animationDuration: `${b.duration}ms`,
            } as React.CSSProperties
          }
        />
      ))}
      <style>{`
        .viz-bar {
          width: 100%;
          height: var(--target-h, 20%);
          background: linear-gradient(180deg, var(--color-bubble-hi) 0%, var(--color-bubble) 35%, var(--color-magenta) 70%, var(--color-crimson-deep) 100%);
          box-shadow: 0 0 4px rgba(255, 111, 163, 0.4);
          animation: viz-bounce 1000ms ease-in-out infinite alternate;
          image-rendering: pixelated;
        }
        @keyframes viz-bounce {
          0%   { height: 8%; }
          100% { height: var(--target-h, 100%); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────── Oscilloscope — realtime ─────────────────────────── */

function OscilloscopeRealtime({ time }: { time: Float32Array }) {
  // Build a smooth path through the latest time-domain samples.
  const W = 800;
  const H = 200;
  const pts: string[] = [];
  for (let i = 0; i < time.length; i++) {
    const x = (i / (time.length - 1)) * W;
    const y = H / 2 - (time[i] ?? 0) * (H * 0.42);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="scope-grad-rt" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff6fa3" />
          <stop offset="50%" stopColor="#d6307a" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="url(#scope-grad-rt)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(255,111,163,0.7))" }}
      />
      <line
        x1="0"
        y1={H / 2}
        x2={W}
        y2={H / 2}
        stroke="rgba(255,111,163,0.18)"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

/**
 * Idle oscilloscope — scrolling waveform line (left→right), driven
 * by a sine mix. Used when no audio is loaded.
 */

/* ─────────────────────────── Oscilloscope — idle ─────────────────────────── */

function OscilloscopeIdle({ playing }: { playing?: boolean }) {
  const W = 800;
  const H = 200;
  const SAMPLES = 64;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="scope-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff6fa3" />
          <stop offset="50%" stopColor="#d6307a" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
      <g className="scope-scroll">
        <IdleWavePath samples={SAMPLES} width={W * 2} height={H} />
      </g>
      <line
        x1="0"
        y1={H / 2}
        x2={W}
        y2={H / 2}
        stroke="rgba(255,111,163,0.18)"
        strokeDasharray="4 4"
      />
      <style>{`
        .scope-scroll {
          animation: scope-scroll ${playing ? "1.8s" : "4.5s"} linear infinite;
          transform-origin: center;
        }
        @keyframes scope-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${W}px); }
        }
      `}</style>
    </svg>
  );
}

function IdleWavePath({
  samples,
  width,
  height,
}: {
  samples: number;
  width: number;
  height: number;
}) {
  const cy = height / 2;
  const step = width / samples;
  const pts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = i * step;
    const y =
      cy +
      Math.sin((i / samples) * Math.PI * 6) * 30 +
      Math.sin((i / samples) * Math.PI * 14 + 1) * 18 +
      Math.cos((i / samples) * Math.PI * 31) * 8;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <polyline
      points={pts.join(" ")}
      fill="none"
      stroke="url(#scope-grad)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0 0 4px rgba(255,111,163,0.6))" }}
    />
  );
}

/* ─────────────────────────── VU — realtime ─────────────────────────── */

/**
 * Dual analog VU meters driven by the lowest frequency bins (bass
 * is what makes a VU meter feel "alive").
 */
function VuMetersRealtime({ freq }: { freq: Float32Array }) {
  // Bass = first ~12% of bins. Average L and R using first and second
  // half (mono source so both are the same, but the API matches stereo).
  const bassCount = Math.max(2, Math.floor(freq.length * 0.12));
  let sumL = 0;
  for (let i = 0; i < bassCount; i++) sumL += freq[i] ?? 0;
  const lvl = Math.min(1, sumL / bassCount);
  return (
    <div className="absolute inset-0 flex items-stretch gap-3 p-3 sm:p-4" aria-hidden>
      <VuChannel level={lvl} label="L" />
      <VuChannel level={lvl} label="R" />
    </div>
  );
}

function VuMetersIdle({ playing }: { playing?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-stretch gap-3 p-3 sm:p-4" aria-hidden>
      <IdleVuChannel label="L" playing={playing} />
      <IdleVuChannel label="R" playing={playing} />
    </div>
  );
}

function VuChannel({ level, label }: { level: number; label: string }) {
  // Map 0..1 → -55deg..+55deg
  const angle = -55 + level * 110;
  return (
    <div className="flex-1 relative win95-bevel-out bg-[#1a0a10] win95-bevel-in">
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          background:
            "linear-gradient(180deg, #c8152e 0%, #c8152e 18%, #ffcc66 22%, #7eea9a 35%, #7eea9a 90%)",
        }}
      />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {Array.from({ length: 11 }).map((_, i) => {
          const v = -60 + i * 6;
          const y = 100 - (i / 10) * 95;
          return (
            <g key={i}>
              <line
                x1={50}
                y1={y}
                x2={i % 2 === 0 ? 42 : 46}
                y2={y}
                stroke="#000"
                strokeWidth="1"
              />
              {i % 2 === 0 && (
                <text x={40} y={y + 2} fontSize="6" textAnchor="end" fill="#000">
                  {v}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div
        className="vu-needle"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          width: "2px",
          height: "85%",
          background: "linear-gradient(180deg, #ffe5ee 0%, #ff6fa3 100%)",
          transformOrigin: "bottom center",
          transform: `rotate(${angle}deg)`,
          transition: "transform 60ms linear",
          filter: "drop-shadow(0 0 3px rgba(255,111,163,0.8))",
        }}
      />
      <div
        className="absolute left-1/2 bottom-[5%] w-3 h-3 rounded-full bg-win-face win95-bevel-out"
        style={{ transform: "translate(-50%, 50%)" }}
      />
      <span className="absolute top-1 left-2 win-eyebrow-sm text-black">
        {label}
      </span>
      <span className="absolute top-1 right-2 win-eyebrow-sm text-black text-[9px]">
        dB
      </span>
    </div>
  );
}

function IdleVuChannel({ label, playing }: { label: string; playing?: boolean }) {
  return (
    <div className="flex-1 relative win95-bevel-out bg-[#1a0a10] win95-bevel-in">
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          background:
            "linear-gradient(180deg, #c8152e 0%, #c8152e 18%, #ffcc66 22%, #7eea9a 35%, #7eea9a 90%)",
        }}
      />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {Array.from({ length: 11 }).map((_, i) => {
          const v = -60 + i * 6;
          const y = 100 - (i / 10) * 95;
          return (
            <g key={i}>
              <line
                x1={50}
                y1={y}
                x2={i % 2 === 0 ? 42 : 46}
                y2={y}
                stroke="#000"
                strokeWidth="1"
              />
              {i % 2 === 0 && (
                <text x={40} y={y + 2} fontSize="6" textAnchor="end" fill="#000">
                  {v}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div
        className="vu-needle"
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          width: "2px",
          height: "85%",
          background: "linear-gradient(180deg, #ffe5ee 0%, #ff6fa3 100%)",
          transformOrigin: "bottom center",
          filter: "drop-shadow(0 0 3px rgba(255,111,163,0.8))",
          animation: `vu-sweep ${playing ? "2.1s" : "3.2s"} ease-in-out infinite`,
        }}
      />
      <div
        className="absolute left-1/2 bottom-[5%] w-3 h-3 rounded-full bg-win-face win95-bevel-out"
        style={{ transform: "translate(-50%, 50%)" }}
      />
      <span className="absolute top-1 left-2 win-eyebrow-sm text-black">
        {label}
      </span>
      <span className="absolute top-1 right-2 win-eyebrow-sm text-black text-[9px]">
        dB
      </span>
      <style>{`
        @keyframes vu-sweep {
          0%   { transform: rotate(-55deg); }
          18%  { transform: rotate(48deg); }
          32%  { transform: rotate(-30deg); }
          48%  { transform: rotate(55deg); }
          65%  { transform: rotate(10deg); }
          82%  { transform: rotate(-45deg); }
          100% { transform: rotate(-55deg); }
        }
      `}</style>
    </div>
  );
}