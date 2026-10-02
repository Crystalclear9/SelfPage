import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export function loadWriting(root = process.cwd()) {
  const directory = path.resolve(root, 'content');
  const entries = JSON.parse(readFileSync(path.join(directory, 'index.json'), 'utf8'));
  if (!Array.isArray(entries)) throw new Error('content/index.json must be an array');
  const seen = new Set();
  return entries.filter(entry => entry.published === true).map(entry => {
    const { type, slug, title, date, summary, body, externalUrl, pdf, authors, venue, project } = entry;
    if (!['articles', 'papers'].includes(type) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) throw new Error('Invalid content type or slug');
    const route = `/${type}/${slug}/`;
    if (seen.has(route)) throw new Error(`Duplicate route: ${route}`);
    seen.add(route);
    if (![title, summary, date].every(v => typeof v === 'string' && v.trim())) throw new Error(`Missing metadata: ${route}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`Invalid date: ${route}`);
    if (externalUrl && !/^https:\/\//.test(externalUrl)) throw new Error(`Expected HTTPS URL: ${route}`);
    if (pdf && !/^https:\/\//.test(pdf)) {
      if (!/^files\/[a-zA-Z0-9_./-]+\.pdf$/.test(pdf) || pdf.split('/').includes('..') || !existsSync(path.join(root, 'public', pdf))) throw new Error(`Missing or invalid PDF: ${route}`);
    }
    let markdown = '';
    if (body) {
      const file = path.resolve(directory, body);
      if (!file.startsWith(directory + path.sep) || !file.endsWith('.md')) throw new Error(`Invalid Markdown path: ${route}`);
      markdown = readFileSync(file, 'utf8');
    }
    if (!markdown.trim() && !pdf && !externalUrl) throw new Error(`Published entry has no content: ${route}`);
    if (authors && (!Array.isArray(authors) || authors.some(a => typeof a !== 'string'))) throw new Error(`Invalid authors: ${route}`);
    return { type, slug, title, date, summary, markdown, externalUrl, pdf, authors, venue, project, route };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function writingPlugin() {
  return {
    name: 'local-writing',
    resolveId(id) { if (id === 'virtual:writing') return '\0virtual:writing'; },
    load(id) { if (id === '\0virtual:writing') return `export default ${JSON.stringify(loadWriting())}`; },
    configureServer(server) {
      server.watcher.add(path.resolve('content'));
      server.watcher.on('all', (_, file) => {
        if (!path.resolve(file).startsWith(path.resolve('content') + path.sep)) return;
        const mod = server.moduleGraph.getModuleById('\0virtual:writing');
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
