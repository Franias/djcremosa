/**
 * Single source of truth for brand + contact + socials.
 * Update here, propagate everywhere.
 *
 * Brand: "Cremosa" (display: CREMOSA).
 * Legacy alias "DJ Cremosa" kept for SEO continuity and industry billing
 * conventions — never use it as the visible brand name on the site.
 */

export const site = {
  brand: {
    /** Site-wide display name. The image at /logo/cremosa-600.png is the
     *  canonical logo; text fallback is "CREMOSA" in the bagel bubble font. */
    name: "Cremosa",
    /** Title-cased alias used in some contexts (mid-sentence, aria labels). */
    displayName: "CREMOSA",
    /** Older / billing / SEO aliases — never rendered as the primary brand. */
    aliases: ["DJ Cremosa", "CREMESSA"],
    tagline: {
      primary: "Seletora · Curadoria · Discotecagem",
      secondary: "Música preta global na pista — Porto Alegre desde 2016.",
    },
    location: "Porto Alegre, RS — Brasil",
    activeSince: 2016,
    /** Logo assets — relative paths under /public. */
    logo: {
      /** Master, 3840×2160, 1.7MB — kept for archival / press use only. */
      master: "/logo/cremosa-original.png",
      /** 1200px wide — hero, OG image. */
      hero: "/logo/cremosa-1200.png",
      /** 600px wide — footer, generic brand display. */
      default: "/logo/cremosa-600.png",
      /** 240px wide — sticky nav. */
      nav: "/logo/cremosa-240.png",
      /** Default logo alt text — used in <img alt>. */
      alt: "Cremosa — logotipo oficial",
    },
  },
  contact: {
    email: "franciellipdias@gmail.com",
    // Validated 2026-07-08: original kit had +51 (Peru DDI); correct number is
    // +55 (Brazil DDI) + 51 (Porto Alegre area) + 99372-3158.
    phoneDisplay: "+55 51 99372-3158",
    phoneHref: "tel:+5551993723158",
    bookingEmail: "franciellipdias@gmail.com",
  },
  social: {
    instagram: {
      handle: "@djcremosa",
      url: "https://instagram.com/djcremosa",
    },
    // Add as soon as she confirms them:
    // soundcloud: { url: "https://soundcloud.com/djcremosa" },
    // spotify:    { url: "https://open.spotify.com/artist/..." },
  },
  highlights: [
    "Rap in Cena 2023 (com D'Lock) e 2024 (solo)",
    "Abertura para Rafa Moreira, Baco Exu do Blues e KL Jay",
    "Co-fundadora do coletivo AfroJams (2025)",
    "Line-up Planeta Atlântida 2026 via AfroJams",
    "Residência BatukBaile (2026)",
  ],
} as const;

export type Site = typeof site;