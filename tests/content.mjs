import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadWriting } from '../scripts/content.mjs';
const root = mkdtempSync(path.join(tmpdir(), 'selfpage-content-test-'));
try {
 mkdirSync(path.join(root, 'content'));
 const save = entries => writeFileSync(path.join(root, 'content/index.json'), JSON.stringify(entries));
 const article = { type: 'articles', slug: 'test', title: 'Test', summary: 'Summary', date: '2026-10-02', published: true, body: 'test.md' };
 writeFileSync(path.join(root, 'content/test.md'), '# Content');
 save([{ published: false, body: 'private-missing.md' }, article, { ...article, type: 'papers', body: undefined, externalUrl: 'https://example.com/paper' }]);
 assert.equal(loadWriting(root).length, 2);
 assert.equal(loadWriting(root)[0].markdown, '# Content');
 for (const changed of [{ slug: '../escape' }, { date: '2026-02-30' }, { body: '../outside.md' }, { body: 'missing.md' }, { externalUrl: 'javascript:alert(1)' }, { pdf: 'files/../../file.pdf' }, { body: undefined }]) {
  save([{ ...article, ...changed }]); assert.throws(() => loadWriting(root));
 }
 save([article, article]); assert.throws(() => loadWriting(root));
 console.log('Content validation: articles, papers, draft exclusion and invalid input passed.');
} finally { rmSync(root, { recursive: true, force: true }); }

// Exercise the real page renderer with published fixtures, without changing site content.
const { createServer } = await import('vite');
const { default: react } = await import('@vitejs/plugin-react');
const { createElement } = await import('react');
const { renderToString } = await import('react-dom/server');
const fixtures = ['articles', 'papers'].map(type => ({ type, slug: 'fixture', route: `/${type}/fixture/`, title: 'Fixture', summary: 'Summary', date: '2026-10-02', markdown: '## Section\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n![Figure](/files/figure.png)\n\n<script>alert(1)</script>', ...(type === 'papers' ? { pdf: 'files/fixture.pdf', authors: ['Author'], venue: 'Venue' } : {}) }));
const server = await createServer({ configFile: false, base: '/SelfPage/', plugins: [react(), { name: 'fixtures', resolveId(id) { if (id === 'virtual:writing') return '\0virtual:writing'; }, load(id) { if (id === '\0virtual:writing') return `export default ${JSON.stringify(fixtures)}`; } }], server: { middlewareMode: true }, appType: 'custom' });
try {
 const { default: Page } = await server.ssrLoadModule('/src/pages/ContentPage.jsx');
 for (const entry of fixtures) {
  const output = renderToString(createElement(Page, { path: entry.route }));
  assert.match(output, /<table>/); assert.match(output, /src="\/SelfPage\/files\/figure.png"/);
  assert.ok(!output.includes('<script>'));
  if (entry.type === 'papers') assert.match(output, /href="\/SelfPage\/files\/fixture.pdf"/);
 }
 console.log('Published Markdown and paper rendering: tables, image/PDF base paths, HTML escaping passed.');
} finally { await server.close(); }
