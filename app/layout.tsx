import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Geist, Geist_Mono, VT323 } from "next/font/google";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { VerticalRails } from "@/components/sections/VerticalRails";
import { SiteVisitorRuntime } from "@/components/SiteVisitorRuntime";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Bagel Fat One = the chunky Y2K bubble that matches the press kit title.
const bagelFat = Bagel_Fat_One({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

// VT323 = pixel / terminal monospace. Echoes the glitched "contato" header
// and Windows-Media-Player chrome in the Midia Kit 2026.
const vt323 = VT323({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://djcremosa.com.br",
  ),
  title: {
    default: `${site.brand.name} · ${site.brand.tagline.primary}`,
    template: `%s · ${site.brand.name}`,
  },
  description: site.brand.tagline.secondary,
  applicationName: site.brand.name,
  authors: [{ name: site.brand.name }],
  generator: "Next.js",
  keywords: [
    "Cremosa",
    "CREMOSA",
    "DJ Cremosa",
    "CREMESSA",
    "DJ Porto Alegre",
    "funk brasileiro",
    "amapiano",
    "house",
    "R&B",
    "AfroJams",
    "BatukBaile",
    "seletora",
    "curadoria musical",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.brand.name,
    title: `${site.brand.name} · ${site.brand.tagline.primary}`,
    description: site.brand.tagline.secondary,
    images: [{ url: site.brand.logo.hero, alt: site.brand.logo.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand.name} · ${site.brand.tagline.primary}`,
    description: site.brand.tagline.secondary,
    images: [{ url: site.brand.logo.hero, alt: site.brand.logo.alt }],
  },
  icons: {
    // Browser tab + bookmark icon. We use the brand logo as the
    // primary favicon and the Y2K halftone bg tile as a secondary
    // 'any size' alternative — browsers pick the smallest one that
    // fits the requested size. Both are basePath-aware so they
    // resolve correctly on GitHub Pages.
    icon: [
      {
        url: `${site.basePath}/logo/cremosa-240.png`,
        type: "image/png",
        sizes: "240x240",
        rel: "icon",
      },
      {
        url: `${site.basePath}/logo/cremosa-600.png`,
        type: "image/png",
        sizes: "600x600",
        rel: "icon",
      },
      {
        url: `${site.basePath}/bg/star-halftone.jpg`,
        type: "image/jpeg",
        sizes: "any",
        rel: "icon",
      },
    ],
    apple: {
      url: `${site.basePath}/logo/cremosa-600.png`,
      sizes: "600x600",
      type: "image/png",
    },
  },
  // Enable cross-route View Transitions (Chrome 124+, Safari 18+).
  // Browsers without support ignore the meta tag — navigation still works.
  other: {
    "view-transition": "same-origin",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0606",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // `viewport-fit=cover` lets the page extend behind the iPhone notch
  // and Android cutouts. Combined with `env(safe-area-inset-*)` in
  // globals.css (see `.safe-x`, `.safe-top`, `.safe-bottom`) sticky
  // chrome hugs the real visible bounds instead of the device width.
  viewportFit: "cover",
  // Keep users pinch-zooming — accessibility wins outweigh the layout
  // stability hit for an editorial site.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${bagelFat.variable} ${vt323.variable}`}
    >
      <body
        className="min-h-screen flex flex-col bg-bg text-cream"
        style={
          {
            // basePath-aware URL so the CSS background-image resolves
            // correctly in production (e.g. /djcremosa/bg/...) while
            // staying empty in dev where basePath is "".
            "--bg-stars": `url("${site.basePath}/bg/star-halftone.jpg")`,
          } as React.CSSProperties
        }
      >
        {/* Animated background gradient — slow hue drift */}
        <div className="bg-anim" aria-hidden />
        <div className="bg-anim-grain" aria-hidden />
        {/* Boot splash removed — the Press Start gate on / handles first-
            session UX now. Kept the component around for future use. */}
        <SiteVisitorRuntime />
        <SiteNav />
        {/* Vertical side rails echoing the Midia Kit editorial frame */}
        <main className="flex-1 relative z-10 pb-16 safe-bottom sm:pb-20">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
