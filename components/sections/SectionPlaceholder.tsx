/**
 * Stand-in for sections that are not built yet — keeps every nav link working
 * without empty 404s. Each page sets its own title/blurb/copy direction.
 */
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
      <section className="relative overflow-hidden grain">
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bubble mb-4">
            // {eyebrow}
          </p>
          <h1 className="font-display text-[18vw] sm:text-[10rem] leading-[0.85] bubble">
            {title.toUpperCase()}
          </h1>
          <p className="mt-6 max-w-2xl text-cream-dim text-base sm:text-lg">
            {blurb}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bubble mb-3">
          // em construção
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-cream mb-6">
          Próxima fase
        </h2>
        <ul className="list-none p-0 grid sm:grid-cols-2 gap-3">
          {comingSoon.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border border-line rounded-md px-4 py-3 bg-surface"
            >
              <span className="text-bubble mt-0.5">▸</span>
              <span className="text-cream text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-cream-dim text-sm">
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
