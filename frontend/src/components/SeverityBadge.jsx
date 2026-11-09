const SEVERITY_META = {
  critical: { label: 'Critical', className: 'severity-critical' },
  high: { label: 'High', className: 'severity-high' },
  medium: { label: 'Medium', className: 'severity-medium' },
  low: { label: 'Low', className: 'severity-low' },
  info: { label: 'Info', className: 'severity-info' }
};

export default function SeverityBadge({ severity }) {
  const meta = SEVERITY_META[severity] || SEVERITY_META.info;
  return <span className={`severity-badge ${meta.className}`}>{meta.label}</span>;
}
