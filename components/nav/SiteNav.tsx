import Link from "next/link";
import { site } from "@/lib/site";

const NAV = [
  { href: "/agenda", label: "Agenda" },
  { href: "/musica", label: "Música" },
  { href: "/galeria", label: "Galeria" },
  { href: "/videos", label: "Vídeos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-bg/80 border-b border-line">
      <nav
        aria-label="Principal"
        className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between gap-6"
      >
        <Link
          href="/"
          className="font-display text-lg sm:text-xl leading-none bubble whitespace-nowrap"
          aria-label={`${site.brand.name} — início`}
        >
          {site.brand.name.toUpperCase()}
        </Link>

        <ul className="hidden md:flex items-center gap-1 list-none p-0">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="px-3 py-2 rounded-full text-sm text-cream-dim hover:text-cream hover:bg-surface-2 transition-colors"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${site.contact.bookingEmail}?subject=${encodeURIComponent(
            "Booking / proposta de show",
          )}`}
          className={[
            "hidden sm:inline-flex items-center px-4 py-2 rounded-full",
            "font-mono text-[10px] uppercase tracking-[0.22em]",
            "bg-bubble text-bg hover:bg-bubble-hi transition-colors",
          ].join(" ")}
        >
          Booking
        </a>
      </nav>

      {/* Mobile nav strip */}
      <nav
        aria-label="Principal (mobile)"
        className="md:hidden border-t border-line overflow-x-auto"
      >
        <ul className="flex items-center gap-1 px-5 py-2 list-none whitespace-nowrap">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                className="inline-block px-3 py-1 text-xs text-cream-dim hover:text-cream"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
