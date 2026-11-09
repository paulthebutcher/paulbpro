import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {serve} from './server.mjs';

const group = process.argv[2] || 'lead';
const groups = {
  lead: ['person', 'team', 'company'],
  work: ['deadlock', 'analytics', 'six-million', 'ux-practice', 'shriners'],
  builds: ['wcag-engine', 'foundry', 'identity-service', 'idea-factory', 'growth-audit', 'stressfreeclaims'],
};
if (!groups[group]) throw new Error(`Unknown drawing group: ${group}`);
const directory = group === 'work' ? 'cases' : group;
const drawings = groups[group].map(name => {
  const source = fs.readFileSync(`src/img/${directory}/${name}.svg`, 'utf8');
  const [, width, height] = source.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.ok(!/<(?:text|title)\b|\bid=|#[\da-f]{3,8}\b/i.test(source), name);
  assert.equal((source.match(/class="decision"/g) || []).length, group === 'lead' ? 0 : 1, name);
  return {name, source, width: Number(width), height: Number(height)};
});
fs.mkdirSync('.cache/tmp', {recursive: true});
process.env.TMPDIR = path.resolve('.cache/tmp');
fs.mkdirSync('reference/screenshots', {recursive: true});
const server = await serve(4174);
let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage({viewport: {width: 1512, height: 1000}, deviceScaleFactor: 2, reducedMotion: 'reduce'});
  await page.goto('http://127.0.0.1:4174/');
  const buildRow = await page.locator('.build-tiles').evaluate(el => el.outerHTML);
  const pending = await page.locator('.build-tiles .placeholder').count();
  const css = fs.readFileSync('dist/css/main.css', 'utf8');
  const surface = group === 'builds' ? 'on-alabaster' : 'on-pine';
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}
    .sheet-heading {padding:32px 64px 24px;font-size:24px}
    .drawing-grid {display:flex;flex-wrap:wrap;justify-content:center;align-items:start;gap:32px;padding:0 64px 40px}
    .drawing-cell {flex:none}
    .drawing-cell h2 {font-size:18px;margin-bottom:16px}
    .drawing-cell>svg {width:100%;height:auto;box-shadow:inset 0 0 0 1px var(--line)}
    .drawing-cell p {font-size:12px;margin-top:12px;color:var(--muted)}
    .row-section {padding-bottom:40px}
    .row-section .build-tiles {margin-top:0}
  </style></head><body>
    <section class="${surface}"><h1 class="sheet-heading">${group === 'lead' ? 'Lead: parts and stroke review' : `${group}: drawing review`}</h1>
    <div class="drawing-grid">${drawings.map(d => `<article class="drawing-cell" style="width:${d.width}px"><h2>${d.name.replaceAll('-', ' ')}</h2>${d.source}<p>${d.width} × ${d.height} · 1× size · 1.5px structure${group === 'lead' ? ' · no accent' : ' · 2px decision'}</p></article>`).join('')}</div></section>
    <section class="on-alabaster row-section"><div class="frame"><h2 class="sheet-heading">Homepage build row${pending ? ': existing placeholders, drawings follow Lead approval' : ''}</h2>${buildRow}</div></section>
  </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  for (const drawing of drawings) {
    const rendered = await page.locator('.drawing-cell>svg').nth(drawings.indexOf(drawing)).boundingBox();
    assert.equal(rendered.width, drawing.width);
    assert.equal(rendered.height, drawing.height);
  }
  await page.screenshot({path: `reference/screenshots/drawings-${group}.png`, fullPage: true});
  console.log(`Saved drawings-${group}.png at deviceScaleFactor 2; every drawing verified at 1x CSS size.`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
