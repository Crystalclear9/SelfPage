import { launchBrowser, testUrl } from './support/browser.mjs';
import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

const base = testUrl();
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 }, reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    window.addEventListener('pagereveal', async event => {
      if (!event.viewTransition) return;
      await event.viewTransition.ready;
      window.projectTitleTransition = document.getAnimations().some(animation =>
        animation.effect?.pseudoElement === '::view-transition-group(project-gameqa)');
    });
  });
  await page.goto(base);
  await page.locator('html.interactive').waitFor();
  await page.locator('h3 a').filter({ hasText: /^GameQA$/ }).click();
  await expect(page.locator('main h1')).toHaveText('GameQA');
  await page.waitForFunction(() => window.projectTitleTransition === true);
  assert.equal(new URL(page.url()).pathname, new URL('projects/gameqa/', base).pathname);
  await page.locator('.page-navigation').getByRole('link', { name: '全部项目' }).click();
  await expect(page.locator('.hero')).toBeAttached();
  await page.waitForFunction(() => window.projectTitleTransition === true);
  console.log('Native GameQA title transitions passed in both directions.');
} finally { await browser.close(); }
