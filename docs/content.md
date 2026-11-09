# Content

Edit copy in `content/`. Keep templates for structure and read [voice.md](../content/site/voice.md) before writing.

- `cases/*.md` publishes to `/work/<slug>/`. Fields: `title`, `slug`, `order`, `featured`, `kind`, `org`, `years`, `role`, `summary`, `image`, `imageAlt`, and optional `seoDescription`, `imageCaption`, `pull`. `locked` is editorial guidance, not rendered. Only featured cases appear in the Work section, where the card shows `kind` and `years` below its title.
- `builds/*.md` publishes to `/build/<slug>/`. Use the shared title, slug, order, summary, image and optional fields above, plus `featured_size` (`small` or `large`), `kind`, `status`, and `stack` (array, including when empty). Only builds with `featured_size` appear on the homepage, in order. Omit it for page-only builds, which remain in the sitemap and adjacent-page navigation.
- Both collections render Markdown below the summary and image. `order` controls adjacent-page links. SEO uses `seoDescription` when set and `summary` otherwise. Use the front matter image slot; keep HTML and image embeds out of Markdown.
- Link previews use the homepage portrait or the page illustration with the title. The build renders PNG cards and emits matching Open Graph and X metadata.
- `site/*.json` files are available by basename under `site`. `site.json` holds profile and SEO data and link destinations. `nav.json` holds section links; `ui.json` holds interface labels and error copy. `hero.json`, `about.json`, `work.json`, `build.json`, `lead.json` and `footer.json` hold their respective section content. Hero stats link to case slugs. Each Lead level has an ID, label, image and alt text, and three headline/body principles. Lead’s closing has separate `statement` and `note` fields.
- Use plain text in JSON and a newline for an intentional desktop headline break. Set `scheduleUrl` in `site.json` to update both booking buttons and the Netlify redirect from `/book`.
