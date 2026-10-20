import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { loadLearning } from '../scripts/learning.mjs';

const { pages } = loadLearning();
const index = JSON.parse(readFileSync('content/index.json', 'utf8'));
assert.equal(index.filter(p => p.published && p.slug === 'ailearning').length, 1);
assert.equal(index.filter(p => p.slug?.startsWith('ailearning/')).length, 0);
const documents = new Map(pages.map(page => {
  const file = path.join('dist', page.route, 'index.html');
  assert.ok(existsSync(file), `Missing generated page: ${page.route}`);
  const html = readFileSync(file, 'utf8');
  assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length, 1, page.route);
  assert.ok(!html.includes('class="katex-error"'), `Invalid formula: ${page.route}`);
  assert.ok(html.includes('id="learning-content"'), page.route);
  return [page.route, { html, ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])) }];
}));
for (const [route, { html }] of documents) {
  // Infer the build prefix from the stylesheet, so this checks root and Pages builds.
  const base = html.match(/href="([^"]*)assets\/site\.css/)?.[1];
  assert.ok(base, 'Missing stable CSS entry');
  for (const [, raw] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const url = new URL(raw.replaceAll('&amp;', '&'), `https://test.invalid${base}${route.slice(1)}`);
    if (url.origin !== 'https://test.invalid') continue;
    assert.ok(url.pathname.startsWith(base), `Link escaped site prefix: ${route} -> ${url.pathname}`);
    const target = '/' + url.pathname.slice(base.length);
    if (documents.has(target) && url.hash) {
      assert.ok(documents.get(target).ids.has(decodeURIComponent(url.hash.slice(1))), `Missing anchor: ${route} -> ${raw}`);
    }
    assert.ok(existsSync(path.join('dist', target, 'index.html')), `Missing internal destination: ${route} -> ${raw}`);
  }
}
const bundle = readFileSync('dist/assets/site.js', 'utf8');
assert.ok(!bundle.includes('一条样本可以写成向量'), 'Chapter text must not be bundled into the homepage');
console.log(`Learning collection: ${pages.length} standalone pages, all internal links/anchors, formulas and scoped content passed.`);
