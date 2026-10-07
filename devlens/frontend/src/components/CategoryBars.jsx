const CATEGORY_LABELS = {
  quality: 'Code quality',
  security: 'Security',
  performance: 'Performance',
  maintainability: 'Maintainability',
  complexity: 'Complexity'
};

function tierClass(score) {
  if (score >= 80) return 'tier-good';
  if (score >= 50) return 'tier-warn';
  return 'tier-critical';
}

export default function CategoryBars({ categoryScores }) {
  return (
    <ul className="category-bars">
      {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
        const score = categoryScores?.[key] ?? 0;
        return (
          <li key={key} className="category-bar-row">
            <div className="category-bar-head">
              <span>{label}</span>
              <span className="category-bar-score">{score}</span>
            </div>
            <div className="category-bar-track">
              <div
                className={`category-bar-fill ${tierClass(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
