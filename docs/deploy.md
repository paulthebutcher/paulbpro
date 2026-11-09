# Deploy

Push day-to-day work to `dev`. Review the [branch deploy](https://dev--paulbpro.netlify.app/) behind Netlify team protection. Branch deploys do not incur production deploy credits. `main` is production; keep auto-publishing locked and publish the chosen successful build by hand in [Netlify Deploys](https://app.netlify.com/projects/paulbpro/deploys). Production publishes cost credits.

Before merging to `main`:

1. Run `npm run build:preview`, `npm run a11y`, `npm run lighthouse` and `npm run check:images`. Resolve missing launch assets. Run WCAG Engine against the preview and review it on a phone.
2. Run `npm run build` for the launch gate. Resolve all content gaps and use licensed Diatype Regular and Light and Diatype Mono Regular WOFF2 files in `src/fonts/` before publishing a public site.
3. Netlify currently builds drafts with `build:preview` and sends noindex headers. At launch set `command = "npm run build"` under `[context.production]` in `netlify.toml`. Keep previews on the preview command. Only publish after checking the production build.

Production uses `www.paulb.pro` as the primary domain. Netlify redirects `paulb.pro` to it automatically. Keep the canonical URL in `content/site/site.json` on the primary domain.

Before changing DNS, copy the current records. If moving nameservers, recreate the existing mail records first, including MX for `hello@paulb.pro`, SPF, DKIM and DMARC. Afterward, verify HTTPS on both hosts, the redirect to `www`, `/book`, and incoming and outgoing mail. To roll back a site release without moving DNS, publish the last good Netlify deploy.
