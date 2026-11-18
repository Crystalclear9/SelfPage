import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writingPlugin } from './scripts/content.mjs';
import { learningPlugin } from './scripts/learning.mjs';
import { readFileSync } from 'node:fs';

let siteBase = '/';
const transitionGuard = {
  name: 'early-transition-guard',
  configResolved(config) { siteBase = config.base; },
  transformIndexHtml() {
    // The browser can paint the chosen native cursor before external assets arrive.
    const cursor = name => 'url(data:image/png;base64,' +
      readFileSync(new URL('./src/assets/' + name + '.png', import.meta.url)).toString('base64') + ')';
    const artwork = name => {
      const svg = readFileSync(new URL('./public/images/' + name + '.svg', import.meta.url), 'utf8');
      const image = svg.match(/href="(data:image\/webp;base64,[A-Za-z0-9+/=]+)"/);
      if (!image) throw new Error('Missing embedded cursor artwork: ' + name);
      return 'url("' + image[1] + '")';
    };
    return [{ tag: 'meta', attrs: { charset: 'UTF-8' }, injectTo: 'head-prepend' },
    { tag: 'script', attrs: { 'data-base': siteBase, 'data-cursor-entry': '' }, injectTo: 'head-prepend',
      children: readFileSync(new URL('./src/lib/cursor-entry.js', import.meta.url), 'utf8') },
    { tag: 'style', attrs: { 'data-native-cursor': '' }, injectTo: 'head-prepend',
      children: `@media (hover: hover) and (pointer: fine) {
        html {
          --long-cursor: ${artwork('megumi-cursor')};
          --short-cursor: ${artwork('megumi-cursor-short')};
          --cursor-image: var(--long-cursor);
          --cursor-fallback: ${cursor('megumi-cursor')};
          --native-cursor: var(--cursor-fallback) 8 12, auto;
        }
        html[data-cursor-outfit="short"] {
          --cursor-image: var(--short-cursor);
          --cursor-fallback: ${cursor('megumi-cursor-short')};
        }
        @supports (cursor: image-set(url("") 3x) 8 12, auto) {
          html { --native-cursor: image-set(var(--cursor-image) 3x) 8 12, var(--cursor-fallback) 8 12, auto; }
        }
        html, html * { cursor: var(--native-cursor) !important; }
        html.animated-cursor-active:active-view-transition, html.animated-cursor-active:active-view-transition *, html::view-transition { cursor: var(--native-cursor) !important; }
        html:active-view-transition .animated-cursor { display: none !important; }
      }` }, { tag: 'script', attrs: { 'data-transition-guard': '' },
      children: readFileSync(new URL('./src/lib/transition-guard.js', import.meta.url), 'utf8'),
      injectTo: 'head' }, { tag: 'script', attrs: { 'data-home-entry': '', 'data-base': siteBase },
      children: readFileSync(new URL('./src/lib/home-entry.js', import.meta.url), 'utf8'),
      injectTo: 'head' }];
  },
};

export default defineConfig({
  plugins: [react(), writingPlugin(), learningPlugin(), transitionGuard],
  base: process.env.SITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      output: {
        entryFileNames: 'assets/site.js',
        assetFileNames: asset => asset.names?.some(name => name.endsWith('.css'))
          ? 'assets/site.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
