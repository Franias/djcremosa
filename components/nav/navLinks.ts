/**
 * navLinks — single source of truth for the principal site
 * navigation. Both the desktop horizontal nav (<SiteNav/>) and
 * the mobile drawer (<MobileNavDrawer/>) read from this list so a
 * route rename only needs one edit.
 *
 * Order matters: the array is rendered top-to-bottom / left-to-right
 * in both UIs, so this list is also the visual order.
 *
 * Trailing slash to match Next.js's `trailingSlash: true` config.
 */

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: ReadonlyArray<NavLink> = [
  { href: "/agenda/", label: "Agenda" },
  { href: "/musica/", label: "Música" },
  { href: "/galeria/", label: "Galeria" },
  { href: "/videos/", label: "Vídeos" },
  { href: "/sobre/", label: "Sobre" },
  { href: "/contato/", label: "Contato" },
];

/**
 * Booking mailto — used by both the desktop nav chip and the
 * mobile drawer CTA. Centralized so the subject line stays in sync
 * with the footer + contact-page CTAs (see /contato).
 */
export const BOOKING_MAILTO = (email: string) =>
  `mailto:${email}?subject=${encodeURIComponent("Booking / proposta de show")}`;
