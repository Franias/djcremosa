import type { CremosaEvent } from "@/lib/events";

/**
 * Booking history + upcoming slots for DJ Cremosa.
 *
 * Sources:
 *  - confirmed past events come from the Midia Kit 2026 PDF.
 *  - anything with `mock: true` is a placeholder to show the agenda layout —
 *    swap with real bookings when they close. Use `tentative` status until
 *    the date is confirmed in writing.
 *
 * When a new show is confirmed, add an entry here and push to git.
 * Phase 5 swap path: this whole file moves into Sanity / Notion / MDX.
 */

export const events: CremosaEvent[] = [
  // ─────── UPCOMING (mock — replace these) ───────
  {
    slug: "mock-club-night-2026-08",
    title: "Noite no Club /// Exemplo",
    date: "2026-08-22",
    time: "23h",
    venue: "House of Cream /// placeholder",
    city: "Porto Alegre",
    region: "RS",
    country: "Brasil",
    status: "tentative",
    category: "club",
    lineup: ["Cremosa", "+ lineup TBA"],
    ticketUrl: "https://example.com",
    note: "Placeholder — substitua pelo seu próximo show confirmado.",
    mock: true,
  },
  {
    slug: "mock-festival-2026-10",
    title: "Festival /// Exemplo",
    date: "2026-10-18",
    endDate: "2026-10-19",
    time: "00h",
    venue: "Parque /// placeholder",
    city: "Florianópolis",
    region: "SC",
    country: "Brasil",
    status: "tentative",
    category: "festival",
    lineup: ["Cremosa", "+ 12 artistas TBA"],
    note: "Placeholder — exemplo para festivais com data fim.",
    mock: true,
  },
  {
    slug: "mock-private-2026-09",
    title: "Evento fechado /// Exemplo",
    date: "2026-09-05",
    time: "22h",
    venue: "Espaço privado",
    city: "São Paulo",
    region: "SP",
    country: "Brasil",
    status: "confirmed",
    category: "private",
    note: "Placeholder — eventos privados não mostram ingressos.",
    mock: true,
  },

  // ─────── PAST (confirmed, from Midia Kit 2026) ───────
  {
    slug: "batukbaile-residency-2026",
    title: "Residência BatukBaile",
    date: "2026-02-05",
    venue: "BatukBaile",
    city: "Porto Alegre",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "residency",
    note: "Residência ativa desde fev/2026.",
  },
  {
    slug: "planeta-atlantida-2026",
    title: "Planeta Atlântida (coletivo AfroJams)",
    date: "2026-01-30",
    endDate: "2026-02-01",
    venue: "Planeta Atlântida",
    city: "Sapiantã — Xangri-lá",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "festival",
    lineup: ["Cremosa", "AfroJams", "+ line-up completo"],
    note: "Line-up via coletivo AfroJams (fundado em 2025).",
  },
  {
    slug: "rap-in-cena-2024",
    title: "Rap in Cena — solo",
    date: "2024-11-09",
    venue: "Rap in Cena",
    city: "Porto Alegre",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "festival",
    note: "Retorno ao festival em carreira solo.",
  },
  {
    slug: "rap-in-cena-2023",
    title: "Rap in Cena — com D'Lock",
    date: "2023-11-04",
    venue: "Rap in Cena",
    city: "Porto Alegre",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "festival",
    lineup: ["Cremosa", "D'Lock"],
    note: "Primeiro destaque no festival, ao lado de D'Lock.",
  },
];
