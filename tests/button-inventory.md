# Button & Interactive Element Inventory — dj-cremosa

> Every `<button>`, `<Win95Button>`, `<Link>`, and `<a>` on the site. Each entry has the **visible label**, the **location** (page + section), and a **draft selector** (use `data-testid` in production for stability).
>
> **Total interactive elements inventoried: ~80.**
>
> Selectors marked `☐` mean the component doesn't currently have a `data-testid` — adding one (production change) is the recommended next step before writing tests against them.
>
> This is a **catalog**, not a contract — entries list what the buttons DO in plain language, **not what their click handlers actually do** (the functionality is in the components themselves).

---

## Global chrome (every page)

### `components/nav/SiteNav.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| Cremosa logo | top-left | `header a[href="/"]` | Goes to `/` |
| `Agenda` | nav center | `header nav a[href="/agenda/"]` | Goes to `/agenda/` |
| `Música` | nav center | `header nav a[href="/musica/"]` | Goes to `/musica/` |
| `Galeria` | nav center | `header nav a[href="/galeria/"]` | Goes to `/galeria/` |
| `Vídeos` | nav center | `header nav a[href="/videos/"]` | Goes to `/videos/` |
| `Sobre` | nav center | `header nav a[href="/sobre/"]` | Goes to `/sobre/` |
| `Contato` | nav center | `header nav a[href="/contato/"]` | Goes to `/contato/` |
| `Booking →` | top-right | `header a[href^="mailto:franciellipdias@gmail.com?subject=Booking"]` | Opens mailto: with prefilled subject |

### `components/nav/SiteFooter.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `● Pronto · Porto Alegre, RS — Brasil` | footer status bar | `footer [role="status"] span:first-child` | Static status text |
| `Cremosa · desde 2016` | footer status bar | `footer [role="status"] span:nth-child(2)` | Static text |
| `Booking →` | footer status bar | `footer [role="status"] a` | Same mailto as header |
| `franciellipdias@gmail.com` | footer info block | `footer a[href^="mailto:franciellipdias@gmail.com"]` | Opens mailto |
| `+55 51 99372-3158` | footer info block | `footer a[href^="tel:+55"]` | Opens tel: |
| `@djcremosa` (Instagram) | footer info block | `footer a[href^="https://instagram.com/djcremosa"]` | Opens Instagram in new tab |
| `Próximos shows` | footer info block | `footer a[href="/agenda"]` | Goes to `/agenda/` |

---

## `/` — Home + Press Start gate

### `components/PressStartGate.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `▶ Press Start` | overlay centre | `div[role="dialog"][aria-label*="press start"]` | Dismisses splash → reveals home (also: click anywhere on overlay, press Space, press Enter) |

### `app/page.tsx`

#### Desktop icons (hero)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Sets` 📀 | hero icon row | `a[href="/musica/"]` | Goes to `/musica/` |
| `Notas` 📝 | hero icon row | `a[href="/sobre/"]` | Goes to `/sobre/` |
| `Agenda` 📅 | hero icon row | `a[href="/agenda/"]` | Goes to `/agenda/` |
| `Vídeos` 🎞 | hero icon row | `a[href="/videos/"]` | Goes to `/videos/` |
| `Galeria` 🖼 | hero icon row | `a[href="/galeria/"]` | Goes to `/galeria/` |

#### CTAs
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Ver agenda →` | hero | `a[href="/agenda"]` | Goes to `/agenda/` |
| `@djcremosa` | hero | `a[href^="https://instagram.com/djcremosa"]` | Opens Instagram in new tab |

#### About dialog
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| (readme title) | about window | `h3:has-text("cremosa.txt — readme")` | Static |
| (properties title) | about window | `h3:has-text("propriedades")` | Static |

#### Press highlights (cremosa.txt — destaques)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| Press highlight list (static) | destaques win | `.win95-window:has-text("destaques") li` | Static |

---

## `/agenda/` — Agenda

### `components/sections/EventRow.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Ingressos →` | per event row | `a[href^="https://"][target="_blank"]` | Opens ticket URL in new tab |
| `(ticket link variants per event)` | per event row | `a` (external) | Opens external ticket |

### `components/sections/AgendaView.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Próximas` | filter row | `a[href*="?view=upcoming"]` | Filters list + updates URL search params |
| `Histórico` | filter row | `a[href*="?view=past"]` | Filters list + updates URL |
| `Tudo` | filter row | `a[href*="?view=all"]` | Shows all events |
| `OK` (in empty state dialog) | empty state | `a:has-text("OK")` | Same as clicking the dialog → goes to Instagram |

---

## `/sobre/` — Sobre

### `app/sobre/page.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| (timeline year cards) | timeline grid | `YearCard` instances | Static |
| `Booking →` (in properties widget) | properties | `a[href="/contato"]` (inside win95-button) | Goes to `/contato/` |
| (final booking dialog) | `booking.exe — confirmar` | `div:has-text("quer levar a Cremosa pra sua pista?")` | Static text + button |
| `Falar pelo contato →` | booking dialog | `a[href="/contato"]` (button) | Goes to `/contato/` |

### `components/sections/Notepad.tsx`

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| _(titles)_ `sobre - Notepad`, `coletivo - Notepad` | notepad cards | `.notepad .notepad-title` | Static window titles |
| `File / Edit / Format / View / Help` | notepad menu bar | `.notepad .notepad-menu` | Static menu labels |

---

## `/contato/` — Contato

### `app/contato/page.tsx`

#### 4 contact cards (in dedicated Win95 windows)

| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Booking` — opens email | booking card | `a[href^="mailto:franciellipdias@gmail.com?subject=Proposta"]` | mailto: |
| `Imprensa` — opens email | imprensa card | `a[href^="mailto:franciellipdias@gmail.com?subject=Imprensa"]` | mailto: |
| `Ligar agora` — tel: link | telefone card | `a[href^="tel:+5551993723158"]` | tel: |
| `Instagram` — opens IG | instagram card | `a[href^="https://instagram.com/djcremosa"]` | Opens IG in new tab |
| `Abrir perfil →` (button in each card) | each card | `a[href^="https://instagram.com"]` (inside button) | Same as Instagram card link |

#### Press kit request
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Solicitar →` | press kit dialog | `a[href^="mailto:franciellipdias@gmail.com?subject=Solicitar"]` | mailto: |

---

## `/musica/` — Música (the most complex page)

### `app/musica/page.tsx`

#### Hero
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| (no interactive elements in hero besides default nav) | — | — | — |

#### Player + visualizer (Win95 window `cremosa — visualizador.exe`)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `▶ Play / ❚❚ Pause` | transport row | `button:has-text("Play")` or `button:has-text("Pause")` | Toggles play |
| `⏹ Stop` | transport row | `button:has-text("Stop")` | Stops playback |
| `📁 Carregar MP3…` | transport row | `button:has-text("Carregar MP3")` | Opens native file picker |
| (scrubber) | transport row | `div[role="slider"]` | Click to seek |
| `<Mode switcher — Spectrum / Scope / VU>` | inside visualizer canvas | `input[type="radio"][name="viz-mode"]` + label | Switches viz mode |
| (closed button 4 corners) | in visualizer window title | `span:has-text("─")` etc | Decorative |

#### Playlist (`playlist.txt`)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `playlist.txt — 7 faixas · 2h 20m total` | window title | `.win95-title-text` | Static |
| `# / ▶ / Título / Gênero / Dur.` | column header row | `.win95-bevel-deep-in.bg-win-face > div.bg-\\[#d4d0c8\\] span` | Static |
| (track row 01–07) | list rows | `ol > li > button:nth-child(N)` | Click loads + plays that track |

#### Footer dialog — about the visualizador
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| (read-only about text) | `about — visualizador` window | `div:has-text("como funciona")` | Static |

---

## `/videos/` — Vídeos

### `app/videos/page.tsx`

#### Channel header card (hero)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `★ Subscribe` | channel header card | `a[href^="https://www.youtube.com/@cremos4?sub_confirmation"]` | Opens subscribe dialog on YouTube |
| `ver canal completo ↗` | featured section header | `a[href^="https://www.youtube.com/@cremos4"]` (not sub_confirmation) | Opens channel in new tab |
| (banner img) | channel header | `<img alt="${handle} channel banner">` | Decorative |
| (avatar img) | channel header | `<img alt="${handle} avatar">` | Decorative |
| `↗ YouTube` (per featured player) | per player footer | `a[href^="https://www.youtube.com/watch?v="]` (in button) | Opens watch page |

#### Featured YouTube players (3 large)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| (thumbnail ▶ button) | inside YouTubePlayer | `button[aria-label*="Reproduzir"]` | Loads iframe + autoplays |
| `↗ YouTube` | per player footer | `a[href^="https://www.youtube.com/watch?v="]` (in button) | Opens watch page |

#### Archive (all videos grid)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `▶ assistir` | per archive card | `a[href^="https://www.youtube.com/watch?v="]` | Opens watch page |

#### Footer dialog
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `★ Subscribe` | footer dialog | `a[href^="https://www.youtube.com/@cremos4?sub_confirmation"]` | Same as hero |
| `↗ abrir canal` | footer dialog | `a[href^="https://www.youtube.com/@cremos4"]` | Same as above |

---

## `/galeria/` — Galeria

### `app/galeria/page.tsx`

#### Filter chips
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Tudo` | filter row | `button:has-text("Tudo")` (role="tab") | Shows all photos |
| `Show` | filter row | `button:has-text("Show")` | Filters by show context |
| `Residência` | filter row | `button:has-text("Residência")` | Filters by residência context |
| `Coletivo` | filter row | `button:has-text("Coletivo")` | Filters by coletivo context |
| `Bastidores` | filter row | `button:has-text("Bastidores")` | Filters by bastidores context |

#### Tiles (5 photos)
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Afro Hellmann's · coletivo AfroJams` | tile 1 | `button[aria-label*="Afro Hellmann"]` | Opens lightbox |
| `Esquenta BatukBaile 2 · pista` | tile 2 | `button[aria-label*="Esquenta"]` (339) | Opens lightbox |
| `Set · Porto Alegre` | tile 3 | `button[aria-label*="Set · Porto"]` (large tile) | Opens lightbox |
| `Esquenta BatukBaile 2 · cabine` | tile 4 | `button[aria-label*="cabine"]` (329) | Opens lightbox |
| `Pista · show` | tile 5 | `button[aria-label*="Pista · show"]` | Opens lightbox |

#### Lightbox
| Visible label | Location | Selector | Functionality |
|---|---|---|---|
| `Fechar ×` | lightbox top-right | `button:has-text("Fechar")` | Closes lightbox |
| (lightbox backdrop click) | lightbox backdrop | `div.fixed.inset-0.bg-bg\\/95` | Click backdrop to close |
| `Esc` key | global | `Escape` key | Closes lightbox |

---

## Visual summary

```
GLOBAL CHROME
├─ Header (SiteNav)
│  ├─ Logo       → /
│  ├─ 6 nav links → /agenda/ /musica/ /galeria/ /videos/ /sobre/ /contato/
│  └─ Booking →   → mailto:
├─ VerticalRails (sidebar text, no interaction)
└─ Footer (SiteFooter)
   ├─ Status bar: Pronto · Porto Alegre · Booking →
   ├─ franciellipdias@gmail.com → mailto:
   ├─ +55 51 99372-3158 → tel:
   ├─ @djcremosa          → Instagram
   └─ Próximos shows      → /agenda/

PAGE-SPECIFIC
├─ / (home + press start)
│  ├─ Press Start splash    → dismiss
│  ├─ 5 desktop icons       → /musica/ /sobre/ /agenda/ /videos/ /galeria/
│  ├─ Ver agenda            → /agenda/
│  ├─ @djcremosa hero CTA   → Instagram
│  └─ about / destaque win95 windows (no buttons inside)
│
├─ /agenda/
│  ├─ Filter: Próximas / Histórico / Tudo  → ?view=...
│  └─ Per event: Ingressos → external ticket URL
│
├─ /sobre/
│  ├─ Booking (properties widget)  → /contato
│  └─ Falar pelo contato →      → /contato
│
├─ /contato/
│  ├─ Booking    → mailto:?subject=Proposta
│  ├─ Imprensa   → mailto:?subject=Imprensa
│  ├─ Telefone   → tel:+5551993723158
│  ├─ Instagram  → instagram.com/djcremosa
│  └─ Solicitar press kit → mailto:?subject=Solicitar
│
├─ /musica/  (most interactive)
│  ├─ ▶ Play / ❚❚ Pause   → audio.togglePlay
│  ├─ ⏹ Stop               → audio.stop + currentTime=0
│  ├─ 📁 Carregar MP3…      → file input click
│  ├─ Scrubber              → audio.currentTime = fraction * duration
│  ├─ Spectrum / Scope / VU → visualizer mode
│  ├─ Playlist rows (7)     → audio loadFromUrl
│  └─ (drag MP3 anywhere)   → audio loadFromFile
│
├─ /videos/
│  ├─ ★ Subscribe           → youtube.com/@cremos4?sub_confirmation=1
│  ├─ Banner + avatar       → decorative (channel-art)
│  ├─ Featured ▶ thumbs (3) → load YouTube iframe
│  ├─ Per featured ↗ YouTube → watch page
│  ├─ Archive cards (7)     → watch page directly
│  └─ Footer ★ Subscribe + abrir canal
│
└─ /galeria/
   ├─ Filter: Tudo / Show / Residência / Coletivo / Bastidores
   ├─ 5 photo tiles          → open lightbox
   └─ Lightbox Fechar × / backdrop / Esc
```

## Total: ~80 interactive elements