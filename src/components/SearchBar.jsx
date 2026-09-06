import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar({ placeholder = 'Search trains by number, name, or station...', onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const navigate = useNavigate()
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

  const handleSearch = (value) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.length < 2) {
      setResults(null)
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
        const data = await res.json()
        setResults(data)
        setIsOpen(true)
      } catch (err) {
        console.error('Search failed:', err)
      }
    }, 300)
  }

  const handleSelect = (type, item) => {
    setIsOpen(false)
    setQuery('')
    if (type === 'train') {
      navigate(`/train/${item.number}`)
    }
    if (onSelect) onSelect(type, item)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (results?.trains?.length > 0) {
      handleSelect('train', results.trains[0])
    }
  }

  return (
    <div className="search-container" ref={wrapperRef}>
      <form className="search-wrapper" onSubmit={handleSubmit}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results && setIsOpen(true)}
          id="search-input"
        />
        <button type="submit" className="search-btn">
          Track →
        </button>
      </form>

      {isOpen && results && (
        <div className="search-results animate-fadeIn">
          {results.trains?.length > 0 && (
            <>
              <div style={{ padding: '8px 16px', fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Trains
              </div>
              {results.trains.map((train) => (
                <div
                  key={train.number}
                  className="search-result-item"
                  onClick={() => handleSelect('train', train)}
                >
                  <span className="search-result-icon">🚆</span>
                  <div className="search-result-info">
                    <div className="search-result-title">
                      {train.name}
                    </div>
                    <div className="search-result-subtitle">
                      #{train.number} • {train.source} → {train.destination} • {train.type}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {results.stations?.length > 0 && (
            <>
              <div style={{ padding: '8px 16px', fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Stations
              </div>
              {results.stations.map((station) => (
                <div
                  key={station.code}
                  className="search-result-item"
                  onClick={() => handleSelect('station', station)}
                >
                  <span className="search-result-icon">🏛️</span>
                  <div className="search-result-info">
                    <div className="search-result-title">
                      {station.name}
                    </div>
                    <div className="search-result-subtitle">
                      {station.code} • {station.city} • {station.zone}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {(!results.trains?.length && !results.stations?.length) && (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-state-text">No results found for "{query}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
