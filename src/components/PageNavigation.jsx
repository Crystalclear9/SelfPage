import { ArrowLeft, ArrowUpLeft } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { href } from '../data/routes';

export function HomeLink({ compact = false }) {
  return <a className={`home-link${compact ? ' home-link-compact' : ''}`} href={href('/')}>
    <span className="home-link-icon" aria-hidden="true"><ArrowLeft size={18} /></span>
    <span>返回个人主页</span>
  </a>;
}

export default function PageNavigation({ section, sectionHref }) {
  const original = useRef(null);
  const floating = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY, direction = 0, frame = 0;
    const update = () => {
      frame = 0;
      // Clamp elastic overscroll; small touchpad fluctuations do not toggle the bar.
      const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - innerHeight));
      const delta = y - lastY;
      if (Math.abs(delta) >= 4) { direction = Math.sign(delta); lastY = y; }
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 68;
      floating.current?.style.setProperty('--return-top', `${headerBottom + 10}px`);
      const above = original.current.getBoundingClientRect().bottom < headerBottom;
      // Keep a focused return link available until keyboard focus leaves it.
      const focused = floating.current.contains(document.activeElement);
      setVisible(focused || (above && direction < 0));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    document.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    const nav = floating.current;
    nav.addEventListener('focusout', schedule);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      nav.removeEventListener('focusout', schedule);
    };
  }, []);

  const links = compact => <>
    <HomeLink compact={compact} />
    {section && <a className="section-return" href={href(sectionHref)}><ArrowUpLeft size={16} aria-hidden="true" />{section}</a>}
  </>;

  return <>
    <nav ref={original} className="page-navigation" aria-label="页面返回导航">{links(false)}</nav>
    <nav ref={floating} className={`scroll-return${visible ? ' is-visible' : ''}`}
      aria-label="随滚动返回导航" aria-hidden={!visible} inert={!visible}>
      {links(true)}
    </nav>
  </>;
}
