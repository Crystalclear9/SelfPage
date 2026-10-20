import React from 'react';
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
import { installNavigationMotion } from './lib/navigation';
const disposeNavigation = installNavigationMotion();
if (import.meta.hot) import.meta.hot.dispose(disposeNavigation);
import { currentPath } from './data/routes';

const container = document.getElementById('root');
async function start() {
  const path = currentPath(window.location.pathname);
  // Production chapters are already rendered. Reuse only this page's sanitized
  // HTML during hydration; never ship the complete collection in the JS bundle.
  let learningHtml = document.getElementById('learning-content')?.innerHTML || '';
  if (import.meta.env.DEV && path.startsWith('/articles/ailearning/')) {
    const response = await fetch(`${import.meta.env.BASE_URL}__learning?route=${encodeURIComponent(path)}`);
    if (response.ok) learningHtml = await response.text();
  }
  const app = <React.StrictMode><App path={path} learningHtml={learningHtml} /></React.StrictMode>;
  if (container.hasChildNodes()) hydrateRoot(container, app);
  else createRoot(container).render(app);
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
  document.documentElement.classList.add('interactive');
}
start();
