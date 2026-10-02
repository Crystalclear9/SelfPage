import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of ['projects/suishouban/', 'projects/gameqa/', 'projects/autellix/', 'projects/time-predict/', 'articles/', 'papers/']) {
      await page.goto(base + route);
      await expect(page.locator('.page-navigation .home-link')).toHaveAttribute('href', new URL(base).pathname);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.locator('.page-navigation .home-link').click();
      await page.waitForURL(base);
      await expect(page.locator('.hero h1')).toBeVisible();
    }
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => window.addEventListener('pagereveal', event => {
    if (event.viewTransition) sessionStorage.setItem('transition-seen', 'yes');
  }));
  await page.goto(base);
  await page.locator('.avatar-button').click();
  await expect(page.locator('.toast')).toContainText('你好，欢迎来这里。');
  assert.ok(await page.locator('.avatar img').evaluate(el => el.getAnimations().some(a => a.animationName === 'avatar-greeting')));
  await expect(page.locator('.avatar-button')).not.toHaveClass(/is-greeting/, { timeout: 2000 });
  await page.locator('.project-page-link').first().click();
  await page.waitForURL(base + 'projects/suishouban/');
  assert.equal(await page.evaluate(() => sessionStorage.getItem('transition-seen')), 'yes');
  await page.waitForTimeout(600);
  await mkdir('.local/reports', { recursive: true });
  await page.screenshot({ path: '.local/reports/return-navigation.png' });
  await page.locator('.site-footer .home-link').click();
  await page.waitForURL(base);
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('随手办');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.page-navigation .home-link').click();
  await page.waitForURL(base);
  await page.locator('.avatar-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.toast')).toContainText('你好，欢迎来这里。');
  assert.equal(await page.locator('.avatar img').evaluate(el => el.getAnimations().length), 0);
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base);
    const stage = page.locator('.project-reveal').nth(1);
    const { top, height } = await stage.evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, height: el.offsetHeight }));
    const angles = [];
    for (const progress of [.12, .5, .88, .5, .12]) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top - 1000 + progress * (1000 + height));
      await page.waitForTimeout(100);
      angles.push(await stage.locator('.project-card').evaluate(el => parseFloat(getComputedStyle(el).rotate.replace('x ', ''))));
    }
    assert.ok(angles[0] > 8 && angles[2] < -8, 'Visible rotation at both viewport edges');
    assert.equal(angles[1], 0); assert.equal(angles[3], 0);
    assert.equal(angles[0], angles[4], 'Reverse scrolling follows the same motion');
    assert.equal(await page.locator('.project-grid').evaluate(el => getComputedStyle(el).gap), width === 375 ? '12px' : '16px');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  assert.deepEqual(errors, []);
  console.log('Return links, no-JS navigation, page transitions, history, avatar and reduced motion passed.');
} finally { await browser.close(); }
