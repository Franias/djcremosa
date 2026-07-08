/**
 * Single source of truth for brand + contact + socials.
 * Update here, propagate everywhere.
 */

export const site = {
  // Use only one form of your name on the URL — append the brand aliases only in display.
  brand: {
    name: "DJ Cremosa",
    aliases: ["CREMESSA", "DJ Cremosa"],
    tagline: {
      primary: "Seletora · Curadoria · Discotecagem",
      secondary: "Música preta global na pista — Porto Alegre desde 2016.",
    },
    location: "Porto Alegre, RS — Brasil",
    activeSince: 2016,
  },
  contact: {
    email: "franciellipdias@gmail.com",
    phoneDisplay: "+51 993723158",
    phoneHref: "tel:+51993723158",
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
