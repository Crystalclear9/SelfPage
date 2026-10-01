import { useEffect, useRef } from 'react';
import { Cursor } from '@phosphor-icons/react';

export default function CharacterCursor() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const image = element.querySelector('img');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const hide = () => {
      element.hidden = true;
      document.documentElement.classList.remove('character-cursor-active');
    };
    const move = event => {
      if (!fine.matches || event.pointerType !== 'mouse' || !image.complete || !image.naturalWidth || document.querySelector('dialog[open]')) return hide();
      element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      element.dataset.link = Boolean(event.target.closest('a, button'));
      element.hidden = false;
      document.documentElement.classList.add('character-cursor-active');
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    document.addEventListener('keydown', hide);
    fine.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      document.removeEventListener('keydown', hide);
      fine.removeEventListener('change', hide);
    };
  }, []);
  return <div className="character-cursor" ref={ref} hidden aria-hidden="true">
    <Cursor size={15} weight="fill" />
    <span className="character-face"><img src={`${import.meta.env.BASE_URL}images/keyvisual-3.jpg`} alt="" width="1200" height="1232" /></span>
  </div>;
}
