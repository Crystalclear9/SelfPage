import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
try {
  for (const mode of ['disabled', 'blocked']) {
    const page = await browser.newPage({ javaScriptEnabled: mode !== 'disabled', viewport: { width: 375, height: 812 } });
    if (mode === 'blocked') await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').textContent(), 'Crystalclear9.');
    assert.equal(await page.locator('.project-card').count(), 4);
    for (const section of await page.locator('main > section').all()) {
      await section.scrollIntoViewIfNeeded();
      assert.equal(await section.evaluate(el => getComputedStyle(el).opacity), '1');
    }
    const images = page.locator('img');
    await images.evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
    assert.equal(await images.evaluateAll(imgs => imgs.every(img => img.naturalWidth > 0)), true);
    assert.equal(await page.locator('.source-link').count(), 4);
    await page.close();
    console.log(`Static content, images, source links work with JavaScript ${mode}.`);
  }
  const delayed = await browser.newPage();
  const errors = [];
  delayed.on('pageerror', error => errors.push(error.message));
  await delayed.route('**/*', async route => {
    if (route.request().resourceType() === 'script') await new Promise(resolve => setTimeout(resolve, 2500));
    await route.continue();
  });
  await delayed.goto(base, { waitUntil: 'commit' });
  await delayed.locator('h1').waitFor({ state: 'visible', timeout: 1500 });
  assert.equal(await delayed.locator('html').evaluate(el => el.classList.contains('interactive')), false);
  assert.equal(await delayed.locator('.source-link').count(), 4);
  await delayed.locator('html.interactive').waitFor({ timeout: 15000 });
  assert.deepEqual(errors, []);
  await delayed.getByRole('button', { name: '项目介绍：随手办' }).click();
  assert.equal(await delayed.locator('dialog[open]').count(), 1);
  await delayed.close();
  console.log('Cold load renders content before delayed JavaScript and hydrates successfully.');
} finally { await browser.close(); }
