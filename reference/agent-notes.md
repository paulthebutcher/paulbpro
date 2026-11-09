# Agent notes

### Completed fourteen-drawing set

- [observed] Paul approved the revised Lead direction before the remaining
  eleven drawings were produced. The parts kit is locked. Work was generated
  with Deadlock first; builds began with WCAG Engine, Foundry and Identity
  Service, then the three page-only builds. Every drawing remains static.
- [observed] All fourteen SVGs and their prose specs exist. Work and builds
  each contain exactly one 2px accent path; Lead contains none. All files use
  currentColor and semantic tokens, 1.5px structure, no text, titles, ids or
  literal colors. Nothing reproduces a client screen, dataset or deliverable.
- [observed] All case/build front matter references its SVG and supplies
  imageAlt. The Eleventy media shortcode inlines the files and reserves the
  viewBox aspect ratio. Work detail pages now use Pine; build pages use
  Alabaster. Page-only builds stay out of the three-tile homepage row but are
  reachable through adjacent-page navigation and the sitemap.
- [observed] No supplied copy for Idea Factory, Growth Audit or StressFreeClaims
  was found in the repository content or supplied brief. Their new pages retain
  `[gap: copy]` for summary, body, kind, status and SEO description. Existing
  content gaps elsewhere remain. Lakewood Court and the Valtech wireframe
  library receive no drawings.
- [observed] The Figma dimensions listed below remain authoritative. The
  homepage build calls are now 676×450 and 322×322. Work's SVG ratio is exactly
  590/393, including within its card wrapper.
- [observed] Final Playwright contact sheets are `drawings-lead.png`,
  `drawings-work.png` and `drawings-builds.png` under `reference/screenshots/`.
  Each shows the drawings at 1× CSS size, rendered at deviceScaleFactor 2,
  plus the completed homepage build row. Companion `-detail` and `-opposite`
  sheets support closer inspection and checks on the other section palette.
  The homepage row also has its own `drawings-homepage-build-row.png` capture.
- [observed] `npm run check:images` reports 0 placeholders; `npm run a11y`
  and `npm run build:preview` pass. `node scripts/check-drawings.mjs` checks
  all fourteen SVG contracts and both palettes, all eleven detail routes on
  desktop and touch, their accessible alt text and aspect ratios, and static
  hover, focus and reduced-motion behavior. It found no axe violations on
  the detail pages. Results are in `reference/drawing-checks.json`.

### Lead revision after Crosswalk reference

- [observed] Paul requested another pass inspired by the hero graphic at
  https://www.crosswalk.cl/en and specified no animation. The reference was
  inspected in a browser: concentric circles, faint construction guides,
  registration marks and overlapping technical geometry inform this revision.
- [observed] Revised all three Lead specs first, then regenerated the SVGs.
  The five semantic parts and 1.5px strokes remain; opacity separates the
  construction guides from the story-bearing nodes, tags and connections.
  Crosswalk assets were not copied into the repository.
- [observed] The no-animation instruction supersedes the original drawing
  hover/focus draw-in requirement for this set. Removed the drawing JS module,
  its import, draw-in CSS and the Lead panel fade. Future decision paths remain
  fully visible at rest. A scoped static rule also prevents section motion
  styles from animating artwork or its immediate wrapper.
- [observed] Updated the alt text and the 2x contact sheet. The additional
  `reference/screenshots/drawings-lead-detail.png` contains just the three
  drawings for easier review; the full sheet retains the existing build row.
  Preview build and accessibility checks pass. Style approval is still pending.
- [observed] Concurrent layout, scroll animation and QA changes were present
  in this checkout during the revision. They are outside this drawing commit.

### SVG drawings, November 8 Lead review

- [observed] The November 8 evening image production brief
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

- The initial implementation kept task writes in the site repository.
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

### Work and Lead scroll pass

- [observed] The pinned Lead layout replaced the Figma row with a tab rail,
  hid inactive levels, and stacked the principles within the active panel.
  All three levels now stay in flow. At 1512px the principles and diagram
  are each 322px wide, starting at x=64, 418, 772, and 1126. Each heading
  sticks on desktop within its own level, above a first-column rule.
- [observed] Work release geometry: the ResizeObserver measures heading
  height minus the distance from the final image top to the case list
  bottom. Positive offsets extend the card column; negative offsets
  shorten the heading lane. In either case the lane ends at the last
  image top plus the heading height, so the two tops move together.
  The release gap was 0px at 1440×900, 1280×800 and 200% text zoom.
- [observed] A one-pixel IntersectionObserver band drives the Work
  counter and a separate top band drives the active nav. The progress
  line uses the case list's CSS view timeline. Work, Build and Lead
  share the sticky tag row and its anchor clearance.
- [observed] Technical illustrations stay static per the separate
  drawing revision. Scroll motion applies to rules, text and Work's
  image placeholders. Reduced motion and Firefox 159 with scroll
  timelines disabled render final states. Firefox needed a private
  macOS app-data directory under the repo's cache for this run.
- [observed] Preview build and axe passed. Home Lighthouse performance,
  accessibility and best practices stayed at 100, matching the
  pre-change dev run. The new scroll captures and measurements are
  indexed in `reference/screenshots/scroll-README.md`.
