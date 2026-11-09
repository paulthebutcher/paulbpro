# Images

- Every Work case, Build project and Lead level uses a static SVG drawing. Never show or recreate client screens, tools, data or artifacts, including on the Shriners case. Keep labels in HTML.
- Draw to the Figma box. Author Work at 590×393; small Build at 322×322, featured WCAG Engine at 676×450, and page-only Build at 590×393; Lead at 322×215. Use a zero-origin `viewBox`, no fixed root dimensions, and reserve the aspect ratio in layout.
- Reuse the five [drawing parts](../src/img/_parts.md). Set structure to `currentColor` with 1.5px strokes and round caps and joins. Use no fill or a surface token. One 2px `.decision` path in the surface accent marks the point of each Work or Build drawing. Lead uses no accent; the Company tally shows coverage gaps only.
- Keep editable drawing specs in `src/img/_specs/`. Render with `scripts/drawings.mjs`, check at 1× on both surfaces, and compare the set on a contact sheet. Write one sentence of alt text that describes the scene and what the accent means. Expose it on the figure; hide the inner SVG from assistive technology.
- Save SVGs under `src/img/cases/`, `src/img/builds/`, or `src/img/lead/`. A missing file displays a reserved placeholder; `npm run check:images` lists missing sources.
- Use responsive AVIF with WebP fallback for the supplied portrait and career photos. Keep PNG masters, reserve image dimensions, prioritize the hero portrait, and lazy-load below the fold. Career captions name the topic; alt text describes the photo.
