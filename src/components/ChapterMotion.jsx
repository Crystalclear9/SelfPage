import { useEffect } from 'react';

// Reveal on every entry; re-arm only after leaving the viewport completely.
export default function ChapterMotion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = [...document.querySelectorAll('[data-chapter]:not([data-chapter="projects"])')];
    if (!('IntersectionObserver' in window)) return;
    let observer;
    const reveal = target => {
      target.dataset.chapterVisible = 'true';
    };
    const prepare = (target, rect) => {
      if (target.contains(document.activeElement)) return;
      target.dataset.chapterEntry = rect.bottom <= 70 ? 'top' : 'bottom';
      target.dataset.chapterVisible = 'false';
    };
    const reset = () => {
      observer?.disconnect();
      nodes.forEach(el => { delete el.dataset.chapterVisible; delete el.dataset.chapterEntry; });
      if (reduced.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting, intersectionRatio, boundingClientRect }) => {
          if (isIntersecting && intersectionRatio >= .12) reveal(target);
          else if (!isIntersecting) prepare(target, boundingClientRect);
        });
      }, { threshold: [0, .12], rootMargin: '-70px 0px -8% 0px' });
      nodes.forEach(el => {
        // Refresh/history at a reading position must not hide already visible content.
        const rect = el.getBoundingClientRect();
        if (rect.top < innerHeight * .92 && rect.bottom > 70) reveal(el);
        else prepare(el, rect);
        observer.observe(el);
      });
    };
    const focus = event => {
      const target = event.target.closest?.('[data-chapter-visible="false"]');
      if (target) reveal(target);
    };
    reset(); reduced.addEventListener('change', reset);
    document.addEventListener('focusin', focus);
    return () => { observer?.disconnect(); document.removeEventListener('focusin', focus); reduced.removeEventListener('change', reset); nodes.forEach(el => { delete el.dataset.chapterVisible; delete el.dataset.chapterEntry; }); };
  }, []);
  return null;
}
