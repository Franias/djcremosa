# DJ Cremosa · site

Site pessoal de **DJ Cremosa** — agenda de shows, música, galeria, vídeos e contato.

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
  lineup: ["DJ Cremosa", "+ outros"],
  ticketUrl: "https://...",
}
```

Push → Actions rebuilda → live em ~60s.

## 🪪 Marca

- **Nome:** DJ Cremosa (display: CREMESSA)
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

Código: privado. Conteúdo (texto, imagens, áudio): © DJ Cremosa.
# djcremosa
