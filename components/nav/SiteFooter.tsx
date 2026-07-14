import Link from "next/link";
import { Win95Button, Win95StatusBar, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

/**
 * SiteFooter — mirrors the SiteNav header so the two pieces of
 * chrome bookend the page symmetrically.
 *
 * Chrome match: the header is a `Win95Window` (raised frame + blue
 * gradient title bar + window controls + content row of buttons).
 * This footer now uses the same primitive:
 *
 *   ┌─ Cremosa · Porto Alegre · desde 2016      ─ □ × ─┐
 *   │ tagline                            [ Booking → ] │   ← content row
 *   │ ● Pronto · Porto Alegre | Cremosa · desde 2016 │   ← status bar
 *   └──────────────────────────────────────────────────┘
 *
 * The original Win95StatusBar is preserved as a real Win95 bottom
 * strip *inside* the window (that's where status bars actually
 * lived in Win9x — not floating standalone). The live clock the
 * StatusBar auto-renders (`--:--` placeholder → ticking HH:MM on
 * the client) lands in the right-most segment.
 *
 * Content row intent: match the header's nav-by-button shape, with
 * the brand tagline echoing the title bar above and the primary CTA
 * `Booking →` (matched across header + footer for the most
 * important page action).
 *
 * Title intent: header says positioning ("Seletora · Curadoria ·
 * Discotecagem"), footer says provenance ("Porto Alegre · desde
 * 2016"). Together they bracket the page.
 */
export function SiteFooter() {
  const portoAlegre = site.brand.location.split(",")[0] ?? site.brand.location;
  const title = `${site.brand.name} · ${portoAlegre} · desde ${site.brand.activeSince}`;

  return (
    <footer className="mt-12 sm:mt-16 safe-x pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <Win95Window title={title} controls>
        {/* Content row — mirrors the header's nav row layout:
            text segment on the left (truncates), primary CTA on
            the right. Same Win95Button treatment as the header's
            Booking →, including `focused` so it gets a magenta
            inner border (the only focused button in the footer
            chrome). */}
        <div className="px-2.5 sm:px-3 py-2 flex flex-wrap items-center gap-2">
          <span className="win-eyebrow-sm text-win-shadow-deep grow truncate min-w-0 basis-0">
            {site.brand.tagline.primary}
          </span>
          <Link href="/contato" className="no-underline shrink-0">
            <Win95Button focused>Booking →</Win95Button>
          </Link>
        </div>

        {/* Status bar — preserved as a real Win9x bottom strip
            *inside* the window. Carries the runtime system info:
            "● Pronto · Porto Alegre, RS — Brasil" on the left, the
            brand + tenure segment on sm+ viewports, and the live
            clock auto-added by Win95StatusBar in the right-most
            segment. Segments truncate with ellipsis on phones
            (see globals.css `.win95-statusbar-segment`). */}
        <Win95StatusBar>
          <span className="win95-statusbar-segment grow">
            {"● Pronto · "}
            {site.brand.location}
          </span>
          <span className="win95-statusbar-segment grow hidden sm:inline">
            {site.brand.name}
            {" · desde "}
            {site.brand.activeSince}
          </span>
        </Win95StatusBar>
      </Win95Window>
    </footer>
  );
}
