import { ArrowRight } from '@phosphor-icons/react';
import { projects } from '../data/site';
import ProjectPage from './ProjectPage';
import PageNavigation from '../components/PageNavigation';
import EntryList from '../components/EntryList';
import LearningPage from './LearningPage';
import { writing, writingSections, learning, learningPublished, href } from '../data/routes';

export default function ContentPage({ path, learningHtml, WritingDetail }) {
  const learningPage = learningPublished && learning.pages.find(p => p.route === path);
  if (learningPage) return <LearningPage page={learningPage} html={learningHtml} />;
  const project = projects.find(p => path === `/projects/${p.id}/`);
  if (project) return <ProjectPage project={project} />;

  const section = writingSections.find(item => path === `/${item.type}/`);
  if (section) {
    const isPaper = section.type === 'papers';
    return <article className="detail-page section-shell">
      <PageNavigation section="文章与论文" sectionHref="/#writing" />
      <header className="detail-heading">
        <p className="eyebrow">{isPaper ? 'PUBLICATIONS' : 'TECHNICAL NOTES'}</p>
        <h1>{section.title}</h1><p className="detail-lead">{section.description}</p>
      </header>
      <EntryList entries={writing.filter(entry => entry.type === section.type)} type={section.type} />
      <a className="text-link index-switch" href={href(isPaper ? '/articles/' : '/papers/')}>
        浏览{isPaper ? '文章' : '论文'} <ArrowRight size={18} />
      </a>
    </article>;
  }

  const entry = writing.find(item => item.route === path);
  if (entry) return <WritingDetail entry={entry} />;
  return <section className="detail-page section-shell">
    <PageNavigation />
    <header className="detail-heading">
      <p className="eyebrow">404</p><h1>页面不存在</h1><p>链接可能已变更，或内容尚未发布。</p>
    </header>
  </section>;
}
