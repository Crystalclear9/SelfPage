import { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';

export default function Modal({ children, onClose, title, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current, focused = document.activeElement;
    dialog.showModal();
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = old; focused?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === ref.current) { const r = ref.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <button className="icon-button close-modal" aria-label="关闭弹窗" onClick={onClose}><X size={23} /></button>{children}
  </dialog>;
}
