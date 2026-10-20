import { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { href } from '../data/routes';

// Group Markdown sections without changing code blocks, tables, or inline markup.
function researchSections() {
  return tree => {
    const children = [];
    let section, index = 0;
    for (const node of tree.children) {
      if (node.type === 'heading' && node.depth === 2) {
        section = { type: 'researchSection', data: { hName: 'section', hProperties: {
          id: `paper-section-${++index}`, className: ['research-section'],
        } }, children: [] };
        children.push(section);
      }
      (section ? section.children : children).push(node);
    }
    tree.children = children;
  };
}

export default function PaperBody({ markdown }) {
  const root = useRef(null);
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState('');
  useEffect(() => {
    const nodes = [...root.current.querySelectorAll('.research-section')];
    setSections(nodes.map(node => ({ id: node.id, title: node.querySelector('h2').textContent })));
    const intersecting = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) intersecting.add(entry.target);
        else intersecting.delete(entry.target);
      }
      const visible = nodes.filter(node => intersecting.has(node));
      if (visible.length) setActive(visible.at(-1).id);
    }, { rootMargin: '-20% 0px -60% 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [markdown]);

  return <div className="paper-content-layout">
    <nav className="paper-contents" hidden={!sections.length} aria-label="论文页内导航">
      <span>本页内容</span>
      {sections.map(section => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>{section.title}</a>)}
    </nav>
    <div ref={root} className="prose research-body">
      <ReactMarkdown remarkPlugins={[remarkGfm, researchSections]} components={{
        p: ({ children, node }) => node.children.length === 1 && node.children[0].tagName === 'img'
          ? <figure className="publication-figure">{children}<figcaption>{node.children[0].properties.alt}</figcaption></figure>
          : <p>{children}</p>,
        img: ({ src, alt }) => {
          const size = src.endsWith('/k-gat/evidence-first.png') ? [1024, 416]
            : src.endsWith('/k-gat/inference.png') ? [3360, 1280] : [];
          return <a href={src} target="_blank" rel="noreferrer" aria-label={`查看原图：${alt}`}><img src={src} alt={alt} width={size[0]} height={size[1]} loading="lazy" decoding="async" /></a>;
        },
      }} urlTransform={url => url.startsWith('/files/') ? href(url) : defaultUrlTransform(url)}>{markdown}</ReactMarkdown>
    </div>
  </div>;
}
