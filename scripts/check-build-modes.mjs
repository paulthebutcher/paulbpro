import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';

const {url:canonicalOrigin} = JSON.parse(fs.readFileSync('content/site/site.json'));
const previewOrigin = 'https://dev--paulbpro.netlify.app';
const read = file => fs.readFileSync(`dist/${file}`, 'utf8');
const metadata = (html, attribute, name) =>
  html.match(new RegExp(`<meta ${attribute}="${name}" content="([^"]+)">`))?.[1];

function build(script) {
  return spawnSync('npm', ['run', script], {
    env:{...process.env, ELEVENTY_ENV:'production', DEPLOY_PRIME_URL:previewOrigin},
    encoding:'utf8',
  });
}

async function verifyMetadata(production) {
  const sitemap = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const pages = fs.readdirSync('dist', {recursive:true}).filter(file => file.endsWith('.html'));
  const shareCards = new Set();
  const canonicals = [];
  for (const page of pages) {
    const html = read(page);
    const excluded = page === '404.html' || page.startsWith('styleguide/');
    const noindex = metadata(html, 'name', 'robots');
    assert.equal(noindex, !production || excluded ? 'noindex, nofollow' : undefined, page);
    if (excluded) {
      assert.doesNotMatch(html, /rel="canonical"|property="og:image"/, page);
      continue;
    }
    const canonical = canonicalOrigin + '/' + page.replace(/index\.html$/, '');
    canonicals.push(canonical);
    assert.equal(html.match(/<link rel="canonical" href="([^"]+)">/)?.[1], canonical, page);
    assert.equal(metadata(html, 'property', 'og:url'), canonical, page);
    for (const key of ['title', 'description', 'image', 'image:alt']) {
      const value = metadata(html, 'property', `og:${key}`);
      assert.ok(value, `${page}: og:${key}`);
      assert.equal(metadata(html, 'name', `twitter:${key}`), value, page);
    }
    const image = new URL(metadata(html, 'property', 'og:image'));
    assert.equal(image.origin, production ? canonicalOrigin : previewOrigin, page);
    assert.ok(!shareCards.has(image.pathname), `${page}: unique share card`);
    shareCards.add(image.pathname);
    const {format,width,height} = await sharp(`dist${image.pathname}`).metadata();
    assert.deepEqual([format,width,height], ['png',1200,630], page);

    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    if (page === 'index.html') {
      const profile = schema['@graph'].find(item => item['@type'] === 'ProfilePage');
      assert.equal(profile.url, canonical);
      assert.equal(profile.mainEntity['@type'], 'Person');
    } else {
      assert.equal(schema['@type'], 'Article');
      assert.equal(schema.mainEntityOfPage, canonical);
      assert.equal(schema.image, canonicalOrigin + image.pathname);
    }
  }
  assert.ok(canonicals.length > 1, 'Homepage and detail routes emit metadata');
  assert.deepEqual(canonicals.sort(), sitemap.sort(), 'Sitemap and canonical URLs agree');
}

const preview = build('build:preview');
assert.equal(preview.status, 0, preview.stdout + preview.stderr);
assert.match(read('_headers'), /\/\*\s+X-Robots-Tag: noindex, nofollow/);
assert.doesNotMatch(read('robots.txt'), /Sitemap:/);
await verifyMetadata(false);

const production = build('build');
if (production.status !== 0) {
  assert.match(production.stdout + production.stderr, /Production blocked: unfinished copy/);
  assert.match(read('build/identity-service/index.html'), /\[gap/);
  console.log('The production content gate still rejects the existing Identity Service gaps.');
}
assert.doesNotMatch(read('_headers'), /X-Robots-Tag/);
assert.ok(read('robots.txt').includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
await verifyMetadata(true);

const reset = build('build:preview');
assert.equal(reset.status, 0, reset.stdout + reset.stderr);
console.log('Preview and production metadata, PNG assets, sitemap, structured data, and indexing rules passed.');
