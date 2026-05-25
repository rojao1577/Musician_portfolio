# Component Catalog — Musician Portfolio

> **AI RULE:** Before writing any CSS class or HTML structure, search this file.
> If the class exists → use it. Never redefine it. Never create a parallel class.
> If you need a variant → extend with a BEM modifier (`.block--modifier`).
> If you need something new → add it here FIRST, then implement in `css/main.css`.

Last updated: 2026-05-23
CSS source: `css/main.css` (~798 lines)

---

## Quick Lookup — All Classes

| Class | Group | CSS Line | JS-applied? |
|---|---|---|---|
| `.social-bar` | Navigation | 14 | no |
| `.social-bar-side` | Navigation | 31 | no |
| `.social-bar-right` | Navigation | 37 | no |
| `.social-bar-star` | Navigation | 41 | no |
| `.social-bar-star--left` | Navigation | 48 | no |
| `.social-bar-star--right` | Navigation | 52 | no |
| `.social-bar-link` | Navigation | 56 | no |
| `nav.scrolled` | Navigation | 86 | YES — `initNav()` on scroll |
| `.nav-logo` | Navigation | 93 | no |
| `.nav-links` | Navigation | 99 | no |
| `.hero-inner` | Hero | 136 | no |
| `.hero-logo` | Hero | 148 | no |
| `.hero-content` | Hero | 162 | no |
| `.hero-name-img` | Hero | 166 | no |
| `.music-label` | Listen | 286 | no |
| `.track-display` | Listen | 297 | no |
| `.track-display.switching` | Listen | 306 | YES — `showTrack()` |
| `.track-number` | Listen | 310 | no |
| `.track-title` | Listen | 317 | no |
| `.track-meta` | Listen | 326 | no |
| `.track-dots` | Listen | 516 | no |
| `.track-dot` | Listen | 516 | YES — `applyTrack()` |
| `.track-scrubber` | Listen | 332 | no |
| `.scrubber-line` | Listen | 341 | no |
| `.scrubber-ticks` | Listen | 350 | no |
| `.scrubber-tick` | Listen | 355 | no |
| `.scrubber-tick.active` | Listen | 367 | YES — `showTrack()` |
| `.scrubber-cursor` | Listen | 372 | no |
| `.track-video-bg` | Listen | 384 | no |
| `.track-video-bg.active` | Listen | 395 | YES — `setVideoBg()` |
| `.track-video-overlay` | Listen | 412 | no |
| `.track-video-overlay.active` | Listen | 423 | YES — `setVideoBg()` |
| `.track-cover-bg` | Listen | 428 | no |
| `.track-cover-img` | Listen | 450 | no |
| `.track-cover-img.visible` | Listen | 464 | YES — `applyTrack()` |
| `.about-inner` | About | 237 | no |
| `.about-image` | About | 246 | no |
| `.about-text` | About | 258 | no |
| `.discography-inner` | Discography | 507 | no |
| `.section-heading` | Discography | 512 | no |
| `.discography-grid` | Discography | 519 | no |
| `.release-card` | Discography | 525 | no |
| `.release-cover` | Discography | 537 | no |
| `.release-cover-placeholder` | Discography | 556 | no |
| `.release-info` | Discography | 562 | no |
| `.release-title` | Discography | 566 | no |
| `.release-meta` | Discography | 573 | no |
| `.release-type` | Discography | 581 | no |
| `.contact-inner` | Contact | 594 | no |
| `.contact-form` | Contact | 606 | no |
| `.form-group` | Contact | 612 | no |
| `.form-error` | Contact | 648 | no |
| `.form-submit` | Contact | 654 | no |
| `.form-success` | Contact | 673 | no |
| `.form-success.visible` | Contact | 681 | YES — `initContactForm()` |
| `.noise-overlay` | Global | 699 | no |
| `.reveal` | Utility | 710 | no |
| `.reveal.visible` | Utility | 716 | YES — IntersectionObserver |
| `.section-fade` | Utility | 721 | no |
| `.section-fade.visible` | Utility | 726 | YES — IntersectionObserver |
| `.vinheta` | Vinheta | 732 | no (display:none by JS on exit) |
| `.vinheta__noise` | Vinheta | 745 | no |
| `.vinheta__scanlines` | Vinheta | 754 | no |
| `.vinheta__vignette` | Vinheta | 764 | no |
| `.vinheta__glitch-strip` | Vinheta | 772 | YES — `initVinheta()` inline style |
| `.vinheta__glitch-strip--a` | Vinheta | 779 | no |
| `.vinheta__glitch-strip--b` | Vinheta | 780 | no |
| `.vinheta__glitch-strip--c` | Vinheta | 781 | no |
| `.vinheta__center` | Vinheta | 783 | no |
| `.vinheta__logo-btn` | Vinheta | 793 | no |
| `.vinheta__logo` | Vinheta | 806 | no |
| `.vinheta__cta` | Vinheta | 854 | no |
| `.vinheta__cta-name` | Vinheta | 865 | no |
| `.vinheta__afterglow` | Vinheta | 877 | YES — `initVinheta()` inline style |
| `.vinheta--clicking` | Vinheta | 889 | YES — `initVinheta()` Phase 1 |
| `.vinheta--collapsing` | Vinheta | 894 | YES — `initVinheta()` Phase 2 |
| `.vinheta__hud` | Vinheta | ~908 | no |
| `.vinheta__hud-rec` | Vinheta | ~935 | no |
| `.vinheta__hud-rec-dot` | Vinheta | ~944 | no |
| `.vinheta__hud-play` | Vinheta | ~959 | no |
| `.vinheta__hud-datetime` | Vinheta | ~965 | no |

---

## Component Details

### GROUP: Navigation

#### `.social-bar`
Fixed top bar, z-index 101, 48px height, 3-column grid layout.
```html
<div class="social-bar" role="navigation" aria-label="Social links">
  <div class="social-bar-side">
    <a class="social-bar-link" href="..." target="_blank" rel="noopener">Label</a>
  </div>
  <a class="social-bar-link" href="...">Center link</a>
  <div class="social-bar-side social-bar-right">
    <a class="social-bar-link" href="..." target="_blank" rel="noopener">Label</a>
  </div>
</div>
```
Children: `.social-bar-side` (left group), center element, `.social-bar-side.social-bar-right` (right group).

#### `.social-bar-link`
Shared link style for all social bar anchors: 0.65rem, uppercase, letter-spacing 0.18em, muted color.
Hover/focus → `--color-text`. Apply to any `<a>` inside `.social-bar`.

#### `nav` / `nav.scrolled`
Fixed below `.social-bar` (top: 48px), 64px height, transparent until scrolled.
`nav.scrolled` is applied automatically by JS — do NOT manually add or replicate this logic.
```html
<nav aria-label="Main navigation">
  <a class="nav-logo" href="#">Name</a>
  <ul class="nav-links">
    <li><a href="#section">Label</a></li>
  </ul>
</nav>
```

---

### GROUP: Hero

#### `.hero-inner`
Flex column, centered, `pointer-events: none`. Contains `.hero-logo` and `.hero-content`.

#### `.hero-logo`
Artist logo image with `glitch-img` animation. `mix-blend-mode: screen`.

#### `.hero-name-img`
Oversized artist name image with `logo-float` animation. `mix-blend-mode: screen`.
Width: `clamp(300px, 72vw, 800px)`.

```html
<div class="hero-inner">
  <img class="hero-logo" src="assets/images/logo.png" alt="Artist logo" />
  <div class="hero-content">
    <img class="hero-name-img" src="assets/images/name.png" alt="Artist name" />
  </div>
</div>
```

---

### GROUP: Listen (`#music`)

All `.track-*` and `.scrubber-*` classes are tightly coupled to `#music` and `initMusicSection()` in `js/main.js`. Do not use them outside `#music`. Do not create new player classes without updating JS.

#### `.track-display` / `.track-display.switching`
Central content block. `.switching` (opacity: 0, 120ms transition) is applied during track transitions.
Contains `.track-number`, `.track-title`, `.track-meta` in that DOM order.

#### `.scrubber-tick` / `.scrubber-tick.active`
Dot controls created programmatically in JS (`buildTicks()`). Do not hardcode in HTML.
`.active` scales the dot to 1.6× and changes color to `--color-text`.

#### `.track-video-bg` / `.track-video-overlay`
iframe video background pair. Both require `.active` to become visible (opacity transitions).
Managed exclusively via `setVideoBg()` in JS. Do not manipulate directly.

#### `.track-cover-img.visible`
opacity: 0.18 when visible. Managed via `applyTrack()` in JS.

#### `.track-dots` / `.track-dot`
Mobile-only (≤600px) row of dot indicators. `display: none` on desktop, `display: flex` centered at `bottom: var(--space-lg)` on mobile. Generated dynamically in JS from the tracks array — do not hardcode in HTML. Active dot gets `.active` class (white fill, scale 1.25). Each dot is a `<button role="tab">` that calls `showTrack(i)`. Do not create other dot/indicator classes.

---

### GROUP: About

#### `.about-inner`
2-column grid (image | text) on desktop, 1-column on tablet (max-width: 900px).
```html
<div class="about-inner">
  <div class="about-image">
    <img src="..." alt="Artist photo" />
  </div>
  <div class="about-text">
    <h2>...</h2>
    <p>...</p>
  </div>
</div>
```
Note: `.about-text` is a scoping wrapper — styles target `.about-text h2` and `.about-text p` (element selectors), not direct classes.

---

### GROUP: Discography / Cards

#### `.release-card`
**The only card pattern in the project.** Block anchor element. Hover: `translateY(-4px)`.
Built programmatically in `js/main.js:buildCard()`. Do not recreate this structure in static HTML.

```html
<a class="release-card" href="..." target="_blank" rel="noopener noreferrer">
  <div class="release-cover">
    <img src="..." alt="[Title] cover art" />
    <!-- OR if no image: -->
    <div class="release-cover-placeholder" aria-hidden="true"></div>
  </div>
  <div class="release-info">
    <p class="release-title">Title</p>
    <div class="release-meta">
      <span>2025</span>
      <span class="release-type">Single</span>
    </div>
  </div>
</a>
```

#### `.section-heading`
Display font heading for section titles. `clamp(2.5rem, 5vw, 4rem)`, letter-spacing 0.05em.
Reuse for any new section `<h2>`. Often combined with `.reveal`.
```html
<h2 class="section-heading reveal">Section Title</h2>
```

---

### GROUP: Contact / Form

#### `.form-group`
Label + input/textarea stack. Gap 0.4rem. Always include a `.form-error` sibling for layout stability.
```html
<div class="form-group">
  <label for="field-id">Label</label>
  <input type="text" id="field-id" name="fieldname" aria-required="true" />
  <span class="form-error" data-error="fieldname" role="alert"></span>
</div>
```

#### `.form-submit`
**The only button style in the project.** Accent background (`--color-accent`), uppercase, 0.7rem.
Do NOT create `.btn`, `.button`, `.cta`, `.submit-btn`, or any other button class.
For new button needs → use `.form-submit` or create `.form-submit--modifier`.
```html
<button type="submit" class="form-submit">Send Message</button>
```

#### `.form-error`
Always rendered in DOM (even when empty) to prevent layout shift. `min-height: 1rem`.
Text set by JS via `setError()`. Do not hide with `display: none`.

#### `.form-success` / `.form-success.visible`
Hidden by default (`display: none`). JS adds `.visible` to reveal (`display: block`).
```html
<div class="form-success" aria-live="polite">
  <p>Message sent successfully.</p>
</div>
```

---

### GROUP: Global / Fixed Layer

#### `.noise-overlay`
Global fixed noise texture. Exists **once** in the DOM. Never add a second instance.
```html
<div class="noise-overlay" aria-hidden="true"></div>
```

#### `#gradient-canvas`
Fixed canvas for stars/shooting stars. Managed entirely by JS (`initCanvas()`).
Do not style or reference this in new CSS rules.

---

### GROUP: Utilities (Scroll Animation)

#### `.reveal` / `.reveal.visible`
Apply to any element that should fade + slide in on scroll.
JS (`initScrollReveal`) adds `.visible` once in viewport. **One-shot** — never toggled back.
```html
<div class="reveal">Content that fades in on scroll</div>
```

#### `.section-fade` / `.section-fade.visible`
Apply to section wrappers that fade in/out as the section enters/leaves viewport.
JS (`initSectionFade`) toggles `.visible` **bidirectionally** (unlike `.reveal`).
```html
<div class="section-fade">Section content</div>
```

---

### GROUP: Vinheta (VHS Intro Overlay)

Full-screen entry gate rendered above all other layers (`z-index: 10000`).
Dismissed on click, vinheta area click, or keyboard Enter/Space on `.vinheta__logo-btn`.
Removed from DOM flow (`display: none`) after exit animation. Not re-shown — no toggle.
All logic lives in `initVinheta()` in `js/main.js`. Called first in `DOMContentLoaded`.
Font `Metal Mania` must be loaded via the Google Fonts `<link>` in `<head>`.

**Do NOT create:** `.vhs-overlay`, `.intro-screen`, `.entry-overlay` — use `.vinheta`.
**Do NOT add a second** `.noise-overlay` — the vinheta uses a `<canvas>` instead.

#### `.vinheta`
Fixed full-viewport container. `overflow: hidden` on `<body>` set by JS while visible.
```html
<div class="vinheta" role="dialog" aria-modal="true" aria-label="Entrada — Alomally">
  <!-- children: noise, scanlines, vignette, glitch strips, center, afterglow -->
</div>
```

#### `.vinheta__noise`
`<canvas>` element. JS drives pixel-level white noise via `ImageData` at every rAF.
Resizes on `window.resize` respecting `devicePixelRatio`. `mix-blend-mode: overlay` in CSS.

#### `.vinheta__scanlines`
Static CSS layer. `repeating-linear-gradient` 2px line + 2px transparent gap.
Color from `--vinheta-scanline-color`. No JS interaction.

#### `.vinheta__vignette`
Static CSS layer. `radial-gradient` transparent center → dark edges. No JS interaction.

#### `.vinheta__glitch-strip` / `--a` / `--b` / `--c`
Three horizontal band elements, default `opacity: 0`. JS fires by setting inline:
`style.top`, `style.height`, `style.transform`, `style.filter`, `style.opacity = '1'`, then resets after 80–200ms.
Different `mix-blend-mode` per modifier (`screen`, `difference`, `overlay`) for chromatic aberration.
Do NOT add CSS transitions — JS controls timing explicitly.

#### `.vinheta__center`
Flex column wrapper. `pointer-events: none` (button child re-enables).

#### `.vinheta__logo-btn`
`<button>` wrapping the logo image. Natively focusable. Do NOT replace with a `<div>`.
`aria-label="Clique para entrar no site"`. Focus ring: `box-shadow` purple glow (no outline rect).

#### `.vinheta__logo`
Logo image inside `.vinheta__logo-btn`. Simultaneous animations:
- `vinheta-logo-float` (6s, non-symmetric) — distinct from `logo-float` (5s, symmetric)
- `vinheta-logo-flicker` (4s, `steps(1)`) — distinct from `glitch-img` (filter/transform)
Filter: white drop-shadow + purple drop-shadow (double glow layer). `transition: filter 0.3s ease`.
On hover (`.vinheta__logo-btn:hover .vinheta__logo`): filter intensifies (brighter white + wider purple glow)
to indicate the logo is clickable. No animation override — float and flicker continue undisturbed.

#### `.vinheta__cta`
`<p>` tag. Font: `--font-body` (Inter). Static — no animation.
Text: `"clique na logo para entrar no mundo de"` + `.vinheta__cta-name` inline.

#### `.vinheta__cta-name`
`<span>` inside `.vinheta__cta`. Font: `--font-gothic` (Metal Mania). Text: `"Alomally"`.
`font-size: 1.0rem`. White glow via `filter: drop-shadow`.

#### `.vinheta__afterglow`
2px white horizontal line, 60% width, centered. `opacity: 0` by default.
JS sets `style.opacity = '1'` at 750ms during exit, then fades to 0 via inline transition.
Simulates phosphor remnant after CRT TV turns off.

#### `.vinheta--clicking` (state)
Applied by `initVinheta() → beginExit()` at Phase 1 (0ms). `filter: brightness(1.5)`.
Removed before `.vinheta--collapsing` is added.

#### `.vinheta--collapsing` (state)
Applied by `initVinheta() → beginExit()` at Phase 2 (300ms).
CSS transition: `transform: scaleY(0)` over 500ms + `filter: brightness(3)`.
`transform-origin: center center` — collapses from screen midpoint.

#### `.vinheta__hud`
Container for camcorder-style HUD overlay (REC, play, date, time). `position: absolute; inset: 0`.
`aria-hidden="true"`. z-index: 7. Font: `'Courier New', monospace` for VHS aesthetic.
**Do NOT put focusable elements inside.**

#### `.vinheta__hud-rec`
REC indicator group — flex row with `.vinheta__hud-rec-dot` + text "REC". `position: absolute; top: 6%; left: 5%`.

#### `.vinheta__hud-rec-dot`
Blinking red circle (8×8px). `animation: vhs-rec-blink 1s steps(1) infinite`.
Paused via `animation: none; opacity: 1` in `prefers-reduced-motion` media query.

#### `.vinheta__hud-play`
▶ play symbol. `position: absolute; top: 6%; right: 5%`.

#### `.vinheta__hud-datetime`
Date + time stacked vertically. `position: absolute; bottom: 7%; left: 5%`.
Children: `#vhs-date` and `#vhs-time` — populated by `initVinheta()` via `setInterval` (Brasília / `America/Sao_Paulo`).
Timer stored in `vhsClockTimer`; cleared inside `cleanup()`.

---

## State Class Contract

These classes are **ONLY applied by JavaScript**. Never hardcode them in HTML source.
Never define them as standalone CSS rules — only as compound selectors (`.base.state`).

| State class | Applied by function | Applied to element |
|---|---|---|
| `.scrolled` | `initNav()` | `nav` |
| `.active` | `initMusicSection()` | `.scrubber-tick`, `.track-video-bg`, `.track-video-overlay` |
| `.visible` | IntersectionObservers, `initContactForm()` | `.reveal`, `.section-fade`, `.form-success`, `.track-cover-img` |
| `.switching` | `showTrack()` | `.track-display` |
| `.vinheta--clicking` | `initVinheta() → beginExit()` | `.vinheta` |
| `.vinheta--collapsing` | `initVinheta() → beginExit()` | `.vinheta` |

---

## CSS Variables Reference

All values must come from `css/variables.css`. Never use hardcoded colors, font names, spacing values, or transition durations.

| Variable | Value | Use for |
|---|---|---|
| `--color-bg` | `#050505` | Page background |
| `--color-surface` | `#0d0d0d` | Elevated surfaces |
| `--color-surface-2` | `#141414` | Double-elevated surfaces |
| `--color-text` | `#f0f0f0` | Primary text |
| `--color-text-muted` | `#606060` | Secondary/label text |
| `--color-accent` | `#7c3aed` | CTAs, active states |
| `--color-border` | `#1a1a1a` | Dividers, borders |
| `--color-error` | `#ef4444` | Form error states |
| `--font-display` | `'Bebas Neue', sans-serif` | Headings, hero |
| `--font-body` | `'Inter', sans-serif` | Body copy, labels |
| `--font-gothic` | `'Metal Mania', cursive` | Vinheta artist name span only |
| `--space-xs` | `0.5rem` | Tight spacing |
| `--space-sm` | `1rem` | Component internal |
| `--space-md` | `2rem` | Section padding |
| `--space-lg` | `4rem` | Large gaps |
| `--space-xl` | `8rem` | Section vertical rhythm |
| `--transition-fast` | `0.2s ease` | Hover states |
| `--transition-slow` | `0.6s ease` | Entrance animations |
| `--max-width` | `1200px` | Content max-width |
| `--nav-height` | `64px` | Navigation height |
| `--social-bar-height` | `48px` | Social bar height |
| `--vinheta-tint` | `rgba(124, 58, 237, 0.04)` | Purple VHS tint overlay |
| `--vinheta-scanline-color` | `rgba(124, 58, 237, 0.08)` | Scanline gradient color |

---

## Adding a New Component

1. **Search this file** — check Quick Lookup table and Component Details for anything equivalent.
2. **If equivalent exists** — use the existing class. Create a BEM modifier if a variant is needed.
3. **Add to this file first** — write the class name, purpose, group, target CSS line, and HTML template.
4. **Implement in `css/main.css`** — add the CSS in the group's section. Update the line number in Quick Lookup.
5. **If JS-applied state is involved** — update the State Class Contract table.

**Never add a `<style>` block to `index.html`.
Never create a new `.css` file unless the catalog has been formally split.
Never use inline `style=""` except for JS-computed values (e.g., cursor position, dynamic widths).**
