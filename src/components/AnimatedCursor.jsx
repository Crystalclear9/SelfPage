import { useEffect, useRef } from 'react';
// Both outfits pivot at the pointing fingertip (8, 12).
// A manual popover keeps the pointer above native dialogs without intercepting input.
export default function AnimatedCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    const sprite = el.querySelector('img');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (!el.showPopover) return;
    let decoded = false, disposed = false, pauseTimer = 0;
    const loadSprite = () => {
      if (!fine.matches || reduced.matches) return;
      const filename = root.dataset.cursorOutfit === 'short' ? 'megumi-cursor-short.svg' : 'megumi-cursor.svg';
      const source = import.meta.env.BASE_URL + 'images/' + filename;
      if (decoded && sprite.getAttribute('src') === source) return;
      decoded = false;
      if (sprite.getAttribute('src') !== source) sprite.src = source;
      sprite.decode().then(() => {
        if (disposed || sprite.getAttribute('src') !== source) return;
        decoded = true;
        schedule();
      }).catch(() => { /* The native pointer remains available. */ });
    };
    let x = 0, y = 0, down = null, target = null, frame = 0, timer = 0;
    let transient = '', nativeDrag = false, visible = false;
    let strokeX = null, previousDirection = 0, reversals = 0, lastReverse = 0, lastPlay = -Infinity;
    let lastLike = -Infinity;
    const status = el.querySelector('.cursor-status');
    const symbols = { copied: '✓', filtered: '✓', wait: '…', progress: '…', read: '≡', download: '↓', text: 'I', 'vertical-text': 'I', 'not-allowed': '⊘', 'no-drop': '⊘', copy: '+', alias: '↗', 'zoom-in': '+', 'zoom-out': '−', help: '?', crosshair: '+', move: '↔', 'ew-resize': '↔', 'ns-resize': '↔', 'nesw-resize': '↔', 'nwse-resize': '↔', 'col-resize': '↔', 'row-resize': '↔', grabbing: '↔', scroll: '↕', context: '···' };
    const aliases = { auto: 'default', all: 'move', 'all-scroll': 'move', 'n-resize': 'ns-resize', 's-resize': 'ns-resize', 'e-resize': 'ew-resize', 'w-resize': 'ew-resize', 'ne-resize': 'nesw-resize', 'sw-resize': 'nesw-resize', 'nw-resize': 'nwse-resize', 'se-resize': 'nwse-resize' };
    const allowed = new Set(['read', 'download', 'default', 'pointer', 'text', 'vertical-text', 'wait', 'progress', 'grab', 'grabbing', 'move', 'not-allowed', 'no-drop', 'copy', 'alias', 'zoom-in', 'zoom-out', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize', 'crosshair', 'help']);
    const context = () => {
      if (!(target instanceof Element)) return 'default';
      if (target.closest('[aria-busy="true"]')) return 'wait';
      if (target.closest(':disabled, [aria-disabled="true"]')) return 'not-allowed';
      let explicit = target.closest('[data-cursor]')?.dataset.cursor;
      explicit = aliases[explicit] || explicit;
      if (allowed.has(explicit)) return explicit;
      let inline = target.closest('[style]')?.style.cursor;
      inline = aliases[inline] || inline;
      if (allowed.has(inline)) return inline;
      if (target.closest('input:not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]')) return 'text';
      if (target.closest('a, button, [role="button"], summary, label, select')) return 'pointer';
      if (target.closest('[draggable="true"], img')) return 'grab';
      if (target.closest('p, h1, h2, h3, li')) return 'text';
      return 'default';
    };
    let scrollCue = '', scrollTimer = 0;
    const clearScroll = () => {
      clearTimeout(scrollTimer);
      scrollCue = '';
    };
    const wheel = event => {
      if (down || nativeDrag || event.ctrlKey || event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (!visible) position(event);
      if (!visible) return;
      clearTimeout(pauseTimer);
      reversals = 0;
      if (transient === 'playful') { clearTimeout(timer); transient = ''; }
      scrollCue = event.deltaY > 0 ? 'scroll-down' : 'scroll-up';
      schedule();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => { scrollCue = ''; schedule(); }, 260);
    };
    const render = () => {
      frame = 0;
      if (!visible) return;
      target = document.elementFromPoint(x, y) || target;
      el.style.transform = `translate3d(${x - 8}px, ${y - 12}px, 0)`;
      const mode = down?.mode || context();
      const state = nativeDrag ? 'grabbing' : transient || (down ? 'pressed' : scrollCue || mode);
      if (el.dataset.state !== state) el.dataset.state = state;
      root.classList.toggle('cursor-posing', decoded && (state === 'scroll-up' || state === 'scroll-down' || state === 'grabbing'));
      if (el.dataset.context !== mode) el.dataset.context = mode;
      const axis = /ns|row/.test(state) ? 'vertical' : /nesw/.test(state) ? 'diagonal-up' : /nwse/.test(state) ? 'diagonal-down' : 'horizontal';
      if (el.dataset.axis !== axis) el.dataset.axis = axis;
      const symbol = state === 'scroll-up' ? '↑' : state === 'scroll-down' ? '↓' : symbols[state] || '';
      if (status.textContent !== symbol) status.textContent = symbol;
    };
    const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(render); };
    const hide = () => {
      clearScroll();
      clearTimeout(pauseTimer);
      visible = false; down = null; nativeDrag = false; transient = '';
      strokeX = null; reversals = 0; previousDirection = 0;
      clearTimeout(timer); cancelAnimationFrame(frame); frame = 0;
      root.classList.remove('animated-cursor-active', 'cursor-posing', 'cursor-stationary');
      if (el.matches(':popover-open')) el.hidePopover();
    };
    const position = (event, restored = false) => {
      if (!fine.matches || reduced.matches || (event.pointerType && event.pointerType !== 'mouse')) return hide();
      root.classList.toggle('cursor-stationary', restored);
      const now = performance.now();
      x = event.clientX; y = event.clientY; target = event.target;
      if (!visible) {
        visible = true;
        render();
        el.showPopover();
        root.classList.add('animated-cursor-active');
      }
      const semantic = context();
      if (transient && !down && (transient === 'playful' ? semantic !== 'default' : ['text', 'read', 'vertical-text'].includes(semantic))) { clearTimeout(timer); transient = ''; }
      const canTease = !down && !nativeDrag && !transient && semantic === 'default';
      clearTimeout(pauseTimer);
      if (!canTease) {
        strokeX = null; previousDirection = 0; reversals = 0;
      }
      const dx = x - (strokeX ?? x);
      if (canTease && strokeX === null) strokeX = x;
      if (canTease && Math.abs(dx) >= 24) {
        strokeX = x;
        const direction = Math.sign(dx);
        if (previousDirection && previousDirection !== direction) {
          reversals = now - lastReverse < 450 ? reversals + 1 : 1;
          lastReverse = now;

        }
        previousDirection = direction;
      }
      if (canTease && reversals >= 2 && now - lastPlay > 12000) {
        pauseTimer = setTimeout(() => {
          target = document.elementFromPoint(x, y);
          if (!visible || down || nativeDrag || transient || context() !== 'default') return;
          pulse('playful', 1150);
          lastPlay = performance.now();
          reversals = 0;
        }, 240);
      }
      if (down && Math.hypot(x - down.x, y - down.y) > 5) transient = ['text', 'vertical-text', 'read'].includes(down.mode) ? down.mode : 'grabbing';
      schedule();
    };
    const pulse = (state, duration = 420) => {
      clearTimeout(timer); transient = state; schedule();
      timer = setTimeout(() => { transient = ''; schedule(); }, duration);
    };
    const press = event => {
      clearScroll();
      position(event);
      clearTimeout(pauseTimer);
      if (!visible) return;
      clearTimeout(timer);
      transient = event.button === 2 ? 'context' : '';
      down = { x, y, mode: context() };
      schedule();
    };
    const release = () => {
      down = null;
      transient = '';
      schedule();
    };
    const feedback = event => {
      if (!visible || reduced.matches) return;
      const state = event.detail;
      if (!['like', 'unlike', 'greeting', 'copied', 'filtered'].includes(state)) return;
      const now = performance.now();
      const reconsidered = state === 'unlike' && now - lastLike < 4000;
      if (state === 'like') lastLike = now;
      if (state === 'unlike') lastLike = -Infinity;
      const reaction = reconsidered ? 'reconsidered' : state;
      pulse(reaction, 900);
    };
    const dragStart = event => {
      nativeDrag = true;
      // Keep the browser's drag payload while avoiding a second image ghost.
      const ghost = document.createElement('canvas'); ghost.width = ghost.height = 1;
      event.dataTransfer?.setDragImage(ghost, 0, 0);
      schedule();
    };
    const cancel = () => { if (nativeDrag) { down = null; schedule(); } else hide(); };
    const dragEnd = () => { nativeDrag = false; release(); };
    const leave = () => { if (!nativeDrag) hide(); };
    const dragMove = event => { nativeDrag = true; position(event); };
    const dragLeave = event => { if (event.clientX <= 0 || event.clientY <= 0 || event.clientX >= innerWidth || event.clientY >= innerHeight) hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    const observer = new MutationObserver(records => {
      if (records.some(r => r.target instanceof HTMLDialogElement && r.target.open && r.attributeName === 'open') && visible) {
        el.hidePopover(); el.showPopover();
      }
      schedule();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open', 'aria-busy', 'data-cursor', 'disabled', 'aria-disabled'] });
    const resumePoint = () => {
      const point = window.readCursorPoint?.();
      if (point && !document.hidden) position(point, true);
    };
    const restore = event => { if (event.persisted) { loadSprite(); resumePoint(); } };
    const reveal = event => { event.viewTransition?.finished.then(schedule, schedule); };
    const preventWordSelection = event => {
      if (event.button !== 0 || event.detail < 2 || !(event.target instanceof Element)) return;
      if (event.target.closest('input, textarea, select, button, a, label, summary, [role="button"]') || event.target.isContentEditable) return;
      event.preventDefault();
    };
    const preference = () => { hide(); loadSprite(); };
    const events = [[document, 'pointermove', position], [document, 'pointerdown', press], [document, 'pointerup', release], [document, 'pointercancel', cancel], [document, 'scroll', schedule], [document, 'dragstart', dragStart], [document, 'dragover', dragMove], [document, 'dragleave', dragLeave], [document, 'dragend', dragEnd], [document, 'drop', dragEnd], [document, 'keydown', hide], [document, 'visibilitychange', visibility], [root, 'pointerleave', leave], [window, 'blur', hide], [window, 'pageswap', hide], [window, 'pagehide', hide], [window, 'pageshow', restore], [window, 'load', schedule], [fine, 'change', preference], [reduced, 'change', preference]];
    loadSprite();
    resumePoint();
    document.fonts.ready.then(() => { if (!disposed) schedule(); });
    // Hydration may follow pagereveal. Re-hit-test when its snapshot is gone.
    document.activeViewTransition?.finished.then(schedule, schedule);
    window.addEventListener('pagereveal', reveal);
    document.addEventListener('wheel', wheel, { passive: true });
    document.addEventListener('mousedown', preventWordSelection);
    events.forEach(([node, name, fn]) => node.addEventListener(name, fn, { passive: true }));
    document.addEventListener('cursor-feedback', feedback);
    return () => {
      disposed = true; sprite.removeAttribute('src'); hide(); observer.disconnect();
      document.removeEventListener('wheel', wheel);
      window.removeEventListener('pagereveal', reveal);
      document.removeEventListener('mousedown', preventWordSelection);
      document.removeEventListener('cursor-feedback', feedback);
      events.forEach(([node, name, fn]) => node.removeEventListener(name, fn));
    };
  }, []);
  return <div ref={ref} popover="manual" className="animated-cursor" aria-hidden="true">
    <img className="cursor-sprite" alt="" width="64" height="68" draggable="false" />
    <svg className="cursor-expression" viewBox="0 0 320 340" width="64" height="68" aria-hidden="true">
      <g className="cursor-lids" fill="#f8d8c7">
        <g className="cursor-lid">
          <path d="M111 91 Q111 79 120 79 Q126 79 129 87 Q125 86 121 86 Q115 85 111 91Z" />
          <path d="M112 90 Q119 83 128 87" fill="none" stroke="#513b39" strokeWidth="2.3" strokeLinecap="round" />
        </g>
        <g className="cursor-lid">
          <path d="M149 102 Q150 90 158 92 Q166 93 170 103 Q159 98 149 102Z" />
          <path d="M150 102 Q158 98 169 103" fill="none" stroke="#513b39" strokeWidth="2.3" strokeLinecap="round" />
        </g>
      </g>
      <g className="cursor-blush" fill="#dd827f">
        <ellipse cx="111" cy="106" rx="5" ry="2" transform="rotate(17 111 106)" />
        <ellipse cx="159" cy="119" rx="6" ry="2" transform="rotate(17 159 119)" />
      </g>
    </svg>
    <span className="cursor-status" />
  </div>;
}
