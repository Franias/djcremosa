"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HomeIcon, MenuIcon } from "@/components/icons";
import { BOOKING_MAILTO, NAV_LINKS } from "@/components/nav/navLinks";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { MobileNavDrawer } from "@/components/nav/MobileNavDrawer";
import { site } from "@/lib/site";

/**
 * SiteNav — sticky Win95 title-bar that follows the user as they
 * scroll. Renders a single semantic <nav> with two responsive
 * children:
 *
 *   - On phones (<sm):  home icon + small brand chip + a hamburger
 *                       that opens <MobileNavDrawer/>. The drawer
 *                       is a portal-style overlay listing every
 *                       destination.
 *   - On sm and up:     home icon + 6 page links + a Booking chip
 *                       pinned right via `sm:ml-auto`. The chip
 *                       never gets clipped because the nav no
 *                       longer scrolls horizontally.
 *
 * The drawer pattern replaces the previous `overflow-x-auto` scroll
 * fallback because a horizontally-scrolling nav is unusable with a
 * thumb and the Booking chip often clipped on small phones. We keep
 * ONE <nav> in the DOM (responsive contents inside it) so screen
 * readers and tests don't see two principal-navigations stacked.
 *
 * Drawer auto-close: the drawer itself subscribes to the current
 * pathname and closes when it changes — keeping the state transition
 * inside a single component avoids a setState-in-effect linter rule
 * and the parent doesn't need to know about route changes.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 safe-x safe-top pt-3">
        <Win95Window
          title={`Cremosa · ${site.brand.tagline.primary}`}
          controls
        >
          <nav
            aria-label="Principal"
            className="px-2.5 sm:px-3 py-1.5 sm:py-2.5"
          >
            <ul className="flex items-center gap-2 list-none m-0 p-0 whitespace-nowrap">
              <li>
                <Link href="/" className="no-underline" aria-label="Início">
                  <Win95Button className="win95-nav-home">
                    <HomeIcon />
                  </Win95Button>
                </Link>
              </li>

              {/* Mobile-only chrome — hidden from sm up. Desktop
                  users see the full inline nav row below instead. */}
              <li className="sm:hidden min-w-0 grow truncate">
                <span className="win-eyebrow-sm text-win-shadow-deep truncate">
                  {"// navegação"}
                </span>
              </li>
              <li className="sm:hidden">
                <button
                  type="button"
                  aria-label="Abrir menu"
                  aria-expanded={drawerOpen}
                  // id on the drawer target makes the aria-controls
                  // association work for screen readers even before
                  // the drawer mounts.
                  aria-controls="mobile-nav-drawer-dialog"
                  onClick={() => setDrawerOpen(true)}
                  className="win95-button no-context"
                >
                  <MenuIcon />
                  <span className="hidden min-[360px]:inline">Menu</span>
                </button>
              </li>

              {/* Desktop-only nav links. ml-auto on the booking chip
                  pushes it to the right because no flex-grow sits
                  between home and the chip on wider screens. */}
              {NAV_LINKS.map((n) => {
                const active = pathname === n.href;
                return (
                  <li key={n.href} className="hidden sm:list-item">
                    <Link href={n.href} className="no-underline">
                      <Win95Button active={active} focused={active}>
                        {n.label}
                      </Win95Button>
                    </Link>
                  </li>
                );
              })}
              <li className="hidden sm:list-item sm:ml-auto">
                <Link
                  href={BOOKING_MAILTO(site.contact.bookingEmail)}
                  className="no-underline"
                >
                  <Win95Button focused>Booking →</Win95Button>
                </Link>
              </li>
            </ul>
          </nav>
        </Win95Window>
      </header>

      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
