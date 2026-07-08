import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <p className="font-display text-3xl bubble leading-none">
            {site.brand.name.toUpperCase()}
          </p>
          <p className="text-cream-dim text-sm mt-3 max-w-xs">
            {site.brand.tagline.secondary}
          </p>
          <p className="text-cream-dim text-xs mt-4 font-mono uppercase tracking-[0.18em]">
            {site.brand.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12 text-sm">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mb-2">
              Contato
            </p>
            <ul className="list-none p-0 flex flex-col gap-1">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-cream hover:text-bubble transition-colors break-all"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="text-cream-dim hover:text-cream transition-colors"
                >
                  {site.contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bubble mb-2">
              Onde me achar
            </p>
            <ul className="list-none p-0 flex flex-col gap-1">
              {site.social.instagram && (
                <li>
                  <a
                    href={site.social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream hover:text-bubble transition-colors"
                  >
                    Instagram · {site.social.instagram.handle}
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/agenda"
                  className="text-cream-dim hover:text-cream transition-colors"
                >
                  Próximos shows
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-dim">
            © {new Date().getFullYear()} {site.brand.name} · desde{" "}
            {site.brand.activeSince}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-dim">
            construído com Next.js · TypeScript · Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
