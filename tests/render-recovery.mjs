import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const stalled of [false, true]) {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    await context.addInitScript(() => {
      window.addEventListener('pagereveal', event => {
        if (!event.viewTransition) return;
        window.transitionResult = { finished: false, skipped: false };
        const transition = event.viewTransition, original = transition.skipTransition.bind(transition);
        transition.skipTransition = () => { window.transitionResult.skipped = true; original(); };
        transition.finished.then(() => { window.transitionResult.finished = true; });
      });
    });
    if (stalled) await context.route('**/*.css', async route => {
      const response = await route.fetch();
      await route.fulfill({ response, body: (await response.text()) + '\n::view-transition-new(root) { animation-duration: 600s !important; }' });
    });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base);
    if (stalled) await context.route('**/*.js', route => route.abort());
    await page.locator('.project-page-link').first().click();
    await page.waitForURL(base + 'projects/suishouban/');
    await expect.poll(() => page.evaluate(() => window.transitionResult?.finished), { timeout: 3500 }).toBe(true);
    assert.equal(await page.evaluate(() => window.transitionResult.skipped), stalled);
    await expect(page.locator('h1')).toHaveText('随手办');
    assert.equal(await page.evaluate(() => document.getAnimations().filter(a => a.effect?.pseudoElement?.startsWith('::view-transition')).length), 0);
    await page.locator('.page-navigation .home-link').click();
    await page.waitForURL(base);
    await expect(page.locator('.hero h1')).toBeVisible();
    await page.goBack(); await expect(page.locator('h1')).toHaveText('随手办');
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log('Normal motion preserved; stalled transition recovers without app JS, refresh, or lost history.');
} finally { await browser.close(); }
