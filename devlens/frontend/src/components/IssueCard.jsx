import { useState } from 'react';
import SeverityBadge from './SeverityBadge.jsx';

export default function IssueCard({ issue }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="issue-card">
      <button
        type="button"
        className="issue-card-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <SeverityBadge severity={issue.severity} />
        <span className="issue-card-title">{issue.title}</span>
        {issue.line != null && <span className="issue-card-line">Line {issue.line}</span>}
        <span className="issue-card-chevron" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      <p className="issue-card-description">{issue.description}</p>

      {open && (
        <div className="issue-card-body">
          {issue.explanation && (
            <div className="issue-card-block">
              <h4>Why it matters</h4>
              <p>{issue.explanation}</p>
            </div>
          )}
          {issue.suggestedFix && (
            <div className="issue-card-block">
              <h4>Suggested fix</h4>
              <p>{issue.suggestedFix}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
