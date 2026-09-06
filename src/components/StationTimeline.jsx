function StationTimeline({ completedStations = [], currentStation = null, upcomingStations = [] }) {
  const allStations = [
    ...completedStations.map(s => ({ ...s, phase: 'completed' })),
    ...(currentStation ? [{ ...currentStation, phase: 'current' }] : []),
    ...upcomingStations.map(s => ({ ...s, phase: 'upcoming' })),
  ]

  if (allStations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🚉</div>
        <div className="empty-state-text">No station data available</div>
      </div>
    )
  }

  return (
    <div className="timeline">
      {allStations.map((station, idx) => (
        <div
          key={station.code + idx}
          className={`timeline-item ${station.phase}`}
          style={{ animationDelay: `${idx * 0.08}s` }}
        >
          <div className="timeline-dot"></div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
              <span className="timeline-station-name">{station.name}</span>
              <span className="timeline-station-code">({station.code})</span>
              {station.phase === 'current' && (
                <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>📍 CURRENT</span>
              )}
              {station.phase === 'completed' && station.actual_delay != null && (
                <span className={`timeline-delay ${station.actual_delay > 0 ? 'late' : 'early'}`}>
                  {station.actual_delay > 0 ? `+${station.actual_delay}m` : station.actual_delay < 0 ? `${station.actual_delay}m` : 'On time'}
                </span>
              )}
              {station.phase === 'upcoming' && station.predicted_delay != null && (
                <span className={`timeline-delay ${station.predicted_delay > 5 ? 'late' : 'early'}`}>
                  {station.predicted_delay > 0 ? `~+${station.predicted_delay}m` : '~On time'}
                  {station.confidence && (
                    <span style={{ marginLeft: '4px', opacity: 0.7 }}>
                      ({station.confidence})
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className="timeline-times">
              {station.scheduled_arr && (
                <div>
                  <span className="timeline-time-label">Sch. Arr: </span>
                  <span className="timeline-time-value">{station.scheduled_arr}</span>
                </div>
              )}
              {station.scheduled_dep && (
                <div>
                  <span className="timeline-time-label">Sch. Dep: </span>
                  <span className="timeline-time-value">{station.scheduled_dep}</span>
                </div>
              )}
              {station.platform && (
                <div>
                  <span className="timeline-time-label">Pf: </span>
                  <span className="timeline-time-value">{station.platform}</span>
                </div>
              )}
              {station.km != null && (
                <div>
                  <span className="timeline-time-label">Km: </span>
                  <span className="timeline-time-value">{station.km}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StationTimeline
