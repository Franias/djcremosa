# DJ Cremosa · site

Site pessoal de **DJ Cremosa** — agenda de shows, música, galeria, vídeos e contato.

Stack: **Next.js 16** (App Router, Turbopack) · **React 19** · **Tailwind v4** · **TypeScript** · **dark mode**.

> Documento de referência completo: [`SPEC.md`](./SPEC.md).

---

## 🧞 Comandos

```bash
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm start        # serve o build
npm run lint     # ESLint
```

## 📁 Estrutura

```
app/                 rotas (App Router)
  agenda/            ★ pronto: lista de shows com filtro
  sobre/  musica/    ⏳ stubs (próximas seções)
  galeria/ videos/
  contato/           pronto: cartões de contato
components/
  nav/               SiteNav, SiteFooter
  sections/          AgendaView, EventRow, SectionPlaceholder
content/
  events.ts          ★ dados da agenda (TS tipado)
lib/
  site.ts            constantes de marca, contatos, social
  events.ts          tipos + helpers de data
public/              assets estáticos
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

Push e pronto — Vercel rebuilda.

## 🪪 Marca

- **Nome:** DJ Cremosa (display: CREMESSA)
- **Ativa desde:** 2016 · Porto Alegre, RS
- **Tagline:** "Seletora · Curadoria · Discotecagem"
- **Manifesto:** "Música preta global na pista."

Tokens, cores e tipografia estão em `app/globals.css` (`@theme { ... }`).

## 🚀 Deploy

1. Conectar o repo na Vercel
2. Setar `NEXT_PUBLIC_SITE_URL` = `https://djcremosa.com.br`
3. Cada `git push` vira preview; merge na main vira produção

## 📝 Licença

Código: privado. Conteúdo (texto, imagens, áudio): © DJ Cremosa.
