# Playwright Test Plan — dj-cremosa

> A starter plan for end-to-end testing with [Playwright](https://playwright.dev/). This document covers setup, file structure, helpers, and concrete test scenarios for each route. Drop the directory into a fresh repo, install Playwright, and run.
>
> Selectors in `{{ double braces }}` come from [`./button-inventory.md`](./button-inventory.md) — update those as you add or rename elements. Selectors prefixed with `data-testid` should be added to the production components for stable testing.

## Setup

```bash
cd /Users/franciellidias/Projects/dj-cremosa
npm install --save-dev @playwright/test
npx playwright install --with-deps    # downloads browser binaries

# In package.json scripts:
"test":            "playwright test",
"test:ui":         "playwright test --ui",
"test:debug":      "playwright test --debug",
"test:report":     "playwright show-report"
```

### `playwright.config.ts`

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Match production viewport for a mobile-first site
    viewport: { width: 414, height: 896 },
  },
  projects: [
    { name: "desktop-chrome",  use: { ...devices["Desktop Chrome"],   viewport: { width: 1440, height: 900 } } },
    { name: "mobile-safari",   use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

## File layout

```
tests/
├── PLAYWRIGHT-PLAN.md      ← this file
├── button-inventory.md     ← human-readable catalog of UI elements
├── button-inventory.ts     ← typed token table for stable selectors
├── helpers/
│   ├── nav.ts              ← waitForHeroPress, scrollPastHero, etc.
│   ├── audio.ts            ← audio-context mocks for /musica
│   └── seed-state.ts       ← sessionStorage helpers (splash skip)
└── e2e/
    ├── 01-press-start.spec.ts
    ├── 02-home.spec.ts
    ├── 03-agenda.spec.ts
    ├── 04-sobre.spec.ts
    ├── 05-contato.spec.ts
    ├── 06-musica.spec.ts
    ├── 07-videos.spec.ts
    └── 08-galeria.spec.ts
```

## Test scenarios

### `01-press-start.spec.ts` — Press Start gate (`/`)

| Test | Action | Assert |
|------|--------|--------|
| Splash renders | visit `/` | `{{splash}}` overlay visible, contains "Press Start" text |
| Click-through | click `{{press-start}}` | splash fades out (380ms), `{{header}}` becomes visible, `{{h1=hero}}` Cremosa logo in DOM |
| Keyboard skip | focus splash, press Enter | same as click |
| Space key | focus splash, press Space | same as click |
| URL skip | visit `/?skipGate=1` | splash not rendered, home content visible immediately |
| Replay protection | click through, reload | splash NOT rendered (sessionStorage flag set) |
| Hide nav during splash | visit `/` before clicking | `{{header}}` is `display: none` (CSS `body[data-gate-active]` attribute) |
| Re-show nav after dismiss | click through | `{{header}}` is `display: flex` (body[data-gate-active] removed) |
| Body scroll lock | visit `/` before clicking | `document.body.style.overflow === "hidden"` |
| Progress bar fills | visit `/` | bar width animates from 0 → 100% over 2000ms |

### `02-home.spec.ts` — Home page (`/djcremosa/`)

| Test | Action | Assert |
|------|--------|--------|
| Hero displays | visit `/` (skip gate) | `{{h1=hero}}` shows "CREMOSA" bubble-strong |
| About dialog | scroll | `{{dialog=readme}}` and `{{dialog=propriedades}}` visible |
| Upcoming preview | scroll | `{{h2="Em rota"}}` shows next events |
| Press highlights | scroll | `{{h2="Dez anos"}}` Win95 window with 5 highlights |
| Desktop icons | scroll | 5 icons render (Sets, Notas, Agenda, Vídeos, Galeria) |
| Nav links | click `{{nav=agenda}}` | navigate to `/agenda/` |
| Footer status bar | scroll to bottom | `{{statusbar}}` shows "● Pronto" + clock |

### `03-agenda.spec.ts` — Agenda (`/agenda/`)

| Test | Action | Assert |
|------|--------|--------|
| FilterPróximas | click `{{filter=upcoming}}` | URL becomes `/agenda/?view=upcoming`, list filtered |
| FilterHistórico | click `{{filter=past}}` | URL `/agenda/?view=past` |
| FilterTudo | click `{{filter=all}}` | URL `/agenda/?view=all`, all events shown |
| EventCard renders | click a past event | `{{event-card}}` shows date, venue, title |
| Empty state (future) | advance system clock past all events | `{{dialog="nada agendado"}}` shown |

### `04-sobre.spec.ts` — Sobre (`/sobre/`)

| Test | Action | Assert |
|------|--------|--------|
| Hero loads | visit | `{{h1=sobre}}` bubble-strong |
| Pink manifesto | scroll | `{{section=pink}}` with manifesto text |
| Properties dialog | scroll | `{{dl=props}}` shows Name, City, etc. |
| Notepad carreira | scroll | two Notepad windows rendered |
| Timeline | scroll | 6 `{{year-card}}` tiles in grid |

### `05-contato.spec.ts` — Contato (`/contato/`)

| Test | Action | Assert |
|------|--------|--------|
| 4 contact cards | visit | `{{card=booking}}`, `{{card=imprensa}}`, `{{card=telefone}}`, `{{card=instagram}}` all visible |
| Mailto opens | click `{{card=booking}}` mailto link | `mailto:franciellipdias@gmail.com?subject=...` is the href |
| Phone link | click `{{card=telefone}}` tel link | `tel:+5551993723158` is the href |
| Press kit request | scroll to footer | `{{dialog=press-kit}}` with `?subject=Solicitar press kit` mailto |

### `06-musica.spec.ts` — Música (`/musica/`) — the complex one

| Test | Action | Assert |
|------|--------|--------|
| Default rig loads | visit (autoplay blocked) | `{{bpm-readout}}` shows `-- BPM`, `{{statusbar}}` shows "idle" |
| Click track in playlist | click row 3 | `{{statusbar}}` shows "▶ playing" or "❚❚ paused" |
| Switch tracks | click row 1, then row 5 | current row highlight changes from row 1 → 5 |
| Visualizer mode switch | click `{{mode=spectrum}}` | spectrum bars render; click `{{mode=scope}}` → oscilloscope renders |
| BPM fills | wait 30s while playing | BPM readout shows a number near the track's tempo |
| Progress bar scrubbing | click middle of `{{scrubber}}` | `rig.audio.currentTime` advances, UI updates |
| Pause / Resume | click `{{btn=pause}}` then `{{btn=play}}` | `isPlaying` toggles, pulse animation stops/starts |
| Drag MP3 to page | dispatch drop event | `{{statusbar}}` shows current track as uploaded |
| File picker | click `{{btn=pick-file}}` (in transport) | native file dialog opens (mock with `setInputFiles`) |
| Visualizer lightbox | n/a | covered in 08-galeria.spec.ts |

### `07-videos.spec.ts` — Vídeos (`/videos/`)

| Test | Action | Assert |
|------|--------|--------|
| Channel header | visit | `{{channel-banner}}` img + `{{channel-avatar}}` img + `{{channel-name}}` "CREMOSA" + `{{channel-handle}}` "@cremos4" |
| Subscribe URL | click `{{btn=subscribe}}` (hero) | opens `youtube.com/@cremos4?sub_confirmation=1` in new tab |
| Featured player | click `{{thumb=video}}` (first featured) | iframe appears with `youtube.com/embed/VIDEO_ID?autoplay=1` |
| Switch featured video | close first, click second | iframe src changes to second video |
| Archive card | click `{{card=archive}}` | opens `youtube.com/watch?v=ID` in new tab |

### `08-galeria.spec.ts` — Galeria (`/galeria/`)

| Test | Action | Assert |
|------|--------|--------|
| Filter chips | click each chip | list filters by context (show/residência/coletivo) |
| Tile click | click `{{tile=afro-hellmanns}}` | `{{lightbox}}` opens with image, Fechar × button |
| Lightbox progress | during load | `{{progress-bar}}` in lightbox fills via animation |
| Fechar button | click `{{btn=close-lightbox}}` | lightbox closes, no console errors |

### Cross-cutting

- **Splash session storage**: opens splash once per session across navigations
- **Color contrast**: scan body text + button text for WCAG AA
- **Keyboard navigation**: `Tab` through every interactive element in order
- **Mobile layout**: every page at 414×896 (use the `mobile-safari` project)
- **No console errors**: any page load → expect 0 console errors
- **Static export**: `npm run build && npx serve out` should serve all routes with no 404s

## Selectors strategy

Prefer these patterns in order:

1. **`data-testid="..."`** — add stable test IDs to the production components (component-level audit pending)
2. **`text="..."`** — for visible labels (Playwright `getByText`)
3. **`role="..."` + `name`/`text`** — for accessible-name lookups (`getByRole('button', { name: '...' })`)
4. **CSS class chains** — last resort, brittle to styling changes

When the token table is in `button-inventory.ts`, tests can import the tokens:
```ts
import { tokens } from "../button-inventory";
await page.getByRole("button", { name: tokens.musica.playlistRow(3) });
```

## Helpers

### `helpers/nav.ts`
```ts
import type { Page } from "@playwright/test";

/** Skip the Press Start splash so subsequent tests don't get blocked. */
export async function skipSplash(page: Page) {
  await page.goto("/?skipGate=1");
}

/** Wait until the splash overlay has unmounted (i.e. user clicked through). */
export async function clickThroughSplash(page: Page) {
  await page.getByText(/press start/i).click();
  await page.waitForFunction(
    () => !document.querySelector('[role="dialog"][aria-label*="press start"]'),
  );
}
```

### `helpers/audio.ts`
Mock `AudioContext` so tests don't actually decode audio. Use `page.addInitScript`:
```ts
import type { Page } from "@playwright/test";

/** Replace Web Audio API with a no-op so /musica tests don't hit real audio. */
export async function mockAudioContext(page: Page) {
  await page.addInitScript(() => {
    window.AudioContext = class {
      createAnalyser() { return { frequencyBinCount: 128, fftSize: 256, getByteFrequencyData: () => {}, getByteTimeDomainData: () => {} }; }
      createMediaElementSource() { return { connect: () => ({}) }; }
      get destination() { return { connect: () => ({}) }; }
      resume() { return Promise.resolve(); }
    } as unknown as typeof AudioContext;
  });
}
```

### `helpers/seed-state.ts`
```ts
/** Mark the splash + Press Start as already seen so tests don't get gated. */
export async function skipAllGates(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("cremosa-splash-seen", "1");
    sessionStorage.setItem("cremosa-pressed-start", "1");
  });
}
```

## CI integration

In `.github/workflows/ci.yml` (extending the existing `.github/workflows/deploy.yml`):
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run sync:audio # audio rig from backup
      - run: npm run test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
```

## Open follow-ups

- [ ] Add `data-testid="..."` to each component listed in the inventory
- [ ] Wire the inventory into a Vitest/Jest side-test so non-E2E smoke tests can assert button presence
- [ ] Add Lighthouse perf thresholds to the test runner
- [ ] Add visual regression tests with `playwright-screenshot` snapshots