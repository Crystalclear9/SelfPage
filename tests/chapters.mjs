import { chromium, expect } from '@playwright/test';
const base = process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  for (const selector of ['#about', '#projects', '#writing', '#contact']) {
    const positions = [];
    for (const progress of [.12, .5, .82, .5, .12]) {
      await page.locator(selector).evaluate((el, progress) => scrollTo({
        top: el.getBoundingClientRect().top + scrollY - innerHeight + (innerHeight + el.offsetHeight) * progress,
        behavior: 'instant',
      }), progress);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const heading = selector === '#about' ? '.about-copy h2' : `${selector} [data-chapter] h2`;
      positions.push(await page.locator(heading).first().evaluate(el => getComputedStyle(el).translate));
    }
    expect(positions[0]).not.toBe(positions[1]);
    expect(positions[1]).toBe(positions[3]);
    expect(positions[0]).toBe(positions[4]);
  }
  await page.locator('#writing').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
  await expect(page.locator('[data-chapter="writing"]')).toHaveAttribute('data-chapter-visible', 'true');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('[data-chapter="writing"]')).toHaveAttribute('data-chapter-visible', 'false');
  await page.locator('#writing').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
  await expect(page.locator('[data-chapter="writing"]')).toHaveAttribute('data-chapter-visible', 'true');
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
  console.log('Bidirectional chapter triggers, parallax, reduced motion, responsive containment and SandBoxSim detail passed.');
} finally { await browser.close(); }
