import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const base = process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/';
await mkdir('.local/reports', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const cursor = page.locator('.animated-cursor');
  const state = value => expect(cursor).toHaveAttribute('data-state', value);
  await page.mouse.move(600, 160);
  await expect(cursor).toBeVisible();
  await expect(cursor.locator('img')).toHaveAttribute('src', /megumi-cursor.svg$/);
  await page.locator('.hero-actions .button').hover();
  await state('pointer');
  await page.mouse.down(); await state('pressed');
  await page.mouse.up(); await state('click');
  await page.locator('.hero-description').dblclick(); await state('double-click');
  await page.waitForTimeout(700);
  await page.locator('.hero-description').hover(); await state('text');
  await page.locator('.hero-image').hover(); await state('grab');
  await page.mouse.down();
  await page.mouse.move(1100, 300, { steps: 8 });
  await state('grabbing');
  // Drag events are browser-managed; cancellation must always restore the cursor.
  await page.mouse.up(); await page.keyboard.press('Escape');
  await page.mouse.move(550, 150);
  await page.evaluate(() => document.querySelector('main').setAttribute('aria-busy', 'true'));
  await state('wait');
  await page.screenshot({ path: '.local/reports/motion-loading.png' });
  await page.evaluate(() => document.querySelector('main').removeAttribute('aria-busy'));
  await page.waitForTimeout(450);
  // Exercise states that have no production control yet without adding fake UI.
  for (const value of ['progress', 'grabbing', 'not-allowed', 'no-drop', 'copy', 'alias', 'zoom-in', 'zoom-out', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize', 'crosshair', 'help', 'move', 'vertical-text']) {
    await page.evaluate(value => document.querySelector('.hero-description').dataset.cursor = value, value);
    await page.locator('.hero-description').hover(); await state(value);
  }
  await page.evaluate(() => delete document.querySelector('.hero-description').dataset.cursor);
  await page.mouse.click(550, 160, { button: 'right' });
  await page.keyboard.press('Escape');
  await page.mouse.move(500, 160);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  const start = await page.locator('.hero-art').evaluate(el => getComputedStyle(el).translate);
  await page.screenshot({ path: '.local/reports/motion-top.png' });
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(100);
  const end = await page.locator('.hero-art').evaluate(el => getComputedStyle(el).translate);
  assert.notEqual(start, end, 'Hero art should follow scroll progress');
  await page.screenshot({ path: '.local/reports/motion-scroll.png' });
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  await page.screenshot({ path: '.local/reports/motion-projects.png' });
  const first = await page.locator('.projects-intro').boundingBox();
  await page.mouse.wheel(0, 400);
  await state('scroll');
  await page.waitForTimeout(500);
  const later = await page.locator('.projects-intro').boundingBox();
  assert.ok(Math.abs(later.y - 138) < 3, 'Project intro pins at its reading position');
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(300);
  assert.ok(Math.abs((await page.locator('.projects-intro').boundingBox()).y - later.y) < 3);
  await page.getByRole('button', { name: '项目介绍：随手办' }).click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.locator('dialog h2').hover(); await state('text');
  assert.equal(await cursor.evaluate(el => el.matches(':popover-open')), true);
  await page.screenshot({ path: '.local/reports/motion-dialog.png' });
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(cursor).toBeHidden();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(300, 160);
  await expect(cursor).toBeHidden();
  assert.match(await page.locator('body').evaluate(el => getComputedStyle(el).cursor), /megumi-cursor/);
  const touch = await browser.newPage({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });
  await touch.goto(base, { waitUntil: 'networkidle' });
  await expect(touch.locator('.animated-cursor')).toBeHidden();
  assert.deepEqual(errors, []);
  console.log('Scroll choreography, cursor action states, dialog top layer, touch and reduced motion passed.');
} finally { await browser.close(); }
