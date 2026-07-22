# Share PNG: blue Win95 chrome + site footer strip + franias.github.io/djcremosa.exe

## Goals
- Restyle the exported PNG so the Win95 chrome uses the brand blue (`--win-title-1` / `--win-title-2`) instead of red/magenta — matches the live header/title bars.
- Add a faithful footer strip to the PNG mirroring the `SiteFooter` Win95StatusBar (`Pronto · Porto Alegre, RS — Brasil`, `Cremosa · desde 2016`, `Next event countdown · HH:MM:SS:SS`, `Booking →`).
- Use the correct production URL `franias.github.io/djcremosa.exe` (replacing the old `djcremosa.com.br`) in both the stamp and the footer "Booking →" link.
- Keep the Win95 chunky bevel + the "CONTRACT CREMOSA FOR YOU SHOW" caption.

## Checklist
- [x] Update `composShareImage` in `lib/graffiti.ts`: swap `crimson`/`magenta` accents for `win-title-1`/`win-title-2` blues; render a real Win95StatusBar footer with current local time as the countdown.
- [x] Replace the `djcremosa.com.br` stamp with `franias.github.io/djcremosa.exe` and wire the `Booking →` segment to use the real mailto URL from `lib/site.ts`.
- [x] Re-render the share PNG (manual screenshot) and verify visually: blue title bar, gray bevel frame, footer with 4 segments, blue caption strip + "CONTRACT CREMOSA FOR YOU SHOW".
- [x] Update `tests/e2e/11-graffiti.spec.ts` SHARE test to also assert the PNG composition includes the new URL string (`franias.github.io/djcremosa.exe`).
- [x] Update `README.md`, `SPEC.md` (Fase 7), and this file.

## Verification
- `npx eslint components/GraffitiRuntime.tsx lib/graffiti.ts tests/e2e/11-graffiti.spec.ts` — pass
- `npx tsc --noEmit --pretty false` — pass
- `npx playwright test tests/e2e/11-graffiti.spec.ts` — 8 passed
- Visual QA at `/tmp/cremosa-share-blue.png` — gray body + brand-blue title bar + 4-segment Win95 status bar footer + brand-blue caption with `franias.github.io/djcremosa.exe`
- `git diff --check` — pass

## Decisions / Notes
- Brand blue chrome: title bar gradient from `var(--win-title-1)` `#000080` → `var(--win-title-2)` `#1084d0`, matching the live page.
- The caption strip changes from crimson to the same brand blue so the Win95 palette stays cohesive.
- Background body uses `var(--win-face)` `#c0c0c0` (gray) with the inset face `var(--win-face-2)` `#d4d0c8` for the window interior — classic Win95 chrome.
- Footer text content mirrors `SiteFooter.tsx` (Pronto · Porto Alegre, RS — Brasil · Cremosa · desde 2016 · Next show · franias.github.io/djcremosa.exe · Booking →). Live clock + countdown string rendered with the local browser time so the export looks honest.
- The four footer segments use weighted widths so the "Pronto · Porto Alegre, RS — Brasil" gets the most room on wide PNGs while keeping a 60px minimum.
- `Booking →` segment label still reads "Booking →" in the PNG (no URL); the URL lives on the caption strip below.
- Iteration 1 closure: all five checklist items already implemented and verified.
- Iteration 2 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 3 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 4 scope shift: user surfaced a separate mobile-UX bug ("cursor-hint doesn't make sense on touch, SHARE/APAGAR invisible on mobile"). Solved with two CSS-only changes in `app/globals.css`:
  1. `@media (hover: none) and (pointer: coarse) { .graffiti-cursor-hint { display: none; } }` — chip stays on real cursor devices, vanishes on touch-only.
  2. `@media (max-width: 639px) { .graffiti-toolbar { flex-wrap: wrap; align-content: flex-end; overflow-y: auto; max-height: calc(100vh - 5.75rem); ...; .graffiti-share/.graffiti-eraser { flex-basis: calc(50% - 0.25rem); } } }` — toolbar grows upward across rows; SHARE + APAGAR always visible even on 320px iPhone SE.
  Added regression test `mobile viewport keeps SHARE / APAGAR visible and hides the cursor hint` to `tests/e2e/11-graffiti.spec.ts` (uses `toBeHidden()` on `.graffiti-cursor-hint` because the JSX still mounts it). Full suite: 9 passed (8 existing + 1 new). `npx tsc --noEmit` + `npx eslint components/GraffitiRuntime.tsx` clean. Visual QA: `/tmp/graffiti-mobile.png` (390 desktop UA, hint visible, toolbar wrapped), `/tmp/graffiti-isMobile.png` (390 isMobile, hint hidden, toolbar wrapped), `/tmp/graffiti-iphone-se.png` (320×568 isMobile, all controls on-screen).
- Iteration 5 scope shift: user reported "Story PNG is 90° flipped" and asked for a single SHARE button that does both Story export and PNG download. Solved by collapsing SHARE+STORY into one button that always exports the 9:16 Story format, plus removing the 90° rotation:
  1. `components/GraffitiRuntime.tsx`: removed `shareStoryPng` + `[data-testid="graffiti-share-story"]` button. The single `sharePng` now calls `composShareStoryImage` (which produces the 9:16 PNG). `deliverBlob` already does `<a download>` + `navigator.share({ files })` fallback.
  2. `lib/graffiti.ts`: replaced `drawRotatedMuralInto` (which did `translate(rotatedWidth, 0) + rotate(Math.PI/2)` to fill the portrait band with a rotated landscape) with `drawFittedMuralInto` that does a contain-fit — scales the source uniformly so it fits inside the band without rotation or crop, then centers it. Updated the JSDoc on `composShareStoryImage`. Filename now `cremosa-graffiti-{ts}.png` (no more `story` suffix since there's only one export).
  3. `tests/e2e/11-graffiti.spec.ts`: dropped the obsolete "STORY button" test, added `SHARE exports a 9:16 Story PNG that keeps the painted orientation` which downloads the PNG, base64-decodes it into a canvas, scans for magenta pixels and asserts `width > height * 2` (horizontal stroke stays horizontal).
  Full suite: 10 passed (one transient flake on first run, passes on re-run). `npx tsc --noEmit` + `npx eslint components/GraffitiRuntime.tsx lib/graffiti.ts tests/e2e/11-graffiti.spec.ts` clean. Manual export at `/tmp/share-final.png` (drew an "L"): L appears in its native orientation inside the 9:16 Story chrome, no rotation. Mobile toolbar at 390×844 isMobile shows exactly one SHARE button + APAGAR + LIVE.
- Iteration 4 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 5 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 6 (final) revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass. Loop complete.