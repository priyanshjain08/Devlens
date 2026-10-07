// Mirrors backend/utils/languages.js. Kept as a plain constant (rather than
// fetched) so the editor can render instantly with no loading state.

export const SUPPORTED_LANGUAGES = [
  { id: 'c', label: 'C', prism: 'c' },
  { id: 'cpp', label: 'C++', prism: 'cpp' },
  { id: 'java', label: 'Java', prism: 'java' },
  { id: 'python', label: 'Python', prism: 'python' },
  { id: 'javascript', label: 'JavaScript', prism: 'javascript' },
  { id: 'typescript', label: 'TypeScript', prism: 'typescript' },
  { id: 'html', label: 'HTML', prism: 'markup' },
  { id: 'css', label: 'CSS', prism: 'css' },
  { id: 'sql', label: 'SQL', prism: 'sql' }
];

// Maps uploaded file extensions to a language id.
export const EXTENSION_MAP = {
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  java: 'java',
  py: 'python',
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'html',
  htm: 'html',
  css: 'css',
  sql: 'sql'
};

export function languageForFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return EXTENSION_MAP[ext] || null;
}

export function labelForLanguage(id) {
  return SUPPORTED_LANGUAGES.find((l) => l.id === id)?.label || id;
}
