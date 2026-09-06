import { NavLink, Link } from 'react-router-dom'

function Navbar({ wsConnected }) {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🚂</div>
          <div className="navbar-logo-text">
            Track<span>MyTrain</span>
          </div>
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
            🏠 Home
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            🗺️ Live Map
          </NavLink>
          <NavLink to="/track" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            📍 Where's My Train
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            📊 Dashboard
          </NavLink>
        </div>

        <div className="live-indicator">
          <div className="live-dot" style={{ background: wsConnected ? '#10b981' : '#f59e0b' }}></div>
          {wsConnected ? 'LIVE' : 'POLLING'}
        </div>

        <button className="mobile-menu-btn" aria-label="Toggle menu">
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar
