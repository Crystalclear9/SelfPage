import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const base = 'http://127.0.0.1:4174/SelfPage/articles/ailearning/';
try {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(base + 'advanced-studies/causal-inference/chapter-03/');
  const answer = page.locator('.exercise-answer').first();
  assert.equal(await answer.getAttribute('open'), null);
  await answer.locator('summary').click();
  assert.ok(await answer.locator('.exercise-solution').isVisible());
  const notes = page.locator('.exercise-notes').first();
  await notes.locator('summary').click();
  await notes.locator('textarea').fill('先写出轨迹概率，再约去相同因子。');
  await notes.locator('input').check();
  await page.reload();
  await notes.locator('summary').click();
  assert.equal(await notes.locator('textarea').inputValue(), '先写出轨迹概率，再约去相同因子。');
  assert.ok(await notes.locator('input').isChecked());
  await page.goto(base + 'mathematics/calculus/chapter-01/');
  const solutions = page.locator('.exercise-answer');
  assert.ok(await solutions.count() >= 12, 'Every numbered question needs its own answer');
  assert.equal(await page.locator('.exercise-answer[open]').count(), 0);
  assert.ok(await page.getByText('题二：', { exact: true }).isVisible());
  assert.ok(await page.getByText('题三：', { exact: true }).isVisible());
  const drafts = page.locator('.exercise-notes');
  for (let i = 0; i < 2; i++) {
    await drafts.nth(i).locator('summary').click();
    await drafts.nth(i).locator('textarea').fill(`独立思路 ${i}`);
  }
  await page.reload();
  assert.equal(await page.locator('.exercise-answer[open]').count(), 0);
  for (let i = 0; i < 2; i++) assert.equal(await drafts.nth(i).locator('textarea').inputValue(), `独立思路 ${i}`);
  await page.goto(base + 'machine-learning/unsupervised-learning/chapter-04/');
  assert.ok(await page.locator('.exercise-answer').count() >= 16, 'Full-stop answer labels must collapse');
  assert.equal(await page.locator('.exercise-answer[open]').count(), 0);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.goto(base + 'guides/assignments/');
  assert.equal(await page.locator('.exercise-notes').count(), 4);
  await page.goto(base + 'guides/teaching/');
  assert.equal(await page.locator('.exercise-answer').count(), 4);
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await plain.newPage();
  await staticPage.goto(base + 'guides/teaching/');
  await staticPage.locator('.exercise-answer summary').first().click();
  assert.ok(await staticPage.locator('.exercise-solution').first().isVisible());
  console.log('Exercises: disclosure, persisted draft/check state, assignments, mobile and no-JS passed.');
} finally { await browser.close(); }
