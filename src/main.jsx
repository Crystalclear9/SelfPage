import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import AnimatedCursor from './components/AnimatedCursor';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import 'katex/dist/katex.min.css';
import './styles/base.css';
import './styles/motion.css';
import './styles/pointer.css';
import './styles/content.css';
import './styles/navigation.css';
import './styles/avatar.css';
import './styles/chapters.css';
import { navigationIntent, installNavigationMotion } from './lib/navigation';
const disposeNavigation = installNavigationMotion();
if (import.meta.hot) import.meta.hot.dispose(disposeNavigation);
import { currentPath, routes, writing, learningPublished } from './data/routes';

const container = document.getElementById('root');
function Site({ page }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return <><App key={page.path} {...page} />{mounted && <AnimatedCursor />}</>;
}

async function readPage(path, initial, signal) {
  let learningHtml = initial ? document.getElementById('learning-content')?.innerHTML || '' : '';
  if (path.startsWith('/articles/ailearning/') && (import.meta.env.DEV || !initial)) {
    const url = import.meta.env.DEV
      ? `${import.meta.env.BASE_URL}__learning?route=${encodeURIComponent(path)}`
      : `${import.meta.env.BASE_URL}${path.slice(1)}`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Chapter unavailable');
    const text = await response.text();
    if (import.meta.env.DEV) learningHtml = text;
    else {
      const content = new DOMParser().parseFromString(text, 'text/html').getElementById('learning-content');
      if (!content) throw new Error('Chapter content missing');
      learningHtml = content.innerHTML;
    }
  }
  const detail = writing.some(entry => entry.route === path) && !(learningPublished && path === '/articles/ailearning/');
  return { path, learningHtml, WritingDetail: detail ? (await import('./pages/WritingDetail')).default : undefined };
}

async function start() {
  let path = currentPath(location.pathname);
  let refreshGeneration = 0;
  const render = page => <React.StrictMode><Site key={refreshGeneration} page={page} /></React.StrictMode>;
  const initial = render(await readPage(path, true));
  const prerendered = container.hasChildNodes();
  const root = prerendered ? hydrateRoot(container, initial) : createRoot(container);
  if (!prerendered) root.render(initial);
  // Anchor targets in source README explanations can be inside collapsed notes.
  const revealAnchor = () => {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const details = target?.closest('details');
    if (details && !details.open) { details.open = true; target.scrollIntoView(); }
  };
  window.addEventListener('hashchange', revealAnchor);
  requestAnimationFrame(revealAnchor);
  if (import.meta.hot) import.meta.hot.dispose(() => window.removeEventListener('hashchange', revealAnchor));
  // Keep the document and its cursor layer alive across internal page changes.
  // Downloads, external URLs, reloads and new tabs retain browser navigation.
  const navigate = event => {
    const to = new URL(event.destination.url);
    if (!event.canIntercept || event.hashChange || event.navigationType === 'reload' ||
        event.downloadRequest != null || event.formData || to.origin !== location.origin ||
        !to.pathname.startsWith(import.meta.env.BASE_URL)) return;
    const next = currentPath(to.pathname);
    const route = routes.find(item => item.path === next);
    if (next === path || !route) return;
    event.intercept({ scroll: 'manual', handler: async () => {
      try {
        const page = await readPage(next, false, event.signal);
        if (event.signal.aborted) return;
        const intent = navigationIntent(path, next);
        document.documentElement.dataset.transitionKind = intent.kind;
        document.documentElement.style.setProperty('--page-direction', String(intent.direction));
        flushSync(() => root.render(render(page)));
        path = next;
        document.querySelector('meta[name="description"]').content = route.description;
        event.scroll();
        revealAnchor();
        if (next === '/' && to.hash && event.navigationType !== 'traverse') {
          history.replaceState(history.state, '', to.pathname + to.search);
        }
        window.dispatchEvent(new Event('site-page-rendered'));
        const main = document.querySelector('main');
        if (main && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          main.classList.add('page-arriving');
          main.addEventListener('animationend', () => {
            main.classList.remove('page-arriving');
            window.dispatchEvent(new Event('site-page-rendered'));
          }, { once: true });
        }
      } catch {
        if (!event.signal.aborted) location.reload();
      }
    } });
  };
  // Edge can leave its system arrow at a stationary pointer after a document
  // replacement. Revalidate a plain F5 in place when the running bundle matches.
  let refreshing;
  const refreshAtPointer = async event => {
    if (event.key !== 'F5' || event.defaultPrevented || event.ctrlKey || event.shiftKey ||
        event.altKey || event.metaKey || !matchMedia('(hover: hover) and (pointer: fine)').matches || import.meta.env.DEV) return;
    event.preventDefault();
    if (event.repeat) return;
    refreshing?.abort();
    const request = new AbortController();
    refreshing = request;
    const address = location.href;
    const current = () => !request.signal.aborted && location.href === address;
    try {
      const response = await fetch(address, { cache: 'reload', signal: request.signal });
      if (!response.ok || response.redirected) throw new Error('Full reload required');
      const next = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (!current()) return;
      const entry = doc => [
        doc.querySelector('script[type="module"][src]')?.getAttribute('src'),
        doc.querySelector('link[rel="stylesheet"]')?.getAttribute('href'),
      ];
      const bundled = entry(document);
      const incoming = entry(next);
      if (bundled.some((url, i) => !url || url !== incoming[i]) ||
          document.querySelector('[data-native-cursor]')?.textContent !== next.querySelector('[data-native-cursor]')?.textContent) {
        throw new Error('New site assets');
      }
      const updated = await readPage(path, true);
      if (path.startsWith('/articles/ailearning/')) {
        const chapter = next.getElementById('learning-content');
        if (!chapter) throw new Error('Missing chapter');
        updated.learningHtml = chapter.innerHTML;
      }
      if (!current()) return;
      const y = scrollY;
      window.chooseCursorOutfit();
      refreshGeneration++;
      flushSync(() => root.render(render(updated)));
      scrollTo({ top: y, behavior: 'instant' });
      revealAnchor();
    } catch {
      if (current()) location.reload();
    } finally {
      if (refreshing === request) refreshing = undefined;
    }
  };
  document.addEventListener('keydown', refreshAtPointer);
  window.navigation?.addEventListener('navigate', () => refreshing?.abort());
  window.navigation?.addEventListener('navigate', navigate);
  if (import.meta.hot) import.meta.hot.dispose(() => window.navigation?.removeEventListener('navigate', navigate));
  document.documentElement.classList.add('interactive');
}
start();
