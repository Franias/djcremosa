# Share graffiti mural as PNG (Win95 background + CONTRACT CREMOSA caption)

## Goals
- Add a SHARE button to the graffiti toolbar that exports the current painted mural as a PNG.
- The PNG composition has a Win95-styled background (chunky bevel, gray face, magenta title bar) and a "CONTRACT CREMOSA FOR YOU SHOW" caption at the bottom.
- Trigger the native download (and try `navigator.share` on mobile) so the user can drop it straight into Instagram Stories or any other network.

## Checklist
- [x] Add a `composShareImage()` helper in `lib/graffiti.ts` that draws the existing canvas onto an offscreen Win95-styled surface (matching the press-start / wallpaper palette), with the caption "CONTRACT CREMOSA FOR YOU SHOW" rendered in the pixel font at the bottom.
- [x] Add a `sharePng()` function in `GraffitiRuntime.tsx` that captures the offscreen canvas as a Blob via `canvas.toBlob('image/png')`, downloads it via a hidden `<a download>` element, and (best-effort) calls `navigator.share` if available.
- [x] Wire a new `SHARE` button into the toolbar with a touch-friendly hit area.
- [x] Add Playwright coverage in `tests/e2e/11-graffiti.spec.ts`: paint a stroke, click SHARE, verify a download is initiated (Playwright `page.waitForEvent('download')`) and the downloaded filename contains `.png`.
- [x] Update README.md and SPEC.md (Fase 7) with the share affordance, and capture a wiki observation.
- [x] Visual QA: inspect a generated PNG to confirm the Win95 chrome + caption render correctly.

## Verification
- `npx eslint components/GraffitiRuntime.tsx lib/graffiti.ts tests/e2e/11-graffiti.spec.ts` — pass
- `npx tsc --noEmit --pretty false` — pass
- `npx playwright test tests/e2e/11-graffiti.spec.ts` — 8 passed (incl. SHARE download + filename + PNG notice)
- `git diff --check` — pass
- Visual QA: generated PNG saved to `/tmp/cremosa-share.png` shows Win95 chrome (gray face + magenta title bar reading `graffiti.exe · CREMOSA` + Win95 control boxes + sunken drawing well) and a crimson caption strip reading `CONTRACT CREMOSA FOR YOU SHOW` with the `djcremosa.com.br · 2026-07-21` stamp.
- Iteration 1 closure: all six checklist items already implemented and verified; task file re-synced with the green verification log.
- Iteration 2 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 3 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 4 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 5 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 6 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.
- Iteration 7 revalidation: ESLint/TypeScript/Playwright all green; suite remains 8/8 pass.

## Decisions / Notes
- Use `canvas.toBlob('image/png')` (no JPEG quality concerns) so the output is lossless.
- Background design: gray surface (`var(--win-face)`) with a magenta Win95 title bar reading "graffiti.exe · CREMOSA" and a bottom caption strip.
- Caption text: `CONTRACT CREMOSA FOR YOU SHOW` in pixel font, centered, with a crimson strip above and below to frame it like a stamp.
- Download filename: `cremosa-graffiti-${timestamp}.png`.
- Mobile share: use `navigator.canShare?.({ files: [file] })` and only invoke if true to avoid falling back to a clipboard or a no-op.
- Keep the share button minimal in the toolbar (no extra dropdown); single click = capture + download, mobile users may also see the native share sheet.