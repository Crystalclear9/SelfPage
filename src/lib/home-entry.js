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
  window.addEventListener('hashchange', cleanAddress);
  if (navigation?.type === 'back_forward') return;
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
