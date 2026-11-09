# Verification

Recorded 2026-11-08. Tested locally with installed Chrome and Node v24.22.1; .nvmrc and Netlify request Node 22.

- Preview build generates homepage, five cases, three builds, 404, sitemap and robots.
- Axe: zero violations on home and deadlock at 1440 and 390 widths.
- No horizontal overflow at 320, 402, 834 or 1440 widths.
- Lead: Person, Team and Company respond to scroll, arrow-key focus and Enter activation.
- Reduced motion, short viewport, 200% text enlargement and disabled JavaScript expose the stacked layout.
- All generated routes and image loads checked; no client runtime errors.
- Tokens are unchanged from the build pack. No raw hex or em dash in templates, handwritten CSS outside tokens, or client JS.
- Supplied content matches the pack; only UI labels were added in a separate JSON file.

| Mobile Lighthouse | Home | Deadlock |
| --- | --- | --- |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| Largest contentful paint | 1.3 s | 1.2 s |
| Layout shift | 0 | 0 |
| Transfer | Total size was 69 KiB | Total size was 47 KiB |

Reports: lighthouse-home.html, lighthouse-deadlock.html and axe-results.json. Local audit server uses gzip, as expected on Netlify. Font files are 22916 and 14676 bytes.

## Production gate

The production command fails as required on unfinished supplied content. See production-build.log. Remaining input: case gaps in six-million, ux-practice and shriners; all three build bodies; scheduler and LinkedIn URLs; résumé PDF; licensed fonts. There are 23 permitted image placeholders. No production deployment was attempted.

WCAG Engine against a deployed preview and résumé PDF accessibility remain Paul's launch checks. The local checks do not claim a manual screen-reader audit or verification on every browser.
