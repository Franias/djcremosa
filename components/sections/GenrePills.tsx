/**
 * GenrePills — the 6 capsule genre tags from page 2 of the Midia Kit.
 *
 * Layout: rendered as a horizontal row that the caller places below
 * the hero title. When `spread` is true, the pills spread out as a
 * fan offset vertically (used on home). When false, they sit in a
 * tight row (used on sobre, inside the pink manifesto section).
 */

const PILLS = ["HOUSE", "POP", "R&B", "FUNK BRASILEIRO", "RAP", "AMAPIANO"];

interface GenrePillsProps {
  /** When true, fan the pills vertically (large hero offset). */
  spread?: boolean;
}

export function GenrePills({ spread = true }: GenrePillsProps) {
  return (
    <ul
      aria-hidden
      className={[
        "flex flex-wrap items-center gap-2 sm:gap-3 list-none p-0",
        spread ? "mt-[-2rem] sm:mt-[-3rem] mb-6" : "mb-6",
      ].join(" ")}
    >
      {PILLS.map((g) => (
        <li key={g}>
          {/* <span className="cappill">{g}</span> */}
        </li>
      ))}
    </ul>
  );
}