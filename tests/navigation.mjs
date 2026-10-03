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
  await page.locator('.pager-next').click();
  await page.waitForURL(base + 'projects/gameqa/');
  await expect(page.locator('html')).toHaveAttribute('data-transition-kind', 'project');
  assert.equal(await page.locator('html').evaluate(el => el.style.getPropertyValue('--page-direction')), '1');
  await page.locator('.pager-previous').click();
  await page.waitForURL(base + 'projects/suishouban/');
  await expect(page.locator('html')).toHaveAttribute('data-transition-kind', 'project');
  assert.equal(await page.locator('html').evaluate(el => el.style.getPropertyValue('--page-direction')), '-1');
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
  await page.setViewportSize({ width: 375, height: 600 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['projects/gameqa/', 'articles/', 'papers/']) {
    await page.goto(base + route);
    const bar = page.locator('.scroll-return');
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect(bar).toHaveAttribute('inert', '');
    await page.mouse.wheel(0, -25);
    await expect(bar).toHaveClass(/is-visible/);
    await expect(bar).not.toHaveAttribute('inert', '');
    await page.mouse.wheel(0, 20);
    await expect(bar).not.toHaveClass(/is-visible/);
    await page.mouse.wheel(0, -25);
    await expect(bar).toHaveClass(/is-visible/);
    await bar.locator('.home-link').focus();
    await page.mouse.wheel(0, 20);
    await expect(bar).toHaveClass(/is-visible/);
    await bar.locator('.home-link').click();
    await page.waitForURL(base);
  }
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    const topLink = page.locator('.floating-top');
    await expect(topLink).toBeHidden();
    await page.evaluate(() => scrollTo({ top: 1500, behavior: 'instant' }));
    await expect(topLink).toBeHidden();
    await page.mouse.wheel(0, -100);
    await expect(topLink).toBeVisible();
    await page.mouse.wheel(0, 80);
    await expect(topLink).toBeHidden();
    await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect(topLink).toBeHidden();
    await page.mouse.wheel(0, -15);
    await expect(topLink).toBeHidden();
    assert.ok(await page.locator('.site-footer .back-top').evaluate(el => el.getBoundingClientRect().top < innerHeight));
    await page.mouse.wheel(0, -700);
    await expect(topLink).toBeVisible();
    await topLink.click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(150);
    await expect(topLink).toBeHidden();
  }
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    if (width === 375) await page.getByRole('button', { name: '打开导航' }).click();
    const writingNav = page.locator('.main-nav').getByRole('link', { name: '文章与论文', exact: true, includeHidden: true });
    await writingNav.click();
    await expect(writingNav).toHaveClass('active');
    await expect(writingNav).toHaveAttribute('aria-current', 'location');
    if (width === 375) await expect(page.locator('.mobile-toggle')).toHaveAttribute('aria-expanded', 'false');
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await expect(writingNav).not.toHaveClass('active');
    await page.locator('#writing').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
    await expect(writingNav).toHaveClass('active');
    await expect(writingNav).toHaveCSS('color', await page.locator('body').evaluate(el => getComputedStyle(el).getPropertyValue('--ink').trim()).then(color => page.evaluate(color => {
      const el = document.createElement('span'); el.style.color = color; document.body.append(el);
      const result = getComputedStyle(el).color; el.remove(); return result;
    }, color)));
  }
  for (const route of ['articles/', 'papers/']) {
    await page.goto(base + route);
    await expect(page.locator('.main-nav a.active')).toHaveText('文章与论文');
    await page.getByRole('button', { name: '打开导航' }).click();
    await page.locator('.main-nav a.active').click();
    await expect(page).toHaveURL(base);
    await expect(page.locator('.main-nav a.active')).toHaveText('文章与论文');
  }
  assert.deepEqual(errors, []);
  console.log('Return links, no-JS navigation, page transitions, history, avatar and reduced motion passed.');
} finally { await browser.close(); }
