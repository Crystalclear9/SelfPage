import { useEffect } from 'react';

export default function useAnswerMotion(route, html) {
  useEffect(() => {
    const root = document.getElementById('learning-content');
    if (!root) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const cleanups = [...root.querySelectorAll('.exercise-answer')].map(details => {
      const summary = details.querySelector('summary');
      const body = details.querySelector('.exercise-solution');
      let animation, fade, desired = details.open;
      const click = event => {
        if (reduced.matches) return;
        event.preventDefault();
        const from = details.getBoundingClientRect().height;
        desired = animation ? !desired : !details.open;
        if (animation) { animation.onfinish = null; animation.cancel(); }
        fade?.cancel();
        details.style.height = '';
        details.open = true;
        const to = desired ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 2;
        animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
        if (desired) fade = body.animate([{ opacity: .25, transform: 'translateY(-5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'ease-out' });
        animation.onfinish = () => { details.open = desired; animation = null; };
      };
      summary.addEventListener('click', click);
      return () => { summary.removeEventListener('click', click); if (animation) animation.onfinish = null; animation?.cancel(); fade?.cancel(); };
    });
    const revealHash = () => {
      let node;
      try { node = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
      for (let parent = node?.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
    };
    revealHash(); window.addEventListener('hashchange', revealHash);
    return () => { cleanups.forEach(fn => fn()); window.removeEventListener('hashchange', revealHash); };
  }, [route, html]);
}
