# Site decisions

[Figma](https://www.figma.com/design/eFoQM2tITelXx3aVoYCryR/) is the visual source. These docs hold the operating rules. `content/` owns site copy; `reference/` holds historical evidence.

- Build static pages with Eleventy 3, Nunjucks, plain CSS and file-based Markdown and JSON. Host on Netlify. No CMS UI, forms or required client JavaScript.
- Blue marks interaction: Royal on Alabaster, Periwinkle on Pine. Work and Build drawings may use one blue decision path. Headlines, dividers, grid lines and stat numbers stay in the surface palette.
- Use Diatype Mono for lowercase tags, eyebrows, captions, status and stack lines, and the copyright line. Keep it muted and at least 11px. Use Diatype for editorial text.
- Keep the editorial grid faint and surface-specific. Structural rules use the foreground. Align layout to the Figma grid at mobile, tablet (768px) and desktop (1200px).
- Buttons are the only rounded element at rest. On hover and focus they expand slightly and ease into 2px corners as the arrow lands. On exit they ease back quickly while the arrow resets in place.
- Write plainly and omit em dashes. Keep unfinished copy marked with `[gap]` or `[gap: …]`; either form fails a production build even if the case is not featured.
