import { useEffect } from 'react';

// Reveal modules once. The sticky project heading is never shifted or hidden.
export default function ChapterMotion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = [...document.querySelectorAll('[data-chapter]:not([data-chapter="projects"])')];
    if (!('IntersectionObserver' in window)) return;
    let observer;
    const reveal = target => {
      target.dataset.chapterVisible = 'true';
      observer?.unobserve(target);
    };
    const reset = () => {
      observer?.disconnect();
      nodes.forEach(el => { delete el.dataset.chapterVisible; });
      if (reduced.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => { if (isIntersecting) reveal(target); });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
      nodes.forEach(el => {
        // Refresh/history at a reading position must not hide already visible content.
        if (el.getBoundingClientRect().top < innerHeight * .92) el.dataset.chapterVisible = 'true';
        else { el.dataset.chapterVisible = 'false'; observer.observe(el); }
      });
    };
    const focus = event => {
      const target = event.target.closest?.('[data-chapter-visible="false"]');
      if (target) reveal(target);
    };
    reset(); reduced.addEventListener('change', reset);
    document.addEventListener('focusin', focus);
    return () => { observer?.disconnect(); document.removeEventListener('focusin', focus); reduced.removeEventListener('change', reset); nodes.forEach(el => { delete el.dataset.chapterVisible; }); };
  }, []);
  return null;
}
