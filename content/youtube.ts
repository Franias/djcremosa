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