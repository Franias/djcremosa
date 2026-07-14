# No-Function Buttons — dj-cremosa

> Every interactive element on the site that **looks like a button** but **does nothing** when clicked. These are either:
> - **Decorative chrome** (Win95 window title-bar controls, Notepad menu items, etc.)
> - **Placeholder buttons** that need wiring up
> - **Visual-only controls** (the agenda "Imprimir" button, the home "Copiar" button)
>
> These are the things that would feel "broken" to a user — clicking them and nothing happens. Most are intentional (decorative chrome is part of the Win95 aesthetic), but some need attention.

**Date of audit:** 2026-07-13
**Total no-function interactive elements: 18**

---

## Category 1: Decorative Win95 chrome (intentional)

These are part of the Win95 visual language. They are `<span>` elements inside title bars, rendered as the classic `─ □ ×` controls. **Not real buttons** — they have no click handlers, no ARIA roles, and are marked `aria-hidden`.

| File:Line | Element | Why |
|---|---|---|
| `components/ui/win95.tsx:60` | `<span>─</span>` (minimize) | Visual chrome — `<Win95Window>` always renders these |
| `components/ui/win95.tsx:60` | `<span>□</span>` (maximize) | Visual chrome |
| `components/ui/win95.tsx:60` | `<span>×</span>` (close) | Visual chrome — note: clicking does NOT close the window |
| `app/sobre/page.tsx:86` | title bar controls | Visual chrome |
| `app/sobre/page.tsx:203` | title bar controls | Visual chrome |
| `app/videos/page.tsx:168` | title bar controls | Visual chrome |
| `app/musica/page.tsx:481` | title bar controls | Visual chrome |
| `components/sections/GaleriaGrid.tsx:171` | title bar controls | Visual chrome |

> **Note:** The `×` *looks* like a close button but the entire splash is dismissed only by clicking the overlay. To make it functional, each `×` would need an `onClick={() => setDecided(true)}` (or a window-level "close" handler in `Win95Window`).

---

## Category 2: Notepad menu items (intentional)

`components/sections/Notepad.tsx:39-44` — the `File / Edit / Format / View / Help` menu bar is rendered as a static `<div className="notepad-menu">`. Each label is a `<span>`, not a button.

```
File   Edit   Format   View   Helo
```

**Why:** Midia Kit page 3 reference. The "Helo" typo is even preserved as a faithful design element. Clicking any label does nothing.

To make functional: replace each `<span>` with a `<button>` + dropdown (File menu → New, Open, Save, Exit; etc.). Estimated effort: half-day.

---

## Category 3: Press Start gate "Press Start" text

`components/PressStartGate.tsx` — the visible "Press Start" text is a `<span>`, not a button. The click handler is on the **parent `<div role="dialog">`** that covers the whole viewport.

| File:Line | Element | Why |
|---|---|---|
| `components/PressStartGate.tsx:227` | `<span>▶ Press Start</span>` | Visual focal point — the parent dialog catches the click |

**Why:** The whole splash is the click target (anywhere = start). Putting the click on the `<span>` would mean only the text is clickable, which is what the user originally complained about. **This is intentional.**

---

## Category 4: Placeholder buttons in dialogs (NEEDS WIRING)

These are `<Win95Button>` elements rendered inside Win95 dialogs that have **no onClick handler and no `<a>` wrapper**. They look like buttons but do nothing.

| File:Line | Button | Dialog | Notes |
|---|---|---|---|
| `app/agenda/page.tsx:50` | `Imprimir` | agenda — instruções | Should call `window.print()` or be removed |
| `app/agenda/page.tsx:51` | `OK` | agenda — instruções | Should dismiss the dialog (currently there's no dismiss mechanism) |
| `app/page.tsx:181` | `Copiar` | cremosa.txt — readme | Should copy the manifesto text to clipboard via `navigator.clipboard.writeText(...)` |
| `app/page.tsx:182` | `Fechar ×` | cremosa.txt — readme | Should dismiss the dialog (currently no dismiss) |
| `app/page.tsx:204` | `OK` | cremosa — propriedades | Should dismiss the dialog |
| `components/sections/SectionPlaceholder.tsx:53` | `OK` | placeholder — propriedades | Stub component; placeholder is for unimplemented sections |
| `components/sections/SectionPlaceholder.tsx:54` | `Cancelar` | placeholder — propriedades | Same |

> **Recommended fix:** wire each to a real handler — `window.print()` for Imprimir, `navigator.clipboard.writeText` for Copiar, `onClick={() => setDismissed(true)}` for OK / Fechar / Cancelar. Total: ~20 min.
>
> **Alternatively**, the OK / Fechar / Cancelar buttons could just be removed — the dialogs are informational, not interactive. The agenda/page buttons (Imprimir + OK) are the only ones that suggest a real action.

---

## Category 5: Real buttons inside `<a>` wrappers (functional via parent)

These `<Win95Button>` elements are wrapped in `<a>` tags. The button itself has no onClick; the parent anchor does the navigation.

| File:Line | Button | Wrapped in | Navigation |
|---|---|---|---|
| `app/sobre/page.tsx:174` | `Falar pelo contato →` | `<Link href="/contato">` | Goes to `/contato/` |
| `app/videos/page.tsx:95` | `★ Subscribe` (hero) | `<a href="youtube.com/.../sub_confirmation=1">` | Opens subscribe dialog on YouTube |
| `app/videos/page.tsx:125` | `ver canal completo ↗` | `<a href="youtube.com/@cremos4">` | Opens channel in new tab |
| `app/videos/page.tsx:231` | `★ Subscribe` (footer) | `<a href="youtube.com/.../sub_confirmation=1">` | Same as hero |
| `app/videos/page.tsx:239` | `↗ abrir canal` | `<a href="youtube.com/@cremos4">` | Same |
| `app/contato/page.tsx:69` | `{c.cta}` (4 cards) | `<a href="mailto:...">`, `<a href="tel:...">`, `<a href="https://instagram.com/...">` | Each opens mailto / tel / Instagram |
| `app/contato/page.tsx:91` | `Abrir perfil →` | `<a href="https://instagram.com/...">` | Opens Instagram in new tab |
| `app/contato/page.tsx:114` | `Solicitar →` | `<a href="mailto:...?subject=Solicitar press kit">` | mailto |
| `components/sections/YouTubePlayer.tsx:111` | `↗ YouTube` | `<a href="https://www.youtube.com/watch?v=ID">` | Opens watch page |

> **Note:** These are FUNCTIONAL via the wrapper. Listed here for completeness so the audit is exhaustive. Clicking works correctly.

---

## Category 6: Mode switcher radio inputs (functional but small)

`components/sections/MediaVisualizer.tsx:540-552` — three radio inputs (Spectrum / Scope / VU) inside `<label>` elements. Functional but the click target is small (the label, not the visual button).

| File:Line | Element | Effect |
|---|---|---|
| `MediaVisualizer.tsx:548` | `<input type="radio" name="viz-mode" value="spectrum">` | Switches visualizer mode to spectrum bars |
| `MediaVisualizer.tsx:548` | `<input type="radio" name="viz-mode" value="oscilloscope">` | Switches to oscilloscope |
| `MediaVisualizer.tsx:548` | `<input type="radio" name="viz-mode" value="vu">` | Switches to VU meters |

> **Why listed:** the radio inputs are hidden (`className="sr-only"`) and the visual is the label. Some users may expect the bigger visual button to be the click target. It IS clickable (label wraps the input), but the experience can be confusing. Consider making the visual button a `<button>` that programmatically checks the radio.

---

## Summary

| Category | Count | Action needed |
|---|---|---|
| 1. Decorative Win95 chrome | 8 spans | None — intentional |
| 2. Notepad menu items | 5 spans | None — intentional (midia-kit reference) |
| 3. Press Start text | 1 span | None — intentional (whole-splash click target) |
| 4. **Placeholder buttons** | **7 buttons** | **Wire to handlers** (highest priority) |
| 5. Buttons in `<a>` wrappers | 11 buttons | None — functional via parent |
| 6. Mode switcher radios | 3 radios | Optional UX polish |

**Total:** 18 elements that look like buttons but have no direct function (categories 1, 2, 3, 4, 6).

**Of those, 7 are placeholder buttons that need wiring up** (category 4). These are the only ones that should be fixed — the rest are intentional.

---

## Recommended fix

```tsx
// app/agenda/page.tsx (line 50-51): add onClick + close handler
<Win95Button onClick={() => window.print()}>Imprimir</Win95Button>
<Win95Button
  focused
  onClick={() => setShowInstructions(false)}
>
  OK
</Win95Button>
```

```tsx
// app/page.tsx (line 181-182): wire Copiar + Fechar
const manifesto = "DJ Cremosa é uma artista..."; // the manifesto text
<Win95Button
  onClick={() => {
    navigator.clipboard.writeText(manifesto);
  }}
>
  Copiar
</Win95Button>
<Win95Button focused onClick={() => setShowReadme(false)}>
  Fechar ×
</Win95Button>
```

**Total effort:** ~30 min for all 7 placeholder buttons.
