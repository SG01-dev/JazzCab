import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Directory.css'

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
          <a href="#">Services</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <button className="nav-btn">Get a Ride</button>
      </nav>

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