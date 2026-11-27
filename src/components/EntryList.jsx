import { ArrowRight } from '@phosphor-icons/react';
import { href } from '../data/routes';

export default function EntryList({ entries, type }) {
  if (!entries.length) return <div className="empty-writing">
    <p>{type === 'papers' ? '目前还没有公开的论文。' : '还没有发布文章。'}</p>
  </div>;

  return <div className="entry-list">{entries.map(entry =>
    <a className="entry-row" data-cursor="read" href={href(entry.route)} key={entry.route}>
      <time dateTime={entry.date}>{entry.date}</time>
      <div><h3>{entry.title}</h3><p>{entry.summary}</p></div>
      <ArrowRight size={22} />
    </a>
  )}</div>;
}
