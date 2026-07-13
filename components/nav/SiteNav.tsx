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

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 px-3 pt-3">
      <Win95Window title={`Cremosa · ${site.brand.tagline.primary}`} controls>
        <nav
          aria-label="Principal"
          className="px-3 py-2.5 overflow-x-auto"
        >
          <ul className="flex items-center gap-2 list-none whitespace-nowrap m-0 p-0">
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
