import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

export default function ScrollToTop({ target = '#home' }) {
  const link = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footerLink = document.querySelector('.site-footer .back-top');
    let lastY = scrollY, direction = 0, frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, Math.min(scrollY, document.documentElement.scrollHeight - innerHeight));
      const delta = y - lastY;
      if (Math.abs(delta) >= 4) { direction = Math.sign(delta); lastY = y; }
      const threshold = Math.min(80, Math.max(0, document.documentElement.scrollHeight - innerHeight) * .15);
      const show = y > threshold && direction < 0;
      // Upward scrolling prioritizes the floating control, even near the footer.
      if (footerLink) footerLink.hidden = show;
      if (!show && document.activeElement === link.current) {
        // Hand off focus without moving the viewport or leaving focus on a hidden link.
        document.querySelector('.wordmark')?.focus({ preventScroll: true });
      }
      setVisible(show);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    document.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      if (footerLink) footerLink.hidden = false;
      document.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <a ref={link} className="floating-top" href={target} onClick={event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }} hidden={!visible} aria-label="回到顶部">
    <ArrowUp size={20} aria-hidden="true" /><span>回到顶部</span>
  </a>;
}
