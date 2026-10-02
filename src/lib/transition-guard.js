// Inlined in <head>, before the application bundle or the first rendered frame.
// Keep rendering independent of React, asset loading and transition completion.
(() => {
  let active = null;
  function watch(event) {
    const transition = event.viewTransition;
    if (!transition) return;
    if (active) { clearTimeout(active.timer); active = null; }
    const record = { transition, timer: 0, phase: event.type };
    active = record;
    const clear = () => {
      clearTimeout(record.timer);
      if (active === record) active = null;
    };
    const recover = () => {
      if (active !== record) return;
      // Cancels only the visual snapshot; the destination document stays loaded.
      try { transition.skipTransition(); } finally { clear(); }
    };
    record.timer = setTimeout(recover, 1800);
    transition.ready.catch(recover);
    transition.finished.then(clear, recover);
  }
  window.addEventListener('pageswap', watch);
  window.addEventListener('pagereveal', watch);
  window.addEventListener('pageshow', event => {
    if (event.persisted && active?.phase === 'pageswap') {
      clearTimeout(active.timer);
      try { active.transition.skipTransition(); } finally { active = null; }
    }
  });
})();
