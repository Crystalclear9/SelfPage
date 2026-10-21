import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { loadLearning } from '../scripts/learning.mjs';

const base = (process.env.TEST_URL || 'http://127.0.0.1:4174/SelfPage/').replace(/\/?$/, '/');
const { pages } = loadLearning();
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const failures = [];
try {
  for (const javaScriptEnabled of [false, true]) {
    const pending = [...pages];
    await Promise.all(Array.from({ length: 3 }, async () => {
      const context = await browser.newContext({ javaScriptEnabled, reducedMotion: 'reduce' });
      const page = await context.newPage();
      let errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
      while (pending.length) {
        const entry = pending.shift();
        errors = [];
        try {
          const response = await page.goto(base + entry.route.slice(1));
          assert.equal(response.status(), 200);
          if (javaScriptEnabled) await page.waitForFunction(() => document.documentElement.classList.contains('interactive'));
          await page.evaluate(async () => {
            document.querySelectorAll('details').forEach(el => { el.open = true; });
            await document.fonts.ready;
          });
          for (const width of [375, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            for (const theme of ['light', 'dark']) {
              const result = await page.evaluate(theme => {
                document.documentElement.dataset.theme = theme;
                const content = document.querySelector('#learning-content');
                const code = [...content.querySelectorAll('pre code')];
                return {
                  overflow: document.documentElement.scrollWidth > innerWidth + 1,
                  title: document.querySelector('h1')?.textContent,
                  empty: !content.textContent.trim(),
                  mathErrors: content.querySelectorAll('.katex-error').length,
                  wrongFonts: code.some(el => !getComputedStyle(el).fontFamily.includes('monospace')),
                  noColour: code.some(el => {
                    const token = el.querySelector('.hljs-keyword, .hljs-string, .hljs-number');
                    return token && getComputedStyle(token).color === getComputedStyle(el).color;
                  }),
                  brokenImages: [...content.querySelectorAll('img')].some(el => el.complete && !el.naturalWidth),
                };
              }, theme);
              assert.equal(result.title, entry.title);
              for (const key of ['overflow', 'empty', 'wrongFonts', 'noColour', 'brokenImages']) assert.equal(result[key], false, `${width}px ${theme}: ${key}`);
              assert.equal(result.mathErrors, 0);
            }
          }
          assert.deepEqual(errors, []);
        } catch (error) { failures.push({ route: entry.route, javaScriptEnabled, error: error.message }); }
      }
      await context.close();
    }));
    console.log(`Checked ${pages.length} pages, JavaScript ${javaScriptEnabled ? 'enabled' : 'disabled'}, desktop/mobile, light/dark.`);
  }
  assert.deepEqual(failures, []);
  console.log('All learning pages: content, resources, runtime errors, formulas, code fonts/colours and responsive containment passed.');
} finally { await browser.close(); }
