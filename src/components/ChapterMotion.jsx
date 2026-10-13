import { useEffect } from 'react';

// Repeated section entry cues; native scroll timelines handle continuous parallax.
export default function ChapterMotion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = [...document.querySelectorAll('[data-chapter]')];
    if (!('IntersectionObserver' in window)) return;
    let observer;
    const reset = () => {
      observer?.disconnect();
      nodes.forEach(el => { delete el.dataset.chapterVisible; });
      if (reduced.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          target.dataset.chapterVisible = isIntersecting ? 'true' : 'false';
        });
      }, { threshold: .12, rootMargin: '-70px 0px -5% 0px' });
      nodes.forEach(el => observer.observe(el));
    };
    reset(); reduced.addEventListener('change', reset);
    return () => { observer?.disconnect(); reduced.removeEventListener('change', reset); nodes.forEach(el => { delete el.dataset.chapterVisible; }); };
  }, []);
  return null;
}
