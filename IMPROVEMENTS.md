# Improvements Review — dj-cremosa

> A pragmatic audit of the current site, sorted by **effort:impact** ratio. Each item has a concrete description, a file pointer, and the rough cost of fixing it.

**Date of review:** 2026-07-13
**Reviewed:** `/Users/franciellidias/Projects/dj-cremosa` on branch `main`

---

## 🟢 Already good (don't break)

- **Static export + basePath strategy** — site builds to 7 routes + audio bundle, deploys to GitHub Pages cleanly
- **Win95 component library** (`components/ui/win95.tsx`) — 9 primitives (`Window`, `Button`, `StatusBar`, `MenuBar`, `Field`, `ProgressBar`, `Link`, `ModeRadio`, `ClockLive`) consistently used
- **Real audio reactivity** via Web Audio API (`lib/audio.ts`) — same-origin MP3s from `/public/audio/` drive the visualizer
- **Press Start gate** hides nav + locks scroll + persists state per session
- **Typography hierarchy** strict — Bagel Fat One for hero displays, VT323 (default body), Geist Mono only in Notepad
- **Conditional basePath** — dev runs at `/`, prod deploys at `/djcremosa/`

---

## 🟡 Quick wins (1-2 hours total)

### 1. Add `data-testid` to every interactive element
**Why:** Every test in `tests/PLAYWRIGHT-PLAN.md` uses fragile text/role selectors. Adding `data-testid="..."` to buttons gives tests stable hooks without polluting CSS classes.
**Effort:** ~30 min (mechanical pass through 80 elements)
**Impact:** Unblocks reliable E2E coverage

### 2. Add `<meta name="theme-color">` and favicon variants
**Why:** Currently `layout.tsx` ships only `/favicon.ico`. Mobile Safari + Chrome want `apple-touch-icon.png` (180×180) and `<meta name="theme-color" content="#0a0606">` so the address bar matches the dark theme.
**Effort:** ~15 min
**Impact:** Better "installed as PWA" / "added to home screen" UX; status bar color matches site

### 3. Pass `site.basePath` into `next.config.ts` header propagation
**Why:** The OG image (`/logo/cremosa-2000.png`) is hardcoded in `lib/site.ts` as `site.brand.logo.hero`. With conditional basePath, the absolute OG URL still works but could break on custom-domain deploy. Adding `metadata.metadataBase = new URL(...)` with `process.env.NEXT_PUBLIC_BASE_PATH` keeps OG URLs correct in both modes.
**Effort:** ~5 min
**Impact:** Future-proofs the OG image path

### 4. Save `site.brand.logo.hero` as `<Image />` (next/image)
**Why:** Right now `Logo.tsx` uses a plain `<img>` because of the static-export `unoptimized: true` workaround. Switching to `next/image` with `unoptimized` lets us get `srcset`, fixed-up paths, and lays the groundwork for switching to Vercel later.
**Effort:** ~10 min
**Impact:** Better default image handling, smaller LCP on big logos

### 5. Cache the SoundCloud oEmbed results at build time
**Why:** Currently `content/soundcloud.ts` is hard-coded. Once YouTube tracks rotate, titles stale. Add a build script that re-fetches oEmbed (no API key) and writes back; runnable via `npm run refresh:tracks`. Benefits all pages.
**Effort:** ~20 min
**Impact:** Track rotation over time

---

## 🟠 Medium-effort (half-day each)

### 6. Real `Press Start` audio cue
**Why:** Many Win9x boot screens had a startup WAV. Adding a tiny `<audio ref={audioRef}>` in `PressStartGate` that plays a 200ms chime on click adds polish. Source could be a generated WAV or a tiny CC0 asset.
**Effort:** ~30 min (find/chime sound, play on click)
**Impact:** Stronger retro feel, but controversial (can be loud) — gate behind user gesture intent

### 7. Build a `<ContactHub>` component to dedupe mailto/tel patterns
**Why:** The mailto pattern `mailto:franciellipdias@gmail.com?subject=${encodeURIComponent(...)}` appears 4+ times. Extract a helper component:
```tsx
<ContactHub to="..." subject="..." label="..." icon="..." />
```
**Effort:** ~1 hour
**Impact:** DRY-er contact handling across `/contato`, `/`, `/sobre`

### 8. Add a `@/content/site.ts → siteConfig` pattern
**Why:** Currently `lib/site.ts` exports brand colors, locations, aliases, but the album logos are at `public/logo/cremosa-{1200,2000}.png` instead of `content/logos.json` or similar. Content vs. config separation makes future add-ons (multi-artist, Remix-friendly) painless.
**Effort:** ~1 hour
**Impact:** Single source of truth for site-wide metadata

### 9. Move PressStartGate into a route-level layout
**Why:** Currently the gate is rendered inside `app/page.tsx` via `<PressStartGate>` wrapper. A route-level `(landing)` group lets you have a separate chrome (no nav, no footer) just for `/`.
**Effort:** ~30 min
**Impact:** Cleaner separation, better code organization

### 10. Add `manifest.webmanifest` for "Add to Home Screen"
**Why:** PWA-style install on Android/iOS. Showcases brand splash + name when user adds the site. With audio assets + service worker, you could even cache first-page paint for instant re-load.
**Effort:** ~45 min
**Impact:** "Feels like a real app" for repeat visitors

---

## 🔴 Larger items (1-2 days each)

### 11. SoundCloud embed in `/musica` (alongside MP3s)
**Status:** Removed in favor of MP3-driven analysis (cross-origin iframe can't be analyzed). **Bring back as a fallback**: if no MP3s loaded and user clicks a track, fall back to the existing `SoundCloudPlayer` iframe embed.
**Effort:** ~2 hours
**Impact:** Mobile users who can't drop MP3s still get a way to listen

### 12. RSS feed for agenda updates
**Why:** SPEC.md §5 mentions RSS as a Phase 4 deliverable. With the strict `events.ts` schema, generating `feed.xml` at build time is a static function. Hero of every DJ site.
**Effort:** ~2 hours
**Impact:** Subscribable updates; Google indexes it

### 13. Lighthouse CI in the deploy workflow
**Why:** A new visualizer shipped — need a regression net. Add `lhci` to `.github/workflows/`, configure perf budgets (≤100KB JS for `/`, ≤200KB JS for `/musica`, LCP ≤2.5s on `/musica`).
**Effort:** ~1 day
**Impact:** Catches perf regressions before deploy

### 14. Schema.org structured data (`Person`, `Event`, `MusicRecording`, `VideoObject`)
**Why:** JSON-LD `Person` on `/sobre`, `MusicEvent` on each `/agenda` row, `VideoObject` on each `/videos` card → richer Google search results (knowledge panel, event listings).
**Effort:** ~1 day
**Impact:** Significant SEO win; free Google knowledge panel if you're the canonical "DJ Cremosa"

### 15. Service Worker + offline shell
**Why:** Currently visiting the site offline shows Next.js's 404. Caching the home shell + visualizer JS would let `/musica` show "carregando..." on offline rather than blank.
**Effort:** ~1 day
**Impact:** Mobile UX on flaky networks (Pista is at clubs = bad wifi often)

### 16. Full keyboard shortcut layer
**Why:** Power users want `J/K` to skip tracks on `/musica`, `L` to toggle loop, `Space` to play. Currently only `Space` on splash. A `useHotkeys` hook would centralize this.
**Effort:** ~4 hours
**Impact:** "Pro-tool" feel matching the Winamp metaphor

---

## 🔵 Strategic questions (need your input)

### Q1. Hosting / multi-artist intent
Currently single-artist (`Cremosa`). If she's part of a collective (AfroJams) or works with co-DJs, would the site want a `/artists` index? If yes, refactor `lib/site.ts` to a generic "Entity" model.

### Q2. i18n
SPEC §6 mentions EN routes as a "future" item. Both `pt-BR` and `es` are plausible next steps (Cremosa's tracks have English + Portuguese titles). The current copy is hard-coded pt-BR — extracting strings to `messages/pt-BR.json` and `messages/en.json` would lay the groundwork.

### Q3. Source of truth for events
Currently `content/events.ts` is hand-edited. SPEC mentions Sanity / Notion as Phase 5. If you want this hooked up to a CMS soon, the schema is ready (`CremosaEvent` interface) but importing it from a CMS will require an `npm run sync:events` step.

### Q4. Booking pipeline
The mailto: for booking works, but for a real booking flow (Cremosa gets 50+ inquiries/month) you'd want a form → email pipeline with spam protection. Options: Resend + React Email (cheap, ~$0 per email), Formspree (free tier: 50/mo), Buttondown (free, no branding).

### Q5. Analytics
Currently zero analytics. Privacy-friendly options:
- **Plausible** (paid, $9/mo, GDPR-friendly)
- **Umami** (self-hostable, free)
- **Vercel Analytics** (free tier, requires moving off GitHub Pages)

I'd recommend **Plausible** if the budget allows — single script tag, no cookie banner needed.

---

## 📝 Recommended order of attack

1. **Add `data-testid`** (#1) — unblocks Playwright tests
2. **theme-color + apple-touch-icon** (#2) — 1 polish commit before anything else
3. **Build the first 4 Playwright tests** (`01-press-start`, `02-home`, `05-contato`, `07-videos`) — fastest E2E wins
4. **Schema.org structured data** (#14) — biggest SEO return per hour invested
5. **RSS feed** (#12) — visible improvement, ~2 hours
6. **Lighthouse CI** (#13) — installs a regression net that pays off forever
7. **SoundCloud fallback** (#11) — restores parity for mobile
8. **Strategic review** — book a session to walk through Q1-Q5

---

## 🧹 Tech debt (smaller fixes worth doing)

- **`Sparkle` unused import** in `PressStartGate.tsx` — leftover from the design phase, dead code
- **Loading screen never used** — `components/LoadingScreen.tsx` is still around but no longer imported anywhere. Either delete it or restore it on first visit
- **`fmt(0)` returns `00:00` for missing durations** — currently `20-minutinhos.mp3` shows `19:46` correctly but the helper returns `00:00` for tracks without `durationSec`. Defensive: show `--:--` instead
- **`Maybe<>` pattern on `audio.duration`** in `AgendaView.tsx` — `Number.isFinite(audio.duration)` check is duplicated
- **`/agenda` uses client-side routing** (`useSearchParams`) while the rest is server-rendered — fine, but a `<noscript>` fallback would help SEO/no-JS users
- **`colorScheme` metadata** isn't set — currently dark-only; could add `light` scheme option if you ever want to support a light palette alongside

---

## 🧠 Things that surprised me (architectural notes)

1. **Conditional basePath** is unusual — most Next.js sites use a single basePath and a separate dev port. Worth documenting in `SPEC.md` §7 why we made this choice (so a future contributor doesn't revert it).
2. **`PressStartGate`'s `useCallback([start])`** uses `setDecided(true)` in a `popstate` handler — fine, but worth a comment explaining why not `useSyncExternalStore` (which is the React 18+ canonical pattern).
3. **The visualizer's `useEffect` cleanup** resets `beatEnergyRef` directly. If we add more state that depends on this, consider a `useReducer` or even a small state machine (XState).
4. **Songs are deduped** by `slug` in `content/soundcloud.ts` but not enforced by the data schema — could add a `Set<slug>` guard at build time using `zod` or a runtime assertion.

---

## Last updated

2026-07-13 · code state at commit `main` · reviewed by automated audit
