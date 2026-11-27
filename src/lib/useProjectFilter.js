import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

// Keep the list start in view when a shorter category replaces a long list.
export default function useProjectFilter() {
  const [filter, setFilter] = useState('全部');
  const gridRef = useRef(null);
  const animation = useRef(null);
  const request = useRef(0);
  useEffect(() => () => { request.current++; animation.current?.cancel(); }, []);
  const changeFilter = async value => {
    const id = ++request.current;
    animation.current?.cancel();
    const grid = gridRef.current;
    if (!grid || value === filter) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      animation.current = grid.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
      await animation.current.finished.catch(() => {});
    }
    if (id !== request.current) return;
    // Move before shrinking the document so browser clamping cannot land at its end.
    const top = grid.getBoundingClientRect().top;
    if (top < 100) window.scrollTo({ top: scrollY + top - 100, behavior: 'instant' });
    flushSync(() => setFilter(value));
    animation.current?.cancel();
    document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'filtered' }));
    if (!reduced) animation.current = grid.animate([
      { opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' },
    ], { duration: 240, easing: 'ease-out' });
  };
  return { filter, gridRef, changeFilter };
}
