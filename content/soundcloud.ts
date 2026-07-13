import { site } from "@/lib/site";

/**
 * SoundCloud catalogue — sourced from soundcloud.com/cremosinha on
 * 2026-07-13. To refresh:
 *
 *   curl -sL "https://soundcloud.com/cremosinha/tracks" -A "Mozilla/5.0" \
 *     | grep -oE 'cremosinha/[a-zA-Z0-9_-]+' | sort -u
 *
 * Each track has the oEmbed-resolved title (most are lowercase, mixed
 * pt-BR + English). Genre/context inferred from filename + press kit.
 *
 * `audioSrc` points to a same-origin MP3 under /public/audio/ that
 * powers the audio-reactive visualizer (real FFT data via Web Audio
 * API). SoundCloud's iframe embed is still cross-origin and can't be
 * analyzed, so we mirror the tracks locally.
 */

export interface SoundCloudTrack {
  slug: string;
  title: string;
  /** Slug pre-resolved. */
  permalink: string;
  /** Same-origin audio file under /public/audio/ for the visualizer. */
  audioSrc: string;
  /** Optional editorial note shown beneath the embed. */
  note?: string;
  /** Loose context tag for filtering (show, mix, single, residency). */
  context: "set" | "single" | "show" | "mix";
  /** Duration in seconds. Baked at build time via `afinfo` on the MP3s. */
  durationSec?: number;
}

const TRACKS: Omit<SoundCloudTrack, "permalink" | "audioSrc">[] = [
  {
    slug: "20-minutinhos",
    title: "20 minutinhos na maldade",
    context: "mix",
    note: "Mix curto de 20 minutos — groove rápido.",
    durationSec: 1186,
  },
  {
    slug: "baguncinha-1",
    title: "Baguncinha #1",
    context: "mix",
    note: "Primeira edição da série Baguncinha.",
    durationSec: 2317,
  },
  {
    slug: "baguncinha-frita-2",
    title: "Baguncinha [frita] #2",
    context: "mix",
    note: "Versão frita — mais peso no set.",
    durationSec: 1724,
  },
  {
    slug: "baguncinha-tranquila-em-casa",
    title: "baguncinha #3 tranquila em casa",
    context: "mix",
    note: "Gravado em casa — vibe mais chill.",
    durationSec: 2029,
  },
  {
    slug: "bora-dancar-estilo-cachorro",
    title: "bora dançar estilo cachorro",
    context: "single",
    note: "Single autoral — pista entregue.",
    durationSec: 80,
  },
  {
    slug: "dance-potranca-dance-com-emocao",
    title: "dance potranca dance com emoção",
    context: "single",
    note: "Single com pegada amapiano.",
    durationSec: 922,
  },
  {
    slug: "destination-of-tamborzao",
    title: "Destination Of Tamborzao",
    context: "mix",
    note: "Mix tamborzão — edição especial.",
    durationSec: 164,
  },
];

export const tracks: SoundCloudTrack[] = TRACKS.map((t) => ({
  ...t,
  permalink: `https://soundcloud.com/cremosinha/${t.slug}`,
  audioSrc: `${site.basePath}/audio/${t.slug}.mp3`,
}));

export interface SoundCloudSet {
  slug: string;
  title: string;
  permalink: string;
  note?: string;
}

export const sets: SoundCloudSet[] = [
  {
    slug: "meu-brasiu",
    title: "meu brasiu",
    permalink: "https://soundcloud.com/cremosinha/sets/meu-brasiu",
    note: "Playlist curada — panorama do que toca na pista.",
  },
];

/**
 * Default track that auto-loads on /musica mount. Set to the first
 * track in `tracks`. Change here to feature a different opener.
 */
export const DEFAULT_SLUG = "baguncinha-frita-2";

/** Featured track for the hero player on /musica. */
export const FEATURED_SLUG = DEFAULT_SLUG;

/** Look up a track by slug — used by the auto-load + click handlers. */
export function findTrack(slug: string): SoundCloudTrack | undefined {
  return tracks.find((t) => t.slug === slug);
}

/** Default track object — convenient for auto-load on mount. */
export const defaultTrack: SoundCloudTrack | undefined =
  findTrack(DEFAULT_SLUG);

/** Build the SoundCloud Widget Player URL for a permalink. */
export function widgetUrl(permalink: string, opts?: {
  /** Auto-play on load (requires user gesture in most browsers). */
  autoPlay?: boolean;
  /** Hide the artwork? default false */
  hideArtwork?: boolean;
  /** Hide related tracks? default true */
  hideRelated?: boolean;
  /** Show comments? default false */
  showComments?: boolean;
  /** Show user? default true */
  showUser?: boolean;
  /** Visual: classic (default) or visual (large artwork). */
  visual?: boolean;
}): string {
  const params = new URLSearchParams({
    url: permalink,
    auto_play: opts?.autoPlay ? "true" : "false",
    hide_related: opts?.hideRelated === false ? "false" : "true",
    show_comments: opts?.showComments ? "true" : "false",
    show_user: opts?.showUser === false ? "false" : "true",
    hide_artwork: opts?.hideArtwork ? "true" : "false",
    visual: opts?.visual ? "true" : "false",
    color: "#d6307a", // brand magenta
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}