import { useContext, useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { AppContext } from '../App'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
    },
    tooltip: {
      backgroundColor: '#1a2235',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } },
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 16 },
    },
  },
}

function DashboardPage() {
  const { trains, stats } = useContext(AppContext)
  const navigate = useNavigate()
  const [delayData, setDelayData] = useState(null)

  useEffect(() => {
    async function fetchDelayStats() {
      try {
        const res = await fetch('/api/stats/delays')
        const data = await res.json()
        setDelayData(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchDelayStats()
    const interval = setInterval(fetchDelayStats, 15000)
    return () => clearInterval(interval)
  }, [])

  // Delay distribution chart
  const delayDistChart = useMemo(() => {
    if (!delayData?.delay_distribution) return null
    const dd = delayData.delay_distribution
    return {
      labels: Object.keys(dd),
      datasets: [{
        data: Object.values(dd),
        backgroundColor: [
          '#10b981', '#06b6d4', '#f59e0b', '#f97316', '#ef4444', '#dc2626',
        ],
        borderWidth: 0,
        borderRadius: 6,
      }],
    }
  }, [delayData])

  // Type-wise delay chart
  const typeDelayChart = useMemo(() => {
    if (!stats?.type_delays) return null
    const types = Object.keys(stats.type_delays)
    const values = Object.values(stats.type_delays)
    return {
      labels: types,
      datasets: [{
        label: 'Average Delay (min)',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
      }],
    }
  }, [stats])

  // On-time vs delayed doughnut
  const statusChart = useMemo(() => {
    if (!stats) return null
    return {
      labels: ['On Time', 'Delayed', 'Severely Delayed'],
      datasets: [{
        data: [stats.on_time || 0, stats.delayed || 0, stats.severely_delayed || 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    }
  }, [stats])

  // Weather distribution doughnut
  const weatherChart = useMemo(() => {
    if (!stats?.weather_distribution) return null
    const wd = stats.weather_distribution
    return {
      labels: Object.keys(wd).map(w => w.replace('_', ' ')),
      datasets: [{
        data: Object.values(wd),
        backgroundColor: ['#fbbf24', '#94a3b8', '#3b82f6', '#2563eb', '#64748b', '#ef4444'],
        borderWidth: 0,
      }],
    }
  }, [stats])

  // Simulated speed trend line chart
  const speedTrendChart = useMemo(() => {
    if (!trains?.length) return null
    const sortedBySpeed = [...trains].sort((a, b) => b.current_speed - a.current_speed).slice(0, 15)
    return {
      labels: sortedBySpeed.map(t => t.number),
      datasets: [{
        label: 'Current Speed (km/h)',
        data: sortedBySpeed.map(t => Math.round(t.current_speed)),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 4,
      }],
    }
  }, [trains])

  return (
    <div className="page-content container">
      <div className="animate-fadeInUp">
        <h1 className="section-title">📊 Network Analytics Dashboard</h1>
        <p className="section-subtitle">
          Real-time performance metrics and delay analysis across the Indian Railways network
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid-4 animate-fadeInUp delay-1" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-value">{stats?.total_trains || '—'}</div>
          <div className="stat-label">Active Trains</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ background: 'var(--gradient-success)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats?.on_time_percentage || '—'}%
          </div>
          <div className="stat-label">Punctuality Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats?.average_delay != null ? `${stats.average_delay}m` : '—'}
          </div>
          <div className="stat-label">Avg Delay</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.average_speed ? `${Math.round(stats.average_speed)}` : '—'}</div>
          <div className="stat-label">Avg Speed (km/h)</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        {/* Status Distribution */}
        <div className="chart-container animate-fadeInUp delay-2">
          <div className="chart-title">🎯 Train Status Distribution</div>
          <div style={{ height: '280px' }}>
            {statusChart ? (
              <Doughnut data={statusChart} options={doughnutOptions} />
            ) : (
              <div className="loading-spinner"></div>
            )}
          </div>
        </div>

        {/* Delay Distribution */}
        <div className="chart-container animate-fadeInUp delay-3">
          <div className="chart-title">📊 Delay Distribution</div>
          <div style={{ height: '280px' }}>
            {delayDistChart ? (
              <Bar data={delayDistChart} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
            ) : (
              <div className="loading-spinner"></div>
            )}
          </div>
        </div>

        {/* Type-wise Delays */}
        <div className="chart-container animate-fadeInUp delay-4">
          <div className="chart-title">🚂 Average Delay by Train Type</div>
          <div style={{ height: '280px' }}>
            {typeDelayChart ? (
              <Bar data={typeDelayChart} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
            ) : (
              <div className="loading-spinner"></div>
            )}
          </div>
        </div>

        {/* Weather Distribution */}
        <div className="chart-container animate-fadeInUp delay-5">
          <div className="chart-title">🌤️ Weather Conditions</div>
          <div style={{ height: '280px' }}>
            {weatherChart ? (
              <Doughnut data={weatherChart} options={doughnutOptions} />
            ) : (
              <div className="loading-spinner"></div>
            )}
          </div>
        </div>

        {/* Speed Distribution */}
        <div className="chart-container animate-fadeInUp" style={{ gridColumn: 'span 2' }}>
          <div className="chart-title">⚡ Top Train Speeds (Live)</div>
          <div style={{ height: '280px' }}>
            {speedTrendChart ? (
              <Line data={speedTrendChart} options={chartOptions} />
            ) : (
              <div className="loading-spinner"></div>
            )}
          </div>
        </div>
      </div>

      {/* Top Delayed Trains Table */}
      {delayData?.top_delayed && (
        <div className="glass-card-static animate-fadeInUp" style={{ marginBottom: '32px' }}>
          <div className="chart-title">⚠️ Top 10 Most Delayed Trains</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {['#', 'Train', 'Type', 'Route', 'Delay'].map(h => (
                    <th key={h} style={{
                      padding: '10px 12px', textAlign: 'left', fontSize: '0.7rem',
                      color: 'var(--text-tertiary)', textTransform: 'uppercase',
                      letterSpacing: '0.08em', fontWeight: 600,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {delayData.top_delayed.map((train, i) => (
                  <tr
                    key={train.number}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onClick={() => navigate(`/train/${train.number}`)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {i + 1}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{train.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>#{train.number}</div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-type">{train.type}</span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {train.source} → {train.destination}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 700,
                        color: train.delay > 30 ? 'var(--danger)' : train.delay > 0 ? 'var(--warning)' : 'var(--success)',
                      }}>
                        {train.delay > 0 ? `+${train.delay}m` : 'On time'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Last updated */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Last updated: {stats?.updated_at ? new Date(stats.updated_at).toLocaleTimeString() : 'Loading...'}
        &nbsp;• Auto-refreshing every 15s
      </div>
    </div>
  )
}

export default DashboardPage
