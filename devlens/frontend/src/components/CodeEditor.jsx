import { useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';

const LINE_HEIGHT = 21;

export default function CodeEditor({ code, onChange, prismLang, placeholder }) {
  const lineCount = Math.max(1, code.split('\n').length);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  const highlight = (src) => {
    const grammar = Prism.languages[prismLang] || Prism.languages.markup;
    return Prism.highlight(src, grammar, prismLang);
  };

  return (
    <div className="editor-scroll-area">
      <div className="editor-gutter" aria-hidden="true">
        {lineNumbers.map((n) => (
          <div key={n} className="editor-gutter-line" style={{ height: LINE_HEIGHT }}>
            {n}
          </div>
        ))}
      </div>
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        textareaId="devlens-code-input"
        placeholder={placeholder}
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 14,
          lineHeight: `${LINE_HEIGHT}px`,
          flex: 1,
          minHeight: LINE_HEIGHT + 32
        }}
      />
    </div>
  );
}
