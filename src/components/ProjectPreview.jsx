import { useState } from 'react';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Modal from './Modal';
import { href } from '../data/routes';

export default function ProjectPreview({ project, onClose }) {
  const url = href(`/projects/${project.id}/`);
  const [copyLabel, setCopyLabel] = useState('复制项目链接');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(url, location.href).href);
      setCopyLabel('项目链接已复制');
      document.dispatchEvent(new CustomEvent('cursor-feedback', { detail: 'copied' }));
    } catch { setCopyLabel('复制失败，点此重试'); }
  };
  return <Modal title={project.title} onClose={onClose} className="project-modal">
    <div className="modal-body">
      <span className="modal-meta">{project.category} / 公开源码</span>
      <h2>{project.title}</h2><p>{project.description}</p>
      <div className="project-detail-list">{project.details.map(detail =>
        <div key={detail.title}><h3>{detail.title}</h3><p>{detail.text}</p></div>
      )}</div>
      <p className="project-note">{project.note}</p>
      <div className="summary-actions">
        <a className="button primary" href={url}>查看完整介绍 <ArrowRight size={16} /></a>
        <a className="text-link" href={project.source} target="_blank" rel="noreferrer">在 GitHub 查看源码 <ArrowUpRight size={16} /></a>
        <button className="text-link copy-project-link" onClick={copy} data-cursor="copy"><span aria-live="polite">{copyLabel}</span></button>
      </div>
    </div>
  </Modal>;
}
