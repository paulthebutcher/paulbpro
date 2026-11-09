# Deploy

Push day-to-day work to `dev`. Review the [branch deploy](https://dev--paulbpro.netlify.app/) behind Netlify team protection. Branch deploys do not incur production deploy credits. `main` is production; keep auto-publishing locked and publish the chosen successful build by hand in [Netlify Deploys](https://app.netlify.com/projects/paulbpro/deploys). Production publishes cost credits.

Before merging to `main`:

1. Run `npm run build:preview`, `npm run a11y`, `npm run lighthouse` and `npm run check:images`. Resolve missing launch assets. Run WCAG Engine against the preview and review it on a phone.
2. Run `npm run build` for the launch gate. Resolve all content gaps and use licensed Diatype WOFF2 files in `src/fonts/` before publishing a public site.
3. Netlify currently builds drafts with `build:preview` and sends noindex headers. At launch set `command = "npm run build"` under `[context.production]` in `netlify.toml`. Keep previews on the preview command. Only publish after checking the production build.

The Webflow domain cutover is still pending:

1. In Netlify, add `paulb.pro` and `www.paulb.pro` and select the apex as primary. Copy the current DNS records and note the Webflow targets for rollback.
2. If moving nameservers, create all existing mail records in Netlify DNS first, especially the MX records for `hello@paulb.pro`, plus SPF, DKIM and DMARC. Then switch the registrar to the assigned Netlify nameservers. If retaining the existing DNS host, change only the apex and `www` Webflow records to the targets shown in Netlify and leave mail records in place.
3. Confirm HTTPS on both hosts, the `www` redirect, and `/book`. Verify incoming and outgoing mail. Keep Webflow intact for rollback; to roll back a site release without moving DNS, publish the last good Netlify deploy.
