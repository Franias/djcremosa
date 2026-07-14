/**
 * YouTube catalogue — videos from youtube.com/@cremos4 (the Cremosa
 * channel). Refresh by:
 *
 *   curl -sL "https://www.youtube.com/@cremos4/videos" -A "Mozilla/5.0" \
 *     | grep -oE '"videoId":"[A-Za-z0-9_-]{11}"' | sort -u
 *
 * Then for each new id, fetch oEmbed to get the title + thumbnail:
 *
 *   for vid in <ids>; do
 *     curl -sL "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=$vid&format=json" \
 *       | python3 -c "import sys, json; d=json.load(sys.stdin); print(d['title'])"
 *   done
 *
 * Channel metadata:
 *   - Handle:  @cremos4
 *   - Channel URL: https://www.youtube.com/@cremos4
 *   - Channel ID (UCID): UC-zBmFGf0xS4Uozq6QoZ9bg
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

export const youtubeChannel = {
  handle: "@cremos4",
  url: "https://www.youtube.com/@cremos4",
  // The `?sub_confirmation=1` query opens the YouTube subscribe dialog
  // directly when the user clicks — saves a step.
  subscribeUrl: "https://www.youtube.com/@cremos4?sub_confirmation=1",
  embedUrl: "https://www.youtube.com/embed",
  // Avatar (round) — large size for the hero header.
  avatar:
    "https://yt3.googleusercontent.com/0FpX2AnUqpbLAMgx3_MeRUGZOPca0V86BVFeTuz3QVZWz4R1lYRB1mblLmHrga9mFISqCuAaQlw=s900-c-k-c0x00ffffff-no-rj",
  // Channel banner (wide) — used as the hero background strip.
  banner:
    "https://yt3.googleusercontent.com/Ksf7-3BkwevVIHnglxfmOyjMGqOvhM3HuypO44DWgATzLSSKncvQekTY25crK3oKW8nNtBQm=w2120-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj",
} as const;

const VIDEOS: YouTubeVideo[] = [
  {
    id: "2o0d2s5WBuA",
    title:
      "baguncinha em casa [djset tranquilo sza x frank ocean x tems x bryson tiller]",
    thumbnail: "https://i.ytimg.com/vi/2o0d2s5WBuA/hqdefault.jpg",
  },
  {
    id: "EEaDRLWC3Ds",
    title: "baguncinha em casa 3 #djset",
    thumbnail: "https://i.ytimg.com/vi/EEaDRLWC3Ds/hqdefault.jpg",
  },
  {
    id: "LxOZZ7YF6e8",
    title:
      "domingueira cremosa | chill vibes | rap | rnb | bounce | 00's vibes | remixes",
    thumbnail: "https://i.ytimg.com/vi/LxOZZ7YF6e8/hqdefault.jpg",
  },
  {
    id: "Q2ueq_Hetao",
    title: "baguncinha pop em casa #djset",
    thumbnail: "https://i.ytimg.com/vi/Q2ueq_Hetao/hqdefault.jpg",
  },
  {
    id: "QjCSHgYK5Eo",
    title: "baguncinha d'levs em casa #djset",
    thumbnail: "https://i.ytimg.com/vi/QjCSHgYK5Eo/hqdefault.jpg",
  },
  {
    id: "cF-gz5nd1kU",
    title: "baguncinha animada em casa #djset",
    thumbnail: "https://i.ytimg.com/vi/cF-gz5nd1kU/hqdefault.jpg",
  },
  {
    id: "hjYRSZnOyCw",
    title: "Cremosidades na Agoji Vibes",
    thumbnail: "https://i.ytimg.com/vi/hjYRSZnOyCw/hqdefault.jpg",
  },
  {
    id: "uhrGVExy8as",
    title:
      "nucleo vivo #2 djset cremosa [jungle x dnb x dub x house x funk]",
    thumbnail: "https://i.ytimg.com/vi/uhrGVExy8as/hqdefault.jpg",
  },
];

/** Newest first — based on the order the channel lists them. */
export const youtubeVideos: YouTubeVideo[] = VIDEOS;

/** Embed URL for a single video, with sane defaults. */
export function youtubeEmbedUrl(id: string): string {
  const params = new URLSearchParams({
    autoplay: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `${youtubeChannel.embedUrl}/${id}?${params.toString()}`;
}

/**
 * YouTubePlaylist — a curated collection on YouTube that lives outside
 * of Cremosa's own channel. Used to surface guest appearances (e.g.
 * AFROJAMS) on /videos without duplicating each video into
 * `youtubeVideos`.
 */
export interface YouTubePlaylist {
  /** YouTube playlist ID, e.g. "PLLi5256twtgA". */
  id: string;
  /** Editorial title shown in the section header on /videos. */
  title: string;
  /** Short blurb (one sentence) shown next to the embed. */
  blurb: string;
  /** Total video count, displayed in the badge + status bar. */
  count: number;
  /** First video ID of the playlist — used as the lite-embed thumbnail. */
  coverVideoId: string;
  /** Owner of the playlist (may differ from Cremosa's channel). */
  channel: {
    /** Display name, e.g. "AFROJAMS". */
    name: string;
    /** @handle, e.g. "@AFRXJAMS". */
    handle: string;
    /** Channel URL on YouTube. */
    url: string;
    /** Avatar URL — round, prefer YouTube's s800+ size. */
    avatar?: string;
  };
  /** Tracks in playlist order, oldest to newest. */
  tracks: YouTubeVideo[];
  /** Full playlist URL on YouTube. */
  playlistUrl: string;
}

/** Minimal "use" type for an AFROJAMS track entry. */
export interface AfroJamsTrack {
  id: string;
  title: string;
  thumbnail: string;
}

/** YouTube `mqdefault.jpg` URL for a video (320×180, 16:9 — perfect lite-embed thumb). */
const YT_MQ = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

/**
 * AfroJams playlist — DJ Cremosa's appearances on the @AFRXJAMS
 * channel, curated as one playlist. Added 2026-07-14.
 *
 * Source: https://www.youtube.com/playlist?list=PLLi5256twtgA
 * (verified 2026-07-14 — 6 videos total, all featuring DJ Cremosa).
 *
 * To refresh: scrape the playlist page (same trick as the YouTube
 * catalogue) and update the `tracks` array. The cover thumbnail
 * (`coverVideoId`) should stay on the first video of the list.
 */
export const afrJamsPlaylist: YouTubePlaylist = {
  id: "PLLi5256twtgA",
  title: "",
  blurb:
    "Co-fundadora do coletivo AfroJams (2025). Seis sets dela filmados no canal @AFRXJAMS — Black Divas, R&B, afrobeats, charme, Miami bass e brasilidades.",
  count: 6,
  coverVideoId: "4sU4o_ViyfE",
  channel: {
    name: "AFROJAMS",
    handle: "@AFRXJAMS",
    url: "https://www.youtube.com/@AFRXJAMS",
    avatar:
      "https://yt3.googleusercontent.com/ytc/AIdro_mpY9pUw6VNpPO5ZHRnFF0nmfBOjjl8X68DTVNUqp7q6EJh=s240-c-k-c0x00ffffff-no-rj",
  },
  tracks: [
    {
      id: "4sU4o_ViyfE",
      title:
        "AFROJAMS — TEMP. 01 · EP. 01 · DJ CREMOSA",
      thumbnail: YT_MQ("4sU4o_ViyfE"),
    },
    {
      id: "yLfkUE_JuW4",
      title:
        "AFROJAMS — TEMP. 02 · EP. 03 · BADDIE LOMA b2b CREMOSA · DJ SET BLACK DIVAS · RAP E TRAP FEMININO",
      thumbnail: YT_MQ("yLfkUE_JuW4"),
    },
    {
      id: "1_uXQTNd4zk",
      title:
        "AFROJAMS — TEMP. 03 · EP. 03 · CREMOSA · DJ SET R&B & AFROBEATS · POP & RAP · FUNK & HOUSE REMIX",
      thumbnail: YT_MQ("1_uXQTNd4zk"),
    },
    {
      id: "2jWW5W5-sHU",
      title:
        "AFROJAMS — TEMP. 04 · EP. 02 · CREMOSA · DJ SET LOVE SONG · CHARME · R&B · ANOS 2000",
      thumbnail: YT_MQ("2jWW5W5-sHU"),
    },
    {
      id: "uo4CwvRcfOQ",
      title:
        "AFROJAMS — TEMP. 05 · EP. 03 · CREMOSA · DJ SET MIAMI BASS · VOLT MIX · NOSTALGIC",
      thumbnail: YT_MQ("uo4CwvRcfOQ"),
    },
    {
      id: "pOkyPxPnciI",
      title:
        "AFROJAMS — TEMP. 06 · EP. 07 · CREMOSA · DJ SET REMIXES & BRASILIDADES",
      thumbnail: YT_MQ("pOkyPxPnciI"),
    },
  ],
  playlistUrl: "https://www.youtube.com/playlist?list=PLLi5256twtgA",
};

/** Embed URL for a YouTube playlist. Plays the whole list with sane defaults. */
export function youtubePlaylistEmbedUrl(playlistId: string): string {
  const params = new URLSearchParams({
    autoplay: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `${youtubeChannel.embedUrl}/videoseries?list=${playlistId}&${params.toString()}`;
}