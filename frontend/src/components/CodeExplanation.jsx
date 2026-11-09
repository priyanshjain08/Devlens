export default function CodeExplanation({ explanation, positives }) {
  return (
    <div className="explanation-panel">
      {explanation.overview && (
        <section className="explanation-block">
          <h4>What this code does</h4>
          <p>{explanation.overview}</p>
        </section>
      )}

      {explanation.mainComponents?.length > 0 && (
        <section className="explanation-block">
          <h4>Main components</h4>
          <ul>
            {explanation.mainComponents.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {explanation.programFlow && (
        <section className="explanation-block">
          <h4>Program flow</h4>
          <p>{explanation.programFlow}</p>
        </section>
      )}

      {explanation.confusingSections?.length > 0 && (
        <section className="explanation-block">
          <h4>Parts worth a second look</h4>
          <ul>
            {explanation.confusingSections.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {positives?.length > 0 && (
        <section className="explanation-block">
          <h4>What's working well</h4>
          <ul className="positives-list">
            {positives.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
