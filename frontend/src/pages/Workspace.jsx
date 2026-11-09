import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor.jsx';
import LanguageSelector from '../components/LanguageSelector.jsx';
import FileUpload from '../components/FileUpload.jsx';
import ScoreGauge from '../components/ScoreGauge.jsx';
import CategoryBars from '../components/CategoryBars.jsx';
import IssueList from '../components/IssueList.jsx';
import CodeExplanation from '../components/CodeExplanation.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ScanOverlay from '../components/ScanOverlay.jsx';
import { SUPPORTED_LANGUAGES } from '../utils/languages.js';
import { analyzeCode, fetchAnalysis } from '../api/client.js';

const MAX_CODE_LENGTH = 20000;
const TABS = ['Overview', 'Issues', 'Explanation'];

export default function Workspace({ clientId }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[4].id); // javascript
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('Overview');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchAnalysis(id, clientId)
      .then((data) => {
        if (cancelled) return;
        setCode(data.code);
        setLanguage(data.language);
        setResult(data);
        setTab('Overview');
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, clientId]);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.id === language) || SUPPORTED_LANGUAGES[4];

  const handleFileLoaded = ({ code: fileCode, language: fileLanguage }) => {
    setCode(fileCode);
    setLanguage(fileLanguage);
    setResult(null);
    setError('');
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
    setError('');
    if (id) navigate('/');
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please add some code first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await analyzeCode({ code, language, clientId });
      setResult(data);
      setTab('Overview');
      if (id) navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workspace">
      <section className="panel editor-panel">
        <div className="panel-header">
          <h2>Code</h2>
          <div className="panel-header-controls">
            <LanguageSelector value={language} onChange={setLanguage} />
            <FileUpload onFileLoaded={handleFileLoaded} />
          </div>
        </div>

        <div className="editor-frame">
          <CodeEditor
            code={code}
            onChange={(v) => {
              setCode(v);
              if (result) setResult(null);
            }}
            prismLang={activeLang.prism}
            placeholder={`Paste your ${activeLang.label} code here, or upload a file…`}
          />
          {loading && <ScanOverlay />}
        </div>

        <div className="editor-footer">
          <span className={`char-count ${code.length > MAX_CODE_LENGTH ? 'is-over' : ''}`}>
            {code.length.toLocaleString()} / {MAX_CODE_LENGTH.toLocaleString()} characters
          </span>
          <div className="editor-actions">
            <button type="button" className="btn btn-ghost" onClick={handleClear} disabled={loading}>
              Clear
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !code.trim() || code.length > MAX_CODE_LENGTH}
            >
              {loading ? 'Analyzing…' : 'Analyze code'}
            </button>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="panel results-panel">
        {!result && !loading && <EmptyState />}
        {!result && loading && (
          <div className="empty-state">
            <p>Running analysis — this can take a few seconds.</p>
          </div>
        )}

        {result && (
          <>
            <div className="panel-header">
              <div>
                <h2>{result.title}</h2>
                <p className="results-summary">{result.summary}</p>
              </div>
            </div>

            <div className="results-tabs">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`results-tab ${tab === t ? 'is-active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                  {t === 'Issues' ? ` (${result.issues.length})` : ''}
                </button>
              ))}
            </div>

            <div className="results-tab-content">
              {tab === 'Overview' && (
                <div className="overview-grid">
                  <ScoreGauge score={result.overallScore} />
                  <CategoryBars categoryScores={result.categoryScores} />
                </div>
              )}
              {tab === 'Issues' && <IssueList issues={result.issues} />}
              {tab === 'Explanation' && (
                <CodeExplanation explanation={result.explanation} positives={result.positives} />
              )}
            </div>

            <p className="ai-disclaimer">
              AI-generated analysis — it can be wrong or miss things. Review findings yourself
              before relying on them.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
