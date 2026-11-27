import { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import ProfileAvatar from '../components/ProfileAvatar';
import useProjectFilter from '../lib/useProjectFilter';
import useVoice from '../lib/useVoice';
import { ArrowRight, ArrowUpRight, BookOpen, FileText, Code, DeviceMobile, EnvelopeSimple, GameController, GithubLogo, Heart, Plus, Stack, Timer } from '@phosphor-icons/react';
import { href, writingSections } from '../data/routes';
import { profile, projects, extraLinks } from '../data/site';
import { readPreference, savePreference } from '../lib/preferences';

const projectIcons = { phone: DeviceMobile, game: GameController, layers: Stack, clock: Timer };
const categories = ['全部', ...new Set(projects.map(project => project.category))];

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;

export default function HomePage({ hydrated, onToast }) {
  const [liked, setLiked] = useState(false);
  const { filter, gridRef, changeFilter } = useProjectFilter();
  const [project, setProject] = useState(null);
  useEffect(() => { setLiked(readPreference('spring-liked', 'false') === 'true'); }, []);
  const likeVoice = useVoice(profile.likeVoice ? `${import.meta.env.BASE_URL}${profile.likeVoice}` : '',
    () => onToast('语音暂时无法播放。'));
  const unlikeVoice = useVoice(profile.unlikeVoice ? `${import.meta.env.BASE_URL}${profile.unlikeVoice}` : '',
    () => onToast('语音暂时无法播放。'));
  const toggleLike = () => {
    if (!liked) {
      unlikeVoice.stop();
      document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'like' }));
      void likeVoice.play();
    } else {
      likeVoice.stop();
      document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'unlike' }));
      void unlikeVoice.play();
    }
    savePreference('spring-liked', String(!liked));
    setLiked(!liked);
  };
  const copyProjectLink = async () => {
    try {
      await navigator.clipboard.writeText(new URL(href(`/projects/${project.id}/`), location.href).href);
      onToast('项目链接已复制');
      document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'copied' }));
    } catch { onToast('未能复制链接，请打开项目页面后复制地址栏网址。'); }
  };
  return <>
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
      <div className="profile-card" data-chapter="profile">
        <ProfileAvatar enabled={hydrated}
          voiceSrc={profile.avatarVoice ? `${import.meta.env.BASE_URL}${profile.avatarVoice}` : ''}
          onVoiceError={onToast} />
        <div><h2>{profile.name}</h2><a href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={15} /> GitHub <ArrowUpRight size={13} /></a></div>
      </div>
      <div className="about-copy" data-chapter="about">
        <h2>关于我</h2>
        <p>{profile.intro}</p>
        <p>{profile.about}</p>
      </div>
    </section>

    <section className="projects-section section-shell" id="projects">
      <div className="projects-intro">
        <div className="projects-intro-content" data-sticky-reveal>
          <div className="section-heading" data-chapter="projects"><h2>项目与实践</h2><p>从具体问题出发，边做边理解。<br />这里是一些应用与系统方面的尝试。</p></div>
          <div className="filter-bar" role="group" aria-label="筛选项目">{categories.map(value => <button key={value} aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => changeFilter(value)}>{value}</button>)}</div>
        </div>
      </div>
      <div className="project-grid" ref={gridRef} aria-live="polite">
        {projects.filter(p => filter === '全部' || p.category === filter).map(p => {
          const Icon = projectIcons[p.icon] || Code;
          return <div className="project-reveal" data-module="project-card" key={p.id}><article className="project-card">
            <div className="project-top"><Icon size={31} weight="light" aria-hidden="true" /><span>{p.category}</span></div>
            <h3 style={{ viewTransitionName: `project-${p.id}` }}><a href={href(`/projects/${p.id}/`)} data-cursor="read">{p.title}</a></h3>
            <p className="project-subtitle">{p.subtitle}</p>
            <p className="project-description">{p.description}</p>
            <ul className="project-tags">{p.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
            <div className="project-actions">
              <a className="project-page-link text-link" data-cursor="read" href={href(`/projects/${p.id}/`)}>项目详情 <ArrowRight size={15}/></a>
              <a className="source-link" href={p.source} target="_blank" rel="noreferrer" aria-label={`${p.title} 查看源码`}>查看源码 <ArrowUpRight size={16} /></a>
              <button className="detail-button" aria-label={`项目速览：${p.title}`} onClick={() => setProject(p)}><span>速览</span><Plus size={18} /></button>
            </div>
          </article></div>;
        })}
      </div>
      <a className="all-repositories text-link" href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">GitHub 上的全部仓库 <ArrowUpRight size={16} /></a>
      {extraLinks.length > 0 && <div className="extra-links"><h3>其他页面</h3><div>{extraLinks.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><h4>{link.title}<ArrowUpRight size={18} /></h4><p>{link.description}</p></a>)}</div></div>}
    </section>

    <section id="writing" className="writing-section section-shell">
      <div className="section-heading" data-chapter="writing">
        <h2>文章与论文</h2><p>开发过程中的记录，以及研究相关的整理。</p>
      </div>
      <div className="writing-index">{writingSections.map(({ type, title, description }, index) =>
        <a className="writing-door" data-module="writing-entry" data-cursor="read" href={href(`/${type}/`)} key={type}>
          <span className="writing-number">0{index + 1}</span>
          <div>
            {type === 'articles' ? <BookOpen size={28} weight="light" /> : <FileText size={28} weight="light" />}
            <h3>{title}</h3><p>{description}</p>
          </div>
          <ArrowRight className="entry-arrow" size={25} />
        </a>
      )}</div>
    </section>

    <section className="contact-section section-shell reveal" id="contact">
      <div className="contact-inner" data-chapter="contact">
        <div><h2>在 GitHub 上</h2><p>最近的更新和完整实现，可以在 GitHub 找到。</p></div>
        <div className="contact-actions">
          <a className="button primary" href={profile.github} target="_blank" rel="noreferrer"><GithubLogo size={19} /> {profile.name} <ArrowUpRight size={16} /></a>
          {profile.email && <a className="text-link" href={`mailto:${profile.email}`}><EnvelopeSimple size={18} /> 邮件联系</a>}
          <button className={`like-button ${liked ? 'liked' : ''}`} aria-pressed={liked} disabled={!hydrated} onClick={toggleLike}>
            <Heart size={16} weight={liked ? 'fill' : 'regular'} />{liked ? '已经留下喜欢' : '留下一份喜欢'}
          </button>
        </div>
      </div>
    </section>
    {project && <Modal title={project.title} onClose={() => setProject(null)} className="project-modal">
      <div className="modal-body"><span className="modal-meta">{project.category} / 公开源码</span><h2>{project.title}</h2><p>{project.description}</p>
        <div className="project-detail-list">{project.details.map(detail => <div key={detail.title}><h3>{detail.title}</h3><p>{detail.text}</p></div>)}</div>
        <p className="project-note">{project.note}</p>
        <div className="summary-actions"><a className="button primary" href={project.source} target="_blank" rel="noreferrer"><GithubLogo size={18} /> 在 GitHub 查看源码 <ArrowUpRight size={16} /></a><button className="text-link copy-project-link" onClick={copyProjectLink} data-cursor="copy">复制项目链接</button></div>
      </div>
    </Modal>}
  </>;
}
