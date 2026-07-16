/**
 * Event data + helpers for the /agenda page.
 *
 * Format chosen: typed TS records in `content/events.ts` (see import below).
 * Why not MDX/gray-matter yet? One less dep at MVP; fully typed; easy to grep.
 * Phase 5 swap path: replace this loader with Sanity / Notion / MDX+frontmatter
 * without touching the page component.
 */

export type EventStatus =
  | "confirmed"
  | "tentative"
  | "sold-out"
  | "postponed"
  | "cancelled";

export type EventCategory =
  | "festival"
  | "club"
  | "party"
  | "residency"
  | "tour"
  | "private";

export interface CremosaEvent {
  /** Stable URL slug, also acts as id. */
  slug: string;
  /** Show title (lineup first / festival name). */
  title: string;
  /** ISO date YYYY-MM-DD (start of event). */
  date: string;
  /** Optional end date for multi-day festivals. */
  endDate?: string;
  /** Door / set time, free-form "23h" / "15h". */
  time?: string;
  venue: string;
  city: string;
  /** Brazilian UF or country subdivision. Optional. */
  region?: string;
  country: string;
  status: EventStatus;
  category: EventCategory;
  /** Other artists billed, in display order. */
  lineup?: string[];
  /** External ticket / event link. */
  ticketUrl?: string;
  /** Headline / tagline for the show card. */
  note?: string;
  /** True if this is a placeholder demo record (not a real booking). */
  mock?: boolean;
}

export interface AgendaSection {
  title: string;
  events: CremosaEvent[];
}

/* ----------- pure helpers (no IO) ----------- */

const MS_PER_DAY = 86_400_000;

export function parseDate(iso: string): Date {
  // Treat as local-noon to avoid TZ-day-jump surprises when sorting.
  return new Date(`${iso}T12:00:00`);
}

export function isUpcoming(event: CremosaEvent, now = new Date()): boolean {
  if (event.status === "cancelled" || event.status === "postponed") return false;
  const end = event.endDate ? parseDate(event.endDate) : parseDate(event.date);
  return end.getTime() + MS_PER_DAY > now.getTime();
}

export function isPast(event: CremosaEvent, now = new Date()): boolean {
  return !isUpcoming(event, now);
}

/** Upcoming first (chronological), then past (most recent first). */
export function sortEvents(events: CremosaEvent[], now = new Date()): CremosaEvent[] {
  const upcoming = events
    .filter((e) => isUpcoming(e, now))
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  const past = events
    .filter((e) => isPast(e, now))
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  return [...upcoming, ...past];
}

export function splitAgenda(events: CremosaEvent[], now = new Date()): {
  upcoming: CremosaEvent[];
  past: CremosaEvent[];
} {
  return {
    upcoming: events
      .filter((e) => isUpcoming(e, now))
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()),
    past: events
      .filter((e) => isPast(e, now))
      .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()),
  };
}

/** Format "YYYY-MM-DD" → "12 MAI 2026" (pt-BR, uppercase). */
export function formatDate(iso: string): { day: string; month: string; year: string; full: string } {
  const d = parseDate(iso);
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const month = get("month").replace(".", "").toUpperCase();
  const day = get("day");
  const year = get("year");
  return { day, month, year, full: `${day} ${month} ${year}` };
}

/**
 * Pick the next confirmed/non-cancelled event from a list (sorted by
 * date asc). Returns `null` when there's nothing upcoming — callers
 * can render an empty state. Mock entries (`slug` starts with
 * `"mock-"`) are skipped so test fixtures don't leak into prod UI.
 *
 * NOTE: this is a stub — the user was mid-development on this. The
 * footer countdown and (former) NextEventCountdown both use it.
 */
export function getNextEvent(
  events: CremosaEvent[],
  now: Date = new Date(),
): CremosaEvent | null {
  const isReal = (e: CremosaEvent) => !e.slug.startsWith("mock-");
  return (
    events
      .filter(isReal)
      .filter((e) => isUpcoming(e, now) && e.status !== "cancelled")
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())[0] ??
    null
  );
}

/**
 * Format a millisecond delta as a countdown, in two flavors:
 *   - `compact`: `dd:hh:mm:ss` — fixed-width, used in status bars
 *   - `full`:    `XXd XXh XXm XXs`  — used in the (former)
 *                NextEventCountdown hero block
 *
 * Negative or zero deltas clamp to zero so the UI never shows an
 * awkward `-1d -2h` countdown.
 *
 * NOTE: stub — relies on the user finishing the spec.
 */
export function formatCountdown(deltaMs: number): {
  compact: string;
  full: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} {
  const total = Math.max(0, Math.floor(deltaMs / 1000));
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3_600);
  const minutes = Math.floor((total % 3_600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const d = pad(days);
  const h = pad(hours);
  const m = pad(minutes);
  const s = pad(seconds);
  return {
    compact: `${d}:${h}:${m}:${s}`,
    full: `${d}d ${h}h ${m}m ${s}s`,
    days: d,
    hours: h,
    minutes: m,
    seconds: s,
  };
}

/* ----------- status badge config (drives UI colors) ----------- */

export const STATUS_LABEL: Record<EventStatus, string> = {
  confirmed: "Confirmado",
  tentative: "A confirmar",
  "sold-out": "Esgotado",
  postponed: "Adiado",
  cancelled: "Cancelado",
};

export const STATUS_TONE: Record<EventStatus, string> = {
  confirmed: "bg-status-ok/15 text-status-ok border-status-ok/40",
  tentative: "bg-status-warn/15 text-status-warn border-status-warn/40",
  "sold-out": "bg-bubble/15 text-bubble border-bubble/40",
  postponed: "bg-cream-dim/10  border-cream-dim/30",
  cancelled: "bg-status-down/15 text-status-down border-status-down/40 line-through",
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  festival: "Festival",
  club: "Club",
  party: "Festa",
  residency: "Residência",
  tour: "Turnê",
  private: "Privado",
};
