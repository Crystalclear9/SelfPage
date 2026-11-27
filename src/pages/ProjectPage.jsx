import { ArrowUpRight } from '@phosphor-icons/react';
import EntryList from '../components/EntryList';
import PageNavigation from '../components/PageNavigation';
import ProjectPager from '../components/ProjectPager';
import { projectNotes } from '../data/project-notes';
import { writing } from '../data/routes';

export default function ProjectPage({ project }) {
  const notes = projectNotes[project.id];
  const related = writing.filter(entry => entry.project === project.id);

  return <article className="detail-page section-shell">
    <PageNavigation section="全部项目" sectionHref="/#projects" />
    <header className="detail-heading">
      <p className="eyebrow">{project.reference ? '论文复现' : project.category}</p>
      <h1 style={{ viewTransitionName: `project-${project.id}` }}>{project.title}</h1>
      <p className="detail-lead">{project.subtitle}</p>
      <ul className="project-tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    </header>
    <div className="detail-layout">
      <aside className="detail-aside">
        <span>本页内容</span>
        <a href="#overview">概览</a>
        <a href="#implementation">实现思路</a>
        <a href="#scope">{notes.scopeTitle}</a>
        <a href="#code">代码与参考</a>
        {related.length > 0 && <a href="#related">相关记录</a>}
      </aside>
      <div className="detail-body">
        <section id="overview" className="detail-block">
          <h2>概览</h2><p>{project.description}</p><p>{notes.motivation}</p>
        </section>
        <section id="implementation" className="detail-block">
          <h2>实现思路</h2>
          {notes.implementation.map((item, i) => <div className="implementation-row" key={item.title}>
            <span>0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div>
          </div>)}
        </section>
        <section id="scope" className="detail-block">
          <h2>{notes.scopeTitle}</h2>
          {notes.scope.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <section id="code" className="detail-block">
          <h2>代码与参考</h2><p>{project.note}</p>
          {project.reference && <p>原论文：<a href={project.reference.url} target="_blank" rel="noreferrer">{project.reference.title} <ArrowUpRight size={14} /></a></p>}
          <a className="button primary" href={project.source} target="_blank" rel="noreferrer">查看源码 <ArrowUpRight size={17} /></a>
        </section>
        {related.length > 0 && <section id="related" className="detail-block">
          <h2>相关记录</h2><EntryList entries={related} />
        </section>}
      </div>
    </div>
    <ProjectPager project={project} />
  </article>;
}
