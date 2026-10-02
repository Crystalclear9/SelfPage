import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
 for (const javaScriptEnabled of [false, true]) {
  const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const route of ['projects/suishouban/', 'projects/gameqa/', 'projects/autellix/', 'projects/time-predict/', 'articles/', 'papers/']) {
   const response = await page.goto(base + route); assert.equal(response.status(), 200);
   await page.reload(); await page.locator('h1').waitFor();
   assert.equal(await page.locator('h1').count(), 1);
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
   if (route.includes('autellix')) assert.match(await page.locator('main').innerText(), /个人论文复现尝试/);
   if (route === 'articles/' || route === 'papers/') assert.equal(await page.locator('.empty-writing').count(), 1);
  }
  assert.deepEqual(errors, []); await context.close();
 }
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
 await page.goto(base); await page.locator('.writing-door').first().scrollIntoViewIfNeeded();
 await page.locator('.writing-door').first().hover(); await page.waitForTimeout(800);
 assert.equal(await page.locator('.animated-cursor').getAttribute('data-state'), 'read');
 await page.screenshot({ path: '.local/reports/writing-section.png' });
 await page.goto(base + 'projects/autellix/');
 await page.screenshot({ path: '.local/reports/project-page.png', fullPage: true });
 console.log('All 6 new routes: direct load, refresh, no-JS, mobile overflow and reading cursor passed.');
} finally { await browser.close(); }
