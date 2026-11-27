import { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import codeHighlight from '../lib/code-highlight';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { href } from '../data/routes';
import useReadingPosition from '../lib/useReadingPosition';

// Horizontal bounds in the original diagrams. At reading-column widths on
// phones, each stage gets its own line while sharing the original image URL.
const diagramPanels = {
  'evidence-first.png': { width: 1024, height: 416, panels: [
    [0, 468, '先规划再检索：预设分工可能与检索到的证据冲突。'],
    [468, 1024, '先检索再规划：让证据决定需要哪些角色，以及谁来核查。'],
  ] },
  'inference.png': { width: 3360, height: 1280, panels: [
    [0, 755, '两条输入箭头分别来自问题和带来源的知识图谱证据。'],
    [755, 2190, '生成节点后再决定连边。图中的掩码限制了验证节点可以接收哪些消息。'],
    [2190, 3360, '候选图经过排序，选中的图进入执行与验证环节。'],
  ] },
  'training.png': { width: 3360, height: 1280, panels: [
    [0, 1110, '候选池有三个来源：预设结构、随机有向无环图和生成器自身。'],
    [1110, 1995, '剪刀标记的是裁剪步骤：删去角色或连边后，再检查成功率。'],
    [1995, 3360, '虚线把生成器连回结构数据集，下一轮采样可以利用这一轮的训练结果。'],
  ] },
};

function PaperFigure({ image, children }) {
  const { src, alt } = image.properties;
  const diagram = src.includes('/files/k-gat/') && diagramPanels[src.split('/').pop()];
  const url = src.startsWith('/files/') ? href(src) : src;
  return <figure className={`publication-figure${diagram ? ' panelled-figure' : ''}`}>
    {children}
    {diagram && <div className="diagram-panels">{diagram.panels.map(([left, right, caption]) =>
      <div key={left} className="diagram-panel">
        <div aria-hidden="true" style={{ aspectRatio: `${right - left} / ${diagram.height}`, maxWidth: 360 * (right - left) / diagram.height }}>
          <img src={url} alt="" loading="lazy" decoding="async" style={{ width: `${100 * diagram.width / (right - left)}%`, left: `${-100 * left / (right - left)}%` }} />
        </div>
        <p>{caption}</p>
      </div>
    )}</div>}
    <figcaption>{alt}</figcaption>
  </figure>;
}

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
    // Consecutive figures form one comparison, rather than unrelated full-width blocks.
    for (const block of children) {
      if (block.type !== 'researchSection') continue;
      const grouped = [];
      for (const node of block.children) {
        const isFigure = node.type === 'paragraph' && node.children.length === 1 && node.children[0].type === 'image';
        const previous = grouped.at(-1);
        if (isFigure && previous?.type === 'figureGroup') previous.children.push(node);
        else if (isFigure && previous?.type === 'paragraph' && previous.children.length === 1 && previous.children[0].type === 'image') {
          grouped.pop();
          grouped.push({ type: 'figureGroup', data: { hName: 'div', hProperties: { className: ['publication-comparison'] } }, children: [previous, node] });
        } else grouped.push(node);
      }
      block.children = grouped;
    }
    tree.children = children;
  };
}

function PaperContents({ root, markdown }) {
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState('');
  const active = useReadingPosition(nodes);
  useEffect(() => {
    setNodes([...root.current.querySelectorAll('.research-section')]);
    const clear = () => setSelected('');
    const events = ['scrollend', 'wheel', 'touchstart', 'keydown', 'popstate'];
    events.forEach(type => window.addEventListener(type, clear, { passive: true }));
    return () => events.forEach(type => window.removeEventListener(type, clear));
  }, [root, markdown]);
  return <nav className="paper-contents" hidden={!nodes.length} aria-label="论文页内导航">
    <span>本页内容</span>
    {nodes.map(node => <a key={node.id} href={`#${node.id}`} onClick={e => {
      if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) setSelected(node.id);
    }} aria-current={(selected || active) === node.id ? 'location' : undefined}>{node.querySelector('h2').textContent}</a>)}
  </nav>;
}

export default function PaperBody({ markdown }) {
  const root = useRef(null);
  return <div className="paper-content-layout">
    <PaperContents root={root} markdown={markdown} />
    <div ref={root} className="prose research-body">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, researchSections]} rehypePlugins={[[rehypeKatex, { strict: false, trust: false }], codeHighlight]} components={{
        p: ({ children, node }) => node.children.length === 1 && node.children[0].tagName === 'img'
          ? <PaperFigure image={node.children[0]}>{children}</PaperFigure>
          : <p>{children}</p>,
        img: ({ src, alt }) => {
          const size = src.endsWith('/k-gat/evidence-first.png') ? [1024, 416]
            : /\/k-gat\/(inference|training)\.png$/.test(src) ? [3360, 1280]
            : src.endsWith('/k-gat/over-planning.png') ? [617, 544]
            : src.endsWith('/k-gat/under-planning.png') ? [637, 544] : [];
          return <img src={src} alt={alt} width={size[0]} height={size[1]} loading="lazy" decoding="async" />;
        },
      }} urlTransform={url => url.startsWith('/files/') ? href(url) : defaultUrlTransform(url)}>{markdown}</ReactMarkdown>
    </div>
  </div>;
}
