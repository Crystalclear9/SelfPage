import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { loadLearning } from '../scripts/learning.mjs';

const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const { pages } = loadLearning();
const entry = pages.find(p => readFileSync(`content/collections/ailearning/${p.file}`, 'utf8').includes('scalar graph and accumulation'));
assert.ok(entry, 'The reference PyTorch chapter must exist');
const source = readFileSync(`content/collections/ailearning/${entry.file}`, 'utf8');
const sample = [...source.matchAll(/```python\r?\n([\s\S]*?)```/g)].find(m => m[1].includes('scalar graph and accumulation'))[1].replaceAll('\r\n', '\n');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  for (const javaScriptEnabled of [false, true]) {
    const page = await browser.newPage({ javaScriptEnabled, viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + entry.route.slice(1));
    const code = page.locator('pre code').filter({ hasText: 'scalar graph and accumulation' });
    assert.equal(await code.textContent(), sample, 'Highlighting must preserve whitespace and code text');
    assert.ok(await code.locator('.hljs-keyword').count() > 0);
    assert.ok(await code.locator('.hljs-number').count() > 0);
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      const style = await code.evaluate(el => ({
        font: getComputedStyle(el).fontFamily,
        colour: getComputedStyle(el).color,
        keyword: getComputedStyle(el.querySelector('.hljs-keyword')).color,
        number: getComputedStyle(el.querySelector('.hljs-number')).color,
        background: getComputedStyle(el.parentElement).backgroundColor,
      }));
      assert.match(style.font, /Consolas.*monospace/);
      assert.notEqual(style.keyword, style.colour);
      assert.notEqual(style.number, style.keyword);
      assert.notEqual(style.background, style.colour);
    }
    await page.setViewportSize({ width: 375, height: 812 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Code must scroll inside its block on mobile');
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log('Code blocks: original text/indentation, static and hydrated highlighting, theme colours, monospace and mobile overflow passed.');
} finally { await browser.close(); }
