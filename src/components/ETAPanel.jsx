function ETAPanel({ prediction }) {
  if (!prediction) {
    return (
      <div className="eta-panel">
        <div className="eta-label">ETA Prediction</div>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          Select a station to see ETA prediction
        </div>
      </div>
    )
  }

  const circumference = 2 * Math.PI * 34
  const offset = circumference - (prediction.confidence_percentage / 100) * circumference

  const getConfidenceColor = () => {
    if (prediction.confidence === 'high') return 'var(--success)'
    if (prediction.confidence === 'medium') return 'var(--warning)'
    return 'var(--danger)'
  }

  return (
    <div className="eta-panel animate-fadeInUp">
      <div className="eta-label">Predicted Arrival</div>
      <div className="eta-time">{prediction.predicted_arrival}</div>

      <div style={{ marginBottom: '12px' }}>
        {prediction.delay_minutes > 0 ? (
          <span className="badge badge-danger" style={{ fontSize: '0.8rem' }}>
            +{prediction.delay_minutes} min late
          </span>
        ) : prediction.delay_minutes < 0 ? (
          <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
            {Math.abs(prediction.delay_minutes)} min early
          </span>
        ) : (
          <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
            On time
          </span>
        )}
      </div>

      <div className="confidence-ring">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle className="ring-bg" cx="40" cy="40" r="34" />
          <circle
            className={`ring-fill ${prediction.confidence}`}
            cx="40"
            cy="40"
            r="34"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="confidence-value" style={{ color: getConfidenceColor() }}>
          {prediction.confidence_percentage}%
        </div>
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        {prediction.confidence} confidence
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        📏 {prediction.distance_remaining} km remaining
      </div>

      <div className="eta-factors">
        {prediction.factors?.map((factor, i) => (
          <div key={i} className="eta-factor">
            {factor.name}: {factor.impact}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
        Model {prediction.model_version} • Updated just now
      </div>
    </div>
  )
}

export default ETAPanel
