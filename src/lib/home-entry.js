// Runs in the document head, before native fragment scrolling and hydration.
(() => {
  const base = document.currentScript.dataset.base;
  if (location.pathname !== base && location.pathname !== `${base}index.html`) return;
  const navigation = performance.getEntriesByType('navigation')[0];
  let internal = false;
  try {
    const from = new URL(document.referrer);
    internal = from.origin === location.origin && from.pathname.startsWith(base);
  } catch { /* Direct visits and bookmarks have no referrer. */ }
  const sectionReturn = navigation?.type === 'navigate' && internal && location.hash;
  const cleanAddress = () => {
    if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  };
  let clickedSection = null;
  let traversing = false;
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.target && link.target !== '_self' || link.hasAttribute('download')) return;
    const to = new URL(link.href, location.href);
    if (to.origin === location.origin && to.pathname === location.pathname && to.search === location.search && to.hash) {
      clickedSection = to.href;
      // A cancelled link must not authorize a later browser-UI navigation.
      setTimeout(() => { clickedSection = null; }, 0);
    }
  }, true);
  window.navigation?.addEventListener('navigate', event => {
    traversing = event.navigationType === 'traverse';
    if (!traversing && event.hashChange) {
      const internalClick = clickedSection === event.destination.url;
      clickedSection = null;
      if (!internalClick) requestAnimationFrame(() => {
        cleanAddress();
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
  });
  window.addEventListener('hashchange', () => {
    if (!traversing) cleanAddress();
  });
  if (navigation?.type === 'back_forward' || navigation?.type === 'reload') return;
  if (!sectionReturn) {
    cleanAddress();
    const restoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    window.addEventListener('pageshow', () => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        history.scrollRestoration = restoration;
      });
    }, { once: true });
  } else {
    // Let the browser resolve an intentional link from a detail page first.
    window.addEventListener('load', () => requestAnimationFrame(cleanAddress), { once: true });
  }
})();
