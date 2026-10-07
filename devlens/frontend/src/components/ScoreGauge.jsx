const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

function tierFor(score) {
  if (score >= 80) return { className: 'tier-good', label: 'Strong' };
  if (score >= 50) return { className: 'tier-warn', label: 'Needs work' };
  return { className: 'tier-critical', label: 'At risk' };
}

export default function ScoreGauge({ score, label = 'Overall score' }) {
  const tier = tierFor(score);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className={`score-gauge ${tier.className}`}>
      <svg viewBox="0 0 120 120" width="148" height="148">
        <g stroke="currentColor" className="score-gauge-ticks" strokeWidth="2" strokeLinecap="round">
          {TICKS.map((deg) => (
            <line key={deg} x1="60" y1="6" x2="60" y2="12" transform={`rotate(${deg} 60 60)`} />
          ))}
        </g>
        <circle cx="60" cy="60" r={RADIUS} className="score-gauge-track" strokeWidth="9" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          className="score-gauge-progress"
          strokeWidth="9"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="57" textAnchor="middle" className="score-gauge-number">
          {score}
        </text>
        <text x="60" y="74" textAnchor="middle" className="score-gauge-denominator">
          / 100
        </text>
      </svg>
      <div className="score-gauge-caption">
        <span className="score-gauge-tier">{tier.label}</span>
        <span className="score-gauge-label">{label}</span>
      </div>
    </div>
  );
}
