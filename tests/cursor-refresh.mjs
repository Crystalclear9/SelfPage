import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const base = process.env.TEST_URL || 'http://127.0.0.1:4189/SelfPage/';
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'msedge',
  ignoreDefaultArgs: ['--disable-back-forward-cache'],
});
try {
  const page = await browser.newPage({ reducedMotion: 'no-preference' });
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
    await page.mouse.move(300, 220);
    await expect(page.locator('html')).not.toHaveClass(/animated-cursor-active/);
    resume();
    await expect(page.locator('html')).toHaveClass(/animated-cursor-active/);
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
  await page.locator('.writing-door').first().click();
  await expect(page.locator('html')).toHaveAttribute('data-cursor-outfit', 'long');
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
