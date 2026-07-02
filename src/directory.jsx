import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Link } from 'react-router-dom'
import './directory.css'

const cabs = [
  { id: 1, name: 'City Cabs', city: 'Manchester', rating: 4.8, trips: 1200, phone: '0161 123 4567', type: 'Saloon' },
  { id: 2, name: 'Swift Rides', city: 'London', rating: 4.7, trips: 3400, phone: '0207 234 5678', type: 'MPV' },
  { id: 3, name: 'NorthStar Taxis', city: 'Leeds', rating: 4.6, trips: 890, phone: '0113 345 6789', type: 'Saloon' },
  { id: 4, name: 'Express Cars', city: 'Birmingham', rating: 4.9, trips: 2100, phone: '0121 456 7890', type: 'Executive' },
  { id: 5, name: 'QuickCab', city: 'Salford', rating: 4.5, trips: 670, phone: '0161 567 8901', type: 'Saloon' },
  { id: 6, name: 'Royal Rides', city: 'Liverpool', rating: 4.8, trips: 1560, phone: '0151 678 9012', type: 'Executive' },
]

function Directory() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const filtered = cabs.filter(cab =>
    cab.name.toLowerCase().includes(search.toLowerCase()) ||
    cab.city.toLowerCase().includes(search.toLowerCase()) ||
    cab.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="directory">
      <nav className="navbar">
        <div className="logo">🚕 JazzCab</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/directory">Directory</Link>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <Link to="/auth">{user ? (
  <Link to="/dashboard"><button className="nav-btn desktop-only">Dashboard</button></Link>
) : (
  <Link to="/auth"><button className="nav-btn desktop-only">Sign In</button></Link>
)}</Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/directory" onClick={() => setMenuOpen(false)}>Directory</Link>
          <a href="#" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Contact</a>
          {user ? (
  <Link to="/dashboard" onClick={() => setMenuOpen(false)}><button className="nav-btn">Dashboard</button></Link>
) : (
  <Link to="/auth" onClick={() => setMenuOpen(false)}><button className="nav-btn">Sign In</button></Link>
)}
        </div>
      )}

      <div className="dir-header">
        <h1>Taxi <span className="highlight">Directory</span></h1>
        <p>Find verified cab companies near you</p>
        <input
          className="search-box"
          type="text"
          placeholder="Search by city, company or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <p>No cab companies found for "<strong>{search}</strong>"</p>
        </div>
      ) : (
        <div className="cab-grid">
          {filtered.map(cab => (
            <div className="cab-card" key={cab.id}>
              <div className="cab-top">
                <h3>{cab.name}</h3>
                <span className="cab-type">{cab.type}</span>
              </div>
              <div className="cab-city">📍 {cab.city}</div>
              <div className="cab-stats">
                <span>⭐ {cab.rating}</span>
                <span>🚖 {cab.trips} trips</span>
              </div>
              <div className="cab-phone">📞 {cab.phone}</div>
              <button className="cab-btn">Book Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Directory