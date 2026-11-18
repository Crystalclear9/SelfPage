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
      readFileSync(new URL('./src/assets/' + name + '.png', import.meta.url)).toString('base64') + ') 8 12, auto';
    return [{ tag: 'style', attrs: { 'data-native-cursor': '' }, injectTo: 'head-prepend',
      children: `@media (hover: hover) and (pointer: fine) {
        html { --native-cursor: ${cursor('megumi-cursor')}; }
        html[data-cursor-outfit="short"] { --native-cursor: ${cursor('megumi-cursor-short')}; }
        html:not(.animated-cursor-active), html:not(.animated-cursor-active) * { cursor: var(--native-cursor) !important; }
        html.animated-cursor-active:active-view-transition, html.animated-cursor-active:active-view-transition *, html::view-transition { cursor: var(--native-cursor) !important; }
        html:active-view-transition .animated-cursor { visibility: hidden; }
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
