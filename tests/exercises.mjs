import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const base = 'http://127.0.0.1:4174/SelfPage/articles/ailearning/';
try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ reducedMotion, viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto(base + 'mathematics/calculus/chapter-01/');
    await page.waitForFunction(() => document.documentElement.classList.contains('interactive'));
    assert.equal(await page.locator('.exercise-notes, #learning-content textarea').count(), 0);
    const answer = page.locator('.exercise-answer').first();
    assert.equal(await answer.getAttribute('open'), null);
    await answer.locator('summary').click();
    if (reducedMotion === 'no-preference') assert.ok(await answer.evaluate(el => el.getAnimations().length > 0));
    await answer.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished)); });
    assert.ok(await answer.locator('.exercise-solution').isVisible());
    await answer.locator('summary').click();
    await page.waitForFunction(() => !document.querySelector('.exercise-answer').open);
    await answer.locator('summary').evaluate(el => { el.click(); el.click(); el.click(); });
    await answer.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished)); });
    assert.ok(await answer.locator('.exercise-solution').isVisible());
    await answer.locator('summary').click();
    await page.waitForFunction(() => !document.querySelector('.exercise-answer').open);
    await answer.locator('summary').focus();
    await page.keyboard.press('Enter');
    await answer.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished)); });
    assert.ok(await answer.locator('.exercise-solution').isVisible());
    assert.ok(await page.getByText('题二：', { exact: true }).isVisible());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.reload();
    assert.equal(await page.locator('.exercise-answer[open]').count(), 0);
    await context.close();
  }
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const page = await plain.newPage();
  await page.goto(base + 'guides/teaching/');
  await page.locator('.exercise-answer summary').first().click();
  assert.ok(await page.locator('.exercise-solution').first().isVisible());
  console.log('Answers: animated open/close, keyboard, reduced motion, no draft UI, reload and no-JS passed.');
} finally { await browser.close(); }
