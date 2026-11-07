// Build native disclosure elements from known Markdown answer conventions only.
// Raw source HTML remains disabled; arbitrary tags/attributes are never executed.
export default function learningExercises() {
  return tree => {
    const text = n => n.value || n.children?.map(text).join('') || '';
    const disclosure = (label, children) => ({ type: 'paragraph', data: { hName: 'details', hProperties: { className: ['exercise-answer'] } }, children: [
      { type: 'paragraph', data: { hName: 'summary' }, children: [{ type: 'text', value: label }] },
      { type: 'paragraph', data: { hName: 'div', hProperties: { className: ['exercise-solution'] } }, children },
    ] });
    const nodes = tree.children, output = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const native = node.type === 'html' && node.value.trim().match(/^<details>\s*<summary>([^<>]+)<\/summary>\s*$/);
      if (native) {
        const end = nodes.findIndex((n, j) => j > i && n.type === 'html' && n.value.trim() === '</details>');
        if (end > i) {
          const block = disclosure(native[1], nodes.slice(i + 1, end));
          if (!/解答|答案|解析/.test(native[1])) block.data.hProperties.className = ['learning-disclosure'];
          output.push(block); i = end; continue;
        }
      }
      if (node.type === 'paragraph' && /^(?:解答|答案|参考答案|解析)[：:]/.test(text(node))) {
        const answer = [node];
        while (i + 1 < nodes.length && !['heading', 'html'].includes(nodes[i + 1].type)
          && !/^(?:题目|问题)[：:]/.test(text(nodes[i + 1]))) answer.push(nodes[++i]);
        output.push(disclosure('查看参考解析', answer));
      } else output.push(node);
    }
    tree.children = output;
  };
}
