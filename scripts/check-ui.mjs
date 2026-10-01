import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
await mkdir('artifacts', { recursive: true });
const base = process.env.TEST_URL || 'http://127.0.0.1:5173';
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.title(), 'Crystalclear9 · 春日来信');
  assert.equal(await page.locator('.hero-image').evaluate(el => el.naturalWidth > 0), true);
  assert.equal(await page.locator('.project-card').count(), 4);
  await page.getByRole('button', { name: '应用', exact: true }).click();
  assert.equal(await page.locator('.project-card').count(), 2);
  await page.getByRole('button', { name: '项目介绍：随手办' }).click();
  assert.equal(await page.locator('dialog[open]').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  assert.equal(await page.getByRole('button', { name: '项目介绍：随手办' }).evaluate(el => el === document.activeElement), true);
  await page.getByRole('button', { name: '系统研究', exact: true }).click();
  assert.equal(await page.locator('.project-card').count(), 2);
  await page.getByRole('button', { name: '全部' }).click();
  const sourceLinks = await page.locator('.source-link').evaluateAll(links => links.map(a => ({ href: a.href, target: a.target, rel: a.rel })));
  assert.deepEqual(sourceLinks.map(a => a.href), [
    'https://github.com/Crystalclear9/AigcProject',
    'https://github.com/Crystalclear9/RagGameQa',
    'https://github.com/Crystalclear9/Autellix',
    'https://github.com/Crystalclear9/TimePredictModel',
  ]);
  assert.ok(sourceLinks.every(a => a.target === '_blank' && a.rel.includes('noreferrer')));
  assert.equal(await page.getByRole('link', { name: /演示|体验|访问作品/ }).count(), 0);
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
  assert.equal(await page.locator('.extra-links').count(), 0);
  for (const button of await page.locator('.detail-button').all()) {
    await button.click();
    assert.equal(await page.locator('dialog[open] a[href^="https://github.com/Crystalclear9/"]').count(), 1);
    await page.keyboard.press('Escape');
  }

  await page.getByRole('button', { name: '放大图片：樱花盛开的坂道' }).click();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('dialog h2').textContent(), '故事里的你');
  await page.getByRole('button', { name: '上一张图片' }).click();
  assert.equal(await page.locator('dialog h2').textContent(), '樱花盛开的坂道');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '留下一份喜欢' }).click();
  assert.equal(await page.getByRole('button', { name: '已经留下喜欢' }).getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: '樱花拖尾', exact: true }).click();
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('button', { name: '樱花拖尾', exact: true }).getAttribute('aria-pressed'), 'false');
  assert.equal(await page.getByRole('button', { name: '已经留下喜欢' }).getAttribute('aria-pressed'), 'true');
  // Reveal each section before taking the full-page capture.
  for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/desktop-light.png', fullPage: true });
  await page.getByRole('button', { name: '切换到深色模式' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.screenshot({ path: 'artifacts/desktop-dark.png', fullPage: true });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.getByRole('button', { name: '切换到浅色模式' }).click();
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    if (overflow) console.log(await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth).map(e => ({ tag: e.tagName, cls: String(e.className), right: e.getBoundingClientRect().right })) })));
    assert.equal(overflow, false, `Horizontal overflow at ${width}px`);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: '打开导航' }).click();
  await page.getByRole('navigation').getByRole('link', { name: '我的项目' }).click();
  assert.equal(await page.getByRole('button', { name: '打开导航' }).getAttribute('aria-expanded'), 'false');
  assert.ok(page.url().endsWith('#projects'));
  for (const section of await page.locator('main > section').all()) await section.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/mobile-light.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: '樱花拖尾', exact: true }).click();
  await page.mouse.move(400, 250);
  await page.mouse.move(700, 400, { steps: 20 });
  const hasPetals = await page.locator('canvas').evaluate(el => el.getContext('2d').getImageData(0, 0, el.width, el.height).data.some((value, i) => i % 4 === 3 && value > 0));
  assert.equal(hasPetals, true, 'Pointer movement should draw petals');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('canvas').evaluate(el => getComputedStyle(el).display), 'none');
  assert.deepEqual(errors, []);
  const result = { passed: true, viewports: [320, 375, 768, 1024, 1440], checks: ['assets', 'source-only external links', 'all project descriptions', 'no private identifiers', 'filtering', 'project modal', 'focus restoration', 'gallery keyboard navigation', 'theme persistence', 'like persistence', 'trail persistence', 'mobile navigation', 'no horizontal overflow', 'canvas petal rendering', 'reduced motion', 'no runtime errors'] };
  await writeFile('artifacts/ui-results.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }
