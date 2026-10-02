import { useEffect, useRef } from 'react';

// One unchanged sprite. Rotation and scale are anchored on its fingertip (8, 12).
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
    let x = 0, y = 0, down = null, target = null, frame = 0, timer = 0;
    let transient = '', nativeDrag = false, visible = false, travelTimer = 0;
    const aliases = { auto: 'default', all: 'move', 'all-scroll': 'move', 'n-resize': 'ns-resize', 's-resize': 'ns-resize', 'e-resize': 'ew-resize', 'w-resize': 'ew-resize', 'ne-resize': 'nesw-resize', 'sw-resize': 'nesw-resize', 'nw-resize': 'nwse-resize', 'se-resize': 'nwse-resize' };
    const allowed = new Set(['default', 'pointer', 'text', 'vertical-text', 'wait', 'progress', 'grab', 'grabbing', 'move', 'not-allowed', 'no-drop', 'copy', 'alias', 'zoom-in', 'zoom-out', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'col-resize', 'row-resize', 'crosshair', 'help']);
    const context = () => {
      if (document.readyState !== 'complete' || document.querySelector('[aria-busy="true"]')) return 'wait';
      if (!(target instanceof Element)) return 'default';
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
    const render = () => {
      frame = 0;
      if (!visible) return;
      target = document.elementFromPoint(x, y) || target;
      el.style.transform = `translate3d(${x - 8}px, ${y - 12}px, 0)`;
      const state = nativeDrag ? 'grabbing' : transient || (down ? 'pressed' : context());
      el.dataset.state = state;
      el.dataset.axis = /ns|row/.test(state) ? 'vertical' : /nesw/.test(state) ? 'diagonal-up' : /nwse/.test(state) ? 'diagonal-down' : 'horizontal';
      el.querySelector('.cursor-status').textContent = ({ text: 'I', 'vertical-text': 'I', 'not-allowed': '⊘', 'no-drop': '⊘', copy: '+', alias: '↗', 'zoom-in': '+', 'zoom-out': '−', help: '?', crosshair: '+', move: '↔', 'ew-resize': '↔', 'ns-resize': '↔', 'nesw-resize': '↔', 'nwse-resize': '↔', 'col-resize': '↔', 'row-resize': '↔', grabbing: '↔', scroll: '↕', context: '···' })[state] || '';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const hide = () => {
      visible = false; down = null; nativeDrag = false; transient = '';
      clearTimeout(timer); clearTimeout(travelTimer); cancelAnimationFrame(frame); frame = 0;
      root.classList.remove('animated-cursor-active');
      if (el.matches(':popover-open')) el.hidePopover();
    };
    const position = event => {
      if (!fine.matches || reduced.matches || (event.pointerType && event.pointerType !== 'mouse') || !sprite.complete || !sprite.naturalWidth) return hide();
      const lean = visible ? Math.max(-6, Math.min(6, (event.clientX - x) / 3)) : 0;
      el.style.setProperty('--travel-angle', `${lean}deg`);
      clearTimeout(travelTimer);
      travelTimer = setTimeout(() => el.style.setProperty('--travel-angle', '0deg'), 100);
      x = event.clientX; y = event.clientY; target = event.target;
      if (!visible) { visible = true; el.showPopover(); root.classList.add('animated-cursor-active'); }
      if (down && Math.hypot(x - down.x, y - down.y) > 5) transient = context() === 'text' ? 'text' : 'grabbing';
      schedule();
    };
    const pulse = (state, duration = 420) => {
      clearTimeout(timer); transient = state; schedule();
      timer = setTimeout(() => { transient = ''; schedule(); }, duration);
    };
    const press = event => { position(event); down = { x: event.clientX, y: event.clientY }; pulse(event.button === 2 ? 'context' : event.button === 1 ? 'scroll' : 'pressed', 10000); };
    const release = event => { down = null; pulse(event.button === 2 ? 'context' : event.button === 1 ? 'scroll' : 'click'); };
    const doubleClick = () => pulse('double-click', 650);
    const wheel = () => { if (!down) pulse('scroll', 180); };
    const dragStart = event => {
      nativeDrag = true;
      // Keep the browser's drag payload while avoiding a second image ghost.
      const ghost = document.createElement('canvas'); ghost.width = ghost.height = 1;
      event.dataTransfer?.setDragImage(ghost, 0, 0);
      schedule();
    };
    const cancel = () => { if (nativeDrag) { down = null; schedule(); } else hide(); };
    const dragEnd = () => { nativeDrag = false; down = null; transient = ''; schedule(); };
    const leave = () => { if (!nativeDrag) hide(); };
    const dragMove = event => { nativeDrag = true; position(event); };
    const dragLeave = event => { if (event.clientX <= 0 || event.clientY <= 0 || event.clientX >= innerWidth || event.clientY >= innerHeight) hide(); };
    const visibility = () => { if (document.hidden) hide(); };
    const observer = new MutationObserver(records => {
      if (records.some(r => r.attributeName === 'open') && visible) {
        el.hidePopover(); el.showPopover();
      }
      schedule();
    });
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open', 'aria-busy', 'data-cursor', 'disabled', 'aria-disabled'] });
    const events = [[document, 'pointermove', position], [document, 'pointerdown', press], [document, 'pointerup', release], [document, 'pointercancel', cancel], [document, 'dblclick', doubleClick], [document, 'wheel', wheel], [document, 'dragstart', dragStart], [document, 'dragover', dragMove], [document, 'dragleave', dragLeave], [document, 'dragend', dragEnd], [document, 'drop', dragEnd], [document, 'keydown', hide], [document, 'visibilitychange', visibility], [root, 'pointerleave', leave], [window, 'blur', hide], [window, 'pagehide', hide], [window, 'load', schedule], [fine, 'change', hide], [reduced, 'change', hide]];
    events.forEach(([node, name, fn]) => node.addEventListener(name, fn, { passive: true }));
    return () => { hide(); observer.disconnect(); events.forEach(([node, name, fn]) => node.removeEventListener(name, fn)); };
  }, []);
  return <div ref={ref} popover="manual" className="animated-cursor" aria-hidden="true">
    <img className="cursor-sprite" src={`${import.meta.env.BASE_URL}images/megumi-cursor.svg`} alt="" width="64" height="68" draggable="false" />
    <span className="cursor-ring" /><span className="cursor-status" />
  </div>;
}
