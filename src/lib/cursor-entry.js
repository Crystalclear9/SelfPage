(() => {
  const base = document.currentScript.dataset.base;
  const key = 'cursor-outfit:' + base;
  const root = document.documentElement;
  const valid = value => value === 'short' || value === 'long';
  try {
    let outfit = sessionStorage.getItem(key);
    if (!valid(outfit) || performance.getEntriesByType('navigation')[0]?.type === 'reload') {
      outfit = Math.random() < 0.5 ? 'short' : 'long';
      sessionStorage.setItem(key, outfit);
    }
    root.dataset.cursorOutfit = outfit;
    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      const current = sessionStorage.getItem(key);
      if (valid(current)) root.dataset.cursorOutfit = current;
    });
  } catch { root.dataset.cursorOutfit = 'long'; }
  const short = root.dataset.cursorOutfit === 'short';
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = base + 'images/' + (short ? 'megumi-cursor-short.svg' : 'megumi-cursor.svg');
    document.head.append(preload);
  }
})();
