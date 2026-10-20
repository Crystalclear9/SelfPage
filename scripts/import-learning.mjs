import { readdirSync, readFileSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const source = process.argv[2];
if (!source) throw new Error('Usage: npm run import:learning -- <AILearning directory>');
const root = path.resolve(source);
const destination = path.resolve('content/collections/ailearning');
const categories = ['Mathematics', 'Programming', 'ComputerScience', 'MachineLearning', 'DeepLearning', 'AI-Domains', 'ReinforcementLearning', 'AdvancedStudies'];
const guides = { '学习路线.md': 'learning-path', '内容范围与掌握标准.md': 'scope', '运行环境.md': 'environment', '术语与符号.md': 'glossary' };
const slug = value => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const files = [];
function scan(directory, relative = '') {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const file = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) scan(path.join(directory, entry.name), file);
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(file);
  }
}
scan(root);
const pages = files.sort().map(file => {
  const parts = file.split('/');
  if (parts.length > 1 && !categories.includes(parts[0])) throw new Error(`Unknown category: ${file}`);
  const markdown = readFileSync(path.join(root, file), 'utf8');
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
  const route = `/articles/ailearning/${segments.length ? segments.join('/') + '/' : ''}`;
  const parentFile = isIndex ? (directory.length ? [...directory.slice(0, -1), 'README.md'].join('/') : null)
    : [...directory, 'README.md'].join('/');
  return { file, route, title: file === 'README.md' ? 'AILearning' : title, parentFile,
    kind: file === 'README.md' ? 'collection' : isIndex ? (parts.length === 2 ? 'category' : 'topic') : parts.length === 1 ? 'guide' : 'chapter' };
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
// Only Markdown is copied. The sibling checkout, its configuration and Git data stay separate.
for (const page of pages) {
  const target = path.join(destination, page.file);
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(path.join(root, page.file), target);
}
let revision = null;
try { revision = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* Local folders need not be repositories. */ }
const manifest = { source: 'https://github.com/Crystalclear9/AILearning', revision, pages };
writeFileSync(path.join(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Imported ${pages.length} Markdown pages: ${pages.filter(p => p.kind === 'chapter').length} chapters. Review the diff before publishing.`);
