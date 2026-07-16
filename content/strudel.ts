/**
 * strudel.ts — the live-coding patterns DJ Verbosa paints on
 * strudel.cc. Each entry is a complete, runnable Strudel program
 * (one process = one `setcpm` / `samples` setup + any number of
 * `$:` voices).
 *
 * Strudel is a JavaScript port of TidalCycles — `s()` picks a
 * sample, `loopAt/slice/seg/rib/bite` shape it, `adsr`/`lpf`/
 * `phaser`/`echewith` colour it, `sometimesBy`/`lastOf` sprinkle
 * variation, and `_punchcard()` is the project's visualizer mode.
 *
 * The page at `/dj-verbosa/` reads from this file so the patterns
 * stay editable in one place without touching the page component.
 *
 * To add a new pattern: append a new entry to `STRUDEL_PATTERNS`
 * with a unique `slug`, a short title, a one-line `note`, the full
 * `code` as a template literal (preserve the indentation of the
 * chain calls — it doesn't affect runtime but keeps the canvas
 * readable), and any extra `meta` flags you want the toolbar to
 * know about.
 */

export interface StrudelPattern {
  /** URL-safe id; used as React key + for the `#pattern=<slug>`
   *  hash so the page can deep-link to a specific pattern. */
  slug: string;
  /** Short display title (shown in the title bar + dropdown). */
  title: string;
  /** One-line genre / mood blurb (shown next to the copy button). */
  note: string;
  /** Approximate BPM. Strudel uses `setcpm` (cycles per minute) and
   *  `cps = cpm/60/4`, so the printed BPM here is informational —
   *  copy the pattern verbatim and Strudel will play it at its
   *  real tempo. */
  bpm?: number;
  /** Full Strudel program — multi-line, ready to paste into the
   *  strudel.cc REPL. The first non-empty line MUST be either
   *  `setcpm(...)` or `samples(...)` so the file parses top-down. */
  code: string;
}

export const STRUDEL_PATTERNS: ReadonlyArray<StrudelPattern> = [
  {
    slug: "clean-breaks-think",
    title: "think — clean breaks",
    note: "lofi hip-hop · sliced amen · punchcard visualizer",
    bpm: 130,
    code: `setcpm(130/4)
samples('github:yaxu/clean-breaks')

$: s("hh!1")._punchcard()
$: s("think")
  .loopAt(1)
  .slice(8, irand(8)).seg(8)
  .rib("<250 42 40 42 250 72 80 72>*2",1)
  .bite(16,"<[14 12 12 14] [ 12 [2 [2 3]]] [0 1]>*2")
  .adsr("0:0:1:0")
  .sometimesBy(.2, x=>x.lpf("<1000 100 2000 5000 700>*2").gain("<1.2 1.1 1.05 1.02>*2"))
  .sometimesBy(.25, x =>x.phaser("2").gain(1.2))
  .sometimesBy(.2, x =>x.echewith(3,3/16,(p,n) => p.coarse(.4)))
  .lastOf(4, x => x.off(0/128, y => y.speed(".3")))
  ._punchcard()
`,
  },
];

/**
 * Default pattern painted on the canvas when the page first loads.
 * Falls back to the first entry of `STRUDEL_PATTERNS` if the slug
 * isn't found (e.g. after a rename).
 */
export const DEFAULT_STRUDEL_SLUG = STRUDEL_PATTERNS[0]?.slug ?? "";

/** Lookup helper — keeps the page's slug → pattern wiring readable. */
export function findStrudelPattern(slug: string): StrudelPattern | undefined {
  return STRUDEL_PATTERNS.find((p) => p.slug === slug);
}