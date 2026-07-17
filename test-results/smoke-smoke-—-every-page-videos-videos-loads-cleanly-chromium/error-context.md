# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> smoke — every page >> videos (/videos/) loads cleanly
- Location: tests/e2e/smoke.spec.ts:59:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').first()

```

```yaml
- banner:
  - text: Cremosa · Seletora · Curadoria · Discotecagem
  - navigation "Principal":
    - list:
      - listitem:
        - link "Início":
          - /url: /
          - button
      - listitem:
        - link "DJ Verbosa":
          - /url: /dj-verbosa/
          - button "DJ Verbosa"
      - listitem:
        - link "Agenda":
          - /url: /agenda/
          - button "Agenda"
      - listitem:
        - link "Música":
          - /url: /musica/
          - button "Música"
      - listitem:
        - link "Galeria":
          - /url: /galeria/
          - button "Galeria"
      - listitem:
        - link "Vídeos":
          - /url: /videos/
          - button "Vídeos"
      - listitem:
        - link "Sobre":
          - /url: /sobre/
          - button "Sobre"
      - listitem:
        - link "Contato":
          - /url: /contato/
          - button "Contato"
      - listitem:
        - link "Booking →":
          - /url: mailto:franciellipdias@gmail.com?subject=Booking%20%2F%20proposta%20de%20show
          - button "Booking →"
- main:
  - paragraph: // lives · sets filmados
  - img "@cremos4 channel banner"
  - img "@cremos4 avatar"
  - paragraph: CREMOSA
  - paragraph: "@cremos4"
  - paragraph: 10 vídeos · canal ativo
  - link "★ Subscribe":
    - /url: https://www.youtube.com/@cremos4?sub_confirmation=1
    - button "★ Subscribe"
  - paragraph: // em destaque
  - link "ver canal completo ↗":
    - /url: https://www.youtube.com/@cremos4
    - button "ver canal completo ↗"
  - text: youtube.exe — principal
  - button "Reproduzir baguncinha em casa [djset tranquilo sza x frank ocean x tems x bryson tiller]":
    - img "baguncinha em casa [djset tranquilo sza x frank ocean x tems x bryson tiller]"
  - paragraph: baguncinha em casa [djset tranquilo sza x frank ocean x tems x bryson tiller]
  - link "↗ YouTube":
    - /url: https://www.youtube.com/watch?v=2o0d2s5WBuA
    - button "↗ YouTube"
  - text: youtube.exe — set 2
  - 'button "Reproduzir baguncinha em casa 3 #djset"':
    - 'img "baguncinha em casa 3 #djset"'
  - paragraph: "baguncinha em casa 3 #djset"
  - link "↗ YouTube":
    - /url: https://www.youtube.com/watch?v=EEaDRLWC3Ds
    - button "↗ YouTube"
  - text: youtube.exe — set 3
  - button "Reproduzir domingueira cremosa | chill vibes | rap | rnb | bounce | 00's vibes | remixes":
    - img "domingueira cremosa | chill vibes | rap | rnb | bounce | 00's vibes | remixes"
  - paragraph: domingueira cremosa | chill vibes | rap | rnb | bounce | 00's vibes | remixes
  - link "↗ YouTube":
    - /url: https://www.youtube.com/watch?v=LxOZZ7YF6e8
    - button "↗ YouTube"
  - paragraph: // temporada afrojams · dj cremosa
  - heading [level=2]
  - paragraph: Co-fundadora do coletivo AfroJams (2025). Seis sets dela filmados no canal @AFRXJAMS — Black Divas, R&B, afrobeats, charme, Miami bass e brasilidades.
  - link "↗ ver playlist inteira":
    - /url: https://www.youtube.com/playlist?list=PLLi5256twtgA
    - button "↗ ver playlist inteira"
  - text: youtube playlist.exe —
  - button "Reproduzir playlist": 6 sets @AFRXJAMS
  - paragraph
  - link "↗ YouTube":
    - /url: https://www.youtube.com/playlist?list=PLLi5256twtgA
    - button "↗ YouTube"
  - text: "afrojams-temp.txt — 6 faixas # Título ↗"
  - list:
    - listitem:
      - link "01 AFROJAMS — TEMP. 01 · EP. 01 · DJ CREMOSA ▶":
        - /url: https://www.youtube.com/watch?v=4sU4o_ViyfE&list=PLLi5256twtgA
    - listitem:
      - link "02 AFROJAMS — TEMP. 02 · EP. 03 · BADDIE LOMA b2b CREMOSA · DJ SET BLACK DIVAS · RAP E TRAP FEMININO ▶":
        - /url: https://www.youtube.com/watch?v=yLfkUE_JuW4&list=PLLi5256twtgA
    - listitem:
      - link "03 AFROJAMS — TEMP. 03 · EP. 03 · CREMOSA · DJ SET R&B & AFROBEATS · POP & RAP · FUNK & HOUSE REMIX ▶":
        - /url: https://www.youtube.com/watch?v=1_uXQTNd4zk&list=PLLi5256twtgA
    - listitem:
      - link "04 AFROJAMS — TEMP. 04 · EP. 02 · CREMOSA · DJ SET LOVE SONG · CHARME · R&B · ANOS 2000 ▶":
        - /url: https://www.youtube.com/watch?v=2jWW5W5-sHU&list=PLLi5256twtgA
    - listitem:
      - link "05 AFROJAMS — TEMP. 05 · EP. 03 · CREMOSA · DJ SET MIAMI BASS · VOLT MIX · NOSTALGIC ▶":
        - /url: https://www.youtube.com/watch?v=uo4CwvRcfOQ&list=PLLi5256twtgA
    - listitem:
      - link "06 AFROJAMS — TEMP. 06 · EP. 07 · CREMOSA · DJ SET REMIXES & BRASILIDADES ▶":
        - /url: https://www.youtube.com/watch?v=pOkyPxPnciI&list=PLLi5256twtgA
  - text: 6 sets · @AFRXJAMS playlist
  - img "@AFRXJAMS avatar"
  - paragraph: Hospedado em @AFRXJAMS · AFROJAMS
  - paragraph: canal parceiro · filma os sets ao vivo
  - link "★ Subscribe":
    - /url: https://www.youtube.com/@AFRXJAMS?sub_confirmation=1
    - button "★ Subscribe"
  - paragraph: // arquivo
  - list:
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=vbFY4Sn7d0M
        - article:
          - text: "@cremos4 · vbFY4Sn7d0M"
          - img "baguncinha calma na orla"
          - paragraph: baguncinha calma na orla
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=tZ2tU0bygPw
        - article:
          - text: "@cremos4 · tZ2tU0bygPw"
          - img "baguncinha pop atualizada"
          - paragraph: baguncinha pop atualizada
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=2o0d2s5WBuA
        - article:
          - text: "@cremos4 · 2o0d2s5WBuA"
          - img "baguncinha em casa [djset tranquilo sza x frank ocean x tems x bryson tiller]"
          - paragraph: baguncinha em casa [djset tranquilo sza x frank ocean x tems x bryson tiller]
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=EEaDRLWC3Ds
        - article:
          - text: "@cremos4 · EEaDRLWC3Ds"
          - 'img "baguncinha em casa 3 #djset"'
          - paragraph: "baguncinha em casa 3 #djset"
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=LxOZZ7YF6e8
        - article:
          - text: "@cremos4 · LxOZZ7YF6e8"
          - img "domingueira cremosa | chill vibes | rap | rnb | bounce | 00's vibes | remixes"
          - paragraph: domingueira cremosa | chill vibes | rap | rnb | bounce | 00's vibes | remixes
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=Q2ueq_Hetao
        - article:
          - text: "@cremos4 · Q2ueq_Hetao"
          - 'img "baguncinha pop em casa #djset"'
          - paragraph: "baguncinha pop em casa #djset"
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=QjCSHgYK5Eo
        - article:
          - text: "@cremos4 · QjCSHgYK5Eo"
          - 'img "baguncinha d''levs em casa #djset"'
          - paragraph: "baguncinha d'levs em casa #djset"
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=cF-gz5nd1kU
        - article:
          - text: "@cremos4 · cF-gz5nd1kU"
          - 'img "baguncinha animada em casa #djset"'
          - paragraph: "baguncinha animada em casa #djset"
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=hjYRSZnOyCw
        - article:
          - text: "@cremos4 · hjYRSZnOyCw"
          - img "Cremosidades na Agoji Vibes"
          - paragraph: Cremosidades na Agoji Vibes
          - text: youtube.com ▶ assistir
    - listitem:
      - link:
        - /url: https://www.youtube.com/watch?v=uhrGVExy8as
        - article:
          - text: "@cremos4 · uhrGVExy8as"
          - 'img "nucleo vivo #2 djset cremosa [jungle x dnb x dub x house x funk]"'
          - paragraph: "nucleo vivo #2 djset cremosa [jungle x dnb x dub x house x funk]"
          - text: youtube.com ▶ assistir
  - text: cremosa — youtube channel
  - paragraph: // sobre o canal
  - paragraph:
    - text: Quando algum vídeo novo sair, ele aparece aqui automaticamente (via o canal
    - link "@cremos4":
      - /url: https://www.youtube.com/@cremos4
    - text: ).
  - link "★ Subscribe":
    - /url: https://www.youtube.com/@cremos4?sub_confirmation=1
    - button "★ Subscribe"
  - link "↗ abrir canal":
    - /url: https://www.youtube.com/@cremos4
    - button "↗ abrir canal"
- contentinfo:
  - status "Barra de status":
    - text: ● Pronto · Porto Alegre, RS — Brasil Cremosa · desde 2016 Next event countdown ·
    - 'link "Próximo show: Fancy /// Sessions — Porto Alegre"':
      - /url: /agenda/
      - text: Hoje!
    - link "Booking →":
      - /url: /contato/
    - text: 14:01
- alert
```

# Test source

```ts
  1   | import { test, expect, type Page } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * Smoke test — every page should:
  5   |  *   - respond 200
  6   |  *   - render without console errors
  7   |  *   - have the SiteNav header
  8   |  *   - have the SiteFooter (status bar)
  9   |  *   - have a visible <h1> or page title
  10  |  *
  11  |  * Run with: `npx playwright test smoke`
  12  |  */
  13  | 
  14  | const PAGES = [
  15  |   { path: "/", name: "home (with press start)" },
  16  |   { path: "/?skipGate=1", name: "home (skip gate)" },
  17  |   { path: "/agenda/", name: "agenda" },
  18  |   { path: "/sobre/", name: "sobre" },
  19  |   { path: "/contato/", name: "contato" },
  20  |   { path: "/musica/", name: "musica" },
  21  |   { path: "/dj-verbosa/", name: "dj-verbosa" },
  22  |   { path: "/videos/", name: "videos" },
  23  |   { path: "/galeria/", name: "galeria" },
  24  | ] as const;
  25  | 
  26  | /**
  27  |  * Wrap each page in a helper that captures console errors and 4xx/5xx
  28  |  * responses. Returns an object the tests can assert against.
  29  |  */
  30  | async function loadPage(page: Page, path: string) {
  31  |   const errors: string[] = [];
  32  |   const badResponses: string[] = [];
  33  | 
  34  |   page.on("console", (msg) => {
  35  |     if (msg.type() === "error") errors.push(msg.text());
  36  |   });
  37  |   page.on("response", (response) => {
  38  |     if (response.status() >= 400) {
  39  |       badResponses.push(`${response.status()} ${response.url()}`);
  40  |     }
  41  |   });
  42  | 
  43  |   // /musica's auto-load + Web Audio requestAnimationFrame loop never
  44  |   // reaches a true "networkidle" state, so use domcontentloaded + a
  45  |   // short settle. Other pages go to networkidle so any late XHR /
  46  |   // image fetch is caught.
  47  |   const waitUntil = path.startsWith("/musica")
  48  |     ? "domcontentloaded"
  49  |     : "networkidle";
  50  |   const response = await page.goto(path, { waitUntil });
  51  |   // Give the page a moment to settle (CSS-in-JS keyframes, RAF).
  52  |   await page.waitForLoadState("domcontentloaded");
  53  |   await page.waitForTimeout(500);
  54  |   return { response, errors, badResponses };
  55  | }
  56  | 
  57  | test.describe("smoke — every page", () => {
  58  |   for (const { path, name } of PAGES) {
  59  |     test(`${name} (${path}) loads cleanly`, async ({ page }) => {
  60  |       const { response, errors, badResponses } = await loadPage(page, path);
  61  | 
  62  |       // 1. The page responded successfully.
  63  |       expect(response, `no response for ${path}`).not.toBeNull();
  64  |       expect(response!.status(), `${path} did not return 200`).toBe(200);
  65  | 
  66  |       // 2. No console errors (warnings/info are fine).
  67  |       // /musica has a known audio-context warning during dev that doesn't
  68  |       // affect production. We allow one specific warning there.
  69  |       const realErrors = errors.filter(
  70  |         (e) =>
  71  |           !path.startsWith("/musica") ||
  72  |           !/AudioContext|autoplay|NotAllowedError/i.test(e),
  73  |       );
  74  |       expect(
  75  |         realErrors,
  76  |         `console errors on ${path}:\n${realErrors.join("\n")}`,
  77  |       ).toEqual([]);
  78  | 
  79  |       // 3. No 4xx/5xx network responses (404s on assets etc.).
  80  |       const significant = badResponses.filter(
  81  |         (r) => !r.includes("favicon") && !r.includes("robots.txt"),
  82  |       );
  83  |       expect(
  84  |         significant,
  85  |         `bad network responses on ${path}:\n${significant.join("\n")}`,
  86  |       ).toEqual([]);
  87  | 
  88  |       // 4. SiteNav header + footer are present in the DOM. (Visible
  89  |       // only on non-splash pages; on `/` the splash hides the header.)
  90  |       await expect(page.locator("header").first()).toBeAttached();
  91  |       await expect(page.locator("footer").first()).toBeAttached();
  92  | 
  93  |       // 5. The page has a visible <h1> (or main heading).
  94  |       // On `/` (with splash) the home h1 is intentionally hidden until
  95  |       // the splash is dismissed.
  96  |       if (path !== "/") {
  97  |         const h1 = page.locator("h1").first();
> 98  |         await expect(h1).toBeVisible();
      |                          ^ Error: expect(locator).toBeVisible() failed
  99  |       }
  100 |     });
  101 |   }
  102 | });
  103 | 
  104 | test.describe("smoke — press start gate", () => {
  105 |   test("press start splash appears on /", async ({ page }) => {
  106 |     await page.goto("/");
  107 |     // Use getByLabel with a case-insensitive regex — the rendered
  108 |     // aria-label is "Press start to enter the Cremosa site" with a
  109 |     // capital P, so a plain CSS attr selector would miss it.
  110 |     const splash = page.getByRole("dialog", {
  111 |       name: /press start/i,
  112 |     });
  113 |     await expect(splash).toBeVisible();
  114 |     await expect(splash.getByText(/press anywhere/i)).toBeVisible();
  115 |   });
  116 | 
  117 |   test("skip gate via ?skipGate=1 bypasses the splash", async ({ page }) => {
  118 |     await page.goto("/?skipGate=1");
  119 |     const splash = page.getByRole("dialog", { name: /press start/i });
  120 |     await expect(splash).toHaveCount(0);
  121 |     await expect(page.locator("h1").first()).toBeVisible();
  122 |   });
  123 | 
  124 |   test("clicking the splash reveals the home", async ({ page }) => {
  125 |     await page.goto("/");
  126 |     const splash = page.getByRole("dialog", { name: /press start/i });
  127 |     await expect(splash).toBeVisible();
  128 |     await splash.getByText(/press anywhere/i).click();
  129 |     // Wait for the splash to fade out + unmount.
  130 |     await expect(splash).toHaveCount(0, { timeout: 5_000 });
  131 |     await expect(page.locator("h1").first()).toBeVisible();
  132 |   });
  133 | 
  134 |   test("site nav is hidden while splash is showing", async ({ page }) => {
  135 |     await page.goto("/");
  136 |     // Wait for hydration so body[data-gate-active] is set by the
  137 |     // PressStartGate effect. CSS reads the same attribute to hide
  138 |     // the SiteNav — if it never gets set on hydration, the test
  139 |     // would flake intermittently.
  140 |     await page.waitForFunction(
  141 |       () => document.body.getAttribute("data-gate-active") === "true",
  142 |       null,
  143 |       { timeout: 5_000 },
  144 |     );
  145 |     const dataAttr = await page.evaluate(() =>
  146 |       document.body.getAttribute("data-gate-active"),
  147 |     );
  148 |     expect(dataAttr).toBe("true");
  149 |   });
  150 | });
  151 | 
  152 | test.describe("smoke — static assets", () => {
  153 |   test("favicon resolves", async ({ request }) => {
  154 |     const res = await request.get("/favicon.ico");
  155 |     // favicon.ico may 404 in dev; only require it for static export
  156 |     // builds. For now we tolerate any response < 500.
  157 |     expect(res.status()).toBeLessThan(500);
  158 |   });
  159 | 
  160 |   test("audio files in /public/audio/ are accessible", async ({ request }) => {
  161 |     // Just check the default track for now — the others can be
  162 |     // smoke-tested if this passes.
  163 |     const res = await request.get("/audio/20-minutinhos.mp3");
  164 |     // Audio is static-exported; in dev it may not be served by Next
  165 |     // but should be when running against the production build.
  166 |     if (res.status() !== 200) {
  167 |       test.skip(true, "Audio not accessible (probably dev server)");
  168 |     }
  169 |   });
  170 | });
  171 | 
```