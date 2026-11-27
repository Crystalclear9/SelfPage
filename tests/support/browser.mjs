import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

export function testUrl(fallback = 'http://127.0.0.1:4174/SelfPage/') {
  return (process.env.TEST_URL || fallback).replace(/\/?$/, '/');
}

export async function launchBrowser({ reports = false, ...options } = {}) {
  if (reports) await mkdir('.local/reports', { recursive: true });
  return chromium.launch({
    channel: process.env.BROWSER_CHANNEL || 'msedge',
    headless: true,
    ...options,
  });
}
