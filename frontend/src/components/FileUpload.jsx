import { useRef, useState } from 'react';
import { languageForFilename, EXTENSION_MAP } from '../utils/languages.js';

const MAX_FILE_BYTES = 300 * 1024; // 300 KB
const ACCEPT = Object.keys(EXTENSION_MAP)
  .map((ext) => `.${ext}`)
  .join(',');

export default function FileUpload({ onFileLoaded }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    setError('');

    if (!file) return;

    const language = languageForFilename(file.name);
    if (!language) {
      setError('That file type is not supported.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large — please upload something under 300 KB.');
      return;
    }

    // Read as plain text only. The contents are never executed — they are
    // treated as untrusted text and dropped straight into the editor.
    const reader = new FileReader();
    reader.onload = () => {
      onFileLoaded({ code: String(reader.result), language, filename: file.name });
    };
    reader.onerror = () => setError('Could not read that file.');
    reader.readAsText(file);
  };

  return (
    <div className="file-upload">
      <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
        Upload file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {error && <span className="file-upload-error">{error}</span>}
    </div>
  );
}
