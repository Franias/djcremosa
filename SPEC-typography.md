# Win95 Typography Pattern

Single source of truth for fonts, sizes, and centralization across
the DJ Cremosa portfolio. Every page should use these classes — never
raw `text-[Npx] font-pixel` combos. Centralized in `app/globals.css`
under "Win95 typography pattern".

## Why this exists

Before this pattern, eyebrow sizes ranged from `text-[10px]` to
`text-[12px]`, tracking from `0.05em` to `0.4em`, fonts mixed across
`font-sans` (Geist), `font-mono` (Geist Mono), and `font-display`
(Bagel Fat One) with no rule for which is "right" inside a dialog.
Hero padding was `pt-16 sm:pt-24 sm:pt-32` in one page, `pt-16 pb-12
sm:pt-24 sm:pb-16` in another. The visual inconsistency made the
Win95 chrome feel pasted on top of an arbitrary modern stack.

This pattern locks down three axes — **font**, **size**, **layout
shell** — so the Win95 feel reads consistently across all 7 routes.

---

## Fonts (4 roles)

The site has four font roles. Pick by intent, not by element type.

| Role | Font | Tailwind class | Use for |
|------|------|----------------|---------|
| Display | Bagel Fat One | `font-display` | Hero / section titles |
| UI / body | VT323 | `font-pixel` | Chrome, body text, dialogs |
| Mono / code | Geist Mono | `font-mono` | Code blocks (`<code>`) |
| Sans / fallback | Geist | `font-sans` | Last-resort fallback only |

> `font-mono` and `font-sans` should NOT appear inside Win95 dialogs,
> chrome, or visible body copy. Use the utility classes below instead.

---

## Typographic scale (utility classes)

All defined in `app/globals.css` under "Win95 typography pattern".
Built on VT323 for any Win95-feel text, Bagel Fat One for display.

### `.win-display`
- Hero / cover title
- `font-display`, `letter-spacing: 0.01em`, `line-height: 0.85`
- Pair with `bubble-strong` for the glossy gradient treatment
- Pair with `bubble` for the softer 3-stop
- Pair with `glitch` for the chromatic-aberration pixel look
- Size by viewport: `text-[18vw] sm:text-[10rem]` (standard hero)

### `.win-h2`
- Section / subsection title
- `font-display`, `letter-spacing: 0.01em`, `line-height: 0.95`
- Use `text-4xl sm:text-6xl` typically (smaller than hero)
- Pair with `bubble` for the gradient, or `text-cream` for flat

### `.win-eyebrow`
- Small uppercase label above a title
- `font-pixel`, `11px`, `0.22em tracking`, uppercase
- Always precede with `// ` (terminal-style comment marker)
- Common pairings: `text-bubble`, `text-cream-dim`, `text-win-shadow-deep`

### `.win-body`
- Body copy in dialogs and prose blocks
- `font-pixel`, `14px`, `1.55 line-height`
- Reads comfortably at 1080p+ without losing the pixel feel

### `.win-body-sm`
- Dense body (property tables, nested lists)
- `font-pixel`, `12.5px`, `1.5 line-height`

### `.win-caption`
- Small dim text (image credits, footnotes, meta)
- `font-pixel`, `11px`, `1.4 line-height`, `text-cream-dim`

### `.win-button-text`
- Button label
- `font-pixel`, `14px`
- (Already applied by `Win95Button` automatically)

### `.win-status-text`
- Status-bar text
- `font-pixel`, `13px`
- (Already applied by `Win95StatusBar` automatically)

### `.win-title-text`
- Title-bar text in custom Win95 surfaces (e.g. `YearCard`,
  gallery tiles, lightbox)
- `font-pixel`, `13px`, `0.02em tracking`

---

## Centralization (shell pattern)

Three container widths, used by every page. Defined in `app/globals.css`
under "Shell".

### `.shell`
- Default page container
- `max-width: 72rem` (1152px = Tailwind's `max-w-6xl`)
- `padding: 1.25rem → 2rem` at `sm:`
- Use for default sections

### `.shell-narrow`
- Prose-focused blocks (manifesto, dialog bodies)
- `max-width: 48rem` (768px = Tailwind's `max-w-3xl`)
- Same padding rhythm

### `.shell-wide`
- Grids + rails (galeria masonry, agenda timeline)
- `max-width: 100rem` (1600px)
- Same padding rhythm

### `.hero`
- Hero section padding rhythm shared by every page
- `padding: 4rem → 6rem` vertical at `sm:`
- Combine with `.grain` and `.halftone` / `.scanlines` for the
  textured backgrounds

---

## How every page hero should look

The same skeleton on `/`, `/agenda`, `/musica`, `/videos`, `/sobre`,
`/contato`, `/galeria`. Hero content is always **left-aligned** so the
display title reads as an editorial head, not a poster:

```tsx
<section className="hero grain halftone">  {/* or scanlines */}
  <div className="shell relative z-10">
    {/* 1. eyebrow */}
    <p className="win-eyebrow text-bubble mb-4">{"// agenda · 2026"}</p>

    {/* 2. display title */}
    <div className="relative inline-block">
      <Sparkle ... />
      <h1 className="win-display bubble-strong text-[18vw] sm:text-[12rem]">
        AGENDA
      </h1>
    </div>

    {/* 3. lede */}
    <p className="mt-8 max-w-2xl win-body text-cream-dim">
      Próximos shows, festivais...
    </p>
  </div>
</section>
```

Replace `bubble-strong` with `bubble` or `glitch` for variant
treatments per the Midia Kit reference.

---

## Property dialogs (tables, metadata)

Inside a `Win95Window` body, use `.win-body-sm` plus semantic `<dl>`:

```tsx
<dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 win-body-sm">
  <dt className="text-win-shadow-deep">Cidade:</dt>
  <dd>Porto Alegre, RS</dd>
</dl>
```

Body copy inside dialogs is always `win-body-sm` for dense metadata
or `win-body` for paragraph-length prose.

---

## Do's & Don'ts

✅ **DO**
- Use `.win-eyebrow` for all small uppercase labels
- Use `.win-body` / `.win-body-sm` for body copy
- Use `.shell` / `.shell-narrow` / `.shell-wide` for containers
- Center hero content via `flex flex-col items-center text-center`
- Use `.hero` class on every hero section

❌ **DON'T**
- Don't reach for `text-[13px] font-mono` ad-hoc — that's what
  `.win-body-sm` is for
- Don't write `mx-auto max-w-6xl px-5 sm:px-8` — that's `.shell`
- Don't use `font-sans` or `font-mono` inside visible body copy
- Don't mix tracking values (`0.05em`, `0.18em`, `0.22em`, `0.4em`)
  in the same UI region — pick `.win-eyebrow` (0.22em) or a deliberate
  exception documented here
- Don't diverge padding rhythm on heroes — `.hero` is the contract

---

## Exceptions (documented)

- `.vrail-text` uses `0.22em` instead of the legacy `0.4em` to align
  with `.win-eyebrow` — vertical rails count as eyebrows.
- Tracking-tight labels `text-[10px] tracking-[0.18em]` are used
  inline inside Win95 title bars (e.g. footer timestamps, transport
  row meta). They override `.win-eyebrow` for visual density inside
  a 20px-26px tall title bar.
