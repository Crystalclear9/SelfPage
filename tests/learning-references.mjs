import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { loadLearning } from '../scripts/learning.mjs';

const external = new Set();
let images = 0;
for (const page of loadLearning().pages) {
  const html = readFileSync(path.join('dist', page.route, 'index.html'), 'utf8');
  for (const [, attribute, raw] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
    const url = new URL(raw.replaceAll('&amp;', '&'), 'https://local.invalid');
    if (url.origin !== 'https://local.invalid') {
      if (url.protocol === 'https:' || url.protocol === 'http:') external.add(url.href.split('#')[0]);
      continue;
    }
    const marker = '/files/ailearning/';
    const start = url.pathname.indexOf(marker);
    if (start < 0) continue;
    const file = path.join('public/files/ailearning', decodeURIComponent(url.pathname.slice(start + marker.length)));
    assert.ok(existsSync(file), `${page.file}: missing ${raw}`);
    if (attribute === 'src') images++;
    if (file.endsWith('.svg') && url.hash && !url.hash.startsWith('#svgView(')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const svg = readFileSync(file, 'utf8');
      assert.ok(svg.includes(`id="${id}"`) || svg.includes(`id='${id}'`), `${page.file}: missing SVG fragment ${raw}`);
    }
  }
}
console.log(`Checked ${images} image references and all local SVG fragment targets.`);
if (process.argv.includes('--external')) {
  const pending = [...external];
  const failures = [];
  await Promise.all(Array.from({ length: 48 }, async () => {
    while (pending.length) {
      const url = pending.pop();
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        await response.body?.cancel();
        if (!response.ok) failures.push({ url, status: response.status });
      } catch (error) { failures.push({ url, error: error.message }); }
    }
  }));
  console.log(JSON.stringify({ checked: external.size, unverified: failures }, null, 2));
}
