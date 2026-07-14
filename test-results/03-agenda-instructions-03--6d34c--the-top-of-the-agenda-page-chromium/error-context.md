# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03-agenda-instructions.spec.ts >> 03 — Agenda: instruções dialog >> 'OK' button scrolls to the top of the agenda page
- Location: tests/e2e/03-agenda-instructions.spec.ts:39:7

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 100
Received:   0
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
      - heading "Agenda — Cremosa" [level=1] [ref=e45]
      - paragraph [ref=e46]: //Início › Agenda · 2026
      - generic [ref=e49]:
        - generic [ref=e51]: agenda — instruções
        - generic [ref=e53] [cursor=pointer]:
          - generic [ref=e54]: ─
          - generic [ref=e55]: □
          - generic [ref=e56]: ×
        - generic [ref=e58]:
          - paragraph [ref=e59]: Próximos shows, festivais e residências. Ingressos pelo link de cada data — quando disponível. Usa os filtros acima pra navegar entre próximas, histórico ou tudo.
          - generic [ref=e60]:
            - button "Imprimir" [ref=e61] [cursor=pointer]
            - button "OK" [ref=e62] [cursor=pointer]
    - generic [ref=e64]:
      - navigation "Filtro de agenda" [ref=e65]:
        - link "Próximas 0" [ref=e66] [cursor=pointer]:
          - /url: /agenda/?view=upcoming
          - button "Próximas 0" [ref=e67]:
            - text: Próximas
            - generic [ref=e68]: "0"
        - link "Histórico 3" [ref=e69] [cursor=pointer]:
          - /url: /agenda/?view=past
          - button "Histórico 3" [ref=e70]:
            - text: Histórico
            - generic [ref=e71]: "3"
        - link "Tudo 3" [ref=e72] [cursor=pointer]:
          - /url: /agenda/?view=all
          - button "Tudo 3" [ref=e73]:
            - text: Tudo
            - generic [ref=e74]: "3"
        - generic [ref=e75]: 3 shows · ordenado por data
      - region [ref=e76]:
        - generic [ref=e78]: 0 shows
        - generic [ref=e81]:
          - generic [ref=e83]: agenda — sistema
          - generic [ref=e85] [cursor=pointer]:
            - generic [ref=e86]: ─
            - generic [ref=e87]: □
            - generic [ref=e88]: ×
          - generic [ref=e90]:
            - generic [ref=e91]:
              - generic [ref=e92]: i
              - generic [ref=e93]:
                - paragraph [ref=e94]: Nada agendado ainda
                - paragraph [ref=e95]:
                  - text: "Enquanto isso, segue nas redes pra não perder o próximo anúncio. Segue lá:"
                  - link "@djcremosa" [ref=e96] [cursor=pointer]:
                    - /url: https://instagram.com/djcremosa
                  - text: .
            - link "OK" [ref=e98] [cursor=pointer]:
              - /url: https://instagram.com/djcremosa
              - button "OK" [ref=e99]
  - contentinfo [ref=e100]:
    - status "Barra de status" [ref=e101]:
      - generic [ref=e102]: ● Pronto · Porto Alegre, RS — Brasil
      - generic [ref=e103]: Cremosa · desde 2016
      - link "Booking →" [ref=e105] [cursor=pointer]:
        - /url: /contato/
      - generic [ref=e106]: 18:53
  - button "Open Next.js Dev Tools" [ref=e112] [cursor=pointer]:
    - img [ref=e113]
  - alert [ref=e116]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * 03 — Agenda: instructions dialog interactivity
  5  |  *
  6  |  * The "agenda — instruções" dialog at the top of /agenda/ has two
  7  |  * buttons:
  8  |  *   - Imprimir → calls window.print()
  9  |  *   - OK → scrolls back to the top of the page
  10 |  *
  11 |  * These are now wired through `<AgendaInstructions>` (a client
  12 |  * component). The tests verify the side effects, not the markup.
  13 |  */
  14 | 
  15 | test.describe("03 — Agenda: instruções dialog", () => {
  16 |   test.beforeEach(async ({ page }) => {
  17 |     await page.goto("/?skipGate=1");
  18 |     await page.goto("/agenda/");
  19 |   });
  20 | 
  21 |   test("'Imprimir' button triggers window.print()", async ({ page }) => {
  22 |     // Spy on window.print so we can assert it gets called.
  23 |     await page.evaluate(() => {
  24 |       window.__printCalled = 0;
  25 |       window.print = () => {
  26 |         window.__printCalled++;
  27 |       };
  28 |     });
  29 | 
  30 |     await page
  31 |       .getByRole("button", { name: /imprimir/i })
  32 |       .first()
  33 |       .click();
  34 | 
  35 |     const printCount = await page.evaluate(() => window.__printCalled);
  36 |     expect(printCount).toBe(1);
  37 |   });
  38 | 
  39 |   test("'OK' button scrolls to the top of the agenda page", async ({
  40 |     page,
  41 |   }) => {
  42 |     // Scroll down first so we can measure a real scroll change
  43 |     await page.evaluate(() => window.scrollTo(0, 600));
  44 |     const beforeY = await page.evaluate(() => window.scrollY);
> 45 |     expect(beforeY).toBeGreaterThan(100);
     |                     ^ Error: expect(received).toBeGreaterThan(expected)
  46 | 
  47 |     // Click OK — the agenda-instruções one (not the home-properties one).
  48 |     // Use first visible OK that's not inside an aria-label.
  49 |     const okButton = page.getByRole("button", { name: /^OK$/ }).first();
  50 |     await okButton.click();
  51 | 
  52 |     // Allow smooth scroll to settle (CSS smooth scroll)
  53 |     await page.waitForTimeout(800);
  54 |     const afterY = await page.evaluate(() => window.scrollY);
  55 |     expect(afterY).toBeLessThan(beforeY);
  56 |   });
  57 | });
  58 | 
```