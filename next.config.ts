import type { NextConfig } from "next";

/**
 * Next.js configuration for Cremosa.
 *
 * `output: 'export'` → site generates as static HTML/CSS/JS in `./out/`,
 * ready to publish to GitHub Pages (or any static host).
 *
 * `basePath` is conditional:
 *   - In **dev**, `''` so `http://localhost:3000/` IS the site (the
 *     "Press Start" gate lands you directly at the home page).
 *   - In **production**, `'/djcremosa'` so GitHub Pages serves the site
 *     at `https://<user>.github.io/djcremosa/`. The deploy workflow
 *     exports `NEXT_PUBLIC_BASE_PATH` accordingly so asset URLs also
 *     include the prefix.
 *
 * If you ever wire up a custom domain, set both values to `''`.
 *
 * Caveat: dynamic server features (searchParams as Promise, cookies,
 * server actions, API routes) become client-side. The agenda filter is
 * handled by a client component using `useSearchParams`.
 */
const isDev = process.env.NODE_ENV === "development";
const basePath = isDev
  ? ""
  : (process.env.NEXT_PUBLIC_BASE_PATH ?? "/djcremosa");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
