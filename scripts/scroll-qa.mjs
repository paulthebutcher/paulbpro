import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const screenshots = process.env.SCROLL_QA_OUTPUT || 'reference/screenshots';

async function scroll(page, top) {
  await page.evaluate(async y => {
    scrollTo({top: y, behavior: 'instant'});
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, top);
}

async function ready(page, base) {
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('.work-layout').style.getPropertyValue('--work-tail') || innerWidth < 1200);
}

export async function checkScrollLayout(page, zoom = false) {
  if (zoom) {
    await scroll(page, 0);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.evaluate(() => document.fonts.ready);
  }
  await page.waitForFunction(() => {
    const layout = document.querySelector('.work-layout');
    const heading = layout.querySelector('.work-heading');
    const list = layout.querySelector('.case-list');
    const image = list.querySelector('.case-card:last-child .work-image');
    const tail = list.getBoundingClientRect().bottom - image.getBoundingClientRect().top;
    return Math.abs(parseFloat(layout.style.getPropertyValue('--work-tail')) - (heading.getBoundingClientRect().height - tail)) < .1;
  });
  const dimensions = await page.evaluate(() => {
    const layout = document.querySelector('.work-layout');
    const heading = layout.querySelector('.work-heading');
    const images = [...layout.querySelectorAll('.work-image')];
    const top = parseFloat(getComputedStyle(heading).top);
    const crossings = images.map(image => image.getBoundingClientRect().top + scrollY - top);
    return {top, start: crossings[0], second: crossings[1], end: crossings.at(-1), count: crossings.length};
  });
  const sample = () => page.evaluate(() => {
    const heading = document.querySelector('.work-heading').getBoundingClientRect();
    const image = document.querySelector('.case-card:last-child .work-image').getBoundingClientRect();
    const rule = getComputedStyle(document.querySelector('.work-progress__track'), '::after').transform;
    return {heading: heading.top, image: image.top, gap: image.left - heading.right, progress: rule === 'none' ? 1 : new DOMMatrix(rule).a};
  });
  await scroll(page, Math.floor(dimensions.end) - 4);
  const before = await sample();
  assert.ok(Math.abs(before.heading - dimensions.top) <= 1, `Heading sticks before the last image aligns: ${JSON.stringify({dimensions, before, actualY: await page.evaluate(() => scrollY)})}`);
  const y = Math.ceil(dimensions.end) + 1;
  await scroll(page, y);
  const release = await sample();
  assert.ok(release.heading < before.heading && Math.abs(release.heading - release.image) <= 1, `Work release misaligned: ${JSON.stringify(release)}`);
  assert.ok(release.gap >= -1, 'Work heading stays in its own column');
  const total = String(dimensions.count).padStart(2, '0');
  await page.waitForFunction(expected => document.querySelector('.work-progress__count').textContent === expected, `${total} / ${total}`);
  if (!zoom) {
    await scroll(page, Math.ceil(dimensions.start));
    const start = await sample();
    await scroll(page, Math.round((dimensions.start + dimensions.end) / 2));
    const middle = await sample();
    await scroll(page, Math.ceil(dimensions.second) + 2);
    await page.waitForFunction(expected => document.querySelector('.work-progress__count').textContent === expected, `02 / ${total}`, {timeout: 3000});
    if (await page.evaluate(() => CSS.supports('animation-timeline: view()') && matchMedia('(prefers-reduced-motion: no-preference)').matches)) {
      assert.ok(start.progress < .02 && middle.progress > .45 && middle.progress < .55 && release.progress > .98,
        `Progress should span the first and last image: ${[start.progress, middle.progress, release.progress]}`);
    } else assert.equal(middle.progress, 1, 'Fallback progress is fully drawn');
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
  assert.equal(await page.getByRole('heading', {level: 3, name: /^(Person|Team|Company)$/}).count(), 3);
  assert.equal(await page.locator('.principles h4:visible').count(), 9);
  return {y, ...release};
}

async function checkFocus(page) {
  await page.locator('.resume-button a').focus();
  await page.keyboard.press('Tab');
  const cardCount = await page.locator('.case-card a, .build-tile a').count();
  for (let i = 0; i < cardCount; i++) {
    await page.waitForFunction(() => {
      const title = document.activeElement.querySelector('h3');
      const box = title?.getBoundingClientRect();
      return box && box.top >= 32 && box.bottom <= innerHeight;
    }, null, {timeout: 2000});
    const result = await page.evaluate(() => {
      const target = document.activeElement;
      const rect = target.getBoundingClientRect();
      const title = target.querySelector('h3');
      const tag = target.closest('.section')?.querySelector('.section-tag-row')?.getBoundingClientRect();
      return {
        hidden: !title || getComputedStyle(title).opacity !== '1' || (tag && rect.top < tag.bottom && rect.bottom <= tag.bottom),
        titleVisible: title && title.getBoundingClientRect().bottom > (tag?.bottom || 0) && title.getBoundingClientRect().top < innerHeight,
        outline: getComputedStyle(target).outlineStyle,
        card: title?.textContent, y: rect.top,
        hit: target.matches('.case-card a, .build-tile a'),
      };
    });
    assert.ok(result.hit && !result.hidden && result.titleVisible && result.outline !== 'none', `Card focus is visible: ${JSON.stringify(result)}`);
    await page.keyboard.press('Tab');
  }
  // Lead is editorial content; keyboard focus moves to Contact after Build.
  assert.equal(await page.evaluate(() => document.activeElement.closest('footer')?.id), 'contact');
}

export async function captureScroll(browser, base, {width, height, reducedMotion, fallback = false}) {
  const page = await browser.newPage({viewport: {width, height}, reducedMotion});
  try {
    await ready(page, base);
    const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
    if (fallback) assert.equal(supported, false, 'Expected a browser without CSS scroll timelines');
    const final = fallback || reducedMotion === 'reduce';
    for (const section of ['work', 'lead']) {
      const suffix = fallback ? '-firefox' : final ? '-reduced' : '';
      const dir = `${screenshots}/scroll-${section}-${width}${suffix}`;
      fs.mkdirSync(dir, {recursive: true});
      const bounds = await page.locator(`#${section}`).evaluate(el => {
        const rect = el.getBoundingClientRect();
        return {top: Math.floor(rect.top + scrollY), bottom: Math.ceil(rect.bottom + scrollY)};
      });
      const logs = [];
      for (let y = bounds.top - 200, i = 0; y <= bounds.bottom + 100; y += 100, i++) {
        await scroll(page, y);
        const values = await page.locator(`#${section}`).evaluate((el, sectionName) => {
          const box = selector => el.querySelector(selector)?.getBoundingClientRect().top;
          const style = selector => getComputedStyle(el.querySelector(selector));
          const tag = el.querySelector('.section-tag-row');
          const styleOf = selector => ({opacity: style(selector).opacity, transform: style(selector).transform, clip: style(selector).clipPath});
          return {
            y: scrollY, tag: tag.getBoundingClientRect().top,
            heading: box(sectionName === 'work' ? '.work-heading' : '.lead-level h3'),
            content: styleOf(sectionName === 'work' ? '.case-card h3' : '.principles > div'),
            clip: sectionName === 'work' ? style('.work-image').clipPath : 'none',
            rule: getComputedStyle(el.querySelector(sectionName === 'work' ? '.work-progress__track' : '.lead-level h3'), '::after').transform,
            stroke: sectionName === 'lead' ? style('.lead-art svg path').strokeDashoffset : null,
            lastImage: sectionName === 'work' ? box('.case-card:last-child .work-image') : null,
            levels: [...el.querySelectorAll('.lead-level')].map(level => level.hidden),
            active: document.querySelector('[data-nav][aria-current]')?.dataset.nav ?? null,
          };
        }, section);
        if (final) {
          assert.deepEqual(values.content, {opacity: '1', transform: 'none', clip: 'none'});
          assert.equal(values.clip, 'none');
          assert.equal(values.rule, 'none');
          if (values.stroke) assert.equal(parseFloat(values.stroke), 0);
        }
        if (section === 'lead') {
          assert.deepEqual(values.levels, [false, false, false]);
          assert.equal(parseFloat(values.stroke), 0, 'Approved illustrations stay static');
        }
        if (await page.locator(`#${section}`).evaluate(el => {
          const {top, bottom} = el.getBoundingClientRect();
          return top <= 0 && bottom > 32;
        })) assert.equal(values.active, `#${section}`);
        logs.push(values);
        if (i % 3 === 0) await page.screenshot({path: `${dir}/${String(i * 100).padStart(4, '0')}.jpg`, quality: 78});
      }
      if (section === 'work' && width >= 1200) {
        const release = await checkScrollLayout(page);
        logs.push({release});
        await scroll(page, release.y);
        const guide = await page.evaluateHandle(y => {
          const line = document.createElement('div');
          Object.assign(line.style, {position: 'fixed', top: `${Math.round(y)}px`, left: '0', right: '0', height: '1px', background: '#ffcb75', zIndex: 99, pointerEvents: 'none'});
          document.body.append(line);
          return line;
        }, release.heading);
        await page.screenshot({path: `${dir}/release.jpg`, quality: 88});
        await guide.evaluate(el => el.remove());
      }
      fs.writeFileSync(`${dir}/positions.json`, JSON.stringify(logs, null, 2) + '\n');
    }
    if (width === 1440 && !final) {
      await checkFocus(page);
      const release = await checkScrollLayout(page, true);
      console.log('200% text zoom release:', release);
    }
    console.log(`${width}×${height}${fallback ? ' Firefox fallback' : final ? ' reduced motion' : ''}: scroll checks and screenshots complete`);
  } finally {
    await page.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.mkdirSync('.cache/tmp', {recursive: true});
  process.env.TMPDIR = path.resolve('.cache/tmp') + path.sep;
  process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve('.cache/playwright');
  const {chromium, firefox} = await import('playwright-core');
  const {serve} = await import('./server.mjs');
  const isFirefox = process.argv.includes('--firefox');
  const server = await serve();
  let browser;
  try {
    browser = isFirefox ? await firefox.launch({
      firefoxUserPrefs: {'layout.css.scroll-driven-animations.enabled': false},
    }) : await chromium.launch({
      executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    const base = 'http://127.0.0.1:4173';
    const sizes = isFirefox ? [{width: 1440, height: 900, fallback: true}] :
      [{width: 1440, height: 900}, {width: 1280, height: 800}, {width: 390, height: 844}, {width: 1440, height: 900, reducedMotion: 'reduce'}];
    for (const size of sizes) await captureScroll(browser, base, size);
    if (!isFirefox) {
      const page = await browser.newPage({viewport: {width: 1512, height: 900}, reducedMotion: 'reduce'});
      await ready(page, base);
      const level = page.locator('#level-person');
      assert.deepEqual(await level.locator('.principles > div, .lead-art').evaluateAll(items => items.map(item => {
        const rect = item.getBoundingClientRect();
        return [rect.x, rect.width];
      }).sort((a, b) => a[0] - b[0])), [[64, 322], [418, 322], [772, 322], [1126, 322]]);
      await level.screenshot({path: `${screenshots}/lead-person-desktop.jpg`, quality: 90});
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}
