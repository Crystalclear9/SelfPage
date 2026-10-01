import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

// Reuse the same React components and content as the interactive client.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const html = await readFile('dist/index.html', 'utf8');
  const markup = renderToString(createElement(App));
  if (!html.includes('<div id="root"></div>')) throw new Error('Missing prerender mount point');
  await writeFile('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`));
  console.log('Prerendered homepage: content and source links work without JavaScript.');
} finally {
  await server.close();
}
