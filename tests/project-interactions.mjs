import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base = process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
await mkdir('.local/reports', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.project-grid').evaluate(el => scrollTo({ top: scrollY + el.getBoundingClientRect().top + 400, behavior: 'instant' }));
  await expect.poll(() => page.locator('.projects-intro').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(68);
  const centered = await page.locator('.projects-intro').evaluate(el => {
    const a = el.firstElementChild.getBoundingClientRect(), b = el.lastElementChild.getBoundingClientRect();
    return Math.abs((a.top + b.bottom + parseFloat(getComputedStyle(el.lastElementChild).marginBottom)) / 2 - (innerHeight + 68) / 2);
  });
  expect(centered).toBeLessThan(3);
  for (const name of ['应用', '系统研究', '全部', '应用', '全部']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.locator('.project-card')).toHaveCount(name === '全部' ? 4 : 2);
    await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true');
    const top = await page.locator('.project-grid').evaluate(el => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(95);
    expect(top).toBeLessThan(200);
  }
  await page.locator('.project-card').first().hover({ position: { x: 40, y: 100 } });
  const links = await page.locator('.project-card').first().evaluate(el => {
    const a = el.querySelector('.project-page-link').getBoundingClientRect();
    const b = el.querySelector('.source-link').getBoundingClientRect();
    return { gap: b.left - a.right, dy: Math.abs((a.top + a.bottom - b.top - b.bottom) / 2) };
  });
  expect(links.gap).toBeLessThan(30); expect(links.dy).toBeLessThan(8);
  await page.mouse.move(300, 500); await page.mouse.click(300, 500);
  await page.screenshot({ path: '.local/reports/projects-refined.png' });
  await page.locator('.detail-button').first().click();
  await page.locator('.copy-project-link').click();
  await expect(page.locator('.toast')).toContainText('项目链接已复制');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(new URL('projects/suishouban/', base).href);
  await expect(page.locator('.animated-cursor')).toHaveAttribute('data-state', 'copied');
  await page.keyboard.press('Escape');
  for (const door of await page.locator('.writing-door').all()) {
    await door.hover();
    await expect(door).toHaveAttribute('data-pointer-inside', 'true');
    await expect.poll(() => door.evaluate(el => getComputedStyle(el, '::before').opacity)).toBe('1');
    await page.mouse.move(10, 100);
    await expect.poll(() => door.evaluate(el => getComputedStyle(el, '::before').opacity)).toBe('0');
    await door.hover(); await page.mouse.wheel(0, 50);
    await expect.poll(() => door.evaluate(el => getComputedStyle(el, '::before').opacity)).toBe('0');
  }
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('.project-card').first().hover();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 375) await page.screenshot({ path: '.local/reports/projects-mobile.png' });
  }
  await page.getByRole('button', { name: '切换到深色模式' }).click();
  await page.locator('.project-grid').evaluate(el => scrollTo({ top: scrollY + el.getBoundingClientRect().top - 100, behavior: 'instant' }));
  await page.locator('.project-card').first().hover();
  await page.screenshot({ path: '.local/reports/projects-dark.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: '系统研究', exact: true }).click();
  await expect(page.locator('.project-card')).toHaveCount(2);
  expect(await page.locator('.project-grid').evaluate(el => el.getAnimations().length)).toBe(0);
  expect(errors).toEqual([]);
  console.log('Centered sidebar, stable filtering, grouped actions, clipboard, glow cleanup and viewport containment passed.');
} finally { await browser.close(); }
