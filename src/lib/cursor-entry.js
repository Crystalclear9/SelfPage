(() => {
  const base = document.currentScript.dataset.base;
  const key = 'cursor-outfit:' + base;
  const root = document.documentElement;
  const valid = value => value === 'short' || value === 'long';
  const chooseOutfit = () => {
    const outfit = Math.random() < 0.5 ? 'short' : 'long';
    root.dataset.cursorOutfit = outfit;
    try { sessionStorage.setItem(key, outfit); } catch { /* Storage is optional. */ }
    return outfit;
  };
  window.chooseCursorOutfit = chooseOutfit;
  try {
    let outfit = sessionStorage.getItem(key);
    if (!valid(outfit) || performance.getEntriesByType('navigation')[0]?.type === 'reload') {
      outfit = chooseOutfit();
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
    // Keep viewport coordinates in memory. Write once when leaving, including
    // for history traversal; ordinary pointer movement never touches storage.
    const pointKey = 'cursor-departure:' + base;
    let point = null;
    const forget = () => { point = null; };
    const remember = event => {
      if (event.pointerType !== 'mouse') return forget();
      point = { clientX: event.clientX, clientY: event.clientY };
    };
    const restore = () => {
      forget();
      try {
        const saved = JSON.parse(sessionStorage.getItem(pointKey));
        sessionStorage.removeItem(pointKey);
        if (!saved || Date.now() - saved.time > 30000) return;
        const from = window.navigation?.activation?.from?.url || document.referrer;
        const reloading = performance.getEntriesByType('navigation')[0]?.type === 'reload';
        if (saved.url !== from && !(reloading && saved.url === location.href)) return;
        if (saved.width !== innerWidth || saved.height !== innerHeight) return;
        point = saved.point;
      } catch { /* Storage is optional. */ }
    };
    restore();
    window.readCursorPoint = () => point;
    document.addEventListener('pointermove', remember, { capture: true, passive: true });
    document.addEventListener('pointerdown', remember, { capture: true, passive: true });
    // Keyboard navigation dismisses the character. Reload shortcuts need the
    // last mouse position so the next document can paint it without movement.
    document.addEventListener('keydown', event => {
      if (event.key === 'Tab' || event.key === 'Escape') forget();
    }, true);
    root.addEventListener('pointerleave', forget);
    window.addEventListener('blur', forget);
    let savedOnSwap = false;
    const save = () => {
      try {
        if (point) sessionStorage.setItem(pointKey, JSON.stringify({
          url: location.href, time: Date.now(), width: innerWidth, height: innerHeight,
          point,
        }));
        else sessionStorage.removeItem(pointKey);
      } catch { /* Storage is optional. */ }
    };
    window.addEventListener('pageswap', () => { save(); savedOnSwap = true; });
    window.addEventListener('pagehide', () => {
      if (!savedOnSwap) save();
      savedOnSwap = false;
      forget();
    });
    window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = base + 'images/' + (short ? 'megumi-cursor-short.svg' : 'megumi-cursor.svg');
    document.head.append(preload);
  }
})();
