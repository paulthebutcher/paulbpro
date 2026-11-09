# 03. Components

Each component: purpose, markup shape, props from content, states, responsive notes. Class names are suggestions; keep them if nothing better exists so specs and code match.

Interactive color is always `--accent` (Periwinkle on Pine, Royal on Alabaster). Focus ring: `outline: 2px solid var(--accent); outline-offset: 3px` on every focusable element; never remove it. Selection: `::selection { background: var(--accent); color: var(--bg); }`.

---

## Nav (`<header class="nav">`)

- Left: `Paul Butcher` (sans, 16) then `Design & Research Leader` in `--muted`, 8px apart, one line.
- Right: four links, lowercase: `work`, `build`, `lead`, `contact`, each an anchor to the section id. Spacing between links: one column on desktop (they sit at x=1008, 1126, 1244, 1362), 24px on tablet and mobile.
- Not sticky. It sits at y=24 in the hero on every breakpoint.
- **Active state** (JS, progressive): an `IntersectionObserver` on the four sections sets `aria-current="true"` on the link for the section occupying the top edge of the viewport; styled in `--accent`. Without JS no link is highlighted. `contact` maps to the footer.
- Name links to `/`. On inner pages the nav is the same component; the links point to `/#work` etc.

## Section tag (`<p class="section-tag">`)

- A one-column rectangle with a 1px `--section-rule` border, mono 12 lowercase, text inset 16px (8px below desktop). Sits at (margin, 48) in every section, on the first column line so the left border overlaps the line.
- A full-width hairline runs under the tag row at y=80, from the first column line to the last.
- Text: `work`, `build`, `lead`. Hero and About have no tag. Footer has none.
- The row sticks at the viewport top within its section, with an opaque background and the same grain as the section. The root scroll padding reserves one tag height for anchors and keyboard focus.

## Button (`<a class="button">`)

- Pill, `--button-h` tall, `--button-px` side padding, label left, icon right with 24px between, icon `--icon` square.
- **Filled:** `--button-bg` / `--button-fg`. Used for `Let’s chat` (hero), `Download my résumé` (about), `Schedule time` (footer).
- **Outline:** 1px `--fg` border, `--fg` text, transparent. Used for `LinkedIn` (hero).
- Icons: outbound arrow (↗, a 20px SVG, for external links), download (tray with arrow, for the résumé). Both inline SVG with `currentColor`, `aria-hidden="true"`.
- Hover: filled darkens or lightens the bg 8% toward `--fg` via `color-mix`; outline fills with `--fg` at 8%. Transition `--t-fast`.
- External links: `target="_blank" rel="noopener"` and visually-hidden text `(opens in a new tab)` inside the label.
- Widths from Figma: hero buttons 211 and 198 wide (content-sized); résumé 348; schedule 276. Content-sized with a `min-width` of 180 on tablet/mobile. On mobile the hero buttons sit side by side at 169 wide each; the résumé and schedule buttons are full width (354).

## Text link with arrow (`<a class="link-arrow">`)

- Used for Work card titles, Build tile titles, and the footer links row when the arrow variant is needed.
- Title in `--fg`, arrow (`→`, 27px wide SVG or glyph) pinned to the right edge of the card at desktop, in `--accent` always.
- Hover and focus-visible: underline the title. Build tile arrows also translate 4px on hover with motion allowed.
- The whole card is the link target: wrap image and title in one `<a>`, or use a pseudo-element on the title link to cover the card. Only one focusable element per card.

## Stat (`<div class="stat">`)

- Hairline on top (full span width), 24px, number (stat size, tabular), 8px, caption (body 16 at desktop, 15 below) in `--muted`, two lines max.
- Props: `value`, `caption`, optional `href` (links to the case). If `href`, the whole stat is a link and the number turns `--accent` on hover. The number is never blue at rest.
- Four across on desktop (3 cols each), 2×2 on tablet and mobile.

## Eyebrow list (About roles)

- Mono 12 eyebrow (`now`, `before`) in `--muted`, 8px, then one line per role in `small` (15) `--fg`. 24px between the two groups.
- Props: an array of `{ eyebrow, items: [{ role, org }] }`. Rendered as `role at org`. Items may carry an optional `href` (to a case or the résumé); if present, the line is a link in `--fg` that turns `--accent` on hover.

## Caption image (About objects and paper)

- `<figure>` with `<img>` (Pine duotone PNG/AVIF, 2x) and `<figcaption>` mono 11 lowercase `--muted`, 8px below the image.
- Two grids: objects 2×2 (each image 263×84 at desktop, in a 4-col block), paper 4×2 (each 115.5×84). Both grids span 4 columns on the left; paragraphs sit in 6 columns from column line 6.
- Captions double as alt text: `alt` is the caption text.

## Work card (`<article class="case-card">`)

- Image box (5 cols × 308 at desktop; 377×275 tablet; 354×260 mobile), then 32px, then the title link row (36 tall) with the arrow at the right edge.
- Image box: `--placeholder` background until the SVG lands; 1px `--line` border; `border-radius: var(--r-card)`.
- An SVG drawing is inlined and remains static, including its `.decision` path (see the revised drawing brief).
- Props from `content/cases/*.md` front matter: `title`, `slug`, `image`, `imageAlt`, `order`. Only cases with `featured: true` appear on the homepage, in `order`.
- Desktop: a single column of cards at x=874, 590 wide, stacked with 96px between card bottom and next card top. The first card's top aligns with the tag row hairline (y=80) so the column starts level with the section tag.
- **W1, heading release (1200px and wider):** The heading and intro stick at the tag height plus `--s-4` in a separate grid column. The left column ends at the last image top plus the heading height, so the heading and image leave together. A ResizeObserver recalculates the offset when their geometry changes.
- **W2, progress:** A foreground line fills over the intro hairline between the first and last image crossings at the heading's sticky inset. The case list supplies a named view timeline. An IntersectionObserver updates the decorative, aria-hidden counter at that same line.
- **W3, entry:** CSS reveals the image box from the top over entry 0–60% and settles the title after the image. Focused titles and images remain visible. Inline technical illustrations and their decision strokes stay static per the drawing revision. Without scroll timeline support or with reduced motion, cards render in their final state.

## Build tile (`<article class="build-tile">`)

- Image box, then 24px, then title link row (36 tall), then 8px, then mono 12 status line.
- Status line format: `what it is · status` on one line, and an optional second line with the stack. Lowercase. From front matter: `kind`, `status`, `stack[]`.
- Hover: image box border turns `--accent`; title turns `--accent`; arrow moves.
- Desktop layout: three tiles on one row. Foundry 3 cols (322×320) at y=580, WCAG Engine 6 cols (676×412) at y=488 (raised 92 so its bottom edge lines up with the others' bottoms), Identity 3 cols at y=580. Tablet: WCAG full width (770×537) first, then Foundry and Identity 2-up (377×401). Mobile: WCAG (354×260), Foundry (354×378), Identity (354×378), stacked.
- The size difference is intentional: WCAG Engine is the one with paying clients and gets the big slot. `featured_size: "large" | "small"` in front matter decides.

## Lead level and principle

Content shape (from `content/site/lead.json`):

```
levels: [
  { id: "person", label: "Person", image, imageAlt,
    principles: [ { headline, body }, ×3 ] }, ×3
]
```

### Stacked levels with sticky headings

- Each level is a section named by its `h3`; each principle uses an `h4`. All three levels and nine principles remain in the document and accessibility tree.
- Desktop: the level heading has a 3px rule 16px below it, as wide as the first three columns (322px at the 1512px artboard). The next row is four equal columns with a 32px gap. The first three hold the principles; the fourth holds the 322×215 illustration, aligned with the headlines.
- Principle headlines reserve two lines and 16px below. Body copy is 16px with at least four lines of height. Both slots can grow with text zoom. Leave 96px between levels and before the closing line.
- At 1200px and wider, each level heading sticks at the tag height plus `--s-3` and releases at the end of its own level. Its background matches the section. A named view timeline draws the underline, principles settle from left to right, and the technical illustrations remain static per the drawing revision.
- Tablet: full-width rule, principles on the left and image on the right, with 64px between levels. Mobile: full-width rule, image above the stacked principles, with 48px between levels. The headings stay in normal flow.
- CSS scroll animations require both timeline support and a motion preference of no restriction. With reduced motion or without support, text and lines render in their completed state. Without JavaScript, the full layout and content remain available.

## Closing line (Lead)

- `closing` size, `--fg`, 10 cols wide starting at column line 2 (x=166), two lines at desktop. 96px above, 128 below.
- Tablet and mobile: full width, three lines is fine.

## Footer / contact (`<footer id="contact" class="section on-alabaster">`)

- Heading (`display2`, two lines, manual break) at cols 1–4; intro (`intro`, 558 wide) at x=536 (col line 5 + 16), vertically aligned to the heading's second line; button row below: `Schedule time` filled button left (cols 1–3), links line at x=536 on the same baseline as the button's label: `hello@paulb.pro · LinkedIn · Résumé (PDF)` in `--accent`, 16px sans, separated by ` · ` in `--muted`.
- Portrait 322 sq at cols 10–12, top aligned with the heading top.
- Hairline full width at y=418, then mono 12 `--muted`: `© 2026 Paul Butcher · Salt Lake City (open to relocation) · Designed and built by me`. Year from build time.
- Tablet: heading, intro, button, links stacked left in a 475 column; portrait 279 sq right. Mobile: all stacked, portrait 354 sq under the links.
- Links: email is `mailto:`, LinkedIn is external (new tab, noopener), Résumé is `/Paul-Butcher-Resume.pdf` (same tab).
- `Schedule time` links to the scheduling URL in `content/site/site.json`, new tab. The button also has `rel="noopener"`.
- No form. Ever.

## Arrow icon (`<svg class="icon-arrow">`)

- One inline SVG symbol, 20×20 viewBox, 1.5px stroke, `currentColor`, round caps. Three uses by rotation: `→` (0°) for card links, `↗` (−45°) for external links, and the download tray is a separate symbol.
- `aria-hidden="true"` always; meaning is carried by text.
