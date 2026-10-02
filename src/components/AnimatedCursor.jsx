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
    let holdTimer = 0, chargeTimer = 0, lastMove = 0;
    const sparks = [...el.querySelectorAll('.cursor-spark')];
    const clearHold = () => { clearTimeout(holdTimer); clearTimeout(chargeTimer); };
    const burst = (radius = 27) => {
      if (!visible || reduced.matches) return;
      sparks.forEach((spark, i) => {
        spark.getAnimations().forEach(animation => animation.cancel());
        const angle = i * Math.PI / 4;
        spark.animate([
          { opacity: .85, transform: 'translate(0, 0) rotate(45deg) scale(.6)' },
          { opacity: 0, transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) rotate(135deg) scale(.1)` },
        ], { duration: 480 + i * 18, easing: 'cubic-bezier(.16,1,.3,1)' });
      });
    };
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
      clearTimeout(timer); clearTimeout(travelTimer); clearHold(); cancelAnimationFrame(frame); frame = 0;
      sparks.forEach(spark => spark.getAnimations().forEach(animation => animation.cancel()));
      root.classList.remove('animated-cursor-active');
      if (el.matches(':popover-open')) el.hidePopover();
    };
    const position = event => {
      if (!fine.matches || reduced.matches || (event.pointerType && event.pointerType !== 'mouse') || !sprite.complete || !sprite.naturalWidth) return hide();
      const now = performance.now();
      const speed = visible ? Math.hypot(event.clientX - x, event.clientY - y) / Math.max(8, now - lastMove) : 0;
      lastMove = now;
      const lean = visible ? Math.max(-13, Math.min(13, (event.clientX - x) / 2)) : 0;
      el.dataset.speed = speed > 1.4 ? 'fast' : 'normal';
      el.style.setProperty('--travel-angle', `${lean}deg`);
      clearTimeout(travelTimer);
      travelTimer = setTimeout(() => { el.style.setProperty('--travel-angle', '0deg'); el.dataset.speed = 'idle'; }, 140);
      x = event.clientX; y = event.clientY; target = event.target;
      if (!visible) { visible = true; el.showPopover(); root.classList.add('animated-cursor-active'); }
      if (down && Math.hypot(x - down.x, y - down.y) > 5) { clearHold(); transient = context() === 'text' ? 'text' : 'grabbing'; }
      schedule();
    };
    const pulse = (state, duration = 420) => {
      clearTimeout(timer); transient = state; schedule();
      timer = setTimeout(() => { transient = ''; schedule(); }, duration);
    };
    const press = event => {
      position(event); clearHold();
      if (!visible) return;
      down = { x: event.clientX, y: event.clientY };
      pulse(event.button === 2 ? 'context' : event.button === 1 ? 'scroll' : 'pressed', 10000);
      if (event.button === 0 && !['text', 'not-allowed', 'wait'].includes(context())) {
        holdTimer = setTimeout(() => { if (down) pulse('charging', 10000); }, 420);
        chargeTimer = setTimeout(() => { if (down) pulse('charged', 10000); }, 1050);
      }
    };
    const release = event => {
      const charged = transient === 'charged';
      clearHold(); down = null;
      if (event.button === 0) burst(charged ? 48 : 22);
      pulse(event.button === 2 ? 'context' : event.button === 1 ? 'scroll' : charged ? 'charged-release' : 'click', charged ? 650 : 420);
    };
    const doubleClick = () => { burst(36); pulse('double-click', 650); };
    const wheel = event => {
      el.style.setProperty('--scroll-angle', event.deltaY < 0 ? '-10deg' : '10deg');
      if (!down) pulse('scroll', 240);
    };
    const copy = () => { burst(25); pulse('copy', 650); };
    const dragStart = event => {
      clearHold();
      nativeDrag = true;
      // Keep the browser's drag payload while avoiding a second image ghost.
      const ghost = document.createElement('canvas'); ghost.width = ghost.height = 1;
      event.dataTransfer?.setDragImage(ghost, 0, 0);
      schedule();
    };
    const cancel = () => { if (nativeDrag) { down = null; schedule(); } else hide(); };
    const dragEnd = () => { clearHold(); nativeDrag = false; down = null; pulse('settle', 450); };
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
    const events = [[document, 'pointermove', position], [document, 'pointerdown', press], [document, 'pointerup', release], [document, 'pointercancel', cancel], [document, 'dblclick', doubleClick], [document, 'wheel', wheel], [document, 'copy', copy], [document, 'dragstart', dragStart], [document, 'dragover', dragMove], [document, 'dragleave', dragLeave], [document, 'dragend', dragEnd], [document, 'drop', dragEnd], [document, 'keydown', hide], [document, 'visibilitychange', visibility], [root, 'pointerleave', leave], [window, 'blur', hide], [window, 'pagehide', hide], [window, 'load', schedule], [fine, 'change', hide], [reduced, 'change', hide]];
    events.forEach(([node, name, fn]) => node.addEventListener(name, fn, { passive: true }));
    return () => { hide(); observer.disconnect(); events.forEach(([node, name, fn]) => node.removeEventListener(name, fn)); };
  }, []);
  return <div ref={ref} popover="manual" className="animated-cursor" aria-hidden="true">
    <img className="cursor-sprite" src={`${import.meta.env.BASE_URL}images/megumi-cursor.svg`} alt="" width="64" height="68" draggable="false" />
    <span className="cursor-ring" /><span className="cursor-status" />
    <span className="cursor-orbit" /><span className="cursor-wake" />
    {Array.from({ length: 8 }, (_, i) => <i key={i} className="cursor-spark" />)}
  </div>;
}
