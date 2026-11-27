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
  const render = page => <React.StrictMode><Site page={page} /></React.StrictMode>;
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
  // A direct chapter link can be laid out before its text and math fonts arrive.
  if (location.hash && path.startsWith('/articles/ailearning/') && performance.getEntriesByType('navigation')[0]?.type === 'navigate') {
    const initialURL = location.href;
    const input = new AbortController();
    const cancel = () => input.abort();
    for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
      window.addEventListener(type, cancel, { once: true, passive: true, signal: input.signal });
    }
    document.fonts.ready.then(() => requestAnimationFrame(() => {
      if (!input.signal.aborted && initialURL === location.href) {
        const target = document.querySelector(':target');
        target?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
      cancel();
    }));
  }
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
      const link = (event.sourceElement || document.activeElement)?.closest('a');
      const status = document.createElement('span');
      const clearPending = () => {
        clearTimeout(timer);
        if (status.parentElement) {
          status.parentElement.removeAttribute('aria-busy');
          status.remove();
        }
      };
      const timer = setTimeout(() => {
        if (link?.href !== to.href || event.signal.aborted || !next.startsWith('/articles/ailearning/')) return;
        link.setAttribute('aria-busy', 'true');
        status.className = 'navigation-pending';
        status.setAttribute('role', 'status');
        status.textContent = '加载中…';
        link.append(status);
      }, 150);
      event.signal.addEventListener('abort', clearPending, { once: true });
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
      } finally {
        clearPending();
        event.signal.removeEventListener('abort', clearPending);
      }
    } });
  };
  window.navigation?.addEventListener('navigate', navigate);
  if (import.meta.hot) import.meta.hot.dispose(() => window.navigation?.removeEventListener('navigate', navigate));
  document.documentElement.classList.add('interactive');
}
start();
