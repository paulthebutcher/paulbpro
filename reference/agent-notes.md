# Agent notes

### SVG drawings, November 8 Lead review

- [observed] The November 8 evening `../build-pack/reference/image-production.md`
  and Paul's current instructions govern the scenes. All work is on `dev`.
- [observed] Paul supplied the dimensions from Figma file
  `eFoQM2tITelXx3aVoYCryR`, Codex Pass node `23:230`. These override spec 06:
  Work is 590×393 instead of its default 590×308; Lead is 322×215 instead of
  322×240. Build dimensions agree with the drawing table in spec 06:
  WCAG 676×450, Foundry and Identity 322×322, other builds 590×393. The older
  676×412 responsive-image example and existing 322×320 tile calls are superseded.
- [observed] Three Lead SVGs, three plain-language specs, and the proposed
  five-part kit are present. `scripts/drawings.mjs lead` expands the snippets in
  `src/img/_parts.md`. Small parts use scale 0.625 with non-scaling strokes.
  Specs are edited before regenerating drawings. The kit remains provisional
  until Paul approves the Lead sheet; no Work or build drawings have been made.
- [observed] The media shortcode already supported inline SVGs. It now reads
  their viewBox ratio, and SVG wrappers inherit the section foreground even
  inside links. Production excludes the parts and specification Markdown files.
- [observed] Company alt text now describes uncovered products being counted;
  the drawing does not imply that a funding case was approved. Lead has no
  accent paths, text, titles, ids, or literal colors.
- [observed] `reference/screenshots/drawings-lead.png` was rendered with
  Playwright at deviceScaleFactor 2. Each drawing was checked at exactly
  322×215 CSS pixels. The sheet includes the current homepage build row with
  its existing placeholders, explicitly marked as pending Lead approval.
- [observed] `npm run build:preview` and `npm run a11y` pass for this checkpoint.
  `npm run check:images` reports eight existing references still missing, all
  Work/build images. The three additional build pages and their copy review
  remain in the next group of work. This is the required Lead approval stop,
  not completion of the fourteen-drawing request.

- The user named /codex and /build-pack; those are the existing codex/ and build-pack/ directories inside the supplied workspace. All task writes stay in codex/.
- The source content is copied into content/ unchanged. Added UI labels and the approved 404 copy in content/site/ui.json so templates carry no prose.
- Missing scheduler, LinkedIn and résumé destinations render as unavailable controls in previews. Production rejects incomplete URLs, body gaps and the missing résumé.
- Missing image masters render the specified placeholders. No invented product screens or client artifacts.
- The two Regular trial OTFs and portrait are copied into codex/assets to make this project self-contained. WOFF2 conversion uses HarfBuzz subsetting plus wawoff2 at build time; licensed src/fonts files take precedence.
- The initial build kept the supplied tokens.css byte-for-byte unchanged. The visual fixes below supersede that decision for the line and grain tokens. Semantic muted text is adjusted in components.css to meet contrast requirements, using the original palette variables.
- The draft favicon uses the specified line monogram. The draft Open Graph image uses the supplied headline and palette with a system sans; replace with an approved final export before launch.
- Hidden inactive Lead panels are removed from the accessibility tree as required by the hidden contract. All levels remain selectable with keyboard controls; reduced motion and no JavaScript expose all levels in order.
- The production check examines every generated page, including unfeatured cases. Setting featured:false only removes a homepage card and cannot make an unfinished detail page safe to publish.
- QA runs against a development build because the pack deliberately contains gaps. Production failure is verified separately and never bypassed for deployment.
- Static scheduling links need no JavaScript module; valid scheduler URLs open in a new tab with noopener and an accessible announcement.
- Critical CSS is concatenated in the required order, lightly minified, and inlined while under 20 KB; dist/css/main.css is still generated. Larger future stylesheets automatically use a preload plus one linked stylesheet.
- The local audit server uses gzip for text assets, matching ordinary Netlify delivery. Lighthouse uses its default mobile throttling.
- Accessibility uses axe-core through Playwright instead of requiring a separately installed matching ChromeDriver. Lighthouse uses the same Lighthouse engine and explicit CI thresholds in the local runner. Both requested npm entry points are present and reports are retained.
- Enlarged root text above 20px disables the pinned Lead stage. The Lead stage observes its own sizing to re-evaluate that fallback without intercepting any scroll or pointer event.
- Paul authorized a Netlify draft with indexing disabled after the first main-branch deploy hit the required content gate. Netlify now selects build:preview; npm run build retains the strict launch gate. Preview commands override inherited ELEVENTY_ENV, and previews emit robots noindex metadata plus a site-wide X-Robots-Tag header.

### Lead baseline, before visual fixes

[observed] The Playwright sweep at 1440×900 and 1280×800 advanced Person → Team → Company in 50px steps and kept the pin at top: 0 during the runway. Every pin ancestor had visible overflow. Maximum panel heights were 438.75px and 480.56px against 708px and 608px available, so padding and type already fit.

[observed] Adding 1px of height to Hero with Team pinned caused six hidden/data-active mutations at each size. The root ResizeObserver reran setup, temporarily removed both inactive panels' hidden attributes, and restarted Team's entry animation without a level change. The DOM reset was synchronous; the sweep did not capture a frame with three panels painted. At 1280×800 the unchanged Team panel was sampled mid-fade after the layout change. The failure reproduced was the unwanted restart, not overflow or a bad scroll index.

### Visual fixes on dev

- Lead now debounces stage-local resize and media-query changes. A sizing check reuses the active index if the level is unchanged. The hidden flags are cleared only when switching back to stacked mode. The pin content box also observes the effect of text zoom on its padding, so the enlarged-text fallback still works. The same layout-change probe produced zero panel mutations and zero animation restarts at both sizes.
- Work sticks within its left grid column from 1200px at the 64px inset. Its grid row ends at the last card, so the heading releases there. Reduced motion still uses sticky; tablet uses normal flow.
- Per Paul's override, the repository now carries tokens.json and updated src/css/tokens.css. Solid line tints are #285B4C on Pine and #D7D3D2 on Alabaster. The existing grid pseudo-element draws them above the texture. Muted text and placeholders are unchanged.
- Each surface uses a static 160px SVG grain, at 0.08 on Pine and 0.06 on Alabaster. The channel curves keep Pine flecks at or below its background and Alabaster flecks at or above its background. The Crosswalk reference was not available in the supplied files; Alabaster was reviewed against the local screenshots. The existing Netlify CSP permits data images.
- Playwright sampled every pixel of each 160px rendered tile using the actual body text foreground. Minimum WCAG contrast stayed at 7.61:1 on both surfaces. Mean contrast increased from 7.61:1 to 7.72:1 on Pine and 7.66:1 on Alabaster. Screenshots and measurements are indexed in reference/screenshots/visual-fixes/README.md.
