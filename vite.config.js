import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writingPlugin } from './scripts/content.mjs';
import { readFileSync } from 'node:fs';

const transitionGuard = {
  name: 'early-transition-guard',
  transformIndexHtml() {
    return [{ tag: 'script', attrs: { 'data-transition-guard': '' },
      children: readFileSync(new URL('./src/lib/transition-guard.js', import.meta.url), 'utf8'),
      injectTo: 'head' }];
  },
};

export default defineConfig({
  plugins: [react(), writingPlugin(), transitionGuard],
  base: process.env.SITE_BASE_PATH || '/',
});
