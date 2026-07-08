import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/nav/SiteFooter";
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
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand.name} · ${site.brand.tagline.primary}`,
    description: site.brand.tagline.secondary,
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${bagelFat.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-cream">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
