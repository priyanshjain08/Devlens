import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchHistory } from '../api/client.js';
import { labelForLanguage } from '../utils/languages.js';

function scoreTierClass(score) {
  if (score >= 80) return 'tier-good';
  if (score >= 50) return 'tier-warn';
  return 'tier-critical';
}

export default function History({ clientId }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory(clientId)
      .then(setItems)
      .catch((err) => setError(err.message));
  }, [clientId]);

  return (
    <section className="panel history-panel">
      <div className="panel-header">
        <h2>History</h2>
        <p className="results-summary">Past analyses from this browser.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      {items && items.length === 0 && (
        <div className="empty-state">
          <h3>No analyses yet</h3>
          <p>Run your first analysis from the Workspace tab and it will show up here.</p>
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="history-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/history/${item.id}`} className="history-row">
                <span className={`history-score ${scoreTierClass(item.overallScore)}`}>
                  {item.overallScore}
                </span>
                <span className="history-info">
                  <span className="history-title">{item.title}</span>
                  <span className="history-meta">
                    {labelForLanguage(item.language)} · {new Date(item.createdAt).toLocaleString()}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
