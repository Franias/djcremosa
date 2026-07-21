"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  formatCountdown,
  getNextEvent,
  parseDate,
  type CremosaEvent,
} from "@/lib/events";
import { Win95Window } from "@/components/ui/win95";

/**
 * NextEventCountdown — Win95-framed block that sits at the top of
 * the upcoming-events section on the home page.
 *
 * The site is a static export to GitHub Pages, so the timer runs on
 * the client only (the placeholder "00d 00h 00m 00s" ships in the
 * HTML, then hydration swaps in the real value). Ticks every second
 * because the test asserts the seconds field. Mock entries (slug
 * starts with `mock-`) are skipped — see `getNextEvent`.
 *
 * NOTE: this file was lost during a workspace stash-dance and has
 * been recreated with a minimal API. Future edits should restore
 * the original spec (compact timer + CTA + decorative arrow, etc).
 *
 * Architecture:
 *   - Pure `getNextEvent` on every render.
 *   - `useEffect` ticks `deltaMs = target - now` every 1s while
 *     the event is in the future.
 *   - `formatCountdown(deltaMs).full` is the visible string.
 *   - The whole block is a `<Link>` to `/agenda/` so the user can
 *     tap anywhere on the card to dive in.
 */
export function NextEventCountdown({ events }: { events: CremosaEvent[] }) {
  const next = getNextEvent(events);
  const [deltaMs, setDeltaMs] = useState<number | null>(null);

  useEffect(() => {
    if (!next) return;
    const startMs = parseDate(next.date).getTime();
    const tick = () => setDeltaMs(startMs - Date.now());
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, [next]);

  if (!next) return null;

  const timer =
    deltaMs === null
      ? "00d 00h 00m 00s"
      : formatCountdown(Math.max(0, deltaMs)).full;

  return (
    <Link
      href="/agenda/"
      data-testid="next-event-countdown"
      aria-label={`Próximo show: ${next.title}`}
      title={`Próximo show: ${next.title}`}
      className="no-underline block"
    >
      <Win95Window title="próximo show — contagem" controls closeable>
        <div
          className="p-4 sm:p-5 bg-win-face text-win-ink flex flex-col gap-2 text-center"
          data-testid="next-event-countdown-content"
        >
          <span
            data-testid="next-event-countdown-label"
            className="win-eyebrow-sm text-win-shadow-deep uppercase tracking-[0.18em]"
          >
            {"// next event countdown"}
          </span>
          <span
            data-testid="next-event-countdown-timer"
            suppressHydrationWarning
            className="win-h2 text-crimson tabular-nums"
          >
            {timer}
          </span>
          <span
            data-testid="next-event-countdown-event"
            className="win-body-sm text-win-ink"
          >
            {next.title} @ {next.city}
          </span>
        </div>
      </Win95Window>
    </Link>
  );
}
