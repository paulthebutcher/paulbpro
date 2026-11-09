# Agent notes

- The user named /codex and /build-pack; those are the existing codex/ and build-pack/ directories inside the supplied workspace. All task writes stay in codex/.
- The source content is copied into content/ unchanged. Added UI labels and the approved 404 copy in content/site/ui.json so templates carry no prose.
- Missing scheduler, LinkedIn and résumé destinations render as unavailable controls in previews. Production rejects incomplete URLs, body gaps and the missing résumé.
- Missing image masters render the specified placeholders. No invented product screens or client artifacts.
- The two Regular trial OTFs and portrait are copied into codex/assets to make this project self-contained. WOFF2 conversion uses HarfBuzz subsetting plus wawoff2 at build time; licensed src/fonts files take precedence.
- Supplied tokens.css stays byte-for-byte unchanged. Semantic muted text is adjusted in components.css to meet contrast requirements, using the original palette variables.
- The draft favicon uses the specified line monogram. The draft Open Graph image uses the supplied headline and palette with a system sans; replace with an approved final export before launch.
- Hidden inactive Lead panels are removed from the accessibility tree as required by the hidden contract. All levels remain selectable with keyboard controls; reduced motion and no JavaScript expose all levels in order.
- The production check examines every generated page, including unfeatured cases. Setting featured:false only removes a homepage card and cannot make an unfinished detail page safe to publish.
- QA runs against a development build because the pack deliberately contains gaps. Production failure is verified separately and never bypassed for deployment.
- Static scheduling links need no JavaScript module; valid scheduler URLs open in a new tab with noopener and an accessible announcement.
- Critical CSS is concatenated in the required order, lightly minified, and inlined while under 20 KB; dist/css/main.css is still generated. Larger future stylesheets automatically use a preload plus one linked stylesheet.
- The local audit server uses gzip for text assets, matching ordinary Netlify delivery. Lighthouse uses its default mobile throttling.
- Accessibility uses axe-core through Playwright instead of requiring a separately installed matching ChromeDriver. Lighthouse uses the same Lighthouse engine and explicit CI thresholds in the local runner. Both requested npm entry points are present and reports are retained.
- Enlarged root text above 20px disables the pinned Lead stage. A resize observer re-evaluates that fallback without intercepting any scroll or pointer event.
