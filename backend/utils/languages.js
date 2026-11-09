// Single source of truth for languages DevLens can analyze.
// The frontend mirrors this list (see frontend/src/utils/languages.js).

const SUPPORTED_LANGUAGES = [
  { id: 'c', label: 'C' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'sql', label: 'SQL' }
];

const SUPPORTED_LANGUAGE_IDS = SUPPORTED_LANGUAGES.map((l) => l.id);

module.exports = { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGE_IDS };
