/**
 * text-files.ts — the .txt files exposed via the Paint95 "File" menu.
 *
 * Each entry maps to a plain UTF-8 .txt file living under
 * `/public/text-files/`. Clicking a file in the File dropdown fetches
 * the file and replaces the textarea contents — no rebuild required
 * to add a new file, just drop it in `public/text-files/` and append
 * a new entry here (GitHub Pages can't list directories, so this
 * manifest doubles as the discoverability index).
 *
 * The file order in the dropdown is the same as the array order
 * here — keep the most-used patterns at the top.
 *
 *   slug          URL-safe id, used as React key + for the URL hash
 *   title         Short label shown in the dropdown
 *   path          Path under /public/ (no leading slash, but the
 *                 basePath prefix is applied at fetch time)
 */

export interface TextFile {
  slug: string;
  title: string;
  /** Path relative to /public/ — basePath is applied at fetch time. */
  path: string;
}

export const TEXT_FILES: TextFile[] = [
  {
    slug: "clean-breaks",
    title: "clean-breaks",
    path: "text-files/clean-breaks.txt",
  },
  {
    slug: "baile-funk",
    title: "baile-funk",
    path: "text-files/baile-funk.txt",
  },
  {
    slug: "360-kaixi",
    title: "360-kaixi",
    path: "text-files/charlie-360-KAIXI.txt",

  },
];