import { useEffect, useRef, useState } from 'react';
import { ListBullets } from '@phosphor-icons/react';
import useReadingPosition from '../lib/useReadingPosition';

export default function ChapterContents() {
  const [headings, setHeadings] = useState([]);
  const [open, setOpen] = useState(false);
  const root = useRef(null), trigger = useRef(null);
  const active = useReadingPosition(headings);
  useEffect(() => {
    const compact = matchMedia('(max-width: 760px)');
    const collect = () => {
      const directory = document.querySelector('#learning-content .chapter-source-directory');
      if (directory) directory.open = !compact.matches;
      const nodes = compact.matches ? [...document.querySelectorAll('#learning-content h2[id]')]
        .filter(node => node.textContent.trim() !== '本章目录') : [];
      setHeadings(nodes);
      setOpen(false);
    };
    collect();
    compact.addEventListener('change', collect);
    return () => compact.removeEventListener('change', collect);
  }, []);
  useEffect(() => {
    if (!open) return;
    const selected = root.current.querySelector('[aria-current]') || root.current.querySelector('a');
    selected?.focus({ preventScroll: true });
    if (selected) selected.parentElement.scrollTop = selected.offsetTop - selected.parentElement.clientHeight / 2;
    const escape = event => {
      if (event.key === 'Escape') { setOpen(false); trigger.current.focus({ preventScroll: true }); }
    };
    const outside = event => { if (!root.current.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
    };
  }, [open]);
  if (!headings.length) return null;
  return <nav className="chapter-contents" ref={root} aria-label="章节内导航">
    <button type="button" ref={trigger} aria-expanded={open} aria-controls="chapter-sections" onClick={() => setOpen(!open)}>
      <ListBullets size={18} aria-hidden="true" />本章目录
    </button>
    <div id="chapter-sections" hidden={!open}>{headings.map(node =>
      <a key={node.id} href={`#${node.id}`} aria-current={active === node.id ? 'location' : undefined}
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          setOpen(false);
          node.tabIndex = -1;
          node.focus({ preventScroll: true });
        }}>{node.textContent}</a>
    )}</div>
  </nav>;
}
