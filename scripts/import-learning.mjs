import { existsSync, renameSync, rmSync, readdirSync, readFileSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createLearningRenderer } from './learning.mjs';
import { execFileSync } from 'node:child_process';

const source = process.argv[2];
if (!source) throw new Error('Usage: npm run import:learning -- <AILearning directory>');
const root = path.resolve(source);
const destination = path.resolve('content/collections/ailearning');
const categories = ['Mathematics', 'Programming', 'ComputerScience', 'MachineLearning', 'DeepLearning', 'AI-Domains', 'ReinforcementLearning', 'AdvancedStudies'];
const guides = { '学习路线.md': 'learning-path', '内容范围与掌握标准.md': 'scope', '运行环境.md': 'environment', '术语与符号.md': 'glossary', '授课与作业.md': 'teaching', '作业题面.md': 'assignments' };
const slug = value => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const files = [];
const images = [];
function scan(directory, relative = '') {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const file = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) scan(path.join(directory, entry.name), file);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(file);
    else if (entry.isFile() && /\.(svg|png|jpg|jpeg|gif|webp|txt)$/i.test(file)) images.push(file);
  }
}
const media = path.resolve('public/files/ailearning');
const work = path.resolve('.local/learning-import');
for (const directory of [destination, media, work]) {
  if (directory === root || directory.startsWith(root + path.sep) || root.startsWith(directory + path.sep)) {
    throw new Error('Choose a source separate from the publishing directories');
  }
}
scan(root);
if (!files.includes('README.md') || !files.some(file => categories.includes(file.split('/')[0]))) {
  throw new Error('Expected an AILearning source folder with README.md and a curriculum category');
}
function indexPages(contentStage) {
  const pages = files.sort().map(file => {
    const parts = file.split('/');
    if (parts.length > 1 && !categories.includes(parts[0]) && file !== 'assets/external/README.md') throw new Error(`Unknown category: ${file}`);
    const markdown = readFileSync(path.join(contentStage, file), 'utf8');
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    if (!title) throw new Error(`Missing title: ${file}`);
    const directory = parts.slice(0, -1);
    const isIndex = parts.at(-1) === 'README.md';
    let segments = directory.map(slug);
    if (!isIndex) {
      if (parts.length === 1) {
        if (!guides[file]) throw new Error(`Unknown guide: ${file}`);
        segments = ['guides', guides[file]];
      } else {
        const number = parts.at(-1).match(/^(\d+)-/)?.[1];
        if (!number) throw new Error(`Missing chapter number: ${file}`);
        segments.push(`chapter-${number}`);
      }
    }
    if (file === 'assets/external/README.md') segments = ['guides', 'image-sources'];
    const route = `/articles/ailearning/${segments.length ? segments.join('/') + '/' : ''}`;
    const parentFile = file === 'assets/external/README.md' ? 'README.md' : isIndex ? (directory.length ? [...directory.slice(0, -1), 'README.md'].join('/') : null)
      : [...directory, 'README.md'].join('/');
    return { file, route, title: file === 'README.md' ? 'AILearning' : title, parentFile,
      kind: file === 'assets/external/README.md' ? 'guide' : file === 'README.md' ? 'collection' : isIndex ? (parts.length === 2 ? 'category' : 'topic') : parts.length === 1 ? 'guide' : 'chapter' };
  });
  if (new Set(pages.map(p => p.route)).size !== pages.length) throw new Error('Duplicate learning routes');
  for (const page of pages) {
    const parent = pages.find(p => p.file === page.parentFile);
    if (page.parentFile && !parent) throw new Error(`Missing parent: ${page.file}`);
    page.parent = parent?.route || '/articles/';
    delete page.parentFile;
  }
  pages.sort((a, b) => {
    const rank = p => p.kind === 'collection' ? -2 : p.kind === 'guide' ? -1 : categories.indexOf(p.file.split('/')[0]);
    return rank(a) - rank(b) || a.file.localeCompare(b.file, 'en');
  });
  return pages;
}

function copyFiles(list, stage) {
  mkdirSync(stage, { recursive: true });
  for (const file of list) {
    const target = path.join(stage, file);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(path.join(root, file), target);
  }
}

function identifySource(pages, contentStage) {
  const git = args => execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024,
  });
  let revision;
  try { revision = git(['rev-parse', 'HEAD']).trim(); } catch { return null; }
  const records = git(['ls-tree', '-r', '-z', revision, '--', '.']).split('\0');
  const blobs = new Map();
  for (const entry of records) {
    const tab = entry.indexOf('\t');
    if (tab >= 0) blobs.set(entry.slice(tab + 1), entry.slice(0, tab).split(' ')[2]);
  }
  const blobId = data => createHash(revision.length === 64 ? 'sha256' : 'sha1')
    .update(`blob ${data.length}\0`).update(data).digest('hex');
  for (const page of pages) {
    const bytes = readFileSync(path.join(contentStage, page.file));
    const original = blobs.get(page.file);
    if (blobId(bytes) !== original && blobId(Buffer.from(bytes.toString('utf8').replaceAll('\r\n', '\n'))) !== original) {
      page.localSnapshot = true;
    }
  }
  return revision;
}

function validate(manifest, stage) {
  const renderLearning = createLearningRenderer(manifest, '/', stage);
  const documents = new Map();
  for (const page of manifest.pages) {
    const html = renderLearning(page);
    if (html.includes('class="katex-error"')) throw new Error(`Invalid formula in ${page.file}`);
    documents.set(page.route, {
      ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1])),
      links: [...html.matchAll(/<a\b[^>]* href="([^"]+)"/g)].map(match => match[1]),
    });
  }
  for (const [route, { links }] of documents) {
    for (const link of links) {
      const url = new URL(link, 'https://local.invalid' + route);
      if (url.origin === 'https://local.invalid' && url.hash && documents.has(url.pathname) &&
          !documents.get(url.pathname).ids.has(decodeURIComponent(url.hash.slice(1)))) {
        throw new Error(`Missing anchor: ${route} -> ${link}`);
      }
    }
  }
}

mkdirSync(work, { recursive: true });
const lock = path.join(work, 'owner');
try { writeFileSync(lock, String(process.pid), { flag: 'wx' }); }
catch (error) {
  if (error.code !== 'EEXIST') throw error;
  throw new Error(`Import already locked by PID ${readFileSync(lock, 'utf8')} (${lock})`);
}
const journal = path.join(work, 'swap.json');
const slots = [destination, media].map((target, i) => ({
  target, stage: path.join(work, `stage-${i}`), backup: path.join(work, `previous-${i}`),
}));
function recover() {
  if (existsSync(journal)) {
    const existed = JSON.parse(readFileSync(journal, 'utf8'));
    for (const [i, slot] of slots.entries()) {
      if (existsSync(slot.backup)) {
        rmSync(slot.target, { recursive: true, force: true });
        renameSync(slot.backup, slot.target);
      } else if (!existed[i]) rmSync(slot.target, { recursive: true, force: true });
    }
    rmSync(journal);
  }
  for (const slot of slots) {
    rmSync(slot.stage, { recursive: true, force: true });
    rmSync(slot.backup, { recursive: true, force: true });
  }
}
try {
  recover();
  const [contentStage, mediaStage] = slots.map(slot => slot.stage);
  copyFiles(files, contentStage);
  copyFiles(images, mediaStage);
  const pages = indexPages(contentStage);
  const revision = identifySource(pages, contentStage);
  const manifest = { source: 'https://github.com/Crystalclear9/AILearning', revision, images, pages };
  validate(manifest, contentStage);
  writeFileSync(path.join(contentStage, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  for (const slot of slots) mkdirSync(path.dirname(slot.target), { recursive: true });
  writeFileSync(journal + '.tmp', JSON.stringify(slots.map(slot => existsSync(slot.target))));
  renameSync(journal + '.tmp', journal);
  for (const { target, stage, backup } of slots) {
    if (existsSync(target)) renameSync(target, backup);
    renameSync(stage, target);
  }
  rmSync(journal);
  console.log(`Imported ${pages.length} pages and ${images.length} assets.`);
} finally {
  try { recover(); } finally { rmSync(lock); }
}
