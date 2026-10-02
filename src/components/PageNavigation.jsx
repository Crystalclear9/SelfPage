import { ArrowLeft, ArrowUpLeft } from '@phosphor-icons/react';
import { href } from '../data/routes';

export function HomeLink({ compact = false }) {
  return <a className={`home-link${compact ? ' home-link-compact' : ''}`} href={href('/')}>
    <span className="home-link-icon" aria-hidden="true"><ArrowLeft size={18} /></span>
    <span>返回个人主页</span>
  </a>;
}

export default function PageNavigation({ section, sectionHref }) {
  return <nav className="page-navigation" aria-label="页面返回导航">
    <HomeLink />
    {section && <a className="section-return" href={href(sectionHref)}><ArrowUpLeft size={16} aria-hidden="true" />{section}</a>}
  </nav>;
}
