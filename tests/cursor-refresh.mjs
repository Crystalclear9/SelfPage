import { launchBrowser, testUrl } from './support/browser.mjs';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

const base = testUrl();
const browser = await launchBrowser({ ignoreDefaultArgs: ['--disable-back-forward-cache'] });
try {
  const page = await browser.newPage({ deviceScaleFactor: 2, reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    const random = Math.random;
    Math.random = () => {
      Math.random = random;
      return sessionStorage.short === 'yes' ? .1 : .9;
    };
  });
  for (const short of [false, true, false]) {
    const name = short ? 'megumi-cursor-short.svg' : 'megumi-cursor.svg';
    const requests = [];
    let resume;
    const gate = new Promise(resolve => { resume = resolve; });
    await page.route('**/megumi-cursor*.svg', async route => {
      requests.push(route.request().url().split('/').pop());
      await gate;
      await route.continue();
    });
    if (page.url() === 'about:blank') await page.goto(base, { waitUntil: 'domcontentloaded' });
    else {
      await page.evaluate(value => { sessionStorage.short = value; }, short ? 'yes' : 'no');
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    const sprite = page.locator('.cursor-sprite');
    await expect(sprite).toHaveAttribute('src', new RegExp(name + '$'));
    const artwork = readFileSync(new URL('../public/images/' + name, import.meta.url));
    assert.match(artwork.toString(), /viewBox="0 0 192 204"/);
    const embedded = await page.locator('html').evaluate((el, short) =>
      getComputedStyle(el).getPropertyValue(short ? '--short-cursor' : '--long-cursor'), short);
    assert.ok(embedded.includes(artwork.toString('base64')), 'Native and animated states use the same full-resolution artwork');
    // Check the stationary pointer first, before any pointermove can repair it.
    const firstImage = await page.locator('html').evaluate((el, short) => {
      const css = getComputedStyle(el);
      const expected = css.getPropertyValue(short ? '--short-cursor' : '--long-cursor').trim();
      const data = /base64,([A-Za-z0-9+/=]+)/;
      const painted = el.classList.contains('cursor-stationary')
        ? getComputedStyle(document.querySelector('.animated-cursor')).backgroundImage : css.cursor;
      return painted.match(data)?.[1] === expected.match(data)[1];
    }, short);
    assert.ok(firstImage, 'First native cursor matches the new outfit without mouse movement');
    await page.mouse.move(300, 220);
    await expect(page.locator('html')).toHaveClass(/animated-cursor-active/);
    await expect(page.locator('html')).not.toHaveClass(/cursor-posing/);
    await expect(page.locator('body')).toHaveCSS('cursor', /data:image\/svg\+xml;base64,.*8 12, auto/);
    resume();
    await expect(page.locator('html')).toHaveClass(/animated-cursor-active/);
    await expect(page.locator('body')).toHaveCSS('cursor', /data:image\/svg\+xml/);
    await expect(sprite).toBeHidden();
    const box = await page.locator('.animated-cursor').boundingBox();
    assert.equal(box.x + 8, 300);
    assert.equal(box.y + 12, 220);
    assert.deepEqual(requests, [name]);
    await page.unroute('**/megumi-cursor*.svg');
  }
  // Choose the opposite of the current outfit on the next real draw.
  await page.evaluate(() => { sessionStorage.short = 'yes'; });
  const scripts = [];
  page.on('request', request => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  const nativeBefore = await page.locator('html').evaluate(el => getComputedStyle(el).getPropertyValue('--native-cursor'));
  // Simulate a destination whose entire external presentation is unavailable.
  const externalAssets = /\.(?:css|js|svg)(?:\?|$)/;
  await page.route(externalAssets, route => route.abort());
  await page.locator('.writing-door').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-cursor-outfit', 'long');
  await expect(page.locator('html')).not.toHaveClass(/animated-cursor-active/);
  await expect(page.locator('.entry-row').first()).toHaveCSS('cursor', /data:image\/svg\+xml;base64,.*8 12, auto/);
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).getPropertyValue('--native-cursor')), nativeBefore);
  await page.unroute(externalAssets);
  await page.goBack({ waitUntil: 'commit' });
  await page.evaluate(() => document.addEventListener('click', e => {
    sessionStorage.testPoint = JSON.stringify([e.clientX, e.clientY]);
  }, { once: true }));
  await page.route('**/megumi-cursor*.svg', route => route.abort());
  await page.locator('.writing-door').first().click();
  // No hover/move on the new page. Even a failed pose image must not block
  // restoration of the pointer or its contextual feedback.
  const [cx, cy] = await page.evaluate(() => JSON.parse(sessionStorage.testPoint));
  await expect(page.locator('.animated-cursor')).toBeVisible();
  await expect(page.locator('.animated-cursor')).toHaveCSS('background-image', /data:image\/svg\+xml;base64/);
  const restored = await page.locator('.animated-cursor').boundingBox();
  assert.ok(Math.abs(restored.x + 8 - cx) < 1);
  assert.ok(Math.abs(restored.y + 12 - cy) < 1);
  await page.mouse.move(cx + 4, cy);
  await expect(page.locator('html')).not.toHaveClass(/cursor-stationary/);
  await expect(page.locator('body')).toHaveCSS('cursor', /data:image\/svg\+xml/);
  await page.unroute('**/megumi-cursor*.svg');
  await page.locator('.entry-row').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-cursor-outfit', 'long');
  assert.ok(!scripts.some(url => url.includes('/WritingDetail-')), 'Learning pages use pre-rendered HTML');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-cursor-outfit', 'short');
  await page.goBack({ waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveAttribute('data-cursor-outfit', 'short');
  await expect(page.locator('.cursor-sprite')).toHaveAttribute('src', /megumi-cursor-short.svg$/);
  await page.goForward({ waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveAttribute('data-cursor-outfit', 'short');
  await page.goto(new URL('papers/k-gat/', base).href);
  await expect(page.locator('.paper-contents')).toBeVisible();
  assert.ok(scripts.some(url => url.includes('/WritingDetail-')), 'Paper renderer loaded on demand');
  console.log('Both outfit switches use one request and take over at the stationary fingertip after decoding.');
} finally { await browser.close(); }
