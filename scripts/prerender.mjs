import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { routes } = await server.ssrLoadModule('/src/data/routes.js');
  const html = await readFile('dist/index.html', 'utf8');
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
