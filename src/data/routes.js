import writing from 'virtual:writing';
import { projects } from './site';
export { writing };
export const href = route => `${import.meta.env.BASE_URL}${route.replace(/^\//, '')}`;
export const routes = [
  { path: '/', title: '个人主页', description: 'Crystalclear9 的开源项目、技术文章与论文。' },
  ...projects.map(p => ({ path: `/projects/${p.id}/`, title: p.title, description: p.description })),
  { path: '/articles/', title: '文章', description: '实现记录、实验分析与技术笔记。' },
  { path: '/papers/', title: '论文', description: '论文、摘要与相关材料。' },
  ...writing.map(p => ({ path: p.route, title: p.title, description: p.summary })),
];
export function currentPath(pathname) {
  const base = import.meta.env.BASE_URL;
  const relative = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, '');
  return `/${relative.replace(/index\.html$/, '').replace(/\/$/, '')}${relative.replace(/index\.html$/, '').replace(/\/$/, '') ? '/' : ''}`;
}
