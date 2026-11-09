import { useMemo, useState } from 'react';
import IssueCard from './IssueCard.jsx';

const ORDER = ['critical', 'high', 'medium', 'low', 'info'];
const FILTERS = ['all', ...ORDER];

export default function IssueList({ issues }) {
  const [filter, setFilter] = useState('all');

  const sorted = useMemo(
    () => [...issues].sort((a, b) => ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity)),
    [issues]
  );
  const visible = filter === 'all' ? sorted : sorted.filter((i) => i.severity === filter);

  if (issues.length === 0) {
    return <p className="issue-list-empty">No issues found. Nice and clean.</p>;
  }

  return (
    <div>
      <div className="issue-filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`issue-filter-pill ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${issues.length})` : `${f} (${issues.filter((i) => i.severity === f).length})`}
          </button>
        ))}
      </div>
      <ul className="issue-list">
        {visible.map((issue, i) => (
          <IssueCard key={i} issue={issue} />
        ))}
      </ul>
    </div>
  );
}
