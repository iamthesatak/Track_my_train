import { useContext, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import SearchBar from '../components/SearchBar'
import TrainCard from '../components/TrainCard'

const popularRoutes = [
  { name: 'Delhi → Mumbai', trains: '12951, 12953', emoji: '🏛️' },
  { name: 'Delhi → Kolkata', trains: '12301, 12313', emoji: '🌉' },
  { name: 'Delhi → Chennai', trains: '12621, 12615', emoji: '🛕' },
  { name: 'Delhi → Bengaluru', trains: '12627, 12213', emoji: '🏙️' },
  { name: 'Mumbai → Delhi', trains: '12951, 12267', emoji: '🌊' },
  { name: 'Delhi → Varanasi', trains: '22435, 12561', emoji: '🕉️' },
  { name: 'Delhi → Hyderabad', trains: '12723, 12285', emoji: '🏰' },
  { name: 'Howrah → Chennai', trains: '12839, 12841', emoji: '🚂' },
]

function HomePage() {
  const { trains, stats, loading } = useContext(AppContext)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const filteredTrains = useMemo(() => {
    if (!trains) return []
    let result = [...trains]
    if (filter === 'rajdhani') result = result.filter(t => t.type === 'Rajdhani')
    else if (filter === 'shatabdi') result = result.filter(t => t.type === 'Shatabdi')
    else if (filter === 'vande_bharat') result = result.filter(t => t.type === 'Vande Bharat')
    else if (filter === 'local') result = result.filter(t => t.type === 'Local')
    else if (filter === 'delayed') result = result.filter(t => t.delay_minutes > 15)
    else if (filter === 'on_time') result = result.filter(t => t.delay_minutes <= 5)
    return result.slice(0, 12)
  }, [trains, filter])

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-badge">
            🤖 ML-Powered • Real-Time Updates • {trains?.length || 0} Trains Tracked
          </div>
          <h1 className="hero-title">
            Track Every <span className="highlight">Indian Railway</span> Train in <span className="accent">Real Time</span>
          </h1>
          <p className="hero-subtitle">
            AI-powered ETA predictions with live tracking, weather integration, and delay forecasting across the entire Indian Railways network.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="grid-4 animate-fadeInUp delay-4">
          <div className="stat-card">
            <div className="stat-value">{stats?.total_trains || trains?.length || '—'}</div>
            <div className="stat-label">Trains Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'var(--gradient-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.on_time_percentage || '—'}%
            </div>
            <div className="stat-label">On-Time Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.average_delay ? `${stats.average_delay}m` : '—'}
            </div>
            <div className="stat-label">Avg. Delay</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.average_speed ? `${Math.round(stats.average_speed)}` : '—'}</div>
            <div className="stat-label">Avg. Speed (km/h)</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container section" style={{ marginTop: '48px' }}>
        <div className="wimt-cta-card animate-fadeInUp delay-5" style={{
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-6)',
          flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', marginBottom: 'var(--space-2)' }}>
              📍 Where is my Train?
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Track any train between two stations. View live position, segment progress, and accurate ETAs.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/track')} style={{ whiteSpace: 'nowrap' }}>
            Try it now →
          </button>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="container section">
        <h2 className="section-title">🛤️ Popular Routes</h2>
        <p className="section-subtitle">Quick access to the most traveled railway corridors</p>
        <div className="routes-grid">
          {popularRoutes.map((route, i) => (
            <div
              key={i}
              className="route-card animate-fadeInUp"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => {
                const trainNum = route.trains.split(',')[0].trim()
                navigate(`/train/${trainNum}`)
              }}
            >
              <div className="route-emoji">{route.emoji}</div>
              <div className="route-info">
                <div className="route-name">{route.name}</div>
                <div className="route-details">Trains: {route.trains}</div>
              </div>
              <span style={{ color: 'var(--text-tertiary)' }}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* Active Trains */}
      <section className="container section">
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h2 className="section-title">🚂 Live Train Status</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Real-time status of active trains across the network
            </p>
          </div>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Trains' },
            { key: 'rajdhani', label: '🏅 Rajdhani' },
            { key: 'shatabdi', label: '⚡ Shatabdi' },
            { key: 'vande_bharat', label: '🚄 Vande Bharat' },
            { key: 'local', label: '🚇 Local / Suburban' },
            { key: 'on_time', label: '✅ On Time' },
            { key: 'delayed', label: '⚠️ Delayed' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`btn ${filter === key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(key)}
              style={{ fontSize: '0.8rem', padding: '6px 16px' }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="grid-3">
            {filteredTrains.map((train, i) => (
              <TrainCard key={train.number} train={train} index={i} />
            ))}
          </div>
        )}

        {!loading && filteredTrains.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No trains found</div>
            <div className="empty-state-text">Try a different filter</div>
          </div>
        )}

        {filteredTrains.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/map')}>
              🗺️ View All on Live Map
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
