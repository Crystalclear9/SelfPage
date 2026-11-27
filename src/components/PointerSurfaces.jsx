import { useEffect, useRef } from 'react';

// Pointer-only enhancement: content and hit areas never move with magnetic icons.
export default function PointerSurfaces() {
  const ripple = useRef(null);
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const surfaceSelector = '.project-card, .art-window, .contact-inner, .avatar, .writing-door, .learning-row';
    const controlSelector = '.button, .icon-button, .filter-bar button, .source-link';
    let frame = 0, last = null, surface = null, control = null, pressed = null;
    const ring = ripple.current;
    let pulse = null;
    const clearPulse = () => {
      if (pulse) {
        pulse.onfinish = null;
        pulse.cancel();
        pulse = null;
      }
      if (ring.hidePopover && ring.matches(':popover-open')) ring.hidePopover();
    };
    const reset = el => {
      if (!el) return;
      delete el.dataset.pointerInside;
      for (const key of ['--tilt-x', '--tilt-y', '--magnet-x', '--magnet-y', '--pointer-x', '--pointer-y']) el.style.removeProperty(key);
    };
    const hide = () => {
      cancelAnimationFrame(frame); frame = 0; last = null; pressed = null;
      reset(surface); reset(control); surface = control = null;
      clearPulse();
    };
    const paint = () => {
      frame = 0;
      if (!last) return;
      const target = document.elementFromPoint(last.x, last.y);
      const nextSurface = target?.closest(surfaceSelector);
      const nextControl = target?.closest(controlSelector);
      if (surface !== nextSurface) { reset(surface); surface = nextSurface; }
      if (control !== nextControl) { reset(control); control = nextControl; }
      for (const [el, tilt] of [[surface, true], [control, false]]) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (last.x - rect.left) / rect.width));
        const py = Math.max(0, Math.min(1, (last.y - rect.top) / rect.height));
        el.dataset.pointerInside = 'true';
        el.style.setProperty('--pointer-x', `${px * 100}%`);
        el.style.setProperty('--pointer-y', `${py * 100}%`);
        if (tilt) {
          el.style.setProperty('--tilt-x', `${(0.5 - py) * 5}deg`);
          el.style.setProperty('--tilt-y', `${(px - 0.5) * 5}deg`);
        } else {
          el.style.setProperty('--magnet-x', `${(px - 0.5) * 7}px`);
          el.style.setProperty('--magnet-y', `${(py - 0.5) * 7}px`);
        }
      }
    };
    const move = e => {
      if (reduced.matches || e.pointerType !== 'mouse') return hide();
      if (pressed && Math.hypot(pressed.x - e.clientX, pressed.y - e.clientY) > 6) pressed = null;
      if (!fine.matches) return;
      last = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const scroll = () => { if (last && !frame) frame = requestAnimationFrame(paint); };
    const press = e => {
      if (e.button !== 0 || reduced.matches || e.pointerType !== 'mouse') return;
      pressed = { x: e.clientX, y: e.clientY };
    };
    const release = e => {
      if (e.button !== 0 || e.pointerType !== 'mouse') return;
      const hit = pressed; pressed = null;
      if (!hit || Math.hypot(hit.x - e.clientX, hit.y - e.clientY) > 6) return;
      clearPulse();
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      ring.showPopover?.();
      pulse = ring.animate([{ opacity: .45, transform: 'translate(-50%, -50%) scale(.3)' }, { opacity: 0, transform: 'translate(-50%, -50%) scale(7)' }], { duration: 650, easing: 'ease-out' });
      pulse.onfinish = clearPulse;
    };
    const events = [[document, 'pointermove', move], [document, 'pointerdown', press], [document, 'pointerup', release], [document, 'pointercancel', hide], [document, 'keydown', hide], [document, 'wheel', hide], [document, 'scroll', scroll], [document, 'visibilitychange', hide], [document.documentElement, 'pointerleave', hide], [window, 'blur', hide], [window, 'pagehide', hide], [window, 'resize', hide], [fine, 'change', hide], [reduced, 'change', hide]];
    events.forEach(([node, name, fn]) => node.addEventListener(name, fn, { passive: true }));
    return () => { hide(); events.forEach(([node, name, fn]) => node.removeEventListener(name, fn)); };
  }, []);
  return <span ref={ripple} popover="manual" className="click-ripple" aria-hidden="true" />;
}
