import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { AppContext } from '../App'

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const statusColors = {
  on_time: '#10b981',
  slightly_delayed: '#f59e0b',
  delayed: '#f97316',
  severely_delayed: '#ef4444',
}

function createTrainIcon(train) {
  const color = statusColors[train.status_label] || '#3b82f6'
  return L.divIcon({
    className: 'train-marker',
    html: `<div class="train-marker-inner" style="background:${color}">🚆</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center])
  return null
}

function LiveMapPage() {
  const { trains, stats } = useContext(AppContext)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTrain, setSelectedTrain] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filteredTrains = useMemo(() => {
    if (!trains) return []
    let result = trains
    if (selectedType !== 'all') {
      result = result.filter(t => t.type === selectedType)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.number.includes(q) ||
        t.name.toLowerCase().includes(q)
      )
    }
    return result
  }, [trains, selectedType, searchQuery])

  const trainTypes = ['all', 'Rajdhani', 'Shatabdi', 'Vande Bharat', 'Duronto', 'Superfast', 'Express', 'Mail']

  // India center coordinates
  const indiaCenter = [22.5, 79.0]

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <div className="map-container">
        <MapContainer
          center={indiaCenter}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredTrains.map((train) => {
            if (!train.position?.lat || !train.position?.lng) return null
            return (
              <Marker
                key={train.number}
                position={[train.position.lat, train.position.lng]}
                icon={createTrainIcon(train)}
                eventHandlers={{
                  click: () => setSelectedTrain(train),
                }}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                      {train.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                      #{train.number} • {train.type}
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                      {train.source?.name} → {train.destination?.name}
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                      Speed: <strong>{Math.round(train.current_speed)} km/h</strong>
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                      Delay: <strong style={{ color: train.delay_minutes > 0 ? '#ef4444' : '#10b981' }}>
                        {train.delay_minutes > 0 ? `+${train.delay_minutes} min` : train.delay_minutes < 0 ? `${train.delay_minutes} min early` : 'On time'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                      Progress: {train.progress?.toFixed(1)}%
                    </div>
                    <button
                      onClick={() => navigate(`/train/${train.number}`)}
                      style={{
                        marginTop: '8px',
                        padding: '4px 12px',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

        {/* Sidebar */}
        <div className="map-sidebar">
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Search trains on map..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {filteredTrains.length} trains visible
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredTrains.slice(0, 20).map((train) => (
              <div
                key={train.number}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(`/train/${train.number}`)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {train.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                    #{train.number}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: train.delay_minutes > 0 ? 'var(--danger)' : 'var(--success)',
                  }}>
                    {train.delay_minutes > 0 ? `+${train.delay_minutes}m` : 'On time'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type Filters */}
        <div className="map-controls">
          {trainTypes.map((type) => (
            <button
              key={type}
              className={`map-filter-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? '🚂 All' : type}
            </button>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="map-stats">
          <div className="map-stat">
            <div className="map-stat-value" style={{ color: 'var(--success)' }}>
              {stats?.on_time || '—'}
            </div>
            <div className="map-stat-label">On Time</div>
          </div>
          <div className="map-stat">
            <div className="map-stat-value" style={{ color: 'var(--warning)' }}>
              {stats?.delayed || '—'}
            </div>
            <div className="map-stat-label">Delayed</div>
          </div>
          <div className="map-stat">
            <div className="map-stat-value" style={{ color: 'var(--danger)' }}>
              {stats?.severely_delayed || '—'}
            </div>
            <div className="map-stat-label">Severe</div>
          </div>
          <div className="map-stat">
            <div className="map-stat-value">{Math.round(stats?.average_speed || 0)}</div>
            <div className="map-stat-label">Avg km/h</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveMapPage
