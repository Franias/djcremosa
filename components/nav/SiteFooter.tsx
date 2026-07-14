import Link from "next/link";
import { Win95StatusBar } from "@/components/ui/win95";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-12 sm:mt-16 safe-x pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <Win95StatusBar>
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