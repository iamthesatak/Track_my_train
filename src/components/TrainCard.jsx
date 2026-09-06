import { useNavigate } from 'react-router-dom'

const weatherIcons = {
  clear: '☀️',
  cloudy: '⛅',
  rain: '🌧️',
  heavy_rain: '⛈️',
  fog: '🌫️',
  storm: '🌩️',
}

function TrainCard({ train, index = 0 }) {
  const navigate = useNavigate()

  const getStatusBadge = () => {
    const label = train.status_label
    if (label === 'on_time') return <span className="badge badge-success">● On Time</span>
    if (label === 'slightly_delayed') return <span className="badge badge-warning">● Slight Delay</span>
    if (label === 'delayed') return <span className="badge badge-warning">● Delayed</span>
    if (label === 'severely_delayed') return <span className="badge badge-danger">● Severe Delay</span>
    return <span className="badge badge-info">● {train.status}</span>
  }

  const getDelayClass = () => {
    if (train.delay_minutes > 0) return 'positive'
    if (train.delay_minutes < 0) return 'negative'
    return 'zero'
  }

  const getDelayText = () => {
    if (train.delay_minutes > 0) return `+${train.delay_minutes} min late`
    if (train.delay_minutes < 0) return `${Math.abs(train.delay_minutes)} min early`
    return 'On time'
  }

  return (
    <div
      className={`train-card ${train.status_label} animate-fadeInUp delay-${(index % 5) + 1}`}
      onClick={() => navigate(`/train/${train.number}`)}
      id={`train-card-${train.number}`}
    >
      <div className="train-card-header">
        <div>
          <div className="train-number">#{train.number}</div>
          <div className="train-name">{train.name}</div>
          <span className="badge badge-type" style={{ marginTop: '4px' }}>{train.type}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="train-route">
        <span className="train-route-station">{train.source?.name || train.source}</span>
        <span className="train-route-arrow">→</span>
        <span className="train-route-station">{train.destination?.name || train.destination}</span>
      </div>

      <div className="train-progress">
        <div className="train-progress-bar" style={{ width: `${train.progress || 0}%` }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        <span>{train.last_station?.name || '—'}</span>
        <span>{train.progress?.toFixed(1)}% complete</span>
        <span>{train.next_station?.name || '—'}</span>
      </div>

      <div className="train-card-footer">
        <div className="train-speed">
          {weatherIcons[train.weather] || '☀️'} {Math.round(train.current_speed)} km/h
        </div>
        <div className={`train-delay ${getDelayClass()}`}>
          {getDelayText()}
        </div>
      </div>
    </div>
  )
}

export default TrainCard
