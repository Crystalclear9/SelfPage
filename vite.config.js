import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writingPlugin } from './scripts/content.mjs';
import { readFileSync } from 'node:fs';

let siteBase = '/';
const transitionGuard = {
  name: 'early-transition-guard',
  configResolved(config) { siteBase = config.base; },
  transformIndexHtml() {
    return [{ tag: 'script', attrs: { 'data-transition-guard': '' },
      children: readFileSync(new URL('./src/lib/transition-guard.js', import.meta.url), 'utf8'),
      injectTo: 'head' }, { tag: 'script', attrs: { 'data-home-entry': '', 'data-base': siteBase },
      children: readFileSync(new URL('./src/lib/home-entry.js', import.meta.url), 'utf8'),
      injectTo: 'head' }];
  },
};

export default defineConfig({
  plugins: [react(), writingPlugin(), transitionGuard],
  base: process.env.SITE_BASE_PATH || '/',
});
