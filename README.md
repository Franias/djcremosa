# Cremosa · site

Site pessoal de **Cremosa** — agenda de shows, música, galeria, vídeos e contato.

Stack: **Next.js 16** (App Router, Turbopack) · **React 19** · **Tailwind v4** · **TypeScript** · **dark mode**.
Deploy: **GitHub Pages** via GitHub Actions (`output: 'export'`).

> Documento de referência completo: [`SPEC.md`](./SPEC.md).

---

## 🧞 Comandos

```bash
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # gera ./out (HTML estático pra GitHub Pages)
npm run start    # serve o ./out localmente (teste de produção)
npm run lint     # ESLint
```

## 🚀 Deploy no GitHub Pages

### Setup inicial (uma vez)

1. **Crie o repo** no GitHub (pode ser privado no plano Pro/Team; free exige público).
2. **Conecte o remoto** local:
   ```bash
   git remote add origin git@github.com:SEU-USER/dj-cremosa.git
   git push -u origin main
   ```
3. **Ative Pages**: no GitHub, **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.

Pronto. Cada push em `main` rebuilda em ~60s. URL pública padrão:

```
https://SEU-USER.github.io/dj-cremosa/
```

### Domínio custom (djcremosa.com.br)

Ver [`SPEC.md` §7](../../Projects/dj-cremosa/SPEC.md#7-como-rodar-e-fazer-deploy) para detalhes. Resumo:
- Comprou o domínio → configura no painel do GitHub Pages
- CNAME no DNS → repo faz o resto
- HTTPS é automático após provisioning

### Domínio custom ⚠️ (limitação do plano free)

GitHub Pages no plano **free** só permite domínio custom em repos **públicos**. Para repo privado + domínio custom:
- **GitHub Pro** (~$4/mês), ou
- Hospedar `out/` em outro lugar (Cloudflare Pages, Netlify, Surge.sh — todos têm free tier com domínios custom).

## 👀 Visitantes em tempo real

O tile `visitantes.exe` usa [`playhtml`](https://playhtml.fun/docs/) com a sala pública fixa `dj-cremosa-site`:

- `site-visitor-count` é **page data persistente** e guarda o total de visitantes.
- `site-visitor-presence` é **presence efêmera** e alimenta o número "online agora".
- `lib/playhtml.ts` centraliza a importação dinâmica do runtime no navegador, porque o playhtml usa APIs do DOM e o site é exportado estaticamente; métricas e graffiti reutilizam o mesmo singleton.
- `cremosa-visit-recorded-at` no `localStorage` limita cada navegador a um incremento por 24 horas.

O mural usa duas camadas no mesmo room público:

- `site-graffiti-strokes` é `PageData` persistente: strokes finalizados aparecem depois de reload e em qualquer rota.
- `site-graffiti-active-stroke` é `Presence` efêmero: o spray que está sendo desenhado aparece ao vivo para outras pessoas e desaparece quando a sessão fecha.

A tecla `G` liga/desliga o modo em qualquer lugar (fora de inputs/textareas). Ao entrar, um aviso `BE NICE!` aparece por ~2.4s. No modo ativo, a camada transparente captura o arraste, o cursor vira uma lata de spray e a etiqueta junto ao cursor instrui `PRESSIONE G PARA GRAFITAR` (suprimida em touch-only via `@media (hover: none) and (pointer: coarse)` — celular/tablet não tem cursor pra acompanhar). Ao sair, a camada faz fade-out (opacity 1→0 em 600ms) e libera o clique — os traços pintados continuam persistidos no mural compartilhado. O botão `G · GRAFFITI` é o fallback para toque/mobile. A barra flutuante tem paleta de 5 cores da marca, um slider de 8–96px para o tamanho do spray, um botão `APAGAR` que remove apenas os traços pintados neste navegador (outros visitantes continuam visíveis) e um único botão `SHARE` que exporta o mural como PNG 1080×1920 (9:16 Story) com moldura cinza Win95, faixa de título azul (`graffiti.exe · CREMOSA`), status bar do site (`Pronto · Porto Alegre, RS — Brasil`, `Cremosa · desde 2016`, `Next show · franias.github.io/djcremosa.exe`, `Booking →`) e legenda azul `CONTRACT CREMOSA FOR YOU SHOW` com a URL `franias.github.io/djcremosa.exe` pronta pra postar no Instagram ou em qualquer rede. A pintura é blitada na orientação original (sem rotação de 90°) usando `contain` fit — um traço horizontal continua horizontal no PNG. O botão dispara `navigator.share({ files })` em browsers móveis quando disponível e cai pra `<a download>` nos desktops. Em `max-width: 639px` a toolbar ganha `flex-wrap` e `align-content: flex-end` para que `SHARE`, `APAGAR`, paleta, slider e `LIVE` permaneçam todos visíveis sem rolagem horizontal, mesmo em telas de 320px. A muralha é deliberadamente pública e limitada a 320 strokes para o room não crescer sem controle.

O serviço PartyKit hospedado pelo playhtml é público e não criptografado por padrão; não armazene dados privados nessa sala. O plugin de Claude do repositório é opcional e a aplicação usa diretamente o pacote npm `playhtml`.

## 📁 Estrutura

```
app/                 rotas (App Router)
  agenda/            ★ pronto: lista de shows com filtro
  sobre/  musica/    ⏳ stubs (próximas seções)
  galeria/ videos/
  contato/           pronto: cartões de contato
components/
  nav/               SiteNav, SiteFooter
  sections/          AgendaView (client), EventRow, SectionPlaceholder
content/
  events.ts          ★ dados da agenda (TS tipado)
lib/
  site.ts            constantes de marca, contatos, social
  events.ts          tipos + helpers de data
public/              assets estáticos
.github/workflows/
  deploy.yml         ★ GitHub Actions: build → ./out → Pages
```

## ➕ Adicionar um show

Edita `content/events.ts`:

```ts
{
  slug: "show-2026-11-club-x",
  title: "Noite de abertura",
  date: "2026-11-22",          // ISO YYYY-MM-DD
  time: "23h",
  venue: "Club X",
  city: "Porto Alegre",
  region: "RS",
  country: "Brasil",
  status: "confirmed",         // confirmed | tentative | sold-out | postponed | cancelled
  category: "club",            // festival | club | party | residency | tour | private
  lineup: ["Cremosa", "+ outros"],
  ticketUrl: "https://...",
}
```

Push → Actions rebuilda → live em ~60s.

## 🪪 Marca

- **Nome:** Cremosa
- **Logo:** `/public/logo/cremosa-original.png` (master) + versões 1200/600/240
- **Ativa desde:** 2016 · Porto Alegre, RS
- **Tagline:** "Seletora · Curadoria · Discotecagem"
- **Manifesto:** "Música preta global na pista."
- **Contato:** `franciellipdias@gmail.com` · `+55 51 99372-3158` · `@djcremosa`

Tokens, cores e tipografia estão em `app/globals.css` (`@theme { ... }`).

## 🔄 Trocar para Vercel (se quiser SSR nativo mais tarde)

```diff
- next.config.ts: remover `output: 'export'`, `trailingSlash`, `images.unoptimized`
- app/agenda/page.tsx: voltar a usar `await searchParams` server-side
- components/sections/AgendaView.tsx: remover "use client" e prop `view`
- deploy: Vercel detecta Next.js sozinho, só conectar o repo
```

## 📝 Licença

Código: privado. Conteúdo (texto, imagens, áudio): © Cremosa.
# djcremosa
# djcremosa
# djcremosa
# djcremosa
