# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-home.spec.ts >> 02 — Home page >> footer has a link to /contato/
- Location: tests/e2e/02-home.spec.ts:152:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('footer').locator('a[href="/contato"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('footer').locator('a[href="/contato"]').first()

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
  - heading "Cremosa — Início" [level=1]
  - paragraph: Início › Seletora · Curadoria · Discotecagem
  - text: cremosa.exe — welcome
  - paragraph: // 12 atalhos · clique pra abrir
  - list:
    - listitem:
      - link "Agenda Ir para Agenda":
        - /url: /agenda/
    - listitem:
      - link "Música Ir para Música":
        - /url: /musica/
    - listitem:
      - link "Galeria Ir para Galeria":
        - /url: /galeria/
    - listitem:
      - link "Vídeos Ir para Vídeos":
        - /url: /videos/
    - listitem:
      - link "Sobre Ir para Sobre":
        - /url: /sobre/
    - listitem:
      - link "Contato Ir para Contato":
        - /url: /contato/
    - listitem:
      - link "Sets Ir para Sets":
        - /url: /musica/
    - listitem:
      - link "Notas Ir para Notas":
        - /url: /sobre/
    - listitem:
      - link "Destaques Ir para Destaques":
        - /url: /#destaques
    - listitem:
      - link "Booking Abrir Booking em nova aba":
        - /url: mailto:franciellipdias@gmail.com
    - listitem:
      - link "SoundCloud Abrir SoundCloud em nova aba":
        - /url: https://soundcloud.com/cremosinha
    - listitem:
      - link "Instagram Abrir Instagram em nova aba":
        - /url: https://instagram.com/djcremosa
  - text: © 2026 Cremosa · Porto Alegre, RS Seletora · Curadoria · Discotecagem v1.0 · 2026
  - navigation "Mapa do site":
    - link "Agenda":
      - /url: /agenda/
    - link "Música":
      - /url: /musica/
    - link "Galeria":
      - /url: /galeria/
    - link "Vídeos":
      - /url: /videos/
    - link "Sobre":
      - /url: /sobre/
    - link "Contato":
      - /url: /contato/
    - link "Booking":
      - /url: /contato/
  - text: cremosa.txt — readme
  - paragraph: // Porto Alegre, RS — Brasil · desde 2016
  - paragraph:
    - text: DJ Cremosa é uma artista da cena de Porto Alegre que atua desde 2016, conhecida por sets intensos que conectam diferentes vertentes da
    - strong: música preta global
    - text: .
  - paragraph:
    - text: Sua pesquisa parte do
    - strong: funk brasileiro
    - text: e se expande por rap, amapiano, house, pop e R&B — pistas marcadas por groove, energia e mistura de estilos.
  - button "Copiar"
  - button "Fechar ×"
  - complementary:
    - text: cremosa — propriedades
    - term: "Nome:"
    - definition: Cremosa
    - term: "Cidade:"
    - definition: Porto Alegre, RS
    - term: "Desde:"
    - definition: "2016"
    - term: "Coletivo:"
    - definition: AfroJams (2025→)
    - term: "Residência:"
    - definition: BatukBaile (2026→)
    - button "OK"
  - paragraph: // próximas datas
  - link "agenda completa →":
    - /url: /agenda/
    - button "agenda completa →"
  - text: agenda — sistema
  - paragraph: Nada agendado pra esse momento
  - paragraph:
    - text: Segue a Cremosa nas redes pra não perder o próximo anúncio.
    - link "@djcremosa":
      - /url: https://instagram.com/djcremosa
  - link "OK":
    - /url: https://instagram.com/djcremosa
    - button "OK"
  - paragraph: // em destaque
  - heading "Dez anos na pista, da cena de Porto Alegre pro mundo." [level=2]
  - text: cremosa.txt — destaques
  - paragraph: "Última atualização: 2026"
  - list:
    - listitem: ★ Rap in Cena 2023 (com D'Lock) e 2024 (solo)
    - listitem: ★ Abertura para Rafa Moreira, Baco Exu do Blues e KL Jay
    - listitem: ★ Co-fundadora do coletivo AfroJams (2025)
    - listitem: ★ Line-up Planeta Atlântida 2026 via AfroJams
    - listitem: ★ Residência BatukBaile (2026)
  - paragraph: // fim do arquivo
  - paragraph: // pasta do sistema
  - text: cremosa — pasta do sistema
  - img "Cremosa — logotipo oficial"
  - paragraph: .
  - paragraph: Porto Alegre, RS — Brasil
  - paragraph: Contato
  - list:
    - listitem:
      - link "franciellipdias@gmail.com":
        - /url: mailto:franciellipdias@gmail.com
    - listitem:
      - link "+55 51 99372-3158":
        - /url: tel:+5551993723158
  - paragraph: Onde me achar
  - list:
    - listitem:
      - link "Instagram · @djcremosa":
        - /url: https://instagram.com/djcremosa
    - listitem:
      - link "Próximos shows":
        - /url: /agenda/
- contentinfo:
  - status "Barra de status":
    - text: ● Pronto · Porto Alegre, RS — Brasil Cremosa · desde 2016
    - link "Booking →":
      - /url: /contato/
    - text: 21:06
- alert
```

# Test source

```ts
  57  |     const href = await icon.getAttribute("href");
  58  |     expect(href).toMatch(/^mailto:franciellipdias@gmail\.com/);
  59  |   });
  60  | 
  61  |   test("SoundCloud icon opens soundcloud.com/cremosinha", async ({ page }) => {
  62  |     const icon = page.locator('a.win95-icon[title="SoundCloud"]').first();
  63  |     await expect(icon).toBeVisible();
  64  |     const href = await icon.getAttribute("href");
  65  |     expect(href).toBe("https://soundcloud.com/cremosinha");
  66  |   });
  67  | 
  68  |   test("Instagram icon opens instagram.com/djcremosa", async ({ page }) => {
  69  |     const icon = page.locator('a.win95-icon[title="Instagram"]').first();
  70  |     await expect(icon).toBeVisible();
  71  |     const href = await icon.getAttribute("href");
  72  |     expect(href).toBe("https://instagram.com/djcremosa");
  73  |   });
  74  | 
  75  |   test("SiteNav has 8 link elements (home + 6 pages + booking)", async ({
  76  |     page,
  77  |   }) => {
  78  |     // The desktop nav contains:
  79  |     // - 1 home icon (Link to /)
  80  |     // - 6 page links
  81  |     // - 1 booking mailto link
  82  |     const nav = page.locator('nav[aria-label="Principal"]').first();
  83  |     const links = nav.locator("a");
  84  |     await expect(links).toHaveCount(8);
  85  |   });
  86  | 
  87  |   test("clicking 'Música' in nav navigates to /musica/", async ({ page }) => {
  88  |     await page
  89  |       .locator('nav[aria-label="Principal"]')
  90  |       .getByRole("link", { name: /música/i })
  91  |       .first()
  92  |       .click();
  93  |     await expect(page).toHaveURL(/\/musica\/?$/);
  94  |   });
  95  | 
  96  |   test("press highlights section shows the destaques window", async ({
  97  |     page,
  98  |   }) => {
  99  |     await page
  100 |       .locator("text=cremosa.txt — destaques")
  101 |       .first()
  102 |       .scrollIntoViewIfNeeded();
  103 |     await expect(
  104 |       page.locator("text=cremosa.txt — destaques").first(),
  105 |     ).toBeVisible();
  106 |     // At least one of the 5 highlights
  107 |     await expect(page.getByText(/Rap in Cena/).first()).toBeVisible();
  108 |   });
  109 | 
  110 |   test("about section (readme) renders", async ({ page }) => {
  111 |     // The readme dialog is below the fold; scroll to it.
  112 |     await page
  113 |       .locator("text=cremosa.txt — readme")
  114 |       .first()
  115 |       .scrollIntoViewIfNeeded();
  116 |     const readme = page
  117 |       .locator("text=cremosa.txt — readme")
  118 |       .first();
  119 |     await expect(readme).toBeVisible();
  120 |     await expect(
  121 |       page
  122 |         .getByText(/DJ Cremosa é uma artista da cena de Porto Alegre/i)
  123 |         .first(),
  124 |     ).toBeVisible();
  125 |   });
  126 | 
  127 |   test("em destaque section shows the press highlights heading", async ({
  128 |     page,
  129 |   }) => {
  130 |     // "Dez anos na pista, da cena de Porto Alegre pro mundo." is the
  131 |     // h2 of the press highlights section.
  132 |     await page
  133 |       .getByRole("heading", { name: /Dez anos na pista/i, level: 2 })
  134 |       .scrollIntoViewIfNeeded();
  135 |     await expect(
  136 |       page.getByRole("heading", {
  137 |         name: /Dez anos na pista/i,
  138 |         level: 2,
  139 |       }),
  140 |     ).toBeVisible();
  141 |   });
  142 | 
  143 |   test("footer is a Win95 status bar with Pronto indicator", async ({
  144 |     page,
  145 |   }) => {
  146 |     await page.locator("footer").scrollIntoViewIfNeeded();
  147 |     const footer = page.locator("footer");
  148 |     await expect(footer).toBeVisible();
  149 |     await expect(footer.getByText(/Pronto/).first()).toBeVisible();
  150 |   });
  151 | 
  152 |   test("footer has a link to /contato/", async ({ page }) => {
  153 |     // The footer is below the fold; scroll to it before asserting.
  154 |     await page.locator("footer").scrollIntoViewIfNeeded();
  155 |     const footer = page.locator("footer");
  156 |     const contatoLink = footer.locator('a[href="/contato"]');
> 157 |     await expect(contatoLink.first()).toBeVisible();
      |                                       ^ Error: expect(locator).toBeVisible() failed
  158 |   });
  159 | 
  160 |   test("'Fechar ×' on readme dialog hides it and shows a reopen button", async ({
  161 |     page,
  162 |   }) => {
  163 |     await page
  164 |       .locator("text=cremosa.txt — readme")
  165 |       .first()
  166 |       .scrollIntoViewIfNeeded();
  167 |     await expect(
  168 |       page.locator("text=cremosa.txt — readme").first(),
  169 |     ).toBeVisible();
  170 |     await page.getByRole("button", { name: /fechar/i }).first().click();
  171 |     await expect(
  172 |       page.locator("text=cremosa.txt — readme (fechado)").first(),
  173 |     ).toBeVisible();
  174 |   });
  175 | 
  176 |   test("'OK' on propriedades dialog hides it and shows a reopen button", async ({
  177 |     page,
  178 |   }) => {
  179 |     await page
  180 |       .locator("text=cremosa — propriedades")
  181 |       .first()
  182 |       .scrollIntoViewIfNeeded();
  183 |     await expect(
  184 |       page.locator("text=cremosa — propriedades").first(),
  185 |     ).toBeVisible();
  186 |     await page.getByRole("button", { name: /^OK$/ }).first().click();
  187 |     await expect(
  188 |       page.locator("text=cremosa — propriedades (fechado)").first(),
  189 |     ).toBeVisible();
  190 |   });
  191 | 
  192 |   test("'Copiar' button copies manifesto to clipboard", async ({
  193 |     page,
  194 |     context,
  195 |   }) => {
  196 |     await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  197 |     await page
  198 |       .locator("text=cremosa.txt — readme")
  199 |       .first()
  200 |       .scrollIntoViewIfNeeded();
  201 |     await page.getByRole("button", { name: /copiar/i }).first().click();
  202 |     await expect(
  203 |       page.getByText(/✓ copiado|copiar ✓/i).first(),
  204 |     ).toBeVisible({ timeout: 3_000 });
  205 |     const clipboardText = await page.evaluate(() =>
  206 |       navigator.clipboard.readText(),
  207 |     );
  208 |     expect(clipboardText).toContain("DJ Cremosa");
  209 |     expect(clipboardText).toContain("música preta global");
  210 |   });
  211 | 
  212 | });
  213 | 
```