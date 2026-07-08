import type { NextConfig } from "next";

/**
 * Next.js configuration for Cremosa.
 *
 * `output: 'export'` → site generates as static HTML/CSS/JS in `./out/`,
 * ready to publish to GitHub Pages (or any static host).
 *
 * `basePath: '/djcremosa'` → all asset URLs and <Link> hrefs are prefixed.
 * Required because GitHub Pages serves this repo at
 *   https://<user>.github.io/<repo>/
 * — not at the root. Remove (or set to '') once a custom domain is wired up.
 *
 * Caveat: dynamic server features (searchParams as Promise, cookies,
 * server actions, API routes) become client-side. The agenda filter is
 * handled by a client component using `useSearchParams`.
 *
 * Phase 6 alternative: switch to Vercel for native Node.js runtime
 * (just remove `output`, `trailingSlash`, and `basePath`).
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/djcremosa",
  trailingSlash: true,
  // We don't use next/image yet — when we add it, swap to a Cloudinary loader
  // per https://nextjs.org/docs/app/api-reference/components/image#loader.
  images: { unoptimized: true },
};

export default nextConfig;
