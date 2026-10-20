import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    await page.goto(`${base}papers/k-gat/`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.documentElement.style.scrollBehavior = 'auto';
    });
    const section = page.locator('#paper-section-2');
    const body = section.locator('.research-section-content');
    const { top, height } = await section.evaluate(node => ({
      top: node.getBoundingClientRect().top + scrollY, height: node.offsetHeight,
    }));
    async function sample(y) {
      await page.evaluate(y => scrollTo(0, y), y);
      await page.waitForTimeout(120);
      return body.evaluate(node => +getComputedStyle(node).opacity);
    }
    // Downward entry, reading plateau, upward edge exit, then the reverse path.
    const positions = [top - 800, top - 500, top + height - 190, top + height + 40];
    const down = [];
    for (const y of positions) down.push(await sample(y));
    assert.ok(down[0] < .3);
    assert.equal(down[1], 1);
    assert.ok(down[2] > .08 && down[2] < .8);
    assert.ok(down[3] <= .081);
    for (let i = positions.length - 1; i >= 0; i--) {
      assert.ok(Math.abs(await sample(positions[i]) - down[i]) < .01);
    }
    for (let i = 0; i < positions.length; i++) {
      assert.ok(Math.abs(await sample(positions[i]) - down[i]) < .01);
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await body.evaluate(node => getComputedStyle(node).transform), 'none');
    assert.equal(await body.evaluate(node => getComputedStyle(node).opacity), '1');
    await page.close();
    console.log(`Paper sections ${width}px: entry, reading, exit, reverse, repeat and reduced motion passed.`);
  }
} finally {
  await browser.close();
}
