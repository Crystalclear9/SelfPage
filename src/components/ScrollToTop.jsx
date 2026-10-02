import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

export default function ScrollToTop() {
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
      const rect = footerLink?.getBoundingClientRect();
      const footerVisible = rect && rect.top < innerHeight && rect.bottom > 0;
      const show = y > 240 && direction < 0 && !footerVisible;
      if (!show && document.activeElement === link.current) {
        // Hand off focus without moving the viewport or leaving focus on a hidden link.
        (footerVisible ? footerLink : document.querySelector('.wordmark'))?.focus({ preventScroll: true });
      }
      setVisible(show);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(schedule);
    if (footerLink) observer.observe(footerLink);
    document.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      document.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return <a ref={link} className="floating-top" href="#home" hidden={!visible} aria-label="回到顶部">
    <ArrowUp size={20} aria-hidden="true" /><span>回到顶部</span>
  </a>;
}
