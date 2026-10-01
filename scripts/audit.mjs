import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', args: ['--remote-debugging-port=9223'], headless: true });
try {
  const result = await lighthouse(process.env.TEST_URL || 'http://127.0.0.1:4173', { port: 9223, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error' });
  await mkdir('.local/reports', { recursive: true });
  await writeFile('.local/reports/lighthouse.json', result.report);
  console.log(JSON.stringify(Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score * 100])), null, 2));
  console.log(JSON.stringify(Object.values(result.lhr.audits).filter(a => a.score !== null && a.score < 1).map(a => ({ id: a.id, title: a.title, score: a.score, display: a.displayValue })), null, 2));
} finally { await browser.close(); }
