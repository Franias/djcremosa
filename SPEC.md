# SPEC — Site Cremosa

> Documento vivo. Última atualização: **2026-07-08**.
> Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · dark mode.

---

## 0. Resumo em uma linha

Site pessoal de **Cremosa** — seletora de Porto Alegre, ativa desde 2016. Apresenta a persona, a agenda de shows, o repertório musical e o material de imprensa. Visual Y2K crimson/magenta, tom direto, mobile-first.

## 1. Identidade de marca (do Midia Kit 2026)

| Atributo | Detalhe |
|---|---|
| **Nome artístico (site)** | **Cremosa** |
| **Logo canônico** | `/public/logo/cremosa-original.png` (4K master) + versões 1200/600/240 |
| **Aliases preservados** | "DJ Cremosa" (legacy SEO / billing de evento), "CREMESSA" (display secundário do press kit) |
| **Localização** | Porto Alegre, RS — Brasil |
| **Ativa desde** | 2016 (10 anos em 2026) |
| **Pilares textuais** | SELETORA · CURADORIA · DISCOTECAGEM |
| **Manifesto curto** | "Música preta global na pista." |
| **Tagline curta** | "Sua curadoria musical valoriza a potência da música preta na pista e cria sets dinâmicos que transitam entre diferentes épocas, ritmos e influências." |
| **Cores** | Crimson `#c8152e`, Magenta `#d6307a`, Bubble pink `#ff6fa3`, Cream `#f4e7d3`, BG `#0a0606` |
| **Tipografia display** | **Bagel Fat One** (Google Fonts) — bubble Y2K chunky, usada em headings de seção (AGENDA, CONTATO etc.) |
| **Tipografia corpo** | Geist Sans · Geist Mono |
| **Tratamento visual** | Film grain overlay (CSS), gloss duplo nas letras-display, scroll vertical sem scroll-jank |
| **Tom de voz** | Direto, orgulhoso da negritude da cena, em primeira pessoa. Sempre pt-BR |

### Subgêneros (chips na bio, futura seção Música)

funk brasileiro · rap · amapiano · house · pop · R&B

### Highlights de carreira (do kit)

- **2023** — Rap in Cena, ao lado de D'Lock
- **2024** — Rap in Cena solo
- Aberturas para Rafa Moreira, Baco Exu do Blues e KL Jay
- **2025** — Co-funda o coletivo **AfroJams**
- **2026** — Line-up **Planeta Atlântida** via AfroJams
- **2026** — Residência **BatukBaile**

> ⚠️ **Inconsistência detectada no kit**: o telefone listado é `+51 993723158` (código +51 = **Peru**). Ela opera em Porto Alegre/Brasil, então o número correto provavelmente é `+55 51 99372-3158` ou similar. **Validar com Cremosa antes de publicar** — deixei como está no press kit no site, mas a SPEC recomenda corrigir quando confirmar.

### Contatos oficiais (do kit)

| Canal | Valor |
|---|---|
| Instagram | `@djcremosa` |
| Twitch | `https://www.twitch.tv/djcremosa` |
| TikTok | `@cremosinh4` (https://www.tiktok.com/@cremosinh4) |
| Email | `franciellipdias@gmail.com` |
| Telefone (kit) | `+51 993723158` ⚠️ validar DDI |

---

## 2. Estrutura de páginas

```
/                Hero · agenda preview · press highlights
/agenda          ★ Foco principal · upcoming/past/all com filtro URL
/musica          [stub] sets, tracklists, filtros por gênero
/galeria         [stub] grid masonry + lightbox
/videos          [stub] embeds YouTube/Vimeo
/sobre           [stub] bio + linha do tempo 2016→hoje
/contato         Cartões mailto para booking, imprensa, telefone, IG, Twitch, TikTok
```

Todos os stubs compartilham `components/sections/SectionPlaceholder` — em vez de 404, mostram um manifesto do que vai ter na seção.

### Mapa de seção `/agenda` (entregue no protótipo)

```
HERO
 ├ Eyebrow: // agenda · ANO
 ├ Título "AGENDA" gigante (display bubble)
 └ Lede: "Próximos shows, festivais e residências..."

FILTRO (URL ?view=)
 ├ [ Próximas (N) ]   ← default
 ├ [ Histórico (N) ]
 └ [ Tudo (N) ]

PRÓXIMAS DATAS  (upcoming ascending by date)
 └ EventRow[]
     ├ Date col (DIA / MÊS / ANO) — bubble style se futuro
     ├ Eyebrow chips: categoria · status (com cor)
     ├ Title h3
     ├ Venue · city · region · country · time · endDate
     ├ Line-up (opcional) + note (opcional, italic)
     └ Actions: Ingressos → (se confirmado)

HISTÓRICO  (past descending by date) — modo compact (esconde line-up)
 └ mesma estrutura, date em cream-dim (sem gloss)
```

**Filtro é server-side via searchParam** → zero JS no cliente, URL compartilhável, SEO-friendly.

### `/agenda` schema de dados (`content/events.ts`)

```ts
interface CremosaEvent {
  slug: string;
  title: string;
  date: "YYYY-MM-DD";
  endDate?: "YYYY-MM-DD";
  time?: string;             // "23h"
  venue: string;
  city: string;
  region?: string;           // UF
  country: string;
  status: "confirmed" | "tentative" | "sold-out" | "postponed" | "cancelled";
  category: "festival" | "club" | "party" | "residency" | "tour" | "private";
  lineup?: string[];
  ticketUrl?: string;
  note?: string;
  mock?: boolean;            // template entries, false em produção
}
```

**Mock data atual**: 3 upcoming + 4 past (Rap in Cena 2023/2024, Planeta Atlântida 2026, BatukBaile residency). Os 3 upcoming têm `mock: true` e `note` explicando como substituir.

---

## 3. Design system

### Identidade visual (rebrand 2026-07)

O site agora vive dentro de uma metáfora de **Windows 95/98 desktop**: cada
página é uma janela dentro de um shell Win95. O conteúdo do kit está
integrado como chrome nativo (título azul, botões 3D bevel, menu bar,
status bar com relógio, splash de boot, ícones de desktop).

### Tokens (em `app/globals.css`)

```
Surfaces:    bg #0a0606, surface #14090b, surface-2 #1f1014, line #2c1620
Foreground:  cream #f4e7d3, cream-dim #b9a995
Brand:       crimson #c8152e, crimson-deep #8a0d1f, magenta #d6307a,
             bubble #ff6fa3, bubble-hi #ffb3cf
Win95 chrome (registrados em `@theme`):
             win-face #c0c0c0, win-face-2 #d4d0c8, win-light #ffffff,
             win-shadow #808080, win-shadow-deep #404040, win-ink #000000,
             win-title-1 #000080, win-title-2 #1084d0, win-teal #008080
Status:      ok #7eea9a, warn #ffcc66, down #ff6477
```

### Padrão tipográfico (regra única)

| Função | Fonte | Classe | Onde |
|---|---|---|---|
| Hero display titles (`CREMOSA`, `AGENDA`, `SOBRE`, `GALERIA`, `MÚSICA`) | Bagel Fat One | `.bubble-strong` | Apenas nos `<h1>` de hero |
| Glitch hero titles (`contato`, `DJ SETS`) | VT323 | `.glitch` | Apenas nessas duas páginas |
| Chrome Win95 (title bar, botões, menu, status bar) | VT323 | embutido em `.win95-*` | Toda chrome Win95 |
| Site eyebrows `// foo` **fora** de janelas | VT323 | `font-pixel text-[11px]` | Acima de seções/hero |
| Texto de corpo **dentro** de janelas Win95 | Geist Mono | `font-mono` | Conteúdo de diálogos |
| Parágrafos/ledes **fora** de janelas (dark site) | Geist Sans | sem classe (default) | Hero ledes |
| Manifestos editoriais / citações | Geist Mono | `font-mono` | Sobre manifesto |
| Notepad body / midia-kit reference | Geist Mono | embutido em `.notepad-body` | Sobre + Música |

> **Regra:** "dentro de janela" = fonte mono (Geist Mono). "Fora de janela,
> precisa ler como MS Sans Serif" = `font-pixel`. "Hero gigante" = `.bubble-strong`.

### Primitivas Win95 (`components/ui/win95.tsx`)

| Componente | Uso |
|---|---|
| `Win95Window` | Container com blue title bar + bevel 3D; aceita `title`, `controls`, `titleExtras` |
| `Win95Button` / `Win95Link` | Botão 3D bevel padrão; aceita `active`, `focused` |
| `Win95StatusBar` | Strip inferior com clock live (HH:MM); aceita segmentos children |
| `Win95MenuBar` | `Arquivo · Editar · Exibir · Ajuda` com mnemonics underlined |
| `Win95Field` | Input com sunken inset |
| `Win95ProgressBar` | Barra Win95 (azul + stripes animadas) |

### Outros componentes

- `Win95Dialog` (`components/sections/Win95Dialog.tsx`) — diálogo de
  sistema com variantes `info | warning | error`, mensagem, hint e action
  row. Usado para empty states (agenda) e CTAs de booking (sobre).
- `VerticalRails` (`components/sections/VerticalRails.tsx`) — trilhos
  verticais no rodapé das páginas (ocultos em `lg` no mobile), com
  `SELETORA · CURADORIA · DISCOTECAGEM` à esquerda e `PRESS KIT · 2026` à
  direita.
- `LoadingScreen` (`components/LoadingScreen.tsx`) — splash de boot
  Win95 (logo + progress bar animada), toca 1x por sessão
  (sessionStorage `cremosa-splash-seen`).
- `GenrePills`, `Sparkle`, `Notepad`, `MediaPlayer` — primitivas
  restantes do kit, mantidas para coerência editorial.

### Classes utilitárias custom (em `app/globals.css`)

- `.bubble-strong` — gradiente 5-stop glossy display (cover treatment)
- `.glitch` — pixel-font heading com chromatic-aberration offset
- `.halftone` — campo de pontos diagonais para backgrounds
- `.scanlines` — overlay CRT / VHS linhas horizontais
- `.pink-mode` — variante rosa de seção (matching kit page 2)
- `.notepad` — Windows-Notepad window chrome (page 3)
- `.player` — Windows-Media-Player window chrome (page 4)
- `.cappill` — pílula de gênero (capsule tag com nó conector)
- `.sparkle` — starburst Y2K (inline)
- `.win95-*` (ver tabela de primitivas acima)
- `.grain` — overlay SVG inline de ruído, blend overlay, 18% opacity

### Princípios visuais

- **Win95 por padrão** — toda UI de chrome vive dentro de uma
  `Win95Window`. Sem cantos arredondados fora de `.win95-button` /
  `.cappill`.
- **Dark where no Win95** — fora de janelas, o site usa `#0a0606`.
- **Bordas bevel em vez de sombras** — chunky 3D bevel é o cinema.
- **Sem emojis** no body — usa ★ ▸ → ← etc quando precisa de glyph.
- **Tabular monospace** para os relojes / timestamps.
- **Eyebrows `// foo`** sempre em `font-pixel` para ler como MS Sans Serif.

---

## 4. Princípios técnicos

| Tema | Decisão |
|---|---|
| App Router | Sim — layouts aninhados quando precisar (ex: `(site)/agenda/[year]`) |
| Client Components | **Mínimo** — hoje zero. Filtro agenda é server-side via `searchParams` |
| Imagens | `next/image` + Cloudinary loader (Fase 2) |
| Vídeo | Embed YouTube/Vimeo, nunca self-host |
| Áudio (sets) | Embed SoundCloud/Mixcloud |
| Fonts | `next/font/google` (auto-self-hospedadas, zero CLS) |
| Forms | `mailto:` no MVP. Fase 2: Resend + React Email ou Formspree |
| Analytics | Fase 5: Plausible (cookie-free) |
| Deploy | Vercel (free tier cobre tranquilamente) |
| Domínio sugerido | `djcremosa.com.br` · alias `cremosa.art` |
| Idioma | `pt-BR` no `<html lang>`. EN fica pra `/en/*` se um dia precisar |

### Pastas

```
app/
  agenda/    [prototipado]
  sobre/     [stub]
  musica/    [stub]
  galeria/   [stub]
  videos/    [stub]
  contato/   [prototipado]
components/
  nav/        SiteNav, SiteFooter
  sections/   AgendaView, EventRow, SectionPlaceholder
content/
  events.ts   fonte da agenda (typed TS records)
lib/
  site.ts     brand + contatos
  events.ts   tipos + helpers (parseDate, splitAgenda, formatDate, badges)
public/
  photos/     [vazio — fase 2]
```

### Versão do framework

- **Next.js 16.2.10** (Turbopack default). Atenção a `params`/`searchParams` como `Promise` (await obrigatório).
- **React 19.2**.
- **Tailwind v4** com `@theme` em CSS, sem `tailwind.config.js`.

---

## 5. Roadmap por fase (cumulativo)

### ✅ Fase 1 — Scaffold + brand (FEITO)
- [x] Next.js 16 + TS + Tailwind v4
- [x] Paleta + tipografia display = press kit
- [x] Layout com nav sticky + footer
- [x] Página `/agenda` funcional com filtro URL
- [x] 3 mock events + 4 eventos reais do kit

### ⏭️ Fase 2 — Conteúdo
- [ ] Seed `content/events.ts` com 5–10 shows reais
- [ ] Substituir mocks por eventos reais conforme forem fechando
- [ ] `/sobre` com bio completa pt-BR (e EN)
- [ ] `/contato` formulário real (Resend ou Formspree)
- [ ] Foto oficial do hero (Cloudinary ou Next/Image local)

### ⏭️ Fase 3 — Música + Galeria + Vídeos
- [ ] `/musica` — embeds SoundCloud + filtro por gênero
- [ ] `/galeria` — masonry + lightbox, organizado por evento
- [ ] `/videos` — embeds YouTube com poster otimizado

### ⏭️ Fase 4 — Conteúdo derivado
- [ ] `/press-kit` mirror do PDF (download)
- [ ] `/releases` para EPs/singles se vier a produzir
- [ ] RSS da agenda (motor XML do Next)
- [ ] Open Graph image custom por página

### ⏭️ Fase 5 — Polimento + SEO
- [ ] Lighthouse ≥ 95 mobile
- [ ] Sitemap + robots
- [ ] Plausible/Umami analytics
- [ ] Schema.org `Person` + `MusicEvent` por evento
- [ ] 404 page bonitona

### ✅ Fase 6 — Lançamento (GitHub Pages)
- [x] `output: 'export'` + `trailingSlash: true` em `next.config.ts` → site vira HTML puro em `out/`
- [x] `/agenda` refatorado: client component com `useSearchParams`, Suspense no hero estático
- [x] Workflow GitHub Actions em `.github/workflows/deploy.yml`
- [x] Telefone validado: `+55 51 99372-3158`
- [ ] Subir repo no GitHub (proprietário)
- [ ] Settings → Pages → Source = "GitHub Actions" (uma vez)
- [ ] Domínio custom `djcremosa.com.br` (CNAME para `<user>.github.io`)
- [ ] Link na bio de todas as redes
- [ ] Submit sitemap ao Google Search Console

> **Vercel é a alternativa**: trocar `output: 'export'` por um deploy direto na Vercel te dá de volta SSR nativo, `next/image` otimizado, ISR e API routes. Recomendado se algum dia precisar de formulário com backend ou visualização em tempo real.

---

## 6. Decisões abertas (precisam de input da Cremosa)

1. **Domínio** — `djcremosa.com.br` é o mais óbvio. Confirmar disponibilidade.
2. **Telefone** — número do kit tem DDI +51 (Peru); validar o correto.
3. **Página `/en`** — quer versão bilíngue? Se sim, replicar tudo em `/en/*`.
4. **CMS** — quer editar a agenda sem mexer em código? Se sim, Fase 2 vira **Sanity** (recomendado) ou Notion-as-CMS.
5. **Player fixo** — quer player SoundCloud no rodapé que continua tocando entre páginas? Tende a incomodar em entrevistas/reuniões.
6. **Newsletter** — coletar email de fans? Se sim, integração com Resend + double opt-in.
7. **Loja** — vende camisetas/vinyl? Mercado Livre / Shopify / própria?

---

## 7. Como rodar e fazer deploy

### Local

```bash
cd ~/Projects/dj-cremosa
npm run dev          # dev em http://localhost:3000
npm run build        # roda sync:audio + gera ./out (estático, pronto pra publicar)
npx serve out        # serve o build localmente pra testar

# Comandos auxiliares
npm run sync:audio   # copia os MP3s de ~/Music/.../soundcloudtracks pra public/audio/
npm run lint         # ESLint
```

### Áudio (MP3s em /public/audio)

Os MP3s ficam em `/public/audio/` mas **são .gitignored** (194MB não vai
pro repo). Antes de cada `npm run build` (local e no CI), o script
`scripts/sync-audio.sh` copia os arquivos do backup local:

- **Origem padrão:** `~/Music/Downloaded by MediaHuman/soundcloudtracks/`
- **Override:** `AUDIO_SRC=/outro/caminho npm run sync:audio`
- **Idempotente:** pula arquivos que já estão atualizados (mtime + size)
- **Mapeamento:** a tabela `TRACKS` no script mapeia nome original do
  MediaHuman → slug kebab-case (ex.: `"Baguncinha [frita] #2.mp3"` →
  `baguncinha-frita-2.mp3`).

**No CI (GitHub Actions):** o workflow chama `npm run sync:audio` antes do
build. Se `AUDIO_SRC` não estiver definido (caso comum em runner
limpo), o passo é pulado com warning e o site faz deploy **sem áudio** —
o visualizador de `/musica` cai no modo idle (animação CSS, sem FFT).

Para o CI ter áudio, defina a variável `AUDIO_SRC` em
**Settings → Secrets and variables → Actions → Variables** apontando para
o caminho do backup no runner (ou monte um volume com os MP3s).

### Deploy no GitHub Pages (one-time setup + push)

### Deploy no GitHub Pages (one-time setup + push)

1. Crie o repo no GitHub (privado, se quiser). Nome sugerido: `dj-cremosa` ou `cremosa-site`.
2. Localmente:
   ```bash
   git remote add origin git@github.com:SEU-USER/dj-cremosa.git
   git push -u origin main
   ```
3. No GitHub: **Settings → Pages → Build and deployment → Source = "GitHub Actions"** (uma vez só, pelo dono do repo).
4. Pronto. Cada `git push` em `main` rebuilda e republica em ~60s. A URL pública será `https://SEU-USER.github.io/dj-cremosa/` por padrão, ou seu domínio custom se adicionar CNAME.

### Domínio custom (djcremosa.com.br)

1. Compre o domínio (Registro.br, Namecheap, Cloudflare).
2. No GitHub: **Settings → Pages → Custom domain** → digite `djcremosa.com.br`. Salva.
3. No DNS do domínio, adicione um CNAME de `www` para `SEU-USER.github.io` e um A-record para o apex (`@`) apontando para os IPs do GitHub Pages (veja docs atualizadas — os IPs mudam ocasionalmente).
4. Ative **Enforce HTTPS** depois que o certificado provisionar (pode levar ~15 min).

> ⚠️ **Limitação Pages**: conta free GitHub só permite domínio custom se o repo for **público**. Pra repo privado + domínio custom, é preciso GitHub Pro/Team. Alternativa: deixe o repo público (o código é seu, é sua decisão).

### Atualização de telefone (validado)

`lib/site.ts` foi atualizado para `+55 51 99372-3158` (DDI +55 BR, área 51 POA). Substituiu o `+51 993723158` original do press kit que estava errado.

---

## 8. Critério de "MVP bom o suficiente pra lançar"

- [ ] Hero com nome + última data confirmada (auto-lendo da agenda)
- [ ] `/agenda` mostra próximos 2–3 shows sem mocks
- [ ] `/contato` aponta para email que você responde
- [ ] Bio em uma linha na home
- [ ] 4–6 fotos reais
- [ ] 1 release embed (SoundCloud do set mais recente)
- [ ] Lighthouse ≥ 90 mobile
- [ ] Domínio apontando

Quando os 8 itens estiverem ✅, **publica**.
