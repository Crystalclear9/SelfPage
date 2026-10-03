import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight, ArrowRight, BookOpen, FileText } from '@phosphor-icons/react';
import { projects } from '../data/site';
import { projectNotes } from '../data/project-notes';
import PageNavigation from '../components/PageNavigation';
import ProjectPager from '../components/ProjectPager';
import { writing, href } from '../data/routes';

const labels = { articles: '文章', papers: '论文' };
const descriptions = { articles: '记录开发中遇到的问题与尝试过的方法。', papers: '研究工作、论文与相关材料。' };
const contentUrl = value => /^https:\/\//.test(value) ? value : href(`/${value.replace(/^\//, '')}`);

export function EntryList({ entries, type }) {
  return entries.length ? <div className="entry-list">{entries.map(entry => <a className="entry-row" data-cursor="read" href={href(entry.route)} key={entry.route}><time dateTime={entry.date}>{entry.date}</time><div><h3>{entry.title}</h3><p>{entry.summary}</p></div><ArrowRight size={22}/></a>)}</div> : <div className="empty-writing"><p>{type === 'papers' ? '目前还没有公开的论文。' : '还没有发布文章。'}</p></div>;
}

export function WritingSection() {
  return <section id="writing" className="writing-section section-shell"><div className="section-heading"><h2>文章与论文</h2><p>开发过程中的记录，以及研究相关的整理。</p></div><div className="writing-index">{Object.keys(labels).map((type, index) => <a className="writing-door" data-cursor="read" href={href(`/${type}/`)} key={type}><span className="writing-number">0{index + 1}</span><div>{type === 'articles' ? <BookOpen size={28} weight="light"/> : <FileText size={28} weight="light"/>}<h3>{labels[type]}</h3><p>{descriptions[type]}</p>{writing.filter(e => e.type === type).length > 0 && <span className="writing-count">{writing.filter(e => e.type === type).length} 篇</span>}</div><ArrowRight className="entry-arrow" size={25}/></a>)}</div></section>;
}

export default function ContentPage({ path }) {
  const project = projects.find(p => path === `/projects/${p.id}/`);
  const entry = writing.find(p => p.route === path);
  const type = Object.keys(labels).find(t => path === `/${t}/`);
  if (project) {
    const notes = projectNotes[project.id];
    return <article className="detail-page section-shell"><PageNavigation section="全部项目" sectionHref="/#projects" /><header className="detail-heading"><p className="eyebrow">{project.reference ? '论文复现' : project.category}</p><h1 style={{ viewTransitionName: `project-${project.id}` }}>{project.title}</h1><p className="detail-lead">{project.subtitle}</p><ul className="project-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></header><div className="detail-layout"><aside className="detail-aside"><span>本页内容</span><a href="#overview">概览</a><a href="#implementation">实现思路</a><a href="#scope">{notes.scopeTitle}</a><a href="#code">代码与参考</a>{writing.some(e => e.project === project.id) && <a href="#related">相关记录</a>}</aside><div className="detail-body"><section id="overview" className="detail-block"><h2>概览</h2><p>{project.description}</p><p>{notes.motivation}</p></section><section id="implementation" className="detail-block"><h2>实现思路</h2>{notes.implementation.map((item, i) => <div className="implementation-row" key={item.title}><span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</section><section id="scope" className="detail-block"><h2>{notes.scopeTitle}</h2>{notes.scope.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section><section id="code" className="detail-block"><h2>代码与参考</h2><p>{project.note}</p>{project.reference && <p>原论文：<a href={project.reference.url} target="_blank" rel="noreferrer">{project.reference.title} <ArrowUpRight size={14}/></a></p>}<a className="button primary" href={project.source} target="_blank" rel="noreferrer">查看源码 <ArrowUpRight size={17}/></a></section>{writing.some(e => e.project === project.id) && <section id="related" className="detail-block"><h2>相关记录</h2><EntryList entries={writing.filter(e => e.project === project.id)} /></section>}</div></div><ProjectPager project={project}/></article>;
  }
  if (type) return <article className="detail-page section-shell"><PageNavigation section="文章与论文" sectionHref="/#writing" /><header className="detail-heading"><p className="eyebrow">{type === 'articles' ? 'TECHNICAL NOTES' : 'PUBLICATIONS'}</p><h1>{labels[type]}</h1><p className="detail-lead">{descriptions[type]}</p></header><EntryList entries={writing.filter(e => e.type === type)} type={type}/><a className="text-link index-switch" href={href(type === 'articles' ? '/papers/' : '/articles/')}>浏览{type === 'articles' ? '论文' : '文章'} <ArrowRight size={18}/></a></article>;
  if (entry) return <article className="detail-page section-shell reading-page"><PageNavigation section={`返回${labels[entry.type]}列表`} sectionHref={`/${entry.type}/`} /><header className="detail-heading"><p className="eyebrow"><time dateTime={entry.date}>{entry.date}</time>{entry.venue && ` · ${entry.venue}`}</p><h1>{entry.title}</h1><p className="detail-lead">{entry.summary}</p>{entry.authors?.length > 0 && <p>{entry.authors.join('、')}</p>}<div className="publication-links">{entry.pdf && <a className="button primary" data-cursor="download" href={contentUrl(entry.pdf)} target="_blank" rel="noreferrer">阅读 PDF <ArrowUpRight size={17}/></a>}{entry.externalUrl && <a className="text-link" href={entry.externalUrl} target="_blank" rel="noreferrer">发表页面 <ArrowUpRight size={17}/></a>}</div></header><div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={url => url.startsWith('/files/') ? href(url) : defaultUrlTransform(url)}>{entry.markdown}</ReactMarkdown></div></article>;
  return <section className="detail-page section-shell"><PageNavigation /><header className="detail-heading"><p className="eyebrow">404</p><h1>页面不存在</h1><p>链接可能已变更，或内容尚未发布。</p></header></section>;
}
