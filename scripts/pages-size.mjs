import { appendFile, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve('dist');
const reportFile = 'assets/build-size.json';
const images = {};
let total = 0;
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    const relative = path.relative(root, file).split(path.sep).join('/');
    if (relative === reportFile) continue;
    const { size } = await stat(file);
    total += size;
    if (/\.(?:svg|webp|jpe?g|png|gif|avif)$/i.test(relative)) images[relative] = size;
  }
}
await scan(root);
const report = { bytes: total, images };
let json = JSON.stringify(report);
do {
  report.bytes = total + Buffer.byteLength(json);
  json = JSON.stringify(report);
} while (report.bytes !== total + Buffer.byteLength(json));
await writeFile(path.join(root, reportFile), json);
let previous;
if (process.env.PREVIOUS_SITE_URL) {
  try {
    const url = new URL(reportFile, process.env.PREVIOUS_SITE_URL.replace(/\/?$/, '/'));
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
    if (response.ok) previous = await response.json();
    else if (response.status !== 404) console.warn('Previous report HTTP', response.status);
  } catch (error) { console.warn('Previous size report unavailable:', error.message); }
}
const mib = bytes => (bytes / 1048576).toFixed(2) + ' MiB';
const ranked = Object.entries(images).sort((a, b) => b[1] - a[1]);
const rows = entries => entries.slice(0, 8).map(([file, size]) => `- ${mib(size)} · \`${file}\``).join('\n');
const equalSizes = Map.groupBy(ranked, ([, size]) => size);
const duplicates = [];
for (const group of equalSizes.values()) {
  if (group.length < 2) continue;
  const seen = new Map();
  for (const [file, size] of group) {
    const hash = createHash('sha256').update(await readFile(path.join(root, file))).digest('hex');
    if (seen.has(hash)) duplicates.push([file + ' = ' + seen.get(hash), size]);
    else seen.set(hash, file);
  }
}
const summary = [
  '## Pages 发布容量', `总量 **${mib(report.bytes)}** · 图片 ${mib(ranked.reduce((sum, [, size]) => sum + size, 0))}`,
  previous ? '相对上次发布变化 ' + mib(report.bytes - previous.bytes) : '本次记录基线，上次发布的数据不可用。',
  '### 体积最大的图片', rows(ranked),
  '### 新增图片（按体积）', previous ? rows(ranked.filter(([file]) => !(file in previous.images))) || '无' : '首次基线',
  '### 内容相同的图片', rows(duplicates) || '无',
].join('\n\n') + '\n';
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
