// Direction follows content order and hierarchy, including browser Back/Forward.
import { projects } from '../data/site';
import { currentPath } from '../data/routes';

export function navigationIntent(from, to) {
  if (from === to) return { kind: 'section', direction: 1 };
  const projectIndex = route => projects.findIndex(p => route === `/projects/${p.id}/`);
  const first = projectIndex(from), second = projectIndex(to);
  if (first >= 0 && second >= 0) return { kind: 'project', direction: second > first ? 1 : -1 };
  if (to === '/' || (from.startsWith(to) && from !== to)) return { kind: 'return', direction: -1 };
  return { kind: 'open', direction: 1 };
}

function applyIntent(fromUrl, toUrl) {
  const from = new URL(fromUrl, location.href), to = new URL(toUrl, location.href);
  if (from.origin !== location.origin || to.origin !== location.origin) return;
  const intent = navigationIntent(currentPath(from.pathname), currentPath(to.pathname));
  document.documentElement.dataset.transitionKind = intent.kind;
  document.documentElement.style.setProperty('--page-direction', String(intent.direction));
}

export function installNavigationMotion() {
  const swap = event => {
    if (event.viewTransition && event.activation?.entry?.url) applyIntent(location.href, event.activation.entry.url);
  };
  const reveal = event => {
    const from = window.navigation?.activation?.from?.url;
    if (event.viewTransition && from) applyIntent(from, location.href);
  };
  window.addEventListener('pageswap', swap);
  window.addEventListener('pagereveal', reveal);
  return () => { window.removeEventListener('pageswap', swap); window.removeEventListener('pagereveal', reveal); };
}
