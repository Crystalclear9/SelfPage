import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const chapter = 'articles/ailearning/mathematics/linear-algebra/chapter-01/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(base + 'articles/');
    assert.equal(await page.locator('.entry-row').count(), 1);
    await page.locator('.entry-row', { hasText: 'AILearning' }).click();
    await page.waitForURL(base + 'articles/ailearning/');
    assert.equal(await page.locator('.learning-row').count(), 12);
    assert.equal(await page.locator('.learning-notes').getAttribute('open'), null);
    assert.equal(await page.locator('.learning-meta').count(), 0);
    await page.locator('.learning-notes summary').click();
    assert.equal(await page.locator('#learning-content code').filter({ hasText: '$$...$$' }).count(), 1);
    await page.locator('.learning-notes summary').click();
    await page.locator('.learning-row', { hasText: '数学基础' }).click();
    await page.locator('.learning-row', { hasText: '线性代数' }).click();
    assert.equal(await page.locator('.learning-row').count(), 4);
    await page.locator('.learning-row').first().click();
    await page.waitForURL(base + chapter);
    for (const action of [() => page.reload(), () => page.goto(base + chapter)]) {
      await action(); await page.locator('#sec-1').waitFor({ state: 'attached' });
      assert.ok(await page.locator('.katex').count() > 0);
      assert.ok((await page.locator('#learning-content').innerText()).length > 10000);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile overflow');
    }
    await page.locator('.learning-pager a').last().click();
    await page.waitForURL(/chapter-02\/$/);
    await page.goBack({ waitUntil: 'commit' }); await page.waitForURL(base + chapter);
    assert.ok(await page.locator('.katex').count() > 0);
    await page.goForward({ waitUntil: 'commit' }); await page.waitForURL(/chapter-02\/$/);
    assert.deepEqual(errors, []);
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(base + 'articles/ailearning/');
  await page.screenshot({ path: '.local/reports/learning-directory.png', fullPage: true });
  await page.goto(base + chapter + '#sec-1');
  await page.screenshot({ path: '.local/reports/learning-chapter.png' });
  console.log('Learning UI: one article entry, nested navigation, direct/reload/history, no-JS, mobile layout and hydration passed.');
} finally { await browser.close(); }
