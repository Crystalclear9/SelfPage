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
      readFileSync(new URL('./src/assets/' + name + '.png', import.meta.url)).toString('base64') + ') 8 12';
    return [{ tag: 'meta', attrs: { charset: 'UTF-8' }, injectTo: 'head-prepend' },
    { tag: 'script', attrs: { 'data-base': siteBase, 'data-cursor-entry': '' }, injectTo: 'head-prepend',
      children: readFileSync(new URL('./src/lib/cursor-entry.js', import.meta.url), 'utf8') },
    { tag: 'style', attrs: { 'data-native-cursor': '' }, injectTo: 'head-prepend',
      children: `@media (hover: hover) and (pointer: fine) {
        html {
          --long-cursor: ${cursor('megumi-cursor')};
          --short-cursor: ${cursor('megumi-cursor-short')};
          --native-cursor: var(--long-cursor), var(--short-cursor), auto;
        }
        html[data-cursor-outfit="short"] { --native-cursor: var(--short-cursor), var(--long-cursor), auto; }
        html, html * { cursor: var(--native-cursor) !important; }
        html.cursor-posing.animated-cursor-active:active-view-transition, html.cursor-posing.animated-cursor-active:active-view-transition *, html::view-transition { cursor: var(--native-cursor) !important; }
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
