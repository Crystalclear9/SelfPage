import { useEffect } from 'react';

export default function useExerciseNotes(route, html) {
  useEffect(() => {
    const root = document.getElementById('learning-content');
    if (!root) return;
    const targets = route.endsWith('/guides/assignments/')
      ? [...root.querySelectorAll('h2')].filter(h => h.textContent.startsWith('作业'))
      : [...root.querySelectorAll('.exercise-answer')];
    const cleanups = targets.map((target, index) => {
      const heading = target.matches('h2') ? target : (() => {
        let node = target.previousElementSibling;
        while (node && !/^H[2-6]$/.test(node.tagName)) node = node.previousElementSibling;
        return node;
      })();
      const key = `learning-draft:${route}:${heading?.id || index}`;
      const panel = document.createElement('details');
      panel.className = 'exercise-notes';
      const summary = document.createElement('summary'); summary.textContent = '写下我的思路';
      const field = document.createElement('textarea');
      field.rows = 5; field.placeholder = '记录推导、代码思路，或还没想清楚的地方…';
      field.setAttribute('aria-label', `${heading?.textContent || '本题'}：我的思路`);
      const status = document.createElement('small'); status.textContent = '仅保存在此浏览器，不会提交或自动评分。';
      const label = document.createElement('label');
      const done = document.createElement('input'); done.type = 'checkbox';
      label.append(done, document.createTextNode('已自行核对'));
      try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); field.value = saved.text || ''; done.checked = !!saved.done; } catch { /* Storage is optional. */ }
      const save = () => { try { localStorage.setItem(key, JSON.stringify({ text: field.value, done: done.checked })); status.textContent = '已保存在此浏览器 · 不会提交或自动评分'; } catch { status.textContent = '浏览器无法保存，请自行复制记录。'; } };
      field.addEventListener('input', save); done.addEventListener('change', save);
      panel.append(summary, field, label, status);
      if (target.matches('h2')) {
        let end = target.nextElementSibling;
        while (end && end.tagName !== 'H2') end = end.nextElementSibling;
        root.insertBefore(panel, end);
      } else target.before(panel);
      return () => panel.remove();
    });
    const revealHash = () => {
      let node;
      try { node = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
      for (let parent = node?.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
    };
    revealHash(); window.addEventListener('hashchange', revealHash);
    return () => { cleanups.forEach(fn => fn()); window.removeEventListener('hashchange', revealHash); };
  }, [route, html]);
}
