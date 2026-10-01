import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowUp, Flower, Moon, Sun, Sparkle, GithubLogo, EnvelopeSimple, Code, DeviceMobile, GameController, Stack, Timer, Plus, Heart, X, List, CaretLeft, CaretRight, ImageSquare } from '@phosphor-icons/react';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { profile, projects, gallery, extraLinks } from './content';
import './styles.css';

const projectIcons = { phone: DeviceMobile, game: GameController, layers: Stack, clock: Timer };
const categories = ['全部', ...new Set(projects.map(project => project.category))];

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
const read = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing can disable storage. */ } };

function PetalTrail({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(pointer: fine)');
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let particles = [], frame = 0, previous = 0, lastSpawn = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; particles = []; ctx.clearRect(0, 0, innerWidth, innerHeight); };
    const draw = (now) => {
      const dt = Math.min((now - previous) / 16.67 || 1, 3); previous = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.x += p.vx * dt; p.y += p.vy * dt; p.angle += .035 * dt; p.life -= .018 * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(p.life, 0) * .48;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.bezierCurveTo(p.size, -p.size, p.size, p.size * .5, 0, p.size); ctx.bezierCurveTo(-p.size, p.size * .5, -p.size, -p.size, 0, -p.size); ctx.fill(); ctx.restore();
      }
      frame = particles.length ? requestAnimationFrame(draw) : 0;
    };
    const move = (e) => {
      if (!enabled || media.matches || !fine.matches || e.pointerType === 'touch' || document.hidden) return;
      const now = performance.now(); if (now - lastSpawn < 40) return; lastSpawn = now;
      particles.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 1.6, vy: .6 + Math.random(), life: 1, angle: Math.random() * 6, size: 2 + Math.random() * 2, color: ['#dd879f', '#eaa6ba', '#d77292'][Math.floor(Math.random() * 3)] });
      if (particles.length > 30) particles.shift();
      if (!frame) { previous = now; frame = requestAnimationFrame(draw); }
    };
    const visibility = () => { if (document.hidden) stop(); };
    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', visibility); media.addEventListener('change', stop);
    return () => { stop(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', stop); };
  }, [enabled]);
  return <canvas ref={ref} className="petal-canvas" aria-hidden="true" />;
}

function Modal({ children, onClose, title, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current, focused = document.activeElement;
    dialog.showModal();
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = old; focused?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === ref.current) { const r = ref.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <button className="icon-button close-modal" aria-label="关闭弹窗" onClick={onClose}><X size={23} /></button>{children}
  </dialog>;
}

function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  const [trail, setTrail] = useState(() => read('spring-trail', 'true') === 'true');
  const [liked, setLiked] = useState(() => read('spring-liked', 'false') === 'true');
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('home');
  const [filter, setFilter] = useState('全部');
  const [project, setProject] = useState(null);
  const [picture, setPicture] = useState(null);
  const [toast, setToast] = useState('');
  const links = [['home', '首页'], ['about', '关于我'], ['projects', '我的项目'], ['moments', '喜欢的瞬间']];
  useEffect(() => { document.documentElement.dataset.theme = theme; save('spring-theme', theme); }, [theme]);
  useEffect(() => { save('spring-trail', String(trail)); }, [trail]);
  useEffect(() => { save('spring-liked', String(liked)); }, [liked]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2500); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    const reveals = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); } }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => reveals.observe(el));
    return () => { observer.disconnect(); reveals.disconnect(); };
  }, []);
  useEffect(() => {
    if (picture === null) return;
    const key = e => { if (e.key === 'ArrowRight') setPicture(i => (i + 1) % gallery.length); if (e.key === 'ArrowLeft') setPicture(i => (i + gallery.length - 1) % gallery.length); };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [picture]);
  useEffect(() => {
    if (!menu) return;
    const close = e => { if (e.key === 'Escape') { setMenu(false); document.querySelector('.mobile-toggle')?.focus(); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [menu]);
  const toggleTrail = () => { setTrail(!trail); setToast(trail ? '樱花拖尾已关闭' : '樱花拖尾已开启（鼠标设备生效）'); };
  return <>
    <a href="#main" className="skip-link">跳到主要内容</a>
    <PetalTrail enabled={trail} />
    <header className="site-header">
      <div className="nav-shell">
        <a href="#home" className="wordmark"><Flower weight="duotone" size={30} /><span>{profile.siteName}<small>HARU LETTER</small></span></a>
        <nav className={menu ? 'main-nav open' : 'main-nav'} id="navigation" aria-label="主导航">
          {links.map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => setMenu(false)}>{label}</a>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-button trail-toggle" aria-label="樱花拖尾" title="樱花拖尾" aria-pressed={trail} onClick={toggleTrail}><Sparkle size={21} weight={trail ? 'duotone' : 'regular'} /></button>
          <button className="icon-button" aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={21} /> : <Sun size={21} />}</button>
          <button className="icon-button mobile-toggle" aria-label={menu ? '关闭导航' : '打开导航'} aria-controls="navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={23} /> : <List size={23} />}</button>
        </div>
      </div>
    </header>
    <main id="main">
      <section className="hero section-shell" id="home">
        <div className="hero-copy">
          <p className="hero-greeting">你好，我是</p>
          <h1>{profile.name}<span>.</span></h1>
          <p className="hero-lead">{profile.subtitle}</p>
          <p className="hero-description">这里有我的项目，<br />也有一些代码以外的东西。</p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">浏览项目 <ArrowRight size={17} /></a>
            <a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <figure className="hero-art">
          <div className="art-window"><img className="hero-image" src={asset('keyvisual-1.jpg')} alt="官方插画中的加藤惠，站在盛开的樱花之间" fetchPriority="high" width="1200" height="1232" /></div>
          <figcaption className="art-caption">加藤 恵 <span>冴えない彼女の育てかた Fine</span></figcaption>
        </figure>
      </section>

      <section className="about section-shell reveal" id="about">
        <div className="profile-card">
          <div className="avatar"><img src={asset('keyvisual-3.jpg')} alt="加藤惠主题头像" width="1200" height="1232" loading="lazy" /></div>
          <div><h2>{profile.name}</h2><a href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={15} /> GitHub <ArrowUpRight size={13} /></a></div>
        </div>
        <div className="about-copy"><h2>关于我</h2><p>{profile.intro}</p><p>{profile.about}</p><ul className="interest-tags">{profile.interests.map(interest => <li key={interest}>{interest}</li>)}</ul></div>
      </section>

      <section className="projects-section section-shell reveal" id="projects">
        <div className="section-heading"><h2>我的项目<span>。</span></h2><p>从日常应用到系统研究，整理在这里。<br />以下为公开源码项目，尚未部署在线服务。</p></div>
        <div className="filter-bar" role="group" aria-label="筛选项目">{categories.map(value => <button key={value} aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div>
        <div className="project-grid" aria-live="polite">
          {projects.filter(p => filter === '全部' || p.category === filter).map(p => {
            const Icon = projectIcons[p.icon] || Code;
            return <article className={`project-card ${p.category === '应用' ? 'application-card' : 'research-card'}`} key={p.id}>
              <div className="project-top"><Icon size={31} weight="light" aria-hidden="true" /><span>{p.category}</span></div>
              <h3>{p.title}</h3>
              <p className="project-subtitle">{p.subtitle}</p>
              <p className="project-description">{p.description}</p>
              <ul className="project-tags">{p.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              <div className="project-actions">
                <a className="source-link" href={p.source} target="_blank" rel="noreferrer" aria-label={`${p.title} 查看源码`}>查看源码 <ArrowUpRight size={16} /></a>
                <button className="detail-button" aria-label={`项目介绍：${p.title}`} onClick={() => setProject(p)}><span>项目介绍</span><Plus size={18} /></button>
              </div>
            </article>;
          })}
        </div>
        <a className="all-repositories text-link" href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">GitHub 上的全部仓库 <ArrowUpRight size={16} /></a>
        {extraLinks.length > 0 && <div className="extra-links"><h3>其他页面</h3><div>{extraLinks.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><h4>{link.title}<ArrowUpRight size={18} /></h4><p>{link.description}</p></a>)}</div></div>}
      </section>

      <section className="moments-section section-shell reveal" id="moments">
        <div className="section-heading"><h2>喜欢的瞬间<span>。</span></h2><p>加藤惠，还有故事里的春天。</p></div>
        <div className="gallery-grid">{gallery.map((item, i) => <button key={item.title} className={`gallery-item gallery-${i}`} onClick={() => setPicture(i)} aria-label={`放大图片：${item.title}`}><div className="gallery-image"><img src={asset(item.image)} alt={item.title} loading="lazy" width={item.width} height={item.height} /><span className="gallery-expand"><ImageSquare size={22} /></span></div><span className="gallery-caption">{item.title}<ArrowUpRight size={16} /></span></button>)}</div>
      </section>

      <section className="contact-section section-shell reveal" id="contact">
        <div className="contact-inner"><div><h2>在 GitHub 继续。</h2><p>源码、说明和后续更新，都在那里。</p></div><div className="contact-actions"><a className="button primary" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={19} /> {profile.name} <ArrowUpRight size={16} /></a>{profile.email && <a className="text-link" href={`mailto:${profile.email}`}><EnvelopeSimple size={18} /> 邮件联系</a>}<button className={`like-button ${liked ? 'liked' : ''}`} aria-pressed={liked} onClick={() => { setLiked(!liked); setToast(liked ? '已取消喜欢' : '谢谢你的喜欢。'); }}><Heart size={16} weight={liked ? 'fill' : 'regular'} />{liked ? '已经留下喜欢' : '留下一份喜欢'}</button></div></div>
      </section>
    </main>
    <footer className="site-footer section-shell"><div><a className="footer-brand" href="#home"><Flower size={21} weight="duotone" />{profile.siteName}</a><span>© {new Date().getFullYear()} {profile.name}.</span></div><div className="footer-links"><a href="https://saenai-movie.com/" target="_blank" rel="noreferrer">角色与官方视觉来源 <ArrowUpRight size={12} /></a><span>非官方个人主题站</span><a href="#home" className="back-top" aria-label="回到顶部"><ArrowUp size={20} /></a></div></footer>
    <div className="toast" role="status" aria-live="polite">{toast && <span><Flower size={17} />{toast}</span>}</div>

    {project && <Modal title={project.title} onClose={() => setProject(null)} className="project-modal">
      <div className="modal-body"><span className="modal-meta">{project.category} / 公开源码</span><h2>{project.title}</h2><p>{project.description}</p>
        <div className="project-detail-list">{project.details.map(detail => <div key={detail.title}><h3>{detail.title}</h3><p>{detail.text}</p></div>)}</div>
        <p className="project-note">{project.note}</p>
        <a className="button primary" href={project.source} target="_blank" rel="noreferrer"><GithubLogo size={18} /> 在 GitHub 查看源码 <ArrowUpRight size={16} /></a>
      </div>
    </Modal>}
    {picture !== null && <Modal title={gallery[picture].title} onClose={() => setPicture(null)} className="gallery-modal"><img src={asset(gallery[picture].image)} alt={gallery[picture].title} /><div className="lightbox-caption"><button className="icon-button" aria-label="上一张图片" onClick={() => setPicture((picture + gallery.length - 1) % gallery.length)}><CaretLeft size={24} /></button><div><h2>{gallery[picture].title}</h2><p>{gallery[picture].description}</p></div><button className="icon-button" aria-label="下一张图片" onClick={() => setPicture((picture + 1) % gallery.length)}><CaretRight size={24} /></button></div></Modal>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
