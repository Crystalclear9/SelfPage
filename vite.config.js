import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writingPlugin } from './scripts/content.mjs';

export default defineConfig({
  plugins: [react(), writingPlugin()],
  base: process.env.SITE_BASE_PATH || '/',
});
