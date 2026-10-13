import { chromium, expect } from '@playwright/test';
const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const browser = await chromium.launch({ channel: 'msedge', headless: true, ignoreDefaultArgs: ['--disable-back-forward-cache'] });
try {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const url = base + 'projects/sandboxsim/';
  const response = await context.request.get(url);
  const html = await response.text();
  expect(html).toContain('/assets/site.css?v=');
  expect(html).toContain('/assets/site.js?v=');
  // A cached HTML version must still be able to load entry resources after deploy.
  const old = html.replaceAll(/(assets\/site\.(?:js|css)\?v=)[a-f0-9]+/g, '$1previous-build');
  await page.route(url, route => route.fulfill({ status: 200, contentType: 'text/html', body: old }));
  await page.goto(url);
  await expect(page.locator('h1')).toHaveText('SandBoxSim');
  await expect(page.locator('.detail-page')).toHaveCSS('display', 'block');
  expect(await page.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(50);
  await page.reload();
  await expect(page.locator('h1')).toHaveText('SandBoxSim');
  await page.unroute(url);
  const hashed = html.replace(/assets\/site\.css\?v=[a-f0-9]+/g, 'assets/index-64bnodTW.css')
    .replace(/assets\/site\.js\?v=[a-f0-9]+/g, 'assets/index-CWN9onPT.js');
  await page.route(url, route => route.fulfill({ status: 200, contentType: 'text/html', body: hashed }));
  await page.goto(url); await expect(page.locator('h1')).toHaveText('SandBoxSim');
  expect(await page.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(50);
  await page.unroute(url);
  for (let i = 0; i < 2; i++) {
    await page.locator('.page-navigation .home-link').click(); await page.waitForURL(base);
    await page.goBack({ waitUntil: 'commit' });
    await expect(page.locator('h1')).toHaveText('SandBoxSim');
    expect(await page.locator('h1').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(50);
    await page.goForward({ waitUntil: 'commit' }); await expect(page.locator('.hero h1')).toBeVisible();
    await page.goBack({ waitUntil: 'commit' }); await expect(page.locator('h1')).toHaveText('SandBoxSim');
  }
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    await page.locator('#writing').evaluate(el => scrollTo({ top: el.offsetTop - 100, behavior: 'instant' }));
    await expect(page.locator('[data-chapter="writing"]')).toHaveCSS('translate', '0px');
    const gap = await page.evaluate(() => {
      const p = document.querySelector('#projects'), w = document.querySelector('#writing');
      const link = p.querySelector('.all-repositories').getBoundingClientRect();
      const title = w.querySelector('h2').getBoundingClientRect();
      return title.top - link.bottom;
    });
    expect(gap).toBeLessThan(100);
  }
  expect(errors).toEqual([]);
  console.log('Cached entry versions, styled SandBoxSim direct/reload/history and compact section boundary passed.');
} finally { await browser.close(); }
