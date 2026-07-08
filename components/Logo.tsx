import { site } from "@/lib/site";

type LogoSize = "nav" | "footer" | "hero" | "master";

interface LogoProps {
  /**
   * Predefined size variant. Controls both the source file and rendered
   * dimensions so the right asset is shipped at each breakpoint.
   *  - nav:    small, sticky header — 240px source, h-10
   *  - footer: medium brand mark — 600px source, h-14
   *  - hero:   large display — 2000px source, fills container
   *  - master: full-resolution original — only for press / OG use
   */
  size?: LogoSize;
  /** Pixel width override (intrinsic). */
  width?: number;
  /** Pixel height override (intrinsic). */
  height?: number;
  /** Override alt text (defaults to brand.logo.alt). */
  alt?: string;
  /** CSS class passthrough (Tailwind). */
  className?: string;
  /** Render priority (preload) — true for above-the-fold logos. */
  priority?: boolean;
}

const VARIANTS: Record<
  LogoSize,
  { src: string; intrinsicW: number; intrinsicH: number; defaultClass: string }
> = {
  nav: {
    src: site.brand.logo.nav,
    intrinsicW: 240,
    intrinsicH: 135, // original 16:9
    defaultClass: "block h-10 w-auto sm:h-12",
  },
  footer: {
    src: site.brand.logo.default,
    intrinsicW: 600,
    intrinsicH: 338,
    defaultClass: "block h-14 w-auto sm:h-20",
  },
  hero: {
    // 2000×1125 source — covers up to ~3x retina on a 600px CSS width.
    // The rendered <img> fills the parent up to max-w-6xl (1152px) and
    // is block + mx-auto so it centers instead of flowing inline-left.
    src: site.brand.logo.hero,
    intrinsicW: 2000,
    intrinsicH: 1125,
    defaultClass: "block w-full max-w-6xl h-auto mx-auto",
  },
  master: {
    src: site.brand.logo.master,
    intrinsicW: 3840,
    intrinsicH: 2160,
    defaultClass: "block w-full h-auto",
  },
};

/**
 * Plain <img> instead of next/image.
 *
 * Why: under `output: 'export'` + `images.unoptimized: true`, next/image
 * emits the literal src into the HTML without applying `basePath`. So a
 * site deployed to https://<user>.github.io/<repo>/ ends up with
 *   <img src="/logo/foo.png">
 * which 404s (browser resolves against the host root).
 *
 * A plain <img> lets us prefix the src ourselves with `site.basePath`,
 * keeping the asset URL correct under any subpath host. Set
 * `site.basePath = ""` once you migrate to a custom domain.
 */
export function Logo({
  size = "nav",
  width,
  height,
  alt,
  className,
  priority = false,
}: LogoProps) {
  const v = VARIANTS[size];
  const src = `${site.basePath}${v.src}`;
  return (
    <img
      src={src}
      alt={alt ?? site.brand.logo.alt}
      width={width ?? v.intrinsicW}
      height={height ?? v.intrinsicH}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={[v.defaultClass, className].filter(Boolean).join(" ")}
    />
  );
}