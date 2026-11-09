export default function ScanOverlay() {
  return (
    <div className="scan-overlay" role="status" aria-live="polite">
      <div className="scan-overlay-line" />
      <span className="scan-overlay-label">Scanning code…</span>
    </div>
  );
}
