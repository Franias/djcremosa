/**
 * Audio helpers — minimal Web Audio API setup for the /musica
 * visualizer. The visualizer reads FFT data from an AnalyserNode
 * attached to a same-origin <audio> element (loaded from a file
 * the user uploaded or from a track in /public/audio).
 *
 * Why not the SoundCloud iframe?
 *   Cross-origin restrictions on https://w.soundcloud.com/player/
 *   prevent us from reading its audio buffer. So the SoundCloud
 *   embed stays as the "play the track" path, and this module
 *   powers the visualizer from a *separate* audio source that
 *   Cremosa owns (or the user uploads locally).
 */

export interface AudioRig {
  /** The actual <audio> element — call .play() / .pause() on this. */
  audio: HTMLAudioElement;
  /** AnalyserNode you can read frequency/time data from each frame. */
  analyser: AnalyserNode;
  /** The AudioContext (kept so callers can resume on user gesture). */
  context: AudioContext;
  /** Object URL — call URL.revokeObjectURL(rig.url) when done. */
  url: string;
  /** Filename the rig was created from. */
  name: string;
}

/** FFT size → number of frequency bins. 256 → 128 bins (good for a
 *  visualizer with 32-64 bars). */
export const FFT_SIZE = 256;

let cachedContext: AudioContext | null = null;

/**
 * Returns a shared AudioContext, creating one on first call. Many
 * browsers require resume() after a user gesture before audio can
 * play; we expose resumeAudio() to do that.
 */
export function getAudioContext(): AudioContext {
  if (cachedContext && cachedContext.state !== "closed") {
    return cachedContext;
  }
  cachedContext = new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return cachedContext;
}

/** Call this from a click handler before .play() — some browsers
 *  block audio context start until a user gesture. */
export async function resumeAudio(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

/**
 * Build an audio rig from a File (e.g. dropped onto the page or
 * picked from a file input). The returned object owns the audio
 * resource — call `disposeAudio(rig)` when you're done to free the
 * object URL and detach the analyser.
 */
export function buildRigFromFile(file: File): AudioRig {
  const url = URL.createObjectURL(file);
  const audio = new Audio(url);
  audio.preload = "auto";
  audio.crossOrigin = "anonymous";

  const context = getAudioContext();
  const source = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  analyser.smoothingTimeConstant = 0.82;

  // Route audio: source → analyser → destination (so playback is audible).
  source.connect(analyser);
  analyser.connect(context.destination);

  return {
    audio,
    analyser,
    context,
    url,
    name: file.name,
  };
}

/**
 * Build an audio rig from a same-origin URL (e.g. /audio/foo.mp3
 * served from /public). The AudioContext is created on first call
 * — call resumeAudio() before .play() to satisfy autoplay policies.
 */
export function buildRigFromUrl(src: string, name?: string): AudioRig {
  const audio = new Audio(src);
  audio.preload = "auto";
  audio.crossOrigin = "anonymous";

  const context = getAudioContext();
  const source = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();
  analyser.fftSize = FFT_SIZE;
  analyser.smoothingTimeConstant = 0.82;

  source.connect(analyser);
  analyser.connect(context.destination);

  return {
    audio,
    analyser,
    context,
    url: src,
    name: name ?? src.split("/").pop() ?? "track",
  };
}

/** Free resources held by a rig. Call from useEffect cleanup. */
export function disposeAudio(rig: AudioRig): void {
  try {
    rig.audio.pause();
    rig.audio.src = "";
    rig.audio.load();
    if (rig.url.startsWith("blob:")) {
      URL.revokeObjectURL(rig.url);
    }
  } catch {
    /* ignore — audio already torn down */
  }
}

/** Frequency bins — typed array the caller fills each frame. */
export function makeFreqBuffer(analyser: AnalyserNode): Uint8Array {
  return new Uint8Array(analyser.frequencyBinCount);
}

/** Time-domain bins — for waveform display. */
export function makeTimeBuffer(analyser: AnalyserNode): Uint8Array {
  return new Uint8Array(analyser.fftSize);
}

/** Pull the current frequency data into the buffer. Returns the buffer. */
export function readFreq(
  analyser: AnalyserNode,
  buffer: Uint8Array<ArrayBuffer>,
): Uint8Array<ArrayBuffer> {
  analyser.getByteFrequencyData(buffer);
  return buffer;
}

/** Pull the current time-domain data into the buffer. Returns the buffer. */
export function readTime(
  analyser: AnalyserNode,
  buffer: Uint8Array<ArrayBuffer>,
): Uint8Array<ArrayBuffer> {
  analyser.getByteTimeDomainData(buffer);
  return buffer;
}

/** Normalise a Uint8Array(0..255) to a Float32Array(0..1). */
export function normalise(buffer: Uint8Array): Float32Array {
  const out = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    out[i] = buffer[i] / 255;
  }
  return out;
}