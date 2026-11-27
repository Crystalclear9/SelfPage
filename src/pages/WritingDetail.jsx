import { remarkPlugins, rehypePlugins } from '../lib/markdown.js';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import { ArrowUpRight } from '@phosphor-icons/react';
import PageNavigation from '../components/PageNavigation';
import PaperBody from './PaperBody';
import { href } from '../data/routes';

const contentUrl = value => /^https:\/\//.test(value) ? value : href(`/${value.replace(/^\//, '')}`);

export default function WritingDetail({ entry }) {
  const isPaper = entry.type === 'papers';
  return <article className={`detail-page section-shell reading-page${isPaper ? ' publication-page' : ''}`}>
    <PageNavigation section={`返回${isPaper ? '论文' : '文章'}列表`} sectionHref={`/${entry.type}/`} />
    <header className="detail-heading">
      <p className="eyebrow">{isPaper ? (entry.venue || 'RESEARCH PAPER') : <><time dateTime={entry.date}>{entry.date}</time>{entry.venue && ` · ${entry.venue}`}</>}</p>
      <h1>{entry.title}</h1>
      {isPaper && entry.authors?.length > 0 && <ul className="publication-authors" aria-label="论文作者">{entry.authors.map(author => <li key={author}>{author}</li>)}</ul>}
      <p className="detail-lead">{entry.summary}</p>
      {!isPaper && entry.authors?.length > 0 && <p>{entry.authors.join('、')}</p>}
      <div className="publication-links">
        {entry.externalUrl && <a className={isPaper ? 'button primary' : 'text-link'} href={entry.externalUrl} target="_blank" rel="noreferrer">发表页面 <ArrowUpRight size={17}/></a>}
        {entry.pdf && <a className={isPaper ? 'text-link' : 'button primary'} data-cursor="download" href={contentUrl(entry.pdf)} target="_blank" rel="noreferrer">阅读 PDF <ArrowUpRight size={17}/></a>}
      </div>
    </header>
    {isPaper ? <PaperBody markdown={entry.markdown} /> : <div className="prose"><ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} urlTransform={url => url.startsWith('/files/') ? href(url) : defaultUrlTransform(url)}>{entry.markdown}</ReactMarkdown></div>}
  </article>;
}
