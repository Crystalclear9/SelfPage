import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { common } from 'lowlight';
import powershell from 'highlight.js/lib/languages/powershell';

export const remarkPlugins = [remarkGfm, remarkMath];
export const rehypePlugins = [
  [rehypeKatex, { strict: false, trust: false }],
  [rehypeHighlight, { languages: { ...common, powershell }, plainText: ['text', 'txt', 'plaintext'] }],
];
