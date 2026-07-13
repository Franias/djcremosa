/**
 * Beat detection via spectral flux — runs alongside the FFT loop on
 * /musica. Zero dependencies; integrates with our existing
 * AnalyserNode + requestAnimationFrame pipeline.
 *
 * Algorithm (the classic Bello/Roweis-style onset detector):
 *
 *   1. Each frame, grab the frequency data.
 *   2. Compute spectral flux = sum of positive changes between the
 *      current and previous frame's bins (only count increases;
 *      ignore decreases — they don't trigger beats).
 *   3. Maintain a rolling mean of recent flux values.
 *   4. Fire a beat when the current flux exceeds `mean * threshold`
 *      AND enough time has passed since the last beat (cooldown).
 *
 * The detector also produces a stable BPM estimate by averaging the
 * inter-beat intervals over the last few beats. The visualizer
 * subscribes to the `onBeat` callback for per-beat visual punch
 * (flashes, gain bumps, needle jolts) and polls `bpm` for the
 * readout display.
 *
 * Why not `web-audio-beat-detector` or Meyda?
 *   - web-audio-beat-detector analyzes a full AudioBuffer offline
 *     and returns a single BPM number — no per-beat events.
 *   - Meyda is great but adds ~50KB for one feature we can write
 *     in ~70 lines.
 *   - realtime-bpm-analyzer is real-time but BPM-only, no beat
 *     ticks for the visualizer.
 */

export interface BeatDetectorOpts {
  /** Beat fires when flux > mean * threshold. Default 1.45 (typical). */
  threshold?: number;
  /** Minimum time between beats (ms). Default 200ms (~300 BPM max). */
  cooldownMs?: number;
  /** Rolling-window length for the mean. Default 43 frames (~0.7s). */
  windowSize?: number;
  /** Called on each detected beat. */
  onBeat?: () => void;
  /** Called when BPM updates (every 4 beats by default). */
  onBpmChange?: (bpm: number) => void;
}

export interface BeatDetector {
  /** Push a new frequency frame. Returns `true` if a beat was detected. */
  push: (freq: Uint8Array) => boolean;
  /** Current BPM estimate (NaN until ~4 beats have been detected). */
  bpm: () => number;
  /** Current rolling average spectral flux value (mostly for debugging). */
  flux: () => number;
  /** Reset state — call when switching tracks. */
  reset: () => void;
}

/**
 * Build a beat detector instance. The detector holds rolling state
 * for the flux window + inter-beat intervals; one instance per audio
 * stream makes sense.
 */
export function createBeatDetector(opts: BeatDetectorOpts = {}): BeatDetector {
  const THRESHOLD = opts.threshold ?? 1.45;
  const COOLDOWN_MS = opts.cooldownMs ?? 200;
  const WINDOW = opts.windowSize ?? 43;

  // Ring buffer of recent flux values for the running mean.
  const fluxWindow: number[] = [];
  let fluxSum = 0;
  let prev: Uint8Array | null = null;

  // Beat timing state.
  let lastBeatAt = 0;
  let lastBpmAt = 0;

  // BPM tracking — list of recent inter-beat intervals in ms.
  const INTERVAL_HISTORY = 8;
  const intervals: number[] = [];

  let cachedBpm = NaN;
  let cachedFlux = 0;

  function recordFlux(flux: number): boolean {
    fluxWindow.push(flux);
    fluxSum += flux;
    if (fluxWindow.length > WINDOW) {
      fluxSum -= fluxWindow.shift()!;
    }
    cachedFlux = flux;
    return false;
  }

  function push(freq: Uint8Array): boolean {
    const now = performance.now();

    if (!prev || prev.length !== freq.length) {
      prev = new Uint8Array(freq);
      return false;
    }

    // Spectral flux — sum of positive differences between current
    // and previous frame's frequency bins. Skip DC bin (index 0) to
    // avoid low-frequency rumble triggering false beats.
    let flux = 0;
    const len = freq.length;
    for (let i = 1; i < len; i++) {
      const d = freq[i] - prev[i];
      if (d > 0) flux += d;
    }
    prev = new Uint8Array(freq);

    // Detect beat if flux exceeds the running mean by a threshold
    // and the cooldown has elapsed.
    const mean = fluxWindow.length > 0 ? fluxSum / fluxWindow.length : 0;
    const isBeat =
      fluxWindow.length >= WINDOW / 2 &&
      flux > mean * THRESHOLD &&
      now - lastBeatAt > COOLDOWN_MS;

    recordFlux(flux);

    if (isBeat) {
      const dt = lastBeatAt === 0 ? 0 : now - lastBeatAt;
      lastBeatAt = now;

      if (dt > 0) {
        intervals.push(dt);
        if (intervals.length > INTERVAL_HISTORY) intervals.shift();

        // Update BPM every 4 beats using the average interval.
        if (intervals.length >= 4 && now - lastBpmAt > 1000) {
          const avg =
            intervals.reduce((a, b) => a + b, 0) / intervals.length;
          const newBpm = Math.round(60_000 / avg);
          // Reject absurd values (>200 BPM is almost always a
          // doubletime detection or a misfire).
          if (newBpm > 60 && newBpm < 200) {
            cachedBpm = newBpm;
            opts.onBpmChange?.(newBpm);
            lastBpmAt = now;
          }
        }
      }

      opts.onBeat?.();
      return true;
    }

    return false;
  }

  function reset(): void {
    prev = null;
    fluxWindow.length = 0;
    fluxSum = 0;
    intervals.length = 0;
    lastBeatAt = 0;
    lastBpmAt = 0;
    cachedBpm = NaN;
    cachedFlux = 0;
  }

  return {
    push,
    bpm: () => cachedBpm,
    flux: () => cachedFlux,
    reset,
  };
}

/**
 * Confidence-bounded beat detection helper — returns a normalised
 * 0..1 strength for how strong a beat feels on this frame. Useful
 * for scaling visual effects (bar gain, needle wiggle, etc.).
 */
export function beatStrength(
  flux: number,
  meanFlux: number,
  threshold = 1.45,
): number {
  if (meanFlux <= 0) return 0;
  const ratio = flux / meanFlux;
  if (ratio < threshold) return 0;
  return Math.min(1, (ratio - threshold) / threshold);
}