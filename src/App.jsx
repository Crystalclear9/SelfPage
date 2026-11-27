import { useEffect, useState } from 'react';
import PetalTrail from './components/PetalTrail';
import AnimatedCursor from './components/AnimatedCursor';
import PointerSurfaces from './components/PointerSurfaces';
import ScrollToTop from './components/ScrollToTop';
import ChapterMotion from './components/ChapterMotion';
import { HomeLink } from './components/PageNavigation';
import ContentPage from './pages/ContentPage';
import HomePage from './pages/HomePage';
import { href } from './data/routes';
import { ArrowUpRight, ArrowUp, Flower, Moon, Sun, Sparkle, Code, X, List } from '@phosphor-icons/react';
import { readPreference, savePreference } from './lib/preferences';
import { profile } from './data/site';

export default function App({ path = '/', learningHtml = '', WritingDetail }) {
  const [theme, setTheme] = useState('light');
  const [hydrated, setHydrated] = useState(false);
  const [trail, setTrail] = useState(true);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('home');
  const [toast, setToast] = useState('');
  const links = [['home', '首页'], ['about', '关于我'], ['projects', '我的项目'], ['writing', '文章与论文']];
  const activeSection = path === '/' ? active : /^\/(articles|papers)\//.test(path) ? 'writing' : path.startsWith('/projects/') ? 'projects' : null;
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'light');
    setTrail(readPreference('spring-trail', 'true') === 'true');
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) { document.documentElement.dataset.theme = theme; savePreference('spring-theme', theme); } }, [theme, hydrated]);
  useEffect(() => { if (hydrated) savePreference('spring-trail', String(trail)); }, [trail, hydrated]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2500); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (path !== '/' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    const reveals = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); } }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
    return () => { observer.disconnect(); reveals.disconnect(); };
  }, [path]);
  useEffect(() => {
    if (!menu) return;
    const close = e => { if (e.key === 'Escape') { setMenu(false); document.querySelector('.mobile-toggle')?.focus(); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [menu]);
  const toggleTrail = () => { setTrail(!trail); setToast(trail ? '樱花拖尾已关闭' : '樱花拖尾已开启（鼠标设备生效）'); };
  return <>
    <a href="#main" className="skip-link">跳到主要内容</a>
    <PetalTrail enabled={trail} />
    {hydrated && <AnimatedCursor />}
    <PointerSurfaces />
    <ScrollToTop target={path === '/' ? '#home' : '#main'} />
    {path === '/' && <ChapterMotion />}
    <div className="scroll-progress" aria-hidden="true" />
    <header className="site-header">
      <div className="nav-shell">
        <a href={href('/#home')} className="wordmark"><Code weight="light" size={26} /><span>{profile.name}</span></a>
        <nav className={menu ? 'main-nav open' : 'main-nav'} id="navigation" aria-label="主导航">
          {links.map(([id, label]) => <a key={id} href={path === '/' ? `#${id}` : href(`/#${id}`)} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined} onClick={() => setMenu(false)}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button trail-toggle" aria-label="樱花拖尾" title="樱花拖尾" aria-pressed={trail} onClick={toggleTrail}><Sparkle size={21} weight={trail ? 'duotone' : 'regular'} /></button>
          <button className="icon-button" aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={21} /> : <Sun size={21} />}</button>
          <button className="icon-button mobile-toggle" aria-label={menu ? '关闭导航' : '打开导航'} aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={23} /> : <List size={23} />}</button>
        </div>
      </div>
    </header>
    <main id="main">
      {path === '/' ? <HomePage hydrated={hydrated} onToast={setToast} /> : <ContentPage path={path} learningHtml={learningHtml} WritingDetail={WritingDetail}/>}
    </main>
    <footer className="site-footer section-shell"><div><a className="footer-brand" href={href('/#home')}><Code size={21} weight="light" />{profile.name}</a><span>© {new Date().getFullYear()} {profile.name}.</span></div><div className="footer-links">{path !== '/' && <HomeLink compact />}<a className="visual-credit" href="https://saenai-movie.com/" target="_blank" rel="noreferrer">角色与官方视觉来源 <ArrowUpRight size={12} /></a><a href={path === '/' ? '#home' : '#main'} className="back-top" aria-label="回到顶部"><ArrowUp size={20} /></a></div></footer>
    <div className="toast" role="status" aria-live="polite">{toast && <span><Flower size={17} />{toast}</span>}</div>
  </>;
}
