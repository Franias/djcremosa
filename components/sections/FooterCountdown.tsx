"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatCountdown,
  getNextEvent,
  parseDate,
  type CremosaEvent,
} from "@/lib/events";

/**
 * FooterCountdown — compact `dd:hh:mm` timer placed in the fixed
 * page-level Win95 status bar (SiteFooter).
 *
 * The site is a static export to GitHub Pages, so the timer runs
 * entirely on the client. It picks the next confirmed/non-cancelled
 * event from `content/events.ts` (mock entries are skipped — see
 * `getNextEvent`) and ticks every 30s. The minute-precision display
 * `dd:hh:mm` is derived from a single `deltaMs` in state.
 *
 * Architecture notes:
 *
 *   - `getNextEvent` runs during render (pure), so React can re-
 *     derive it on every re-render without an effect.
 *   - The visible text is computed from `next` + `deltaMs` purely
 *     on each render — never via setState inside the effect body
 *     (which would trigger the cascading-renders lint rule).
 *   - The effect only schedules a `setInterval` whose callback
 *     updates `deltaMs`. This is the only place setState fires.
 *   - When `next` is null (no upcoming event), the effect short-
 *     circuits and the render shows `—`.
 *
 * The whole segment is wrapped in a Link to `/agenda/` so clicking
 * the timer takes the visitor straight to the agenda page.
 *
 * SSR safety: the server renders `--:--` (5 chars, same column
 * count as `01:23:45`) so hydration never complains about
 * mismatched text.
 *
 * Empty state: when there's no upcoming event we render `—` so the
 * segment still occupies its column and the status bar rhythm
 * doesn't shift on `/agenda` visits between bookings.
 */
export function FooterCountdown({ events }: { events: CremosaEvent[] }) {
  // Pure derivation on every render.
  const next = getNextEvent(events);
  const [deltaMs, setDeltaMs] = useState<number | null>(null);

  useEffect(() => {
    if (!next) return;
    const startMs = parseDate(next.date).getTime();
    const tick = () => setDeltaMs(startMs - Date.now());
    tick();
    // 1s tick — we display seconds so the timer must refresh every
    // second. The state update is a single string replacement, so
    // React's automatic batching keeps the cost negligible.
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, [next]);

  // Pure derivation — no setState in render, no Date.now() leaks.
  let timer: string;
  if (!next) {
    timer = "—";
  } else if (deltaMs === null) {
    // Placeholder matches the post-tick width (11 chars) so the
    // status-bar segment doesn't reflow when the real value lands.
    timer = "00:00:00:00";
  } else if (deltaMs <= 0) {
    timer = "agora";
  } else {
    timer = formatCountdown(deltaMs).compact;
  }

  // Static aria-label derived only from event metadata — no time
  // math (would violate the render-purity rule). The live time
  // digits are conveyed through the visible text inside the <span>.
  const label = next
    ? `Próximo show: ${next.title} — ${next.city}`
    : "Sem próxima data confirmada";

  return (
    <Link
      href="/agenda/"
      data-testid="footer-countdown"
      aria-label={label}
      title={label}
      className="no-underline text-win-ink hover:underline tabular-nums"
    >
      <span suppressHydrationWarning>{timer}</span>
    </Link>
  );
}