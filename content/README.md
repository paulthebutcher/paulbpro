# content/

This folder is the CMS. Edit, commit, push; Netlify rebuilds.

- `site/*.json`: homepage sections and site-wide settings. Keys are documented in `../specs/08-content-model.md`.
- `cases/*.md`: one file per case study. Front matter drives the card and the stat; the body is the page.
- `builds/*.md`: one file per build. Same template as cases.

Rules: typographic quotes, no em dashes, `\n` in a JSON headline means a deliberate line break on desktop, `[gap: …]` means Paul owes a fact and the production build will refuse to ship while any remain.
