import Link from "next/link";
import { Win95StatusBar } from "@/components/ui/win95";
import { site } from "@/lib/site";

/**
 * SiteFooter — page-level footer chrome. Pinned to the viewport
 * bottom via `fixed bottom-0`, mirroring the header's `sticky top-0`
 * so the bookend chrome stays visible while the user scrolls.
 *
 *   z-30   — matches SiteNav's z-30 so the footer sits at the same
 *            stack layer as the header (above content at z-10, above
 *            the decorative VerticalRails at z-20). They live at
 *            opposite edges so they don't actually overlap.
 *
 *   safe-x + safe-bottom
 *          — globals.css utilities that apply horizontal safe-area
 *            insets + the iPhone home-indicator safe area. The
 *            Win95StatusBar inside is pushed above the home indicator.
 *
 *   The Win95StatusBar gets the `win95-statusbar--pinned` modifier
 *   class (defined in globals.css) so its chrome matches the
 *   `win95-bevel-out` rhythm of the header: 2px white top/left +
 *   2px gray right/bottom, no inset face-2 highlight.
 *
 *   Main in layout.tsx adds matching bottom padding so content
 *   never scrolls behind the footer.
 */
export function SiteFooter() {
  return (
    <footer className="fixed bottom-0 inset-x-0 z-30 safe-x safe-bottom">
      <Win95StatusBar className="win95-statusbar--pinned">
        <span className="win95-statusbar-segment grow">
          ● Pronto · {site.brand.location}
        </span>
        <span className="win95-statusbar-segment grow hidden sm:inline">
          {site.brand.name} · desde {site.brand.activeSince}
        </span>
        <span className="win95-statusbar-segment shrink">
          <Link
            href="/contato"
            className="no-underline text-win-ink hover:underline"
          >
            Booking →
          </Link>
        </span>
      </Win95StatusBar>
    </footer>
  );
}