import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import StationTimeline from '../components/StationTimeline'
import ETAPanel from '../components/ETAPanel'

const weatherIcons = {
  clear: '☀️', cloudy: '⛅', rain: '🌧️',
  heavy_rain: '⛈️', fog: '🌫️', storm: '🌩️',
}

function TrainDetailPage() {
  const { trainNumber } = useParams()
  const navigate = useNavigate()
  const [train, setTrain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPrediction, setSelectedPrediction] = useState(null)

  const fetchTrain = useCallback(async () => {
    try {
      const res = await fetch(`/api/trains/${trainNumber}`)
      const data = await res.json()
      if (data.error) {
        setLoading(false)
        return
      }
      setTrain(data)
      if (data.predictions?.length > 0 && !selectedPrediction) {
        setSelectedPrediction(data.predictions[0])
      } else if (data.predictions?.length > 0) {
        // Update selected prediction
        const updated = data.predictions.find(p => p.station_code === selectedPrediction?.station_code)
        if (updated) setSelectedPrediction(updated)
      }
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch train:', err)
      setLoading(false)
    }
  }, [trainNumber])

  useEffect(() => {
    fetchTrain()
    const interval = setInterval(fetchTrain, 5000)
    return () => clearInterval(interval)
  }, [fetchTrain])

  if (loading) {
    return (
      <div className="page-content container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!train) {
    return (
      <div className="page-content container">
        <div className="empty-state">
          <div className="empty-state-icon">🚫</div>
          <div className="empty-state-title">Train Not Found</div>
          <div className="empty-state-text">Train #{trainNumber} could not be found</div>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    const l = train.status_label
    if (l === 'on_time') return <span className="badge badge-success">● On Time</span>
    if (l === 'slightly_delayed') return <span className="badge badge-warning">● Slight Delay</span>
    if (l === 'delayed') return <span className="badge badge-warning">● Delayed</span>
    if (l === 'severely_delayed') return <span className="badge badge-danger">● Severe Delay</span>
    return <span className="badge badge-info">● {train.status}</span>
  }

  // Build route coordinates for polyline
  const routeCoords = []
  const allStops = [
    ...(train.completed_stations || []),
    ...(train.current_station ? [train.current_station] : []),
    ...(train.upcoming_stations || []),
  ]

  return (
    <div className="page-content container">
      {/* Back button */}
      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        ← Back
      </button>

      {/* Header */}
      <div className="detail-header animate-fadeInUp">
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="detail-train-number">Train #{train.number}</div>
            <h1 className="detail-train-name">{train.name}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              <span className="badge badge-type">{train.type}</span>
              {getStatusBadge()}
              <span className="badge badge-info">
                {weatherIcons[train.weather]} {train.weather}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: train.delay_minutes > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {train.delay_minutes > 0 ? `+${train.delay_minutes}` : train.delay_minutes}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              minutes {train.delay_minutes > 0 ? 'late' : train.delay_minutes < 0 ? 'early' : ''}
            </div>
          </div>
        </div>

        {/* Route progress */}
        <div className="detail-route-display" style={{ marginTop: '24px' }}>
          <div className="detail-route-station">
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>FROM</div>
            <div style={{ fontWeight: 700 }}>{train.source?.name}</div>
          </div>
          <div className="detail-route-line" style={{ minWidth: '100px' }}>
            <div className="progress-fill" style={{ width: `${train.progress}%` }}></div>
            <div className="progress-dot" style={{ left: `${train.progress}%` }}></div>
          </div>
          <div className="detail-route-station" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>TO</div>
            <div style={{ fontWeight: 700 }}>{train.destination?.name}</div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid-4" style={{ marginTop: '20px', gap: '12px' }}>
          <div className="stat-card" style={{ padding: '12px' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {Math.round(train.current_speed)}
            </div>
            <div className="stat-label">Speed (km/h)</div>
          </div>
          <div className="stat-card" style={{ padding: '12px' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {train.progress?.toFixed(1)}%
            </div>
            <div className="stat-label">Complete</div>
          </div>
          <div className="stat-card" style={{ padding: '12px' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {Math.round(train.current_km)}
            </div>
            <div className="stat-label">Km Covered</div>
          </div>
          <div className="stat-card" style={{ padding: '12px' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {train.total_distance - Math.round(train.current_km)}
            </div>
            <div className="stat-label">Km Remaining</div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="detail-grid">
        {/* Left column: Timeline + Map */}
        <div>
          {/* Mini Map */}
          {train.position?.lat && (
            <div className="glass-card-static" style={{ marginBottom: '24px', padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '16px 16px 8px' }}>
                <h3 className="detail-section-title">📍 Live Position</h3>
              </div>
              <div style={{ height: '280px' }}>
                <MapContainer
                  center={[train.position.lat, train.position.lng]}
                  zoom={7}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[train.position.lat, train.position.lng]}
                    icon={L.divIcon({
                      className: 'train-marker',
                      html: '<div class="train-marker-inner on_time" style="width:32px;height:32px;font-size:16px">🚆</div>',
                      iconSize: [32, 32],
                      iconAnchor: [16, 16],
                    })}
                  >
                    <Popup>
                      <strong>{train.name}</strong><br />
                      Speed: {Math.round(train.current_speed)} km/h
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          {/* Station Timeline */}
          <div className="glass-card-static">
            <h3 className="detail-section-title">🚉 Station Timeline</h3>
            <StationTimeline
              completedStations={train.completed_stations}
              currentStation={train.current_station}
              upcomingStations={train.upcoming_stations}
            />
          </div>
        </div>

        {/* Right column: ETA + Info */}
        <div>
          {/* ETA Prediction Panel */}
          <div style={{ marginBottom: '24px' }}>
            <h3 className="detail-section-title" style={{ marginBottom: '12px' }}>🤖 ETA Prediction</h3>

            {train.upcoming_stations?.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {train.upcoming_stations.map((s) => (
                  <button
                    key={s.code}
                    className={`btn ${selectedPrediction?.station_code === s.code ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/trains/${train.number}/eta/${s.code}`)
                        const data = await res.json()
                        if (!data.error) setSelectedPrediction(data)
                      } catch (e) {
                        console.error(e)
                      }
                    }}
                  >
                    {s.code}
                  </button>
                ))}
              </div>
            )}

            <ETAPanel prediction={selectedPrediction} />
          </div>

          {/* Train Info */}
          <div className="glass-card-static">
            <h3 className="detail-section-title">ℹ️ Train Information</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                ['Train Number', `#${train.number}`],
                ['Train Name', train.name],
                ['Type', train.type],
                ['Source', train.source?.name],
                ['Destination', train.destination?.name],
                ['Total Distance', `${train.total_distance} km`],
                ['Max Speed', `${train.max_speed} km/h`],
                ['Running Days', train.days?.join(', ') || 'Daily'],
                ['Weather', `${weatherIcons[train.weather] || ''} ${train.weather}`],
                ['Current Status', train.status],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainDetailPage
