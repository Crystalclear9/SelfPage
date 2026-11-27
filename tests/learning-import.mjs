import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const temp = mkdtempSync(path.join(tmpdir(), 'selfpage-import-'));
const source = path.join(temp, 'source'), site = path.join(temp, 'site');
const script = fileURLToPath(new URL('../scripts/import-learning.mjs', import.meta.url));
const content = path.join(site, 'content/collections/ailearning');
const media = path.join(site, 'public/files/ailearning');
const run = () => spawnSync(process.execPath, [script, source], { cwd: site, encoding: 'utf8' });
const manifest = () => JSON.parse(readFileSync(path.join(content, 'manifest.json'), 'utf8'));
try {
  mkdirSync(site);
  mkdirSync(path.join(source, 'Mathematics'), { recursive: true });
  const write = (name, value) => writeFileSync(path.join(source, name), value);
  write('README.md', '# Index');
  write('Mathematics/README.md', '# Math');
  write('Mathematics/01-example.md', '# Example');
  write('old.txt', 'Old license');
  const git = args => execFileSync('git', ['-C', source, ...args]);
  git(['init', '--quiet']);
  git(['add', '.']);
  git(['-c', 'user.name=Test', '-c', 'user.email=test@example.org', 'commit', '--quiet', '-m', 'Fixture']);
  assert.equal(run().status, 0);
  assert.ok(manifest().pages.every(page => !page.localSnapshot));
  rmSync(path.join(source, 'old.txt'));
  rmSync(path.join(source, 'Mathematics/01-example.md'));
  write('Mathematics/02-example.md', '# New');
  write('README.md', '# Edited\n\n[missing](missing.md)');
  const failed = run();
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /Unresolved learning link/);
  assert.ok(existsSync(path.join(media, 'old.txt')));
  assert.ok(existsSync(path.join(content, 'Mathematics/01-example.md')));
  write('README.md', '# Edited');
  assert.equal(run().status, 0);
  assert.equal(existsSync(path.join(media, 'old.txt')), false);
  assert.equal(existsSync(path.join(content, 'Mathematics/01-example.md')), false);
  assert.deepEqual(manifest().pages.filter(p => p.localSnapshot).map(p => p.file).sort(),
    ['Mathematics/02-example.md', 'README.md']);
  console.log('Import preserves the last good snapshot, removes retired files and identifies local articles.');
} finally { rmSync(temp, { recursive: true, force: true }); }
