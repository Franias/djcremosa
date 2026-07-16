# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-home.spec.ts >> 02 — Home page >> press highlights section shows the destaques window
- Location: tests/e2e/02-home.spec.ts:118:7

# Error details

```
TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('text=cremosa.txt — destaques').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e6]: Cremosa · Seletora · Curadoria · Discotecagem
      - generic [ref=e8] [cursor=pointer]:
        - generic [ref=e9]: ─
        - generic [ref=e10]: □
        - generic [ref=e11]: ×
      - navigation "Principal" [ref=e13]:
        - list [ref=e14]:
          - listitem [ref=e15]:
            - link "Início" [ref=e16] [cursor=pointer]:
              - /url: /
              - button [ref=e17]:
                - img [ref=e18]
          - listitem [ref=e21]:
            - link "Agenda" [ref=e22] [cursor=pointer]:
              - /url: /agenda/
              - button "Agenda" [ref=e23]
          - listitem [ref=e24]:
            - link "Música" [ref=e25] [cursor=pointer]:
              - /url: /musica/
              - button "Música" [ref=e26]
          - listitem [ref=e27]:
            - link "Galeria" [ref=e28] [cursor=pointer]:
              - /url: /galeria/
              - button "Galeria" [ref=e29]
          - listitem [ref=e30]:
            - link "Vídeos" [ref=e31] [cursor=pointer]:
              - /url: /videos/
              - button "Vídeos" [ref=e32]
          - listitem [ref=e33]:
            - link "Sobre" [ref=e34] [cursor=pointer]:
              - /url: /sobre/
              - button "Sobre" [ref=e35]
          - listitem [ref=e36]:
            - link "Contato" [ref=e37] [cursor=pointer]:
              - /url: /contato/
              - button "Contato" [ref=e38]
          - listitem [ref=e39]:
            - link "Booking →" [ref=e40] [cursor=pointer]:
              - /url: mailto:franciellipdias@gmail.com?subject=Booking%20%2F%20proposta%20de%20show
              - button "Booking →" [ref=e41]
  - main [ref=e42]:
    - generic [ref=e44]:
      - heading "Cremosa — Início" [level=1] [ref=e45]
      - paragraph [ref=e46]: // cremosa.exe — welcome
      - generic [ref=e47]:
        - generic [ref=e48]:
          - link "Agenda" [ref=e49] [cursor=pointer]:
            - /url: /agenda/
            - generic [ref=e51]: Agenda
            - text: Ir para Agenda
          - link "Música" [ref=e52] [cursor=pointer]:
            - /url: /musica/
            - generic [ref=e54]: Música
            - text: Ir para Música
          - link "Galeria" [ref=e55] [cursor=pointer]:
            - /url: /galeria/
            - generic [ref=e57]: Galeria
            - text: Ir para Galeria
          - link "Vídeos" [ref=e58] [cursor=pointer]:
            - /url: /videos/
            - generic [ref=e60]: Vídeos
            - text: Ir para Vídeos
          - link "Sobre" [ref=e61] [cursor=pointer]:
            - /url: /sobre/
            - generic [ref=e63]: Sobre
            - text: Ir para Sobre
          - link "Contato" [ref=e64] [cursor=pointer]:
            - /url: /contato/
            - generic [ref=e66]: Contato
            - text: Ir para Contato
        - figure [ref=e67]:
          - img "Cremosa em um retrato promocional com a marca CREMOSA" [ref=e69]
        - generic [ref=e70]:
          - button "Abrir contador de visitantes" [ref=e71] [cursor=pointer]:
            - generic [ref=e73]: visitantes.exe
            - text: nº visitantes
          - link "Sets" [ref=e74] [cursor=pointer]:
            - /url: /musica/
            - generic [ref=e76]: Sets
            - text: Ir para Sets
          - link "SoundCloud" [ref=e77] [cursor=pointer]:
            - /url: https://soundcloud.com/cremosinha
            - generic [ref=e79]: SoundCloud
            - text: Abrir SoundCloud em nova aba
          - link "Instagram" [ref=e80] [cursor=pointer]:
            - /url: https://instagram.com/djcremosa
            - generic [ref=e82]: Instagram
            - text: Abrir Instagram em nova aba
          - link "Twitch" [ref=e83] [cursor=pointer]:
            - /url: https://www.twitch.tv/djcremosa
            - generic [ref=e85]: Twitch
            - text: Abrir Twitch em nova aba
          - link "TikTok" [ref=e86] [cursor=pointer]:
            - /url: https://www.tiktok.com/@cremosinh4
            - generic [ref=e88]: TikTok
            - text: Abrir TikTok em nova aba
      - text: Ir para Agenda Ir para Música Ir para Galeria Ir para Vídeos Ir para Sobre Ir para Contato nº visitantes Ir para Sets Abrir SoundCloud em nova aba Abrir Instagram em nova aba Abrir Twitch em nova aba Abrir TikTok em nova aba
      - generic [ref=e91]:
        - generic [ref=e93]: booking.exe — confirmar
        - generic [ref=e95] [cursor=pointer]:
          - generic [ref=e96]: ─
          - generic [ref=e97]: □
          - generic [ref=e98]: ×
        - generic [ref=e100]:
          - paragraph [ref=e101]: // quer levar a Cremosa pra sua pista?
          - paragraph [ref=e102]: Booking, imprensa, residência — resposta em até 72h úteis.
          - link "Contatar →" [ref=e104] [cursor=pointer]:
            - /url: /contato/
            - button "Contatar →" [ref=e105]
      - navigation "Mapa do site" [ref=e106]:
        - generic [ref=e107]:
          - link "Agenda" [ref=e108] [cursor=pointer]:
            - /url: /agenda/
          - text: "|"
        - generic [ref=e109]:
          - link "Música" [ref=e110] [cursor=pointer]:
            - /url: /musica/
          - text: "|"
        - generic [ref=e111]:
          - link "Galeria" [ref=e112] [cursor=pointer]:
            - /url: /galeria/
          - text: "|"
        - generic [ref=e113]:
          - link "Vídeos" [ref=e114] [cursor=pointer]:
            - /url: /videos/
          - text: "|"
        - generic [ref=e115]:
          - link "Sobre" [ref=e116] [cursor=pointer]:
            - /url: /sobre/
          - text: "|"
        - generic [ref=e117]:
          - link "Contato" [ref=e118] [cursor=pointer]:
            - /url: /contato/
          - text: "|"
        - link "Booking" [ref=e120] [cursor=pointer]:
          - /url: /contato/
    - generic [ref=e122]:
      - generic [ref=e125]:
        - generic [ref=e127]: cremosa.txt — readme
        - generic [ref=e129] [cursor=pointer]:
          - generic [ref=e130]: ─
          - generic [ref=e131]: □
          - generic [ref=e132]: ×
        - generic [ref=e134]:
          - paragraph [ref=e135]: // Porto Alegre, RS — Brasil · desde 2016
          - generic [ref=e136]:
            - paragraph [ref=e137]:
              - text: DJ Cremosa é uma artista da cena de Porto Alegre que atua desde 2016, conhecida por sets intensos que conectam diferentes vertentes da
              - strong [ref=e138]: música preta global
              - text: .
            - paragraph [ref=e139]:
              - text: Sua pesquisa parte do
              - strong [ref=e140]: funk brasileiro
              - text: e se expande por rap, amapiano, house, pop e R&B — pistas marcadas por groove, energia e mistura de estilos.
          - generic [ref=e141]:
            - button "Copiar" [ref=e142] [cursor=pointer]
            - button "Fechar ×" [ref=e143] [cursor=pointer]
      - complementary [ref=e144]:
        - generic [ref=e146]:
          - generic [ref=e148]: cremosa — propriedades
          - generic [ref=e150] [cursor=pointer]:
            - generic [ref=e151]: ─
            - generic [ref=e152]: □
            - generic [ref=e153]: ×
          - generic [ref=e155]:
            - generic [ref=e156]:
              - term [ref=e157]: "Nome:"
              - definition [ref=e158]: Cremosa
              - term [ref=e159]: "Cidade:"
              - definition [ref=e160]: Porto Alegre, RS
              - term [ref=e161]: "Desde:"
              - definition [ref=e162]: "2016"
              - term [ref=e163]: "Coletivo:"
              - definition [ref=e164]: AfroJams (2025→)
              - term [ref=e165]: "Residência:"
              - definition [ref=e166]: BatukBaile (2026→)
            - button "OK" [ref=e168] [cursor=pointer]
    - generic [ref=e169]:
      - generic [ref=e170]:
        - paragraph [ref=e173]: // próximas datas
        - link "agenda completa →" [ref=e174] [cursor=pointer]:
          - /url: /agenda/
          - button "agenda completa →" [ref=e175]
      - list [ref=e176]:
        - listitem [ref=e177]:
          - generic [ref=e179]:
            - generic [ref=e180]:
              - generic [ref=e181]: JUL 17 · Fancy /// Sessions
              - generic [ref=e183]: Festa · Confirmado
            - generic [ref=e185] [cursor=pointer]:
              - generic [ref=e186]: ─
              - generic [ref=e187]: □
              - generic [ref=e188]: ×
            - article "Fancy /// Sessions em Fancy Bar, Porto Alegre" [ref=e190]:
              - generic [ref=e191]:
                - generic [ref=e192]: JUL
                - generic [ref=e193]: "17"
                - generic [ref=e194]: "2026"
              - generic [ref=e195]:
                - generic [ref=e196]:
                  - generic [ref=e198]: Confirmado
                  - heading "Fancy /// Sessions" [level=3] [ref=e199]
                  - paragraph [ref=e200]: Fancy Bar·Porto Alegre, RS·Brasil·21h
                - generic [ref=e201]:
                  - paragraph [ref=e202]: Line-up:Cremosa · Ehllep
                  - paragraph [ref=e203]: "SET TIME: 21H · Gravação de set para o Fancy Sessions."
                - link "Ingressos →" [ref=e205] [cursor=pointer]:
                  - /url: https://shotgun.live/en/events/fancy-sessions
                  - button "Ingressos →" [ref=e206]
        - listitem [ref=e207]:
          - generic [ref=e209]:
            - generic [ref=e210]:
              - generic [ref=e211]: JUL 24 · Lesbilab /// Baile Funk @Lesbilab
              - generic [ref=e213]: Club · Confirmado
            - generic [ref=e215] [cursor=pointer]:
              - generic [ref=e216]: ─
              - generic [ref=e217]: □
              - generic [ref=e218]: ×
            - article "Lesbilab /// Baile Funk @Lesbilab em Club 772, Porto Alegre" [ref=e220]:
              - generic [ref=e221]:
                - generic [ref=e222]: JUL
                - generic [ref=e223]: "24"
                - generic [ref=e224]: "2026"
              - generic [ref=e225]:
                - generic [ref=e226]:
                  - generic [ref=e228]: Confirmado
                  - heading "Lesbilab /// Baile Funk @Lesbilab" [level=3] [ref=e229]
                  - paragraph [ref=e230]: Club 772·Porto Alegre, RS·Brasil·23h
                - generic [ref=e231]:
                  - paragraph [ref=e232]: Line-up:Cremosa · Taay Melo · DJ Cremosa · Elle P · Julia Klein · DJ Luizza
                  - paragraph [ref=e233]: .
                - link "Ingressos →" [ref=e235] [cursor=pointer]:
                  - /url: https://shotgun.live/en/events/baile-funk-lesbilab
                  - button "Ingressos →" [ref=e236]
    - generic [ref=e238]:
      - paragraph [ref=e239]: // pasta do sistema
      - generic [ref=e241]:
        - generic [ref=e243]: cremosa — pasta do sistema
        - generic [ref=e245] [cursor=pointer]:
          - generic [ref=e246]: ─
          - generic [ref=e247]: □
          - generic [ref=e248]: ×
        - generic [ref=e250]:
          - generic [ref=e251]:
            - img "Cremosa — logotipo oficial" [ref=e252]
            - paragraph [ref=e253]: .
            - paragraph [ref=e254]: Porto Alegre, RS — Brasil
          - generic [ref=e255]:
            - generic [ref=e256]:
              - paragraph [ref=e257]: Contato
              - list [ref=e258]:
                - listitem [ref=e259]:
                  - link "franciellipdias@gmail.com" [ref=e260] [cursor=pointer]:
                    - /url: mailto:franciellipdias@gmail.com
                - listitem [ref=e261]:
                  - link "+55 51 99372-3158" [ref=e262] [cursor=pointer]:
                    - /url: tel:+5551993723158
            - generic [ref=e263]:
              - paragraph [ref=e264]: Onde me achar
              - list [ref=e265]:
                - listitem [ref=e266]:
                  - link "Instagram · @djcremosa" [ref=e267] [cursor=pointer]:
                    - /url: https://instagram.com/djcremosa
                - listitem [ref=e268]:
                  - link "Twitch · djcremosa" [ref=e269] [cursor=pointer]:
                    - /url: https://www.twitch.tv/djcremosa
                - listitem [ref=e270]:
                  - link "TikTok · @cremosinh4" [ref=e271] [cursor=pointer]:
                    - /url: https://www.tiktok.com/@cremosinh4
                - listitem [ref=e272]:
                  - link "Próximos shows" [ref=e273] [cursor=pointer]:
                    - /url: /agenda/
  - contentinfo [ref=e274]:
    - status "Barra de status" [ref=e275]:
      - generic [ref=e276]: ● Pronto · Porto Alegre, RS — Brasil
      - generic [ref=e277]: Cremosa · desde 2016
      - link "Booking →" [ref=e279] [cursor=pointer]:
        - /url: /contato/
      - generic [ref=e280]: 15:39
  - button "Open Next.js Dev Tools" [ref=e286] [cursor=pointer]:
    - img [ref=e287]
  - alert [ref=e290]
```

# Test source

```ts
  24  |   test("welcome chip 'cremosa.exe — welcome' is visible", async ({ page }) => {
  25  |     // The home page keeps a sr-only `<h1>` with the real identity and
  26  |     // relies on visual chrome for hierarchy. On desktop the figure row
  27  |     // IS the "welcome dialog", so we ship a small `cremosa.exe —
  28  |     // welcome` label chip in the hero comment block above the figure
  29  |     // so screen readers / tests have a stable title to anchor on.
  30  |     const welcome = page.locator("text=cremosa.exe — welcome").first();
  31  |     await expect(welcome).toBeVisible();
  32  |   });
  33  | 
  34  |   test("welcome dialog has 11 desktop icons flanking the figure", async ({
  35  |     page,
  36  |   }) => {
  37  |     // Each desktop icon (besides VisitCounter) renders as an `<a>` with
  38  |     // class `win95-icon`. Destaques was dropped in favor of the
  39  |     // visitantes.exe counter (which is a `<button>`, not counted),
  40  |     // so the desktop chrome has 11 anchor tiles around the figure.
  41  |     //
  42  |     // We count VISIBLE icons only because the mobile fallback
  43  |     // (`md:hidden`) also renders the same 11 anchors in the DOM —
  44  |     // they just take `display: none` at md+ so a plain `.count()`
  45  |     // would see 22 (11 desktop + 11 mobile).
  46  |     const icons = page.locator("a.win95-icon:visible");
  47  |     const count = await icons.count();
  48  |     expect(count).toBe(11);
  49  |   });
  50  | 
  51  |   test("all 6 page icons link to the correct routes", async ({ page }) => {
  52  |     const expected = [
  53  |       { label: "Agenda", href: "/agenda/" },
  54  |       { label: "Música", href: "/musica/" },
  55  |       { label: "Galeria", href: "/galeria/" },
  56  |       { label: "Vídeos", href: "/videos/" },
  57  |       { label: "Sobre", href: "/sobre/" },
  58  |       { label: "Contato", href: "/contato/" },
  59  |     ];
  60  | 
  61  |     for (const { label, href } of expected) {
  62  |       // The icon is the <a.win95-icon> with `title={label}`.
  63  |       const icon = page.locator(`a.win95-icon[title="${label}"]`).first();
  64  |       await expect(icon).toBeVisible();
  65  |       await expect(icon).toHaveAttribute("href", href);
  66  |     }
  67  |   });
  68  | 
  69  |   test("SoundCloud icon opens soundcloud.com/cremosinha", async ({ page }) => {
  70  |     const icon = page.locator('a.win95-icon[title="SoundCloud"]').first();
  71  |     await expect(icon).toBeVisible();
  72  |     const href = await icon.getAttribute("href");
  73  |     expect(href).toBe("https://soundcloud.com/cremosinha");
  74  |   });
  75  | 
  76  |   test("Instagram icon opens instagram.com/djcremosa", async ({ page }) => {
  77  |     const icon = page.locator('a.win95-icon[title="Instagram"]').first();
  78  |     await expect(icon).toBeVisible();
  79  |     const href = await icon.getAttribute("href");
  80  |     expect(href).toBe("https://instagram.com/djcremosa");
  81  |   });
  82  | 
  83  |   test("Twitch icon opens twitch.tv/djcremosa", async ({ page }) => {
  84  |     const icon = page.locator('a.win95-icon[title="Twitch"]').first();
  85  |     await expect(icon).toBeVisible();
  86  |     const href = await icon.getAttribute("href");
  87  |     expect(href).toBe("https://www.twitch.tv/djcremosa");
  88  |   });
  89  | 
  90  |   test("TikTok icon opens tiktok.com/@cremosinh4", async ({ page }) => {
  91  |     const icon = page.locator('a.win95-icon[title="TikTok"]').first();
  92  |     await expect(icon).toBeVisible();
  93  |     const href = await icon.getAttribute("href");
  94  |     expect(href).toBe("https://www.tiktok.com/@cremosinh4");
  95  |   });
  96  | 
  97  |   test("SiteNav has 8 link elements (home + 6 pages + booking)", async ({
  98  |     page,
  99  |   }) => {
  100 |     // The desktop nav contains:
  101 |     // - 1 home icon (Link to /)
  102 |     // - 6 page links
  103 |     // - 1 booking mailto link
  104 |     const nav = page.locator('nav[aria-label="Principal"]').first();
  105 |     const links = nav.locator("a");
  106 |     await expect(links).toHaveCount(8);
  107 |   });
  108 | 
  109 |   test("clicking 'Música' in nav navigates to /musica/", async ({ page }) => {
  110 |     await page
  111 |       .locator('nav[aria-label="Principal"]')
  112 |       .getByRole("link", { name: /música/i })
  113 |       .first()
  114 |       .click();
  115 |     await expect(page).toHaveURL(/\/musica\/?$/);
  116 |   });
  117 | 
  118 |   test("press highlights section shows the destaques window", async ({
  119 |     page,
  120 |   }) => {
  121 |     await page
  122 |       .locator("text=cremosa.txt — destaques")
  123 |       .first()
> 124 |       .scrollIntoViewIfNeeded();
      |        ^ TimeoutError: locator.scrollIntoViewIfNeeded: Timeout 5000ms exceeded.
  125 |     await expect(
  126 |       page.locator("text=cremosa.txt — destaques").first(),
  127 |     ).toBeVisible();
  128 |     // At least one of the 5 highlights
  129 |     await expect(page.getByText(/Rap in Cena/).first()).toBeVisible();
  130 |   });
  131 | 
  132 |   test("about section (readme) renders", async ({ page }) => {
  133 |     // The readme dialog is below the fold; scroll to it.
  134 |     await page
  135 |       .locator("text=cremosa.txt — readme")
  136 |       .first()
  137 |       .scrollIntoViewIfNeeded();
  138 |     const readme = page
  139 |       .locator("text=cremosa.txt — readme")
  140 |       .first();
  141 |     await expect(readme).toBeVisible();
  142 |     await expect(
  143 |       page
  144 |         .getByText(/DJ Cremosa é uma artista da cena de Porto Alegre/i)
  145 |         .first(),
  146 |     ).toBeVisible();
  147 |   });
  148 | 
  149 |   test("em destaque section shows the press highlights heading", async ({
  150 |     page,
  151 |   }) => {
  152 |     // "Dez anos na pista, da cena de Porto Alegre pro mundo." is the
  153 |     // h2 of the press highlights section.
  154 |     await page
  155 |       .getByRole("heading", { name: /Dez anos na pista/i, level: 2 })
  156 |       .scrollIntoViewIfNeeded();
  157 |     await expect(
  158 |       page.getByRole("heading", {
  159 |         name: /Dez anos na pista/i,
  160 |         level: 2,
  161 |       }),
  162 |     ).toBeVisible();
  163 |   });
  164 | 
  165 |   test("footer is a Win95 status bar with Pronto indicator", async ({
  166 |     page,
  167 |   }) => {
  168 |     await page.locator("footer").scrollIntoViewIfNeeded();
  169 |     const footer = page.locator("footer");
  170 |     await expect(footer).toBeVisible();
  171 |     await expect(footer.getByText(/Pronto/).first()).toBeVisible();
  172 |   });
  173 | 
  174 |   test("footer has a link to /contato/", async ({ page }) => {
  175 |     // The footer is below the fold; scroll to it before asserting.
  176 |     await page.locator("footer").scrollIntoViewIfNeeded();
  177 |     const footer = page.locator("footer");
  178 |     // Next.js renders Link hrefs with a trailing slash when
  179 |     // `trailingSlash: true` is set in next.config.ts — match both.
  180 |     const contatoLink = footer.locator('a[href="/contato"], a[href="/contato/"]');
  181 |     await expect(contatoLink.first()).toBeVisible();
  182 |   });
  183 | 
  184 |   test("'Fechar ×' on readme dialog hides it and shows a reopen button", async ({
  185 |     page,
  186 |   }) => {
  187 |     await page
  188 |       .locator("text=cremosa.txt — readme")
  189 |       .first()
  190 |       .scrollIntoViewIfNeeded();
  191 |     await expect(
  192 |       page.locator("text=cremosa.txt — readme").first(),
  193 |     ).toBeVisible();
  194 |     await page.getByRole("button", { name: /fechar/i }).first().click();
  195 |     await expect(
  196 |       page.locator("text=cremosa.txt — readme (fechado)").first(),
  197 |     ).toBeVisible();
  198 |   });
  199 | 
  200 |   test("'OK' on propriedades dialog hides it and shows a reopen button", async ({
  201 |     page,
  202 |   }) => {
  203 |     await page
  204 |       .locator("text=cremosa — propriedades")
  205 |       .first()
  206 |       .scrollIntoViewIfNeeded();
  207 |     await expect(
  208 |       page.locator("text=cremosa — propriedades").first(),
  209 |     ).toBeVisible();
  210 |     await page.getByRole("button", { name: /^OK$/ }).first().click();
  211 |     await expect(
  212 |       page.locator("text=cremosa — propriedades (fechado)").first(),
  213 |     ).toBeVisible();
  214 |   });
  215 | 
  216 |   test("'Copiar' button copies manifesto to clipboard", async ({
  217 |     page,
  218 |     context,
  219 |   }) => {
  220 |     await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  221 |     await page
  222 |       .locator("text=cremosa.txt — readme")
  223 |       .first()
  224 |       .scrollIntoViewIfNeeded();
```