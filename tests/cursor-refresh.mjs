import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const base = process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/';
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'msedge',
  ignoreDefaultArgs: ['--disable-back-forward-cache'],
});
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
    const initial = page.url() === 'about:blank';
    if (initial) await page.goto(base, { waitUntil: 'domcontentloaded' });
    else {
      await page.evaluate(value => { sessionStorage.short = value; }, short ? 'yes' : 'no');
      // Headless keyboard input delivers F5 to the document; reload performs
      // the browser command normally dispatched by the desktop shortcut.
      await page.keyboard.press('F5');
      await page.reload({ waitUntil: 'domcontentloaded' });
    }
    const sprite = page.locator('.cursor-sprite');
    await expect(sprite).toHaveAttribute('src', new RegExp(name + '$'));
    // Check the stationary pointer first, before any pointermove can repair it.
    const firstImage = await page.locator('html').evaluate((el, short) => {
      const css = getComputedStyle(el);
      const expected = css.getPropertyValue(short ? '--short-cursor' : '--long-cursor').trim();
      const data = /base64,([A-Za-z0-9+/=]+)/;
      const painted = el.classList.contains('animated-cursor-active')
        ? getComputedStyle(document.querySelector('.animated-cursor')).backgroundImage : css.cursor;
      return painted.match(data)?.[1] === expected.match(data)[1];
    }, short);
    assert.ok(firstImage, 'First native cursor matches the new outfit without mouse movement');
    if (initial) await page.mouse.move(300, 220);
    else await expect(page.locator('.animated-cursor')).toBeVisible();
    await expect(page.locator('html')).toHaveClass(/animated-cursor-active/);
    await expect(page.locator('html')).not.toHaveClass(/cursor-posing/);
    await expect(page.locator('body')).toHaveCSS('cursor', 'none');
    resume();
    await expect(page.locator('html')).toHaveClass(/animated-cursor-active/);
    await expect(page.locator('body')).toHaveCSS('cursor', 'none');
    await expect(sprite).toBeHidden();
    const resolution = await page.locator('.animated-cursor').evaluate(async el => {
      const image = new Image();
      const uri = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/)[1];
      const svg = new DOMParser().parseFromString(atob(uri.split(',')[1]), 'image/svg+xml');
      image.src = svg.querySelector('image').getAttribute('href');
      await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    });
    assert.deepEqual(resolution, [192, 204], 'Idle pointer uses the full-resolution artwork');
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
  await expect(page.locator('.entry-row').first()).toBeVisible();
  await expect(page.locator('.animated-cursor')).toHaveCSS('background-image', /data:image\/svg\+xml/);
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
  await expect(page.locator('.animated-cursor')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('cursor', 'none');
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
  console.log('Both outfits, stationary page navigation, refresh and history passed.');
} finally { await browser.close(); }
