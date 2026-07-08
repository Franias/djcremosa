import type { NextConfig } from "next";

/**
 * Next.js configuration for DJ Cremosa.
 *
 * `output: 'export'` → site generates as static HTML/CSS/JS in `./out/`,
 * ready to publish to GitHub Pages (or any static host).
 *
 * Caveat: dynamic server features (searchParams as Promise, cookies,
 * server actions, API routes) become client-side. The agenda filter is
 * handled by a client component using `useSearchParams`.
 *
 * Phase 6 alternative: switch to Vercel for native Node.js runtime
 * (just remove `output` and the `trailingSlash` line).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // We don't use next/image yet — when we add it, swap to a Cloudinary loader
  // per https://nextjs.org/docs/app/api-reference/components/image#loader.
  images: { unoptimized: true },
};

export default nextConfig;
