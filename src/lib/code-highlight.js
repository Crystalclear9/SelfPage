import rehypeHighlight from 'rehype-highlight';
import { common } from 'lowlight';
import powershell from 'highlight.js/lib/languages/powershell';

// Share the same grammar set between prerendered chapters and React Markdown.
// Unlabelled fences remain plain text; never guess a language for output/logs.
export default function codeHighlight() {
  return rehypeHighlight({ languages: { ...common, powershell }, plainText: ['text', 'txt', 'plaintext'] });
}
