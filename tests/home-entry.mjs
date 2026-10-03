import { chromium, expect } from '@playwright/test';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  for (const hash of ['', '#projects', '#about']) {
    await page.goto('about:blank');
    await page.goto(base + hash);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page).toHaveURL(base);
  }
  await page.locator('.hero a[href="#projects"]').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await expect(page).toHaveURL(base);
  await page.locator('.project-page-link').first().click();
  await expect(page).toHaveURL(base + 'projects/suishouban/');
  await page.goBack();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.goto(base + 'projects/suishouban/');
  await page.locator('.pager-previous').click();
  await expect(page).toHaveURL(base);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.reload();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.locator('.detail-button').first().click();
  await expect(page.locator('dialog')).toBeVisible();
  await expect.poll(() => page.locator('.project-detail-list').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await page.locator('.project-detail-list > div').first().hover();
  await expect.poll(() => page.locator('.project-detail-list > div').first().evaluate(el => getComputedStyle(el).translate)).toBe('2px');
  const y = await page.evaluate(() => scrollY);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(y);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.detail-button').first().click();
  await expect(page.locator('.project-detail-list')).toHaveCSS('animation-name', 'none');
  await page.close();
  console.log('Bookmark entry, clean URLs, contextual return, history, reload and restrained modal motion passed.');
} finally { await browser.close(); }
