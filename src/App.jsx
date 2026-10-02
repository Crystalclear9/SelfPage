import { useEffect, useState } from 'react';
import PetalTrail from './components/PetalTrail';
import Modal from './components/Modal';
import AnimatedCursor from './components/AnimatedCursor';
import PointerSurfaces from './components/PointerSurfaces';
import ContentPage, { WritingSection } from './pages/ContentPage';
import { href } from './data/routes';
import { ArrowUpRight, ArrowRight, ArrowUp, Flower, Moon, Sun, Sparkle, GithubLogo, EnvelopeSimple, Code, DeviceMobile, GameController, Stack, Timer, Plus, Heart, X, List } from '@phosphor-icons/react';
import { profile, projects, extraLinks } from './data/site';

const projectIcons = { phone: DeviceMobile, game: GameController, layers: Stack, clock: Timer };
const categories = ['全部', ...new Set(projects.map(project => project.category))];

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
const read = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing can disable storage. */ } };

export default function App({ path = '/' }) {
  const [theme, setTheme] = useState('light');
  const [hydrated, setHydrated] = useState(false);
  const [trail, setTrail] = useState(true);
  const [liked, setLiked] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('home');
  const [filter, setFilter] = useState('全部');
  const [project, setProject] = useState(null);
  const [toast, setToast] = useState('');
  const links = [['home', '首页'], ['about', '关于我'], ['projects', '我的项目']];
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'light');
    setTrail(read('spring-trail', 'true') === 'true');
    setLiked(read('spring-liked', 'false') === 'true');
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) { document.documentElement.dataset.theme = theme; save('spring-theme', theme); } }, [theme, hydrated]);
  useEffect(() => { if (hydrated) save('spring-trail', String(trail)); }, [trail, hydrated]);
  useEffect(() => { if (hydrated) save('spring-liked', String(liked)); }, [liked, hydrated]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2500); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    const reveals = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); } }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
    return () => { observer.disconnect(); reveals.disconnect(); };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = e => { if (e.key === 'Escape') { setMenu(false); document.querySelector('.mobile-toggle')?.focus(); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [menu]);
  const toggleTrail = () => { setTrail(!trail); setToast(trail ? '樱花拖尾已关闭' : '樱花拖尾已开启（鼠标设备生效）'); };
  return <>
    <a href="#main" className="skip-link">跳到主要内容</a>
    <PetalTrail enabled={trail} />
    <AnimatedCursor />
    <PointerSurfaces />
    <div className="scroll-progress" aria-hidden="true" />
    <header className="site-header">
      <div className="nav-shell">
        <a href={href('/#home')} className="wordmark"><Code weight="light" size={26} /><span>{profile.name}</span></a>
        <nav className={menu ? 'main-nav open' : 'main-nav'} id="navigation" aria-label="主导航">
          {links.map(([id, label]) => <a key={id} href={path === '/' ? `#${id}` : href(`/#${id}`)} className={path === '/' && active === id ? 'active' : ''} aria-current={path === '/' && active === id ? 'location' : undefined} onClick={() => setMenu(false)}>{label}</a>)}
        <a href={href('/articles/')} aria-current={path.startsWith('/articles/') ? 'page' : undefined} data-cursor="read">文章</a><a href={href('/papers/')} aria-current={path.startsWith('/papers/') ? 'page' : undefined} data-cursor="read">论文</a></nav>
        <div className="nav-actions">
          <button className="icon-button trail-toggle" aria-label="樱花拖尾" title="樱花拖尾" aria-pressed={trail} onClick={toggleTrail}><Sparkle size={21} weight={trail ? 'duotone' : 'regular'} /></button>
          <button className="icon-button" aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={21} /> : <Sun size={21} />}</button>
          <button className="icon-button mobile-toggle" aria-label={menu ? '关闭导航' : '打开导航'} aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={23} /> : <List size={23} />}</button>
        </div>
      </div>
    </header>
    <main id="main">
      {path === '/' ? <>
      <section className="hero section-shell" id="home">
        <div className="hero-stage">
          <div className="hero-copy">
            <p className="hero-greeting">你好，我是</p>
            <h1>{profile.name}<span>.</span></h1>
            <p className="hero-lead">{profile.subtitle}</p>
            <p className="hero-description">关注模型在应用中的使用，<br />也研究推理与调度背后的系统问题。</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">浏览项目 <ArrowRight size={17} /></a>
              <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a>
            </div>
          </div>
          <figure className="hero-art">
            <div className="art-window"><img className="hero-image" src={asset('keyvisual-1.jpg')} alt="官方插画中的加藤惠，站在盛开的樱花之间" fetchPriority="high" width="1200" height="1232" /></div>

          </figure>
        </div>
      </section>

      <section className="about section-shell reveal" id="about">
        <div className="profile-card">
          <div className="avatar"><img src={asset('keyvisual-3.jpg')} alt="加藤惠主题头像" width="1200" height="1232" loading="lazy" /></div>
          <div><h2>{profile.name}</h2><a href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={15} /> GitHub <ArrowUpRight size={13} /></a></div>
        </div>
        <div className="about-copy"><h2>关于我</h2><p>{profile.intro}</p><p>{profile.about}</p></div>
      </section>

      <section className="projects-section section-shell" id="projects">
        <div className="projects-intro">
          <div className="section-heading"><h2>项目与实践</h2><p>从具体问题出发，边做边理解。<br />这里是一些应用与系统方面的尝试。</p></div>
          <div className="filter-bar" role="group" aria-label="筛选项目">{categories.map(value => <button key={value} aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div>
        </div>
        <div className="project-grid" aria-live="polite">
          {projects.filter(p => filter === '全部' || p.category === filter).map(p => {
            const Icon = projectIcons[p.icon] || Code;
            return <div className="project-reveal" key={p.id}><article className={`project-card ${p.category === '应用' ? 'application-card' : 'research-card'}`} key={p.id}>
              <div className="project-top"><Icon size={31} weight="light" aria-hidden="true" /><span>{p.category}</span></div>
              <h3><a href={href(`/projects/${p.id}/`)} data-cursor="read">{p.title}</a></h3>
              <p className="project-subtitle">{p.subtitle}</p>
              <p className="project-description">{p.description}</p>
              <ul className="project-tags">{p.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              <a className="project-page-link text-link" data-cursor="read" href={href(`/projects/${p.id}/`)}>了解项目 <ArrowRight size={15}/></a>
              <div className="project-actions">
                <a className="source-link" href={p.source} target="_blank" rel="noreferrer" aria-label={`${p.title} 查看源码`}>查看源码 <ArrowUpRight size={16} /></a>
                <button className="detail-button" aria-label={`项目介绍：${p.title}`} onClick={() => setProject(p)}><span>项目介绍</span><Plus size={18} /></button>
              </div>
            </article></div>;
          })}
        </div>
        <a className="all-repositories text-link" href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">GitHub 上的全部仓库 <ArrowUpRight size={16} /></a>
        {extraLinks.length > 0 && <div className="extra-links"><h3>其他页面</h3><div>{extraLinks.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><h4>{link.title}<ArrowUpRight size={18} /></h4><p>{link.description}</p></a>)}</div></div>}
      </section>

      <WritingSection />
      <section className="contact-section section-shell reveal" id="contact">
        <div className="contact-inner"><div><h2>在 GitHub 上</h2><p>最近的更新和完整实现，可以在 GitHub 找到。</p></div><div className="contact-actions"><a className="button primary" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={19} /> {profile.name} <ArrowUpRight size={16} /></a>{profile.email && <a className="text-link" href={`mailto:${profile.email}`}><EnvelopeSimple size={18} /> 邮件联系</a>}<button className={`like-button ${liked ? 'liked' : ''}`} aria-pressed={liked} onClick={() => { if (!liked) document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'like' })); setLiked(!liked); setToast(liked ? '已取消喜欢' : '谢谢你的喜欢。'); }}><Heart size={16} weight={liked ? 'fill' : 'regular'} />{liked ? '已经留下喜欢' : '留下一份喜欢'}</button></div></div>
      </section>
      </> : <ContentPage path={path}/>}
    </main>
    <footer className="site-footer section-shell"><div><a className="footer-brand" href={href('/#home')}><Code size={21} weight="light" />{profile.name}</a><span>© {new Date().getFullYear()} {profile.name}.</span></div><div className="footer-links"><a href="https://saenai-movie.com/" target="_blank" rel="noreferrer">角色与官方视觉来源 <ArrowUpRight size={12} /></a><a href={path === '/' ? '#home' : '#main'} className="back-top" aria-label="回到顶部"><ArrowUp size={20} /></a></div></footer>
    <div className="toast" role="status" aria-live="polite">{toast && <span><Flower size={17} />{toast}</span>}</div>

    {project && <Modal title={project.title} onClose={() => setProject(null)} className="project-modal">
      <div className="modal-body"><span className="modal-meta">{project.category} / 公开源码</span><h2>{project.title}</h2><p>{project.description}</p>
        <div className="project-detail-list">{project.details.map(detail => <div key={detail.title}><h3>{detail.title}</h3><p>{detail.text}</p></div>)}</div>
        <p className="project-note">{project.note}</p>
        <a className="button primary" href={project.source} target="_blank" rel="noreferrer"><GithubLogo size={18} /> 在 GitHub 查看源码 <ArrowUpRight size={16} /></a>
      </div>
    </Modal>}

  </>;
}
