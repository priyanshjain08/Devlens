export default function EmptyState() {
  return (
    <div className="empty-state">
      <svg viewBox="0 0 96 96" width="64" height="64" aria-hidden="true">
        <circle cx="42" cy="42" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
        <line x1="62" y1="62" x2="84" y2="84" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <h3>Nothing analyzed yet</h3>
      <p>Paste or upload some code on the left, then run an analysis to see results here.</p>
    </div>
  );
}
