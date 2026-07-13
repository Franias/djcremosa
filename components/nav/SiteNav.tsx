import Link from "next/link";
import { Win95Button, Win95Window } from "@/components/ui/win95";
import { site } from "@/lib/site";

const NAV = [
  { href: "/agenda/", label: "Agenda", mnemonic: "A" },
  { href: "/musica/", label: "Música", mnemonic: "M" },
  { href: "/galeria/", label: "Galeria", mnemonic: "G" },
  { href: "/videos/", label: "Vídeos", mnemonic: "V" },
  { href: "/sobre/", label: "Sobre", mnemonic: "S" },
  { href: "/contato/", label: "Contato", mnemonic: "C" },
];

/**
 * Pixel-style home icon. Inlined SVG so it stays crisp at any DPI and
 * inherits `currentColor` from the Win95 button (black ink inside the
 * gray face surface).
 */
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="14"
      height="14"
      className={className}
      shapeRendering="crispEdges"
    >
      {/* Roof */}
      <path d="M8 1 L1 7 L2 7 L8 2 L14 7 L15 7 Z" fill="currentColor" />
      {/* Walls + door */}
      <path d="M3 7 L3 14 L7 14 L7 10 L9 10 L9 14 L13 14 L13 7 Z" fill="currentColor" />
    </svg>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3">
      <Win95Window title={`Cremosa · ${site.brand.tagline.primary}`} controls>
        <nav
          aria-label="Principal"
          className="px-3 py-2.5 overflow-x-auto"
        >
          <ul className="flex items-center gap-2 list-none whitespace-nowrap m-0 p-0">
            {/* Home — icon-only Win95 button, links to root */}
            <li>
              <Link href="/" className="no-underline" aria-label="Início">
                <Win95Button>
                  <HomeIcon />
                </Win95Button>
              </Link>
            </li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="no-underline">
                  <Win95Button>{n.label}</Win95Button>
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                href={`mailto:${site.contact.bookingEmail}?subject=${encodeURIComponent(
                  "Booking / proposta de show",
                )}`}
                className="no-underline"
              >
                <Win95Button focused>Booking →</Win95Button>
              </Link>
            </li>
          </ul>
        </nav>
      </Win95Window>
    </header>
  );
}
