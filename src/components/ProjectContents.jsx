import { useEffect, useState } from 'react';
import useReadingPosition from '../lib/useReadingPosition';

export default function ProjectContents({ scopeTitle, related }) {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    setNodes([...document.querySelectorAll('.detail-body > .detail-block[id]')]);
  }, [scopeTitle, related]);
  const active = useReadingPosition(nodes);
  const entries = [['overview', '概览'], ['implementation', '实现思路'], ['scope', scopeTitle], ['code', '代码与参考']];
  if (related) entries.push(['related', '相关记录']);
  return <nav className="detail-aside" aria-label="项目页内导航">
    <span>本页内容</span>
    {entries.map(([id, title]) => <a key={id} href={`#${id}`} aria-current={id === (active || 'overview') ? 'location' : undefined}>{title}</a>)}
  </nav>;
}
