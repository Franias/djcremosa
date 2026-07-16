# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-hero-proportions.spec.ts >> 10 — Hero proportions >> desktop 1440px shows all 12 anchor tiles + VisitCounter in flanking columns
- Location: tests/e2e/10-hero-proportions.spec.ts:160:7

# Error details

```
Error: right column labels (visitantes→TikTok)

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
            - link "DJ Verbosa" [ref=e22] [cursor=pointer]:
              - /url: /dj-verbosa/
              - button "DJ Verbosa" [ref=e23]
          - listitem [ref=e24]:
            - link "Agenda" [ref=e25] [cursor=pointer]:
              - /url: /agenda/
              - button "Agenda" [ref=e26]
          - listitem [ref=e27]:
            - link "Música" [ref=e28] [cursor=pointer]:
              - /url: /musica/
              - button "Música" [ref=e29]
          - listitem [ref=e30]:
            - link "Galeria" [ref=e31] [cursor=pointer]:
              - /url: /galeria/
              - button "Galeria" [ref=e32]
          - listitem [ref=e33]:
            - link "Vídeos" [ref=e34] [cursor=pointer]:
              - /url: /videos/
              - button "Vídeos" [ref=e35]
          - listitem [ref=e36]:
            - link "Sobre" [ref=e37] [cursor=pointer]:
              - /url: /sobre/
              - button "Sobre" [ref=e38]
          - listitem [ref=e39]:
            - link "Contato" [ref=e40] [cursor=pointer]:
              - /url: /contato/
              - button "Contato" [ref=e41]
          - listitem [ref=e42]:
            - link "Booking →" [ref=e43] [cursor=pointer]:
              - /url: mailto:franciellipdias@gmail.com?subject=Booking%20%2F%20proposta%20de%20show
              - button "Booking →" [ref=e44]
  - main [ref=e45]:
    - generic [ref=e47]:
      - heading "Cremosa — Início" [level=1] [ref=e48]
      - paragraph [ref=e49]: // cremosa.exe — welcome
      - generic [ref=e50]:
        - generic [ref=e51]:
          - link "Agenda" [ref=e52] [cursor=pointer]:
            - /url: /agenda/
            - generic [ref=e54]: Agenda
            - text: Ir para Agenda
          - link "Música" [ref=e55] [cursor=pointer]:
            - /url: /musica/
            - generic [ref=e57]: Música
            - text: Ir para Música
          - link "Galeria" [ref=e58] [cursor=pointer]:
            - /url: /galeria/
            - generic [ref=e60]: Galeria
            - text: Ir para Galeria
          - link "Vídeos" [ref=e61] [cursor=pointer]:
            - /url: /videos/
            - generic [ref=e63]: Vídeos
            - text: Ir para Vídeos
          - link "Sobre" [ref=e64] [cursor=pointer]:
            - /url: /sobre/
            - generic [ref=e66]: Sobre
            - text: Ir para Sobre
          - link "Contato" [ref=e67] [cursor=pointer]:
            - /url: /contato/
            - generic [ref=e69]: Contato
            - text: Ir para Contato
        - figure [ref=e70]:
          - img "Cremosa em um retrato promocional com a marca CREMOSA" [ref=e72]
        - generic [ref=e73]:
          - button "Abrir contador de visitantes" [ref=e74] [cursor=pointer]:
            - generic [ref=e76]: visitantes.exe
            - text: nº visitantes
          - link "Sets" [ref=e77] [cursor=pointer]:
            - /url: /musica/
            - generic [ref=e79]: Sets
            - text: Ir para Sets
          - link "SoundCloud" [ref=e80] [cursor=pointer]:
            - /url: https://soundcloud.com/cremosinha
            - generic [ref=e82]: SoundCloud
            - text: Abrir SoundCloud em nova aba
          - link "Instagram" [ref=e83] [cursor=pointer]:
            - /url: https://instagram.com/djcremosa
            - generic [ref=e85]: Instagram
            - text: Abrir Instagram em nova aba
          - link "Twitch" [ref=e86] [cursor=pointer]:
            - /url: https://www.twitch.tv/djcremosa
            - generic [ref=e88]: Twitch
            - text: Abrir Twitch em nova aba
          - link "TikTok" [ref=e89] [cursor=pointer]:
            - /url: https://www.tiktok.com/@cremosinh4
            - generic [ref=e91]: TikTok
            - text: Abrir TikTok em nova aba
      - text: Ir para Agenda Ir para Música Ir para Galeria Ir para Vídeos Ir para Sobre Ir para Contato nº visitantes Ir para Sets Abrir SoundCloud em nova aba Abrir Instagram em nova aba Abrir Twitch em nova aba Abrir TikTok em nova aba
      - generic [ref=e94]:
        - generic [ref=e96]: booking.exe — confirmar
        - generic [ref=e98] [cursor=pointer]:
          - generic [ref=e99]: ─
          - generic [ref=e100]: □
          - generic [ref=e101]: ×
        - generic [ref=e103]:
          - paragraph [ref=e104]: // quer levar a Cremosa pra sua pista?
          - paragraph [ref=e105]: Booking, imprensa, residência — resposta em até 72h úteis.
          - link "Contatar →" [ref=e107] [cursor=pointer]:
            - /url: /contato/
            - button "Contatar →" [ref=e108]
      - navigation "Mapa do site" [ref=e109]:
        - generic [ref=e110]:
          - link "Agenda" [ref=e111] [cursor=pointer]:
            - /url: /agenda/
          - text: "|"
        - generic [ref=e112]:
          - link "Música" [ref=e113] [cursor=pointer]:
            - /url: /musica/
          - text: "|"
        - generic [ref=e114]:
          - link "Galeria" [ref=e115] [cursor=pointer]:
            - /url: /galeria/
          - text: "|"
        - generic [ref=e116]:
          - link "Vídeos" [ref=e117] [cursor=pointer]:
            - /url: /videos/
          - text: "|"
        - generic [ref=e118]:
          - link "Sobre" [ref=e119] [cursor=pointer]:
            - /url: /sobre/
          - text: "|"
        - generic [ref=e120]:
          - link "Contato" [ref=e121] [cursor=pointer]:
            - /url: /contato/
          - text: "|"
        - link "Booking" [ref=e123] [cursor=pointer]:
          - /url: /contato/
    - generic [ref=e125]:
      - generic [ref=e128]:
        - generic [ref=e130]: cremosa.txt — readme
        - generic [ref=e132] [cursor=pointer]:
          - generic [ref=e133]: ─
          - generic [ref=e134]: □
          - generic [ref=e135]: ×
        - generic [ref=e137]:
          - paragraph [ref=e138]: // Porto Alegre, RS — Brasil · desde 2016
          - generic [ref=e139]:
            - paragraph [ref=e140]:
              - text: DJ Cremosa é uma artista da cena de Porto Alegre que atua desde 2016, conhecida por sets intensos que conectam diferentes vertentes da
              - strong [ref=e141]: música preta global
              - text: .
            - paragraph [ref=e142]:
              - text: Sua pesquisa parte do
              - strong [ref=e143]: funk brasileiro
              - text: e se expande por rap, amapiano, house, pop e R&B — pistas marcadas por groove, energia e mistura de estilos.
          - generic [ref=e144]:
            - button "Copiar" [ref=e145] [cursor=pointer]
            - button "Fechar ×" [ref=e146] [cursor=pointer]
      - complementary [ref=e147]:
        - generic [ref=e149]:
          - generic [ref=e151]: cremosa — propriedades
          - generic [ref=e153] [cursor=pointer]:
            - generic [ref=e154]: ─
            - generic [ref=e155]: □
            - generic [ref=e156]: ×
          - generic [ref=e158]:
            - generic [ref=e159]:
              - term [ref=e160]: "Nome:"
              - definition [ref=e161]: Cremosa
              - term [ref=e162]: "Cidade:"
              - definition [ref=e163]: Porto Alegre, RS
              - term [ref=e164]: "Desde:"
              - definition [ref=e165]: "2016"
              - term [ref=e166]: "Coletivo:"
              - definition [ref=e167]: AfroJams (2025→)
              - term [ref=e168]: "Residência:"
              - definition [ref=e169]: BatukBaile (2026→)
            - button "OK" [ref=e171] [cursor=pointer]
    - generic [ref=e172]:
      - generic [ref=e173]:
        - paragraph [ref=e176]: // próximas datas
        - link "agenda completa →" [ref=e177] [cursor=pointer]:
          - /url: /agenda/
          - button "agenda completa →" [ref=e178]
      - list [ref=e179]:
        - listitem [ref=e180]:
          - generic [ref=e182]:
            - generic [ref=e183]:
              - generic [ref=e184]: JUL 17 · Fancy /// Sessions
              - generic [ref=e186]: Festa · Confirmado
            - generic [ref=e188] [cursor=pointer]:
              - generic [ref=e189]: ─
              - generic [ref=e190]: □
              - generic [ref=e191]: ×
            - article "Fancy /// Sessions em Fancy Bar, Porto Alegre" [ref=e193]:
              - generic [ref=e194]:
                - generic [ref=e195]: JUL
                - generic [ref=e196]: "17"
                - generic [ref=e197]: "2026"
              - generic [ref=e198]:
                - generic [ref=e199]:
                  - generic [ref=e201]: Confirmado
                  - heading "Fancy /// Sessions" [level=3] [ref=e202]
                  - paragraph [ref=e203]: Fancy Bar·Porto Alegre, RS·Brasil·21h
                - generic [ref=e204]:
                  - paragraph [ref=e205]: Line-up:Cremosa · Ehllep
                  - paragraph [ref=e206]: "SET TIME: 21H · Gravação de set para o Fancy Sessions."
                - link "Ingressos →" [ref=e208] [cursor=pointer]:
                  - /url: https://shotgun.live/en/events/fancy-sessions
                  - button "Ingressos →" [ref=e209]
        - listitem [ref=e210]:
          - generic [ref=e212]:
            - generic [ref=e213]:
              - generic [ref=e214]: JUL 24 · Lesbilab /// Baile Funk @Lesbilab
              - generic [ref=e216]: Club · Confirmado
            - generic [ref=e218] [cursor=pointer]:
              - generic [ref=e219]: ─
              - generic [ref=e220]: □
              - generic [ref=e221]: ×
            - article "Lesbilab /// Baile Funk @Lesbilab em Club 772, Porto Alegre" [ref=e223]:
              - generic [ref=e224]:
                - generic [ref=e225]: JUL
                - generic [ref=e226]: "24"
                - generic [ref=e227]: "2026"
              - generic [ref=e228]:
                - generic [ref=e229]:
                  - generic [ref=e231]: Confirmado
                  - heading "Lesbilab /// Baile Funk @Lesbilab" [level=3] [ref=e232]
                  - paragraph [ref=e233]: Club 772·Porto Alegre, RS·Brasil·23h
                - generic [ref=e234]:
                  - paragraph [ref=e235]: Line-up:Cremosa · Taay Melo · DJ Cremosa · Elle P · Julia Klein · DJ Luizza
                  - paragraph [ref=e236]: .
                - link "Ingressos →" [ref=e238] [cursor=pointer]:
                  - /url: https://shotgun.live/en/events/baile-funk-lesbilab
                  - button "Ingressos →" [ref=e239]
    - generic [ref=e241]:
      - paragraph [ref=e242]: // pasta do sistema
      - generic [ref=e244]:
        - generic [ref=e246]: cremosa — pasta do sistema
        - generic [ref=e248] [cursor=pointer]:
          - generic [ref=e249]: ─
          - generic [ref=e250]: □
          - generic [ref=e251]: ×
        - generic [ref=e253]:
          - generic [ref=e254]:
            - img "Cremosa — logotipo oficial" [ref=e255]
            - paragraph [ref=e256]: .
            - paragraph [ref=e257]: Porto Alegre, RS — Brasil
          - generic [ref=e258]:
            - generic [ref=e259]:
              - paragraph [ref=e260]: Contato
              - list [ref=e261]:
                - listitem [ref=e262]:
                  - link "franciellipdias@gmail.com" [ref=e263] [cursor=pointer]:
                    - /url: mailto:franciellipdias@gmail.com
                - listitem [ref=e264]:
                  - link "+55 51 99372-3158" [ref=e265] [cursor=pointer]:
                    - /url: tel:+5551993723158
            - generic [ref=e266]:
              - paragraph [ref=e267]: Onde me achar
              - list [ref=e268]:
                - listitem [ref=e269]:
                  - link "Instagram · @djcremosa" [ref=e270] [cursor=pointer]:
                    - /url: https://instagram.com/djcremosa
                - listitem [ref=e271]:
                  - link "Twitch · djcremosa" [ref=e272] [cursor=pointer]:
                    - /url: https://www.twitch.tv/djcremosa
                - listitem [ref=e273]:
                  - link "TikTok · @cremosinh4" [ref=e274] [cursor=pointer]:
                    - /url: https://www.tiktok.com/@cremosinh4
                - listitem [ref=e275]:
                  - link "Próximos shows" [ref=e276] [cursor=pointer]:
                    - /url: /agenda/
  - contentinfo [ref=e277]:
    - status "Barra de status" [ref=e278]:
      - generic [ref=e279]: ● Pronto · Porto Alegre, RS — Brasil
      - generic [ref=e280]: Cremosa · desde 2016
      - generic [ref=e281]:
        - text: Next event countdown ·
        - 'link "Próximo show: Fancy /// Sessions — Porto Alegre" [ref=e282] [cursor=pointer]':
          - /url: /agenda/
          - text: 00:16:38:02
      - link "Booking →" [ref=e284] [cursor=pointer]:
        - /url: /contato/
      - generic [ref=e285]: 19:21
  - button "Open Next.js Dev Tools" [ref=e291] [cursor=pointer]:
    - img [ref=e292]
  - alert [ref=e295]
```

# Test source

```ts
  107 | 
  108 |     const m = await page.evaluate(() => {
  109 |       // The mobile icon grid is the `<ul>` inside the `md:hidden`
  110 |       // Welcome dialog block under the figure. Find the <ul> that
  111 |       // holds the desktop welcome icon tiles — WELCOME_ICONS is 11
  112 |       // entries (Destaques was dropped in favor of visitantes.exe),
  113 |       // plus the VisitCounter <li>, so the mobile <ul> has 12
  114 |       // children. Other <ul>s on the page (sitemap footer, etc.)
  115 |       // have very different counts.
  116 |       const lists = Array.from(
  117 |         document.querySelectorAll<HTMLElement>('main ul')
  118 |       );
  119 |       const grid = lists.find((ul) => ul.children.length === 12);
  120 |       if (!grid) return null;
  121 |       const cs = getComputedStyle(grid);
  122 |       const items = Array.from(grid.children) as HTMLElement[];
  123 |       return {
  124 |         cols: cs.gridTemplateColumns,
  125 |         display: cs.display,
  126 |         itemCount: items.length,
  127 |         // First 6 items are the left-side anchors (Agenda, Música,
  128 |         // Galeria, Vídeos, Sobre, Contato). 7th is VisitCounter
  129 |         // (right-side FIRST). 8-12 are Sets, SoundCloud, Instagram,
  130 |         // Twitch, TikTok. The VisitCounter <li> wraps a <button>
  131 |         // carrying [data-testid="visit-counter"].
  132 |         visitCounterIndex: items.findIndex((it) =>
  133 |           it.querySelector('[data-testid="visit-counter"]')
  134 |         ),
  135 |         // Background of the grid container should NOT be `bg-win-face`
  136 |         // (gray Win95 chrome) — the user wants the icons directly on
  137 |         // the pink halftone.
  138 |         gridBg: getComputedStyle(grid.parentElement?.parentElement ?? grid).backgroundColor,
  139 |         // Each <li> should have transparent bg, no Win95 bevel.
  140 |         firstItemBg: getComputedStyle(items[0]).backgroundColor,
  141 |       };
  142 |     });
  143 |     expect(m, "mobile grid not found").not.toBeNull();
  144 |     if (!m) return;
  145 | 
  146 |     // 3 columns (390 ÷ 3 = ~130px, fits).
  147 |     expect(m.cols.split(" ").length, "must be 3 columns on a 390px phone").toBe(3);
  148 |     // 11 anchors + 1 VisitCounter <li> = 12 children total in the
  149 |     // mobile grid.
  150 |     expect(m.itemCount, "mobile grid item count").toBe(12);
  151 |     // VisitCounter should be at index 6 (7th item, FIRST in the
  152 |     // right-side sequence). After left-side 6 anchors come:
  153 |     // VisitCounter (slot 7) → Sets (8) → SoundCloud (9) → ...
  154 |     expect(m.visitCounterIndex, "VisitCounter first in right-side sequence").toBe(6);
  155 |     // Grid itself should be transparent (the pink halftone bleeds
  156 |     // through). `bg-win-face` = #c0c0c0 / rgb(192, 192, 192).
  157 |     expect(m.gridBg).not.toBe("rgb(192, 192, 192)");
  158 |   });
  159 | 
  160 |   test("desktop 1440px shows all 12 anchor tiles + VisitCounter in flanking columns", async ({ page }) => {
  161 |     await page.setViewportSize({ width: 1440, height: 900 });
  162 |     await page.waitForLoadState("networkidle");
  163 |     await page.waitForTimeout(200);
  164 | 
  165 |     const m = await page.evaluate(() => {
  166 |       // Filter to *visible* anchors manually (Playwright's :visible
  167 |       // pseudo-class is unavailable inside `page.evaluate`'s raw
  168 |       // document context). We treat anything with a non-zero
  169 |       // bounding-rect width/height AND not `display: none` as visible.
  170 |       const isVisible = (el: HTMLElement) => {
  171 |         const r = el.getBoundingClientRect();
  172 |         if (r.width === 0 || r.height === 0) return false;
  173 |         const s = getComputedStyle(el);
  174 |         if (s.display === "none" || s.visibility === "hidden") return false;
  175 |         return true;
  176 |       };
  177 |       const all = Array.from(document.querySelectorAll<HTMLElement>("a.win95-icon")).filter(
  178 |         isVisible
  179 |       );
  180 |       // VisitCounter is <button>, not <a>; counted separately.
  181 |       const counters = Array.from(
  182 |         document.querySelectorAll<HTMLElement>('[data-testid="visit-counter"]')
  183 |       ).filter(isVisible);
  184 |       // Expected labels in the two columns:
  185 |       const leftLabels = ["Agenda", "Música", "Galeria", "Vídeos", "Sobre", "Contato"];
  186 |       const rightLabels = ["visitantes.exe", "Sets", "SoundCloud", "Instagram", "Twitch", "TikTok"];
  187 |       const labels = all.map((a) => a.getAttribute("title"));
  188 |       return {
  189 |         anchorCount: all.length,
  190 |         counterCount: counters.length,
  191 |         leftFound: leftLabels.every((l) => labels.includes(l)),
  192 |         rightFound: rightLabels.every((l) => labels.includes(l)),
  193 |       };
  194 |     });
  195 |     // 6 anchors per side = 12 total anchors. But the right column's
  196 |     // first slot is the VisitCounter (a <button>, not an <a>) and
  197 |     // the left col starts at the figure. So we have 11 <a>
  198 |     // win95-icon tiles (6 left + 5 right) + 1 VisitCounter
  199 |     // button. The "12th anchor slot" is the counter.
  200 |     expect(m.anchorCount, "11 anchor tiles on desktop (12th slot is VisitCounter)").toBe(11);
  201 |     // VisitCounter is a single instance on desktop (in the figure
  202 |     // row). Mobile is hidden.
  203 |     expect(m.counterCount, "1 VisitCounter on desktop").toBe(1);
  204 |     // All 6 left-side labels present.
  205 |     expect(m.leftFound, "left column labels (Agenda→Contato)").toBe(true);
  206 |     // VisitCounter + 5 right-side anchors present.
> 207 |     expect(m.rightFound, "right column labels (visitantes→TikTok)").toBe(true);
      |                                                                     ^ Error: right column labels (visitantes→TikTok)
  208 |   });
  209 | 
  210 |   test("welcome chip 'cremosa.exe — welcome' is visible on desktop above the figure", async ({ page }) => {
  211 |     await page.setViewportSize({ width: 1440, height: 900 });
  212 |     const chip = page.locator("text=cremosa.exe — welcome").first();
  213 |     await expect(chip).toBeVisible();
  214 |   });
  215 | });
  216 | 
```