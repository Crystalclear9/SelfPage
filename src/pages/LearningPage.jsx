import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import PageNavigation from '../components/PageNavigation';
import { href, learning, writing } from '../data/routes';

const rootRoute = '/articles/ailearning/';

function Contents({ entries, label }) {
  return <section className="learning-contents" aria-label={label}><h2>{label}</h2>
    <div className="learning-list">{entries.map(item => {
      return <a href={href(item.route)} className="learning-row" data-cursor="read" key={item.route}>
        <h3>{item.title}</h3>
        <ArrowRight size={20} aria-hidden="true" />
      </a>;
    })}</div>
  </section>;
}

export default function LearningPage({ page, html = '' }) {
  const isIndex = ['collection', 'category', 'topic'].includes(page.kind);
  const isRoot = page.kind === 'collection';
  const children = learning.pages.filter(p => p.parent === page.route);
  const parent = learning.pages.find(p => p.route === page.parent);
  const siblings = learning.pages.filter(p => p.parent === page.parent && p.kind === 'chapter');
  const position = siblings.findIndex(p => p.route === page.route);
  const previous = siblings[position - 1], next = position >= 0 ? siblings[position + 1] : null;
  const rootEntry = writing.find(p => p.route === rootRoute);
  const description = isRoot ? rootEntry.summary : isIndex
    ? `选择一个${page.kind === 'category' ? '主题' : '章节'}继续阅读。`
    : parent?.title || 'AILearning 学习资料';
  const source = `${learning.source}/blob/${learning.revision || 'main'}/${page.file.split('/').map(encodeURIComponent).join('/')}`;
  return <article className={`detail-page section-shell learning-page ${!isIndex ? 'reading-page' : ''}`}>
    <PageNavigation section={isRoot ? '返回文章列表' : '返回上级目录'} sectionHref={page.parent} />
    <header className="detail-heading">
      <p className="eyebrow">{isRoot ? '学习资料' : <a href={href(rootRoute)}>AILearning</a>}</p>
      <h1>{page.title}</h1><p className="detail-lead">{description}</p>
    </header>
    {isRoot ? <>
      <Contents entries={children.filter(p => p.kind === 'guide')} label="开始阅读" />
      <Contents entries={children.filter(p => p.kind === 'category')} label="学习目录" />
    </> : isIndex && <Contents entries={children} label={page.kind === 'category' ? '主题目录' : '章节目录'} />}
    {isIndex ? <details className="learning-notes"><summary>资料说明与阅读建议</summary>
      <div id="learning-content" className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </details> : <div id="learning-content" className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
    {position >= 0 && <nav className="learning-pager" aria-label="章节翻页">
      <a href={href(previous?.route || page.parent)}><ArrowLeft size={18} /><span><small>{previous ? '上一章' : '主题目录'}</small>{previous?.title || parent?.title}</span></a>
      {next && <a href={href(next.route)}><span><small>下一章</small>{next.title}</span><ArrowRight size={18} /></a>}
    </nav>}
    <a className="text-link learning-source" href={source} target="_blank" rel="noreferrer">在 GitHub 查看原文 <ArrowUpRight size={15} /></a>
  </article>;
}
