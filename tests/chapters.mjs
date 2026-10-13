import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  const writing = page.locator('[data-chapter="writing"]');
  await expect(writing).toHaveAttribute('data-chapter-visible', 'false');
  await expect(writing).toHaveCSS('opacity', '0');
  await page.locator('#writing').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
  await expect(writing).toHaveAttribute('data-chapter-visible', 'true');
  await expect(writing).toHaveCSS('opacity', '1');
  await expect(writing).toHaveCSS('translate', '0px');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(writing).toHaveAttribute('data-chapter-visible', 'true');
  await page.locator('#writing').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
  await expect(writing).toHaveCSS('translate', '0px');
  for (const progress of [.12, .5, .82, .5, .12]) {
    await page.locator('#projects').evaluate((el, progress) => scrollTo({
      top: el.offsetTop - innerHeight + (innerHeight + el.offsetHeight) * progress,
      behavior: 'instant',
    }), progress);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    expect(await page.locator('[data-chapter="projects"]').evaluate(el => getComputedStyle(el).translate)).toBe('none');
    expect(await page.locator('[data-chapter="projects"] > h2').evaluate(el => getComputedStyle(el).translate)).toBe('none');
    expect(await page.locator('[data-chapter="projects"] > p').evaluate(el => getComputedStyle(el).translate)).toBe('none');
  }
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const section of await page.locator('main > section').all()) {
      await section.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-chapter-visible]')).toHaveCount(0);
  expect(await page.locator('[data-chapter] h2').evaluateAll(nodes => nodes.every(el => getComputedStyle(el).animationName === 'none'))).toBe(true);
  await page.goto(base + 'projects/sandboxsim/');
  await expect(page.locator('h1')).toHaveText('SandBoxSim');
  await expect(page.locator('#implementation .implementation-row')).toHaveCount(4);
  await expect(page.locator('.pager-previous strong')).toHaveText('TimePredictModel');
  await expect(page.locator('.pager-next strong')).toHaveText('文章');
  expect(errors).toEqual([]);
  console.log('One-time module reveal, stationary project heading, reduced motion, responsive containment and SandBoxSim detail passed.');
} finally { await browser.close(); }
