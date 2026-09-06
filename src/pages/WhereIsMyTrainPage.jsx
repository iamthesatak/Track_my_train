import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const weatherIcons = {
  clear: '☀️', cloudy: '⛅', rain: '🌧️',
  heavy_rain: '⛈️', fog: '🌫️', storm: '🌩️',
}

function StationPicker({ label, value, onChange, placeholder, stations, icon }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredStations, setFilteredStations] = useState([])
  const wrapperRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInput = (val) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.length < 1) {
      setFilteredStations([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`)
        const data = await res.json()
        setFilteredStations(data.stations || [])
        setIsOpen(true)
      } catch (e) {
        console.error(e)
      }
    }, 250)
  }

  const selectStation = (station) => {
    onChange(station)
    setQuery(`${station.name} (${station.code})`)
    setIsOpen(false)
  }

  // Sync display text when value changes externally (e.g. swap)
  useEffect(() => {
    if (value) {
      setQuery(`${value.name} (${value.code})`)
    } else {
      setQuery('')
    }
  }, [value])

  return (
    <div className="station-picker" ref={wrapperRef}>
      <div className="station-picker-label">
        <span className="station-picker-icon">{icon}</span>
        {label}
      </div>
      <input
        type="text"
        className="station-picker-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => filteredStations.length > 0 && setIsOpen(true)}
      />
      {isOpen && filteredStations.length > 0 && (
        <div className="station-picker-dropdown animate-fadeIn">
          {filteredStations.map((s) => (
            <div
              key={s.code}
              className="station-picker-option"
              onClick={() => selectStation(s)}
            >
              <span className="station-picker-option-code">{s.code}</span>
              <div>
                <div className="station-picker-option-name">{s.name}</div>
                <div className="station-picker-option-city">{s.city} • {s.zone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SegmentProgress({ train }) {
  const getStatusColor = () => {
    if (train.segment_status === 'passed') return 'var(--success)'
    if (train.segment_status === 'not_entered') return 'var(--text-tertiary)'
    if (train.delay_minutes > 30) return 'var(--danger)'
    if (train.delay_minutes > 10) return 'var(--warning)'
    return 'var(--accent-blue)'
  }

  const segStations = train.segment_stations || []

  return (
    <div className="segment-progress-container">
      <div className="segment-progress-track">
        <div
          className="segment-progress-fill"
          style={{
            width: `${train.segment_progress}%`,
            background: `linear-gradient(90deg, ${getStatusColor()}, ${getStatusColor()}88)`,
          }}
        />
        {train.segment_status === 'in_segment' && (
          <div
            className="segment-progress-train"
            style={{ left: `${train.segment_progress}%` }}
          >
            🚆
          </div>
        )}
      </div>
      <div className="segment-progress-stations">
        {segStations.map((s, i) => {
          const pct = train.segment_distance > 0
            ? ((s.km - (segStations[0]?.km || 0)) / train.segment_distance) * 100
            : (i / (segStations.length - 1)) * 100
          return (
            <div
              key={s.code}
              className="segment-progress-stop"
              style={{ left: `${pct}%` }}
            >
              <div className={`segment-stop-dot ${
                train.current_km >= s.km ? 'passed' : ''
              }`} />
              <div className="segment-stop-label">{s.code}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WhereIsMyTrainPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [fromStation, setFromStation] = useState(null)
  const [toStation, setToStation] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const pollRef = useRef(null)

  const fetchBetween = useCallback(async (from, to) => {
    if (!from || !to) return
    try {
      const res = await fetch(`/api/trains/between?from=${from}&to=${to}`)
      const data = await res.json()
      setResults(data)
      setLoading(false)
      setError(null)
    } catch (e) {
      console.error('Failed to fetch:', e)
      setError('Failed to fetch train data. Please try again.')
      setLoading(false)
    }
  }, [])

  // Initialize from URL params
  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    if (from && to) {
      // Fetch station info
      fetch(`/api/search?q=${from}`).then(r => r.json()).then(d => {
        const station = d.stations?.find(s => s.code === from.toUpperCase())
        if (station) setFromStation(station)
      })
      fetch(`/api/search?q=${to}`).then(r => r.json()).then(d => {
        const station = d.stations?.find(s => s.code === to.toUpperCase())
        if (station) setToStation(station)
      })
      setLoading(true)
      fetchBetween(from, to)
    }
  }, [])

  // Poll for live updates
  useEffect(() => {
    if (results && fromStation && toStation) {
      pollRef.current = setInterval(() => {
        fetchBetween(fromStation.code, toStation.code)
      }, 6000)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [results, fromStation, toStation, fetchBetween])

  const handleSearch = () => {
    if (!fromStation || !toStation) return
    setLoading(true)
    setResults(null)
    setSearchParams({ from: fromStation.code, to: toStation.code })
    fetchBetween(fromStation.code, toStation.code)
  }

  const handleSwap = () => {
    const temp = fromStation
    setFromStation(toStation)
    setToStation(temp)
  }

  const getDelayBadge = (d) => {
    if (d > 30) return <span className="badge badge-danger">+{d}m late</span>
    if (d > 0) return <span className="badge badge-warning">+{d}m late</span>
    if (d < 0) return <span className="badge badge-success">{Math.abs(d)}m early</span>
    return <span className="badge badge-success">On time</span>
  }

  const getSegStatusText = (status) => {
    if (status === 'not_entered') return '⏳ Not yet entered this segment'
    if (status === 'passed') return '✅ Already passed this segment'
    return '🚂 Currently in this segment'
  }

  return (
    <div className="page-content container">
      {/* Hero Header */}
      <div className="wimt-hero animate-fadeInUp">
        <div className="wimt-hero-icon">📍</div>
        <h1 className="wimt-title">Where is my Train?</h1>
        <p className="wimt-subtitle">
          Track any train between two stations in real-time. See live position, speed, delay, and predicted arrival.
        </p>
      </div>

      {/* Station Picker */}
      <div className="wimt-picker-card animate-fadeInUp delay-1">
        <div className="wimt-picker-grid">
          <StationPicker
            label="From Station"
            value={fromStation}
            onChange={setFromStation}
            placeholder="e.g. Mumbai Central, CSMT, Churchgate..."
            icon="🟢"
          />

          <button className="wimt-swap-btn" onClick={handleSwap} title="Swap stations">
            ⇄
          </button>

          <StationPicker
            label="To Station"
            value={toStation}
            onChange={setToStation}
            placeholder="e.g. New Delhi, Thane, Virar..."
            icon="🔴"
          />
        </div>

        <button
          className="btn btn-primary wimt-search-btn"
          onClick={handleSearch}
          disabled={!fromStation || !toStation || loading}
        >
          {loading ? '🔍 Searching...' : '🔍 Find Trains'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-spinner" style={{ marginTop: '48px' }}></div>
      )}

      {/* Error */}
      {error && (
        <div className="wimt-error animate-fadeIn">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-text">{error}</div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="animate-fadeInUp delay-2">
          {/* Route header */}
          <div className="wimt-route-header">
            <div className="wimt-route-from">
              <div className="wimt-route-label">FROM</div>
              <div className="wimt-route-name">{results.from?.name || results.from}</div>
              <div className="wimt-route-code">{results.from?.code}</div>
            </div>
            <div className="wimt-route-arrow">→</div>
            <div className="wimt-route-to">
              <div className="wimt-route-label">TO</div>
              <div className="wimt-route-name">{results.to?.name || results.to}</div>
              <div className="wimt-route-code">{results.to?.code}</div>
            </div>
            <div className="wimt-route-count">
              <span className="wimt-count-number">{results.count}</span>
              <span className="wimt-count-label">trains found</span>
            </div>
          </div>

          {/* Train results */}
          {results.count === 0 ? (
            <div className="empty-state" style={{ marginTop: '32px' }}>
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-title">No direct trains found</div>
              <div className="empty-state-text">
                No trains run directly between these two stations. Try different stations or check reverse direction.
              </div>
              <button className="btn btn-secondary" onClick={handleSwap} style={{ marginTop: '16px' }}>
                ⇄ Try Reverse Direction
              </button>
            </div>
          ) : (
            <div className="wimt-results">
              {results.trains.map((train, idx) => (
                <div
                  key={train.number}
                  className={`wimt-result-card ${train.status_label} animate-fadeInUp`}
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  {/* Card header */}
                  <div className="wimt-card-header">
                    <div>
                      <div className="wimt-card-number">#{train.number}</div>
                      <div className="wimt-card-name">{train.name}</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span className="badge badge-type">{train.type}</span>
                        {getDelayBadge(train.delay_minutes)}
                        <span className="badge badge-info">
                          {weatherIcons[train.weather]} {train.weather}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="wimt-card-speed">
                        {Math.round(train.current_speed)} <span>km/h</span>
                      </div>
                      <div className="wimt-card-seg-status">
                        {getSegStatusText(train.segment_status)}
                      </div>
                    </div>
                  </div>

                  {/* Full route context */}
                  <div className="wimt-full-route">
                    <span>{train.source?.name}</span>
                    <span className="wimt-full-route-arrow">→</span>
                    <span>{train.destination?.name}</span>
                    <span className="wimt-full-route-pct">{train.progress?.toFixed(1)}% complete</span>
                  </div>

                  {/* Segment progress */}
                  <div className="wimt-segment-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Route segment: {results.from?.name} → {results.to?.name} ({train.segment_distance} km)</span>
                    <span style={{ color: 'var(--accent-blue-light)' }}>
                      Departs <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{train.segment_dep_time}</span>
                    </span>
                  </div>
                  <SegmentProgress train={train} />

                  {/* Bottom stats */}
                  <div className="wimt-card-stats">
                    <div className="wimt-stat">
                      <div className="wimt-stat-value">{train.segment_progress}%</div>
                      <div className="wimt-stat-label">Segment</div>
                    </div>
                    <div className="wimt-stat">
                      <div className="wimt-stat-value">{Math.round(train.current_speed)}</div>
                      <div className="wimt-stat-label">km/h</div>
                    </div>
                    <div className="wimt-stat">
                      <div className="wimt-stat-value" style={{
                        color: train.delay_minutes > 0 ? 'var(--danger)' : 'var(--success)',
                      }}>
                        {train.delay_minutes > 0 ? `+${train.delay_minutes}` : train.delay_minutes}m
                      </div>
                      <div className="wimt-stat-label">Delay</div>
                    </div>
                    {train.eta && (
                      <div className="wimt-stat">
                        <div className="wimt-stat-value wimt-stat-eta">{train.eta.predicted_arrival}</div>
                        <div className="wimt-stat-label">ETA at {results.to?.code}</div>
                      </div>
                    )}
                    {train.eta && (
                      <div className="wimt-stat">
                        <div className="wimt-stat-value" style={{
                          color: train.eta.confidence === 'high' ? 'var(--success)' :
                                 train.eta.confidence === 'medium' ? 'var(--warning)' : 'var(--danger)'
                        }}>
                          {train.eta.confidence_percentage}%
                        </div>
                        <div className="wimt-stat-label">Confidence</div>
                      </div>
                    )}
                  </div>

                  {/* View details */}
                  <button
                    className="btn btn-secondary wimt-details-btn"
                    onClick={() => navigate(`/train/${train.number}`)}
                  >
                    View Full Details →
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Auto-refresh note */}
          {results.count > 0 && (
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '24px' }}>
              🔄 Auto-refreshing every 6 seconds • Data is simulated for demonstration
            </div>
          )}
        </div>
      )}

      {/* Empty state — no search yet */}
      {!results && !loading && !error && (
        <div className="wimt-empty animate-fadeInUp delay-3">
          <div className="wimt-empty-icon">🚂</div>
          <div className="wimt-empty-title">Search for trains between stations</div>
          <div className="wimt-empty-text">
            Select your departure and arrival stations above to find all trains running between them with real-time tracking.
          </div>
          <div className="wimt-suggestions">
            <div className="wimt-suggestion-title">🔥 Popular searches</div>
            <div className="wimt-suggestion-grid">
              {[
                { from: { code: 'CCG', name: 'Churchgate' }, to: { code: 'VIR', name: 'Virar' }, label: 'Mumbai WL' },
                { from: { code: 'CSMT', name: 'CSMT' }, to: { code: 'KYN', name: 'Kalyan' }, label: 'Mumbai CL' },
                { from: { code: 'BCT', name: 'Mumbai Central' }, to: { code: 'NDLS', name: 'New Delhi' }, label: 'Rajdhani' },
                { from: { code: 'SDAH', name: 'Sealdah' }, to: { code: 'RNG', name: 'Ranaghat' }, label: 'Kolkata' },
                { from: { code: 'MSB', name: 'Chennai Beach' }, to: { code: 'TBM', name: 'Tambaram' }, label: 'Chennai' },
                { from: { code: 'NDLS', name: 'New Delhi' }, to: { code: 'HWH', name: 'Howrah' }, label: 'Howrah Rajdhani' },
              ].map((s, i) => (
                <button
                  key={i}
                  className="wimt-suggestion-btn"
                  onClick={() => {
                    setFromStation(s.from)
                    setToStation(s.to)
                    setLoading(true)
                    setSearchParams({ from: s.from.code, to: s.to.code })
                    fetchBetween(s.from.code, s.to.code)
                  }}
                >
                  <span className="wimt-sug-route">{s.from.name} → {s.to.name}</span>
                  <span className="wimt-sug-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhereIsMyTrainPage
