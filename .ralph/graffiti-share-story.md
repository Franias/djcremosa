# Share PNG: Instagram Story 9:16 portrait format with mobile framing

## Goals
- Add an Instagram Story variant of the share PNG export (1080×1920 portrait, 9:16) so users can post straight to Stories.
- Re-frame the painted mural as if it were the mobile graffiti: rotate the landscape source 90° clockwise so the painted stroke spans the full Story width, anchored between a Win95 title bar at top and the brand-blue caption + status bar footer at the bottom.
- Keep the same Win95 chrome language (gray face, brand-blue title/caption, footer mirror) but make it mobile-portrait proportioned.

## Checklist
- [x] Add `composShareStoryImage()` in `lib/graffiti.ts` that targets a 1080×1920 Story canvas with a Win95 chrome layout (title bar, rotated mural, caption strip, footer).
- [x] Wire a `INSTAGRAM STORY` (or compact `STORY`) button into the graffiti toolbar next to SHARE so the existing SHARE button keeps the landscape deliverable.
- [x] Add Playwright coverage in `tests/e2e/11-graffiti.spec.ts` that asserts both downloads happen and the Story image has the portrait data-URL aspect ratio.
- [x] Update README.md + SPEC.md (Fase 7) and capture a wiki observation/retro.
- [x] Visual QA: inspect `/tmp/cremosa-share-story.png` to confirm 9:16 framing, top title bar, mobile-style mural span, blue caption strip + footer at the bottom.

## Verification
- `npx eslint components/GraffitiRuntime.tsx lib/graffiti.ts tests/e2e/11-graffiti.spec.ts` — pass
- `npx tsc --noEmit --pretty false` — pass
- `npx playwright test tests/e2e/11-graffiti.spec.ts` — 10 passed (incl. STORY download + filename `cremosa-graffiti-story-*.png` + `PNG salvo · …` notice)
- Visual QA at `/tmp/cremosa-share-story.png` — 1080×1920 PNG with rotated mural, Win95 chrome, caption, footer
- `git diff --check` — pass

## Decisions / Notes
- Story target dimensions: 1080×1920 (Instagram Story standard).
- Mural rotation: 90° clockwise so the existing landscape painting fits the portrait Story frame width.
- Scaling: cover-fit the rotated mural into the available middle band (so on every device ratio the painting is edge-to-edge).
- Caption copy stays the same; the brand URL stamp moves below the caption.
- Toolbar: add a second compact button (e.g. "STORY") right after SHARE so both deliverables coexist.
- Use a separate `composShareStoryImage` function (don't conflate it with the landscape `composShareImage`) so the existing SHARE flow stays untouched.
- Filename: `cremosa-graffiti-story-${timestamp}.png`.
- Iteration 1 closure: all five checklist items already implemented and verified.
- Iteration 2 revalidation: ESLint/TypeScript/Playwright all green; suite remains 10/10 pass.
- Iteration 3 revalidation: ESLint/TypeScript/Playwright all green; suite remains 10/10 pass.
- Iteration 4 revalidation: ESLint/TypeScript/Playwright all green; suite remains 10/10 pass.
- Iteration 5 revalidation: ESLint/TypeScript/Playwright all green; suite remains 10/10 pass.