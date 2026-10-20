import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
 for (const javaScriptEnabled of [false, true]) {
  const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of ['projects/suishouban/', 'projects/gameqa/', 'projects/autellix/', 'projects/time-predict/', 'projects/sandboxsim/', 'articles/', 'papers/', 'papers/k-gat/']) {
   const response = await page.goto(base + route); assert.equal(response.status(), 200);
   await page.reload(); await page.locator('h1').waitFor();
   assert.equal(await page.locator('h1').count(), 1);
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   if (route.includes('autellix')) assert.match(await page.locator('main').innerText(), /个人论文复现尝试/);
   if (route === 'papers/') assert.equal(await page.locator('.entry-row', { hasText: 'When Evidence Shapes Collaboration' }).count(), 1);
   if (route === 'papers/k-gat/') {
    assert.equal(await page.locator('.publication-links a[href="https://arxiv.org/pdf/2608.27984"]').count(), 1);
    assert.equal(await page.locator('.publication-links a[href="https://openreview.net/forum?id=E51inMWXf1"]').count(), 1);
    assert.match(await page.locator('.prose').innerText(), /研究问题/);
    assert.equal(await page.locator('.publication-page .eyebrow').innerText(), 'EMNLP 2026');
    assert.equal(await page.locator('.publication-authors li').count(), 9);
    assert.equal(await page.locator('.publication-figure').count(), 2);
    for (const img of await page.locator('.publication-figure img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el => el.decode());
      assert.ok(await img.evaluate(el => el.naturalWidth > 0));
      assert.ok((await img.getAttribute('src')).startsWith(new URL(base).pathname + 'files/k-gat/'));
    }
   }
   if (route === 'articles/') assert.equal(await page.locator('.entry-row', { hasText: 'AILearning' }).count(), 1);
  }
  assert.deepEqual(errors, []); await context.close();
 }
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
 await page.goto(base); assert.equal(await page.locator('.writing-count').count(), 0); await page.locator('.writing-door').first().scrollIntoViewIfNeeded();
 await page.locator('.writing-door').first().hover(); await page.waitForTimeout(800);
 assert.equal(await page.locator('.animated-cursor').getAttribute('data-state'), 'read');
 await page.screenshot({ path: '.local/reports/writing-section.png' });
 await page.goto(base + 'projects/autellix/');
 await page.screenshot({ path: '.local/reports/project-page.png', fullPage: true });
 console.log('All 8 detail/index routes: direct load, refresh, no-JS, mobile overflow, paper links and reading cursor passed.');
} finally { await browser.close(); }
