/**
 * cn — a tiny class-name combiner.
 *
 * Filters out falsy values and joins the rest with a space. Used
 * everywhere we conditionally add Tailwind classes so components
 * stay readable (instead of `[…].filter(Boolean).join(" ")`).
 *
 *   cn("foo", cond && "bar", undefined, "baz")  →  "foo bar baz"
 *   cn("foo", false, null, undefined)           →  "foo"
 *
 * If a project starts using `tailwind-merge` to dedupe conflicting
 * utility classes (e.g. `p-2 p-4`), swap this implementation for
 * `twMerge(cn(...))` from `tailwind-merge`. For this codebase the
 * combiner alone is enough.
 */
export function cn(
  ...values: Array<string | false | null | undefined | 0>
): string {
  let out = "";
  for (const v of values) {
    if (!v) continue;
    out = out ? `${out} ${v}` : v;
  }
  return out;
}
