import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { projects } from '../data/site';
import { href } from '../data/routes';

export default function ProjectPager({ project }) {
  const index = projects.indexOf(project);
  const previous = projects[index - 1], next = projects[index + 1];
  return <nav className="project-pager" aria-label="项目翻页">
    <p className="pager-position">项目 {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
    <div className="pager-links">
      {previous ? <a className="pager-link pager-previous" href={href(`/projects/${previous.id}/`)}><ArrowLeft size={24}/><span><small>上一个项目</small><strong>{previous.title}</strong></span></a> : <a className="pager-link pager-previous" href={href('/#projects')}><ArrowLeft size={24}/><span><small>返回主页</small><strong>全部项目</strong></span></a>}
      {next ? <a className="pager-link pager-next" href={href(`/projects/${next.id}/`)}><span><small>下一个项目</small><strong>{next.title}</strong></span><ArrowRight size={24}/></a> : <a className="pager-link pager-next" href={href('/articles/')}><span><small>继续浏览</small><strong>文章</strong></span><ArrowRight size={24}/></a>}
    </div>
  </nav>;
}
