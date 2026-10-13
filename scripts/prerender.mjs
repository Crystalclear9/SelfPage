import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { routes } = await server.ssrLoadModule('/src/data/routes.js');
  let html = await readFile('dist/index.html', 'utf8');
  // Stable entry paths remain valid for cached HTML after a later deployment.
  // Content versions bypass caches for new HTML without deleting old URLs.
  for (const file of ['assets/site.css', 'assets/site.js']) {
    const version = createHash('sha256').update(await readFile(path.join('dist', file))).digest('hex').slice(0, 12);
    html = html.replaceAll(`${server.config.base}${file}"`, `${server.config.base}${file}?v=${version}"`);
  }
  // One-time migration aliases for the three recent hashed entry versions.
  // Old HTML/history can still resolve these URLs; future builds use stable paths.
  const legacy = JSON.parse(await readFile('scripts/legacy-entrypoints.json', 'utf8'));
  for (const [file, names] of Object.entries(legacy)) {
    for (const name of names) await copyFile(path.join('dist', file), path.join('dist/assets', name));
  }
  if (!html.includes('<div id="root"></div>')) throw new Error('Missing prerender mount point');
  for (const route of [...routes, { path: '/404/', title: '页面不存在', description: '页面不存在或尚未发布。' }]) {
    const markup = renderToString(createElement(App, { path: route.path }));
    const target = route.path === '/404/' ? 'dist/404.html' : path.join('dist', route.path, 'index.html');
    await mkdir(path.dirname(target), { recursive: true });
    let output = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
      .replace(/<title>.*?<\/title>/, `<title>Crystalclear9 | ${escape(route.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${escape(route.description)}`);
    if (route.path !== '/') output = output.replace(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g, '');
    await writeFile(target, output);
  }
  console.log(`Prerendered ${routes.length} pages and 404.html.`);
} finally { await server.close(); }
