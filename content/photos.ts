/**
 * Galeria — photographs of Cremosa in performance / backstage.
 *
 * Asset layout under /public/photos/:
 *   {slug}-800.jpg   → tile (lazy-loaded first paint)
 *   {slug}-1600.jpg  → lightbox / fullscreen
 *
 * Each entry's `span` value drives the masonry grid:
 *   row  = how many rows the tile occupies (default 1)
 *   col  = how many cols the tile occupies (default 1, max 2 in 4-col layout)
 *
 * Sources: Google Drive → ~/Library/CloudStorage/.../divulgacao cremosa/FOTOS
 * Captions inferred from file names + Midia Kit context.
 */

import { site } from "@/lib/site";

export interface GaleriaPhoto {
  slug: string;
  /** Photo credit, shown on hover and in lightbox. */
  credit: string;
  /** Short caption shown under the tile. */
  caption: string;
  /** Event or context tag, used for filtering in the future. */
  context: "show" | "residencia" | "coletivo" | "backstage";
  /** Optional tall/wide marker for the masonry layout. */
  span?: { row?: number; col?: number };
}

export const photos: GaleriaPhoto[] = [
  {
    slug: "afro-hellmanns",
    credit: "Divulgação AfroJams",
    caption: "Afro Hellmann's · coletivo AfroJams",
    context: "coletivo",
    span: { row: 2, col: 1 },
  },
  {
    slug: "batukbaile-339",
    credit: "Gabi Lazzarini",
    caption: "Esquenta BatukBaile 2 · pista",
    context: "residencia",
  },
  {
    slug: "set-porto-alegre",
    credit: "Acervo Cremosa",
    caption: "Set · Porto Alegre",
    context: "show",
    span: { row: 2 },
  },
  {
    slug: "batukbaile-329",
    credit: "Gabi Lazzarini",
    caption: "Esquenta BatukBaile 2 · cabine",
    context: "residencia",
  },
  {
    slug: "show-pista",
    credit: "Acervo Cremosa",
    caption: "Pista · show",
    context: "show",
  },
];

/** Filter by context tag. Returns all when called with `undefined`. */
export function photosByContext(
  context: GaleriaPhoto["context"] | undefined,
): GaleriaPhoto[] {
  if (!context) return photos;
  return photos.filter((p) => p.context === context);
}

/** Stable photo URL helper — basePath aware so static export stays correct. */
export function photoSrc(slug: string, size: 800 | 1600): string {
  return `${site.basePath}/photos/${slug}-${size}.jpg`;
}