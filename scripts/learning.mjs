import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const directory = path.resolve('content/collections/ailearning');
export const loadLearning = () => JSON.parse(readFileSync(path.join(directory, 'manifest.json'), 'utf8'));

// Recognize only the source's empty anchor tags; arbitrary HTML remains disabled.
function learningMarkdown({ page, pages, base }) {
  return tree => {
    if (tree.children[0]?.type === 'heading' && tree.children[0].depth === 1) tree.children.shift();
    const visit = node => {
      if (node.type === 'html') {
        const match = node.value.trim().match(/^<a\s+id=["']([a-zA-Z0-9_-]+)["']\s*>(?:<\/a>)?$/);
        if (match) {
          node.type = 'paragraph';
          node.children = [];
          node.data = { hName: 'span', hProperties: { id: match[1], className: ['learning-anchor'] } };
          delete node.value;
        }
      }
      if ((node.type === 'link' || node.type === 'definition') && !/^(?:[a-z]+:|#|\/\/)/i.test(node.url)) {
        const [file, fragment] = node.url.split('#');
        const target = path.posix.normalize(path.posix.join(path.posix.dirname(page.file), decodeURIComponent(file)));
        const linked = pages.find(p => p.file === target);
        if (!linked) throw new Error(`Unresolved learning link in ${page.file}: ${node.url}`);
        node.url = base + linked.route.slice(1) + (fragment ? `#${fragment}` : '');
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export function renderLearning(page, base = '/') {
  const { pages } = loadLearning();
  // Some source blocks close $$ on the formula line. Give display delimiters
  // their own lines so they cannot swallow the rest of a chapter.
  let fence = null;
  const markdown = readFileSync(path.join(directory, page.file), 'utf8').split('\n').map(line => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return line;
    }
    return fence ? line : line.replace(/\$\$/g, () => '\n$$\n');
  }).join('\n');
  return renderToStaticMarkup(createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm, remarkMath, [learningMarkdown, { page, pages, base }]],
    rehypePlugins: [[rehypeKatex, { strict: false, trust: false }]],
    skipHtml: true,
  }, markdown));
}

export function learningPlugin() {
  let base = '/';
  return {
    name: 'learning-collection',
    configResolved(config) { base = config.base; },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.endsWith('/__learning')) return next();
        const page = loadLearning().pages.find(p => p.route === url.searchParams.get('route'));
        if (!page) { res.statusCode = 404; return res.end(); }
        try {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(renderLearning(page, base));
        } catch (error) { next(error); }
      });
      server.watcher.add(directory);
      server.watcher.on('change', file => {
        if (!path.resolve(file).startsWith(directory + path.sep)) return;
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
