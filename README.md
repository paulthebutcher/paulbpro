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

## Netlify draft deployment

Push everyday changes to `dev` and review them at the [Netlify branch deploy](https://dev--paulbpro.netlify.app/). `main` is the production branch, with auto-publishing locked in Netlify. To release, merge the changes into `main`, open its successful build in [Netlify Deploys](https://app.netlify.com/projects/paulbpro/deploys), and select **Publish deploy**. Keep auto-publishing locked between releases.

Netlify currently runs `npm run build:preview`, including builds from `main`. It publishes the supplied draft with visible content gaps and unavailable contact controls. Every draft page carries `noindex, nofollow`, and the generated `_headers` file applies `X-Robots-Tag` to every response. Draft robots.txt omits the sitemap and allows crawlers to read the noindex directive. These directives request exclusion from search indexes; they do not control access. Existing Netlify access protection remains unchanged.

The preview command explicitly selects its mode even if the host sets `ELEVENTY_ENV=production`. `npm run check:build-modes` verifies that behavior and checks that the strict production command still rejects unfinished content.

When launch inputs are complete, set `command = "npm run build"` under `[context.production]` in `netlify.toml`. This removes the draft indexing directives from production builds while keeping `dev` on the preview command.

## Launch blockers

`npm run build` deliberately fails while the supplied `[gap]` markers remain in the case and build content. The contact links are configured in `content/site/site.json`, the booking redirect is in `netlify.toml`, and the résumé PDF is in `src/`.

Replace trial fonts with licensed `src/fonts/ABCDiatype-Regular.woff2` and `src/fonts/ABCDiatypeMono-Regular.woff2` before launch. Licensed files automatically take precedence. Development trial fonts are converted and subset at build time from `assets/fonts/`.

Images other than the supplied portrait remain the specified placeholders. Add PNG masters under `src/img/_masters/about/` and `src/img/_masters/builds/`, matching content paths. Add diagram SVGs under `src/img/cases/` and `src/img/lead/`, following the build pack's currentColor contract. `check:images` lists the remaining placeholders. Add final approved favicon and Open Graph artwork by updating `scripts/assets.mjs`.

Netlify configuration is included. Use the repository root as the Netlify base directory. Publishing is handled by the connected Netlify site. This repository does not change DNS settings.

See `reference/agent-notes.md` for implementation decisions and `reference/verification.md` for recorded results.
