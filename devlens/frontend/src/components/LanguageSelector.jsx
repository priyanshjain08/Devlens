import { SUPPORTED_LANGUAGES } from '../utils/languages.js';

export default function LanguageSelector({ value, onChange }) {
  return (
    <label className="language-select">
      <span className="language-select-label">Language</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}
