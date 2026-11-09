# paulb.pro

Eleventy 3 portfolio built from the supplied build pack. This repository is a self-contained project. All source copy is in `content/`.

## Local preview

Use Node 22, then:

```sh
npm ci
npm run dev
```

Open http://localhost:8080. `npm run build:preview` creates `dist/` without serving it.

## Checks

```sh
npm run a11y
npm run lighthouse
npm run check:images
npm run screenshots
npm run build
```

Browser checks use installed Chrome. On a different system, set `CHROME_PATH` to its executable. The runner starts and closes its own loopback server. Reports and screenshots are saved under `reference/`.

`a11y` uses axe-core in Playwright at 1440 and 390 on the homepage and deadlock case. It also checks 320px reflow, Lead keyboard and scroll behavior, motion preferences, short viewports, no-JavaScript rendering, asset loading and generated routes. `lighthouse` asserts accessibility 100, performance at least 95 and best practices at least 95 on the same pages with mobile throttling.

## Launch blockers

`npm run build` deliberately fails while the supplied `[gap]` markers remain. Fill the unfinished case and build content, scheduler URL and LinkedIn URL in `content/`. Add `src/Paul-Butcher-Resume.pdf`. The supplied copy has not been rewritten to bypass this gate.

Replace trial fonts with licensed `src/fonts/ABCDiatype-Regular.woff2` and `src/fonts/ABCDiatypeMono-Regular.woff2` before launch. Licensed files automatically take precedence. Development trial fonts are converted and subset at build time from `assets/fonts/`.

Images other than the supplied portrait remain the specified placeholders. Add PNG masters under `src/img/_masters/about/` and `src/img/_masters/builds/`, matching content paths. Add diagram SVGs under `src/img/cases/` and `src/img/lead/`, following the build pack's currentColor contract. `check:images` lists the remaining placeholders. Add final approved favicon and Open Graph artwork by updating `scripts/assets.mjs`.

Netlify configuration is included. Use the repository root as the Netlify base directory. No site has been published and no DNS settings have changed.

See `reference/agent-notes.md` for implementation decisions and `reference/verification.md` for recorded results.
