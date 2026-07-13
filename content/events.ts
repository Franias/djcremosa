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
 *
 * Slug convention: kebab-case short tag, e.g. `clube-x-2026-11-22`.
 */

export const events: CremosaEvent[] = [
  // ─────── UPCOMING (confirmed) ───────
  {
    slug: "baile-do-10-2026-07-04",
    title: "080 /// Baile do 10",
    date: "2026-07-04",
    time: "23h",
    venue: "Flamula /// Sports Bar",
    city: "Santa Cruz do Sul",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "club",
    lineup: ["Cremosa"],
    ticketUrl:
      "https://www.sympla.com.br/evento/baile-do-dez-segunda-edicao/3481116",
    note: ".",
  },
  {
    slug: "role-do-kit-2026-07-10",
    title: "Cade o kit /// 1 ano",
    date: "2026-07-10",
    time: "23h",
    venue: "Gauchão Lanches",
    city: "Santa Maria",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "club",
    lineup: ["Cremosa"],
    ticketUrl:
      "https://shotgun.live/en/events/role-do-kit?uhandle=clarissad836",
    note: ".",
  },
  {
    slug: "cha-das-patroas-2026-07-11",
    title: "Chá das Patroas /// Ed. Anos 2000",
    date: "2026-07-11",
    time: "22h",
    venue: "Fv 4° Distrito",
    city: "Porto Alegre",
    region: "RS",
    country: "Brasil",
    status: "confirmed",
    category: "club",
    lineup: ["Cremosa"],
    ticketUrl:
      "https://www.sympla.com.br/evento/cha-das-patroas-ed-anos-2000/3461297",
    note: ".",
  },

  // ─────── PAST (confirmed, from Midia Kit 2026) ───────
  // {
  //   slug: "batukbaile-residency-2026",
  //   title: "Residência BatukBaile",
  //   date: "2026-02-05",
  //   venue: "BatukBaile",
  //   city: "Porto Alegre",
  //   region: "RS",
  //   country: "Brasil",
  //   status: "confirmed",
  //   category: "residency",
  //   note: "Residência ativa desde fev/2026.",
  // },
  // {
  //   slug: "planeta-atlantida-2026",
  //   title: "Planeta Atlântida (coletivo AfroJams)",
  //   date: "2026-01-30",
  //   endDate: "2026-02-01",
  //   venue: "Planeta Atlântida",
  //   city: "Sapiantã — Xangri-lá",
  //   region: "RS",
  //   country: "Brasil",
  //   status: "confirmed",
  //   category: "festival",
  //   lineup: ["Cremosa", "AfroJams", "+ line-up completo"],
  //   note: "Line-up via coletivo AfroJams (fundado em 2025).",
  // },
  // {
  //   slug: "rap-in-cena-2024",
  //   title: "Rap in Cena — solo",
  //   date: "2024-11-09",
  //   venue: "Rap in Cena",
  //   city: "Porto Alegre",
  //   region: "RS",
  //   country: "Brasil",
  //   status: "confirmed",
  //   category: "festival",
  //   note: "Retorno ao festival em carreira solo.",
  // },
  // {
  //   slug: "rap-in-cena-2023",
  //   title: "Rap in Cena — com D'Lock",
  //   date: "2023-11-04",
  //   venue: "Rap in Cena",
  //   city: "Porto Alegre",
  //   region: "RS",
  //   country: "Brasil",
  //   status: "confirmed",
  //   category: "festival",
  //   lineup: ["Cremosa", "D'Lock"],
  //   note: "Primeiro destaque no festival, ao lado de D'Lock.",
  // },
];