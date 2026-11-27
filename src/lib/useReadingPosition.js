import { useEffect, useState } from 'react';

// Read positions at scroll time so fonts, figures and disclosure panels can reflow.
export default function useReadingPosition(nodes) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!nodes.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
        setActive(nodes.at(-1).id);
        return;
      }
      const anchorTop = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(nodes[0]).scrollMarginTop) || 0;
      const line = Math.max(anchorTop + margin + 1, innerHeight * .22);
      let low = 0, high = nodes.length;
      while (low < high) {
        const mid = (low + high) >>> 1;
        if (nodes[mid].getBoundingClientRect().top <= line) low = mid + 1;
        else high = mid;
      }
      setActive(nodes[Math.max(0, low - 1)].id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.querySelector('main'));
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [nodes]);
  return active;
}
