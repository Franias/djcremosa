/**
 * Stand-in for sections that are not built yet — keeps every nav link
 * working without empty 404s. Each page sets its own title/blurb/copy
 * direction.
 *
 * Rendered as a Win95 "folder properties" dialog: shows what the
 * future section will contain (comingSoon list) plus links to the
 * agenda + booking email as a fallback for unimplemented routes.
 *
 * No action buttons here — the previous stub had OK/Cancelar that
 * did nothing. Better to send the user to a real working route than
 * to add a fake "confirm" they can't act on.
 */
import { Win95Window } from "@/components/ui/win95";

interface SectionPlaceholderProps {
  eyebrow: string;
  title: string;
  blurb: string;
  /** Bullet list of what this section will hold when fully built. */
  comingSoon: string[];
}

export function SectionPlaceholder({
  eyebrow,
  title,
  blurb,
  comingSoon,
}: SectionPlaceholderProps) {
  return (
    <>
      <section className="hero grain">
        <div className="shell relative z-10 flex flex-col items-center text-center">
          <p className="win-eyebrow text-bubble mb-4">{`// ${eyebrow}`}</p>
          <h1 className="win-display bubble text-[18vw] sm:text-[10rem]">
            {title.toUpperCase()}
          </h1>
          <p className="mt-6 max-w-2xl win-body text-cream-dim">{blurb}</p>
        </div>
      </section>

      <section className="shell py-16">
        <Win95Window title={`${title.toLowerCase()} — propriedades`} controls>
          <div className="p-5 sm:p-6 bg-win-face text-win-ink">
            <p className="win-eyebrow mb-3">{"// em construção"}</p>
            <p className="win-body-sm mb-4">
              A seção <strong>{title.toLowerCase()}</strong> ainda está em
              fase de conteúdo. O que vai ter aqui:
            </p>
            <ul className="list-none p-0 grid sm:grid-cols-2 gap-2">
              {comingSoon.map((item) => (
                <li key={item} className="flex items-start gap-2 win-body-sm">
                  <span>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Win95Window>

        <p className="mt-10 win-body-sm text-cream-dim">
          Até lá, confere a{" "}
          <a href="/agenda" className="text-bubble hover:text-bubble-hi">
            agenda
          </a>{" "}
          ou manda mensagem pelo{" "}
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_BOOKING_EMAIL ?? "franciellipdias@gmail.com"}`}
            className="text-bubble hover:text-bubble-hi"
          >
            booking
          </a>
          .
        </p>
      </section>
    </>
  );
}