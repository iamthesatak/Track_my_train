import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, createContext, useCallback } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LiveMapPage from './pages/LiveMapPage'
import TrainDetailPage from './pages/TrainDetailPage'
import DashboardPage from './pages/DashboardPage'
import WhereIsMyTrainPage from './pages/WhereIsMyTrainPage'

export const AppContext = createContext(null)

const API_BASE = '/api'

function App() {
  const [trains, setTrains] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)

  const fetchTrains = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/trains`)
      const data = await res.json()
      setTrains(data.trains || [])
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch trains:', err)
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [])

  useEffect(() => {
    fetchTrains()
    fetchStats()

    // Set up WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws/live`
    let ws = null
    let reconnectTimer = null

    const connectWs = () => {
      try {
        ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          setWsConnected(true)
          console.log('WebSocket connected')
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'update') {
              setTrains(data.trains || [])
              if (data.stats) setStats(data.stats)
            }
          } catch (e) {
            console.error('WS parse error:', e)
          }
        }

        ws.onclose = () => {
          setWsConnected(false)
          // Reconnect after 5s
          reconnectTimer = setTimeout(connectWs, 5000)
        }

        ws.onerror = () => {
          setWsConnected(false)
        }
      } catch (e) {
        // Fallback to polling if WebSocket fails
        setWsConnected(false)
      }
    }

    connectWs()

    // Fallback polling
    const pollInterval = setInterval(() => {
      if (!wsConnected) {
        fetchTrains()
        fetchStats()
      }
    }, 8000)

    return () => {
      if (ws) ws.close()
      if (reconnectTimer) clearTimeout(reconnectTimer)
      clearInterval(pollInterval)
    }
  }, [])

  const contextValue = {
    trains,
    stats,
    loading,
    wsConnected,
    fetchTrains,
    API_BASE,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Navbar wsConnected={wsConnected} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<LiveMapPage />} />
        <Route path="/train/:trainNumber" element={<TrainDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/track" element={<WhereIsMyTrainPage />} />
      </Routes>
      <Routes>
        <Route path="/map" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </AppContext.Provider>
  )
}

export default App
