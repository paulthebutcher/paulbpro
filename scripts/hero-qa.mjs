import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {serve} from './server.mjs';

const screenshots = 'reference/screenshots';
await fs.mkdir('.cache/hero-video', {recursive: true});
await fs.mkdir('.cache/tmp', {recursive: true});
process.env.TMPDIR = path.resolve('.cache/tmp');
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve('.cache/playwright');
const {chromium} = await import('playwright-core');
const csp = (await fs.readFile('netlify.toml', 'utf8')).match(/Content-Security-Policy = "([^"]+)"/)[1];
const bootstrap = (await fs.readFile('dist/index.html', 'utf8')).match(/<script>([\s\S]*?intro-ready[\s\S]*?)<\/script>/)[1];
const hash = createHash('sha256').update(bootstrap).digest('base64');
assert.ok(csp.includes(`'sha256-${hash}'`), 'Netlify CSP permits the rendered bootstrap');

const server = await serve(4176);
let browser;
const base = 'http://127.0.0.1:4176';
const frameTimes = [0, 300, 600, 900, 1200, 1500, 1800];
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox'],
  });
  for (const viewport of [{width: 1440, height: 900}, {width: 390, height: 844}]) {
    const context = await browser.newContext({viewport, recordVideo: {dir: '.cache/hero-video', size: viewport}});
    const page = await context.newPage();
    await page.goto(base);
    await page.waitForFunction(() => document.documentElement.classList.contains('intro-ready'));
    const timing = await page.evaluate(async () => {
      const hero = () => document.getAnimations().filter(a => a.animationName?.startsWith('hero-'));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const animations = hero();
      const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
      const finish = Math.max(...animations.map(a => a.startTime + a.effect.getComputedTiming().endTime));
      await Promise.all(animations.map(a => a.finished));
      return {animations: animations.length, firstPaint, finish, fromPaint: finish - firstPaint};
    });
    assert.ok(timing.animations > 15 && timing.fromPaint <= 1800, JSON.stringify(timing));
    const video = page.video();
    await context.close();
    await video.saveAs(`${screenshots}/hero-intro-${viewport.width}.webm`);

    const stillContext = await browser.newContext({viewport});
    const stills = await stillContext.newPage();
    await stills.goto(base);
    await stills.waitForFunction(() => document.documentElement.classList.contains('intro-ready'));
    // Seek the real CSS animations by their common clock. Screenshot latency
    // then has no effect on the seven reference frames.
    await stills.evaluate(async () => {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      window.heroFrames = document.getAnimations().filter(a => a.animationName?.startsWith('hero-')).map(a => {
        const fromPaint = a.startTime - (performance.getEntriesByName('first-paint')[0]?.startTime || 0);
        a.pause();
        return {a, fromPaint};
      });
    });
    const folder = `${screenshots}/hero-intro-${viewport.width}-frames`;
    await fs.mkdir(folder, {recursive: true});
    for (const time of frameTimes) {
      await stills.evaluate(ms => window.heroFrames.forEach(({a, fromPaint}) => { a.currentTime = Math.max(0, ms - fromPaint); }), time);
      await stills.screenshot({path: `${folder}/${String(time).padStart(4, '0')}.jpg`, quality: 85});
    }
    await stills.reload();
    await stills.waitForFunction(() => document.documentElement.classList.contains('intro-ready'));
    assert.ok(await stills.evaluate(() => document.getAnimations().some(a => a.animationName === 'hero-headline')), 'Reload replays the hero animation');
    await stillContext.close();
    console.log(`${viewport.width}×${viewport.height}`, timing);
  }

  for (const options of [{reducedMotion:'reduce'}, {javaScriptEnabled:false}]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.goto(base);
    assert.equal(await page.locator('html.intro').count(), 0);
    assert.equal(await page.locator('.hero-portrait').evaluate(el => getComputedStyle(el).clipPath), 'none');
    assert.equal(await page.locator('.hero-thesis').evaluate(el => getComputedStyle(el).opacity), '1');
    await context.close();
  }
  const slowFonts = await browser.newContext();
  await slowFonts.route('**/fonts/*.woff2', async route => {
    await new Promise(resolve => setTimeout(resolve, 650));
    await route.continue();
  });
  const slowPage = await slowFonts.newPage();
  await slowPage.goto(base, {waitUntil: 'domcontentloaded'});
  await slowPage.waitForFunction(() => document.documentElement.classList.contains('intro-ready'));
  const slow = await slowPage.evaluate(async () => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
    const animations = document.getAnimations().filter(a => a.animationName?.startsWith('hero-'));
    return {fontStatus: document.fonts.status, finish: Math.max(...animations.map(a => a.startTime + a.effect.getComputedTiming().endTime)) - firstPaint};
  });
  assert.equal(slow.fontStatus, 'loading', 'The 300ms cap wins over slow fonts');
  assert.ok(slow.finish <= 1800, JSON.stringify(slow));
  console.log('Slow-font cap:', slow);
  await slowFonts.close();

  const protectedContext = await browser.newContext();
  await protectedContext.route(base + '/', async route => {
    const response = await route.fetch();
    await route.fulfill({response, headers: {...response.headers(), 'content-security-policy': csp}});
  });
  const protectedPage = await protectedContext.newPage();
  await protectedPage.goto(base);
  await protectedPage.waitForFunction(() => document.documentElement.classList.contains('intro-ready'));
  const button = protectedPage.locator('.hero-buttons a').first();
  await button.focus();
  assert.equal(await button.evaluate(el => getComputedStyle(el).opacity), '1');
  assert.ok(await button.getAttribute('href'));
  assert.equal(await protectedPage.locator('.nav a[href="/#work"]').count(), 1);
  await protectedPage.goto(base + '/work/deadlock/');
  assert.equal(await protectedPage.locator('html.intro').count(), 0, 'Only the home page uses the intro');
  await protectedContext.close();
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
