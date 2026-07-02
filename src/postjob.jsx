import { useState } from 'react'
import { supabase } from './supabase'
import { useNavigate, Link } from 'react-router-dom'
import './postjob.css'

function PostJob() {
  const [pickup, setPickup] = useState('')
  const [pickupCoords, setPickupCoords] = useState(null)
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destination, setDestination] = useState('')
  const [destCoords, setDestCoords] = useState(null)
  const [destSuggestions, setDestSuggestions] = useState([])
  const [dateTime, setDateTime] = useState('')
  const [notes, setNotes] = useState('')
  const [budget, setBudget] = useState('')
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [calculating, setCalculating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const searchAddress = async (query, setSuggestions) => {
    if (query.length < 3) { setSuggestions([]); return }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=gb&format=json&limit=5`
    )
    const data = await res.json()
    setSuggestions(data)
  }

  const calculateRoute = async (pCoords, dCoords) => {
    if (!pCoords || !dCoords) return
    setCalculating(true)
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pCoords.lon},${pCoords.lat};${dCoords.lon},${dCoords.lat}?overview=false`
      )
      const data = await res.json()
      if (data.routes && data.routes[0]) {
        const distanceMiles = (data.routes[0].distance / 1609.34).toFixed(1)
        const durationMins = Math.round(data.routes[0].duration / 60)
        setDistance(distanceMiles)
        setDuration(durationMins)
        const suggestedPrice = Math.round(distanceMiles * 2.5 + 3)
        setBudget(suggestedPrice)
      }
    } catch (e) {
      console.error('Route calculation failed', e)
    }
    setCalculating(false)
  }

  const selectPickup = (s) => {
    setPickup(s.display_name)
    setPickupSuggestions([])
    const coords = { lat: s.lat, lon: s.lon }
    setPickupCoords(coords)
    if (destCoords) calculateRoute(coords, destCoords)
  }

  const selectDest = (s) => {
    setDestination(s.display_name)
    setDestSuggestions([])
    const coords = { lat: s.lat, lon: s.lon }
    setDestCoords(coords)
    if (pickupCoords) calculateRoute(pickupCoords, coords)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be signed in to post a job')
      setLoading(false)
      return
    }
    const { error } = await supabase.from('jobs').insert({
      customer_id: user.id,
      pickup,
      destination,
      date_time: dateTime,
      notes,
      budget: parseFloat(budget)
    })
    if (error) setError(error.message)
    else navigate('/jobs')
    setLoading(false)
  }

  return (
    <div className="postjob-page">
      <nav className="navbar">
        <Link to="/" className="logo">🚕 JazzCab</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/directory">Directory</Link>
          <Link to="/jobs">Job Board</Link>
        </div>
        <Link to="/auth"><button className="nav-btn">Sign In</button></Link>
      </nav>

      <div className="postjob-container">
        <div className="postjob-box">
          <h1>Post a <span className="highlight">Ride Job</span></h1>
          <p className="postjob-sub">Tell drivers where you need to go and get the best bids</p>

          <div className="form-group">
            <label>📍 Pickup Location</label>
            <input
              className="form-input"
              type="text"
              placeholder="Type postcode or address..."
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value)
                setPickupCoords(null)
                setDistance(null)
                searchAddress(e.target.value, setPickupSuggestions)
              }}
            />
            {pickupSuggestions.length > 0 && (
              <div className="suggestions">
                {pickupSuggestions.map((s, i) => (
                  <div key={i} className="suggestion-item" onClick={() => selectPickup(s)}>
                    📍 {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>🏁 Destination</label>
            <input
              className="form-input"
              type="text"
              placeholder="Type postcode or address..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value)
                setDestCoords(null)
                setDistance(null)
                searchAddress(e.target.value, setDestSuggestions)
              }}
            />
            {destSuggestions.length > 0 && (
              <div className="suggestions">
                {destSuggestions.map((s, i) => (
                  <div key={i} className="suggestion-item" onClick={() => selectDest(s)}>
                    🏁 {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {calculating && (
            <div className="route-info calculating">
              ⏳ Calculating route...
            </div>
          )}

          {distance && !calculating && (
            <div className="route-info">
              <div className="route-stat">
                <span className="route-label">Distance</span>
                <span className="route-value">🛣️ {distance} miles</span>
              </div>
              <div className="route-stat">
                <span className="route-label">Est. Time</span>
                <span className="route-value">⏱️ {duration} mins</span>
              </div>
              <div className="route-stat">
                <span className="route-label">Suggested Price</span>
                <span className="route-value">💰 £{budget}</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>📅 Date & Time</label>
            <input
              className="form-input"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>💰 Your Budget (£) {distance && <span className="suggested-tag">auto-calculated</span>}</label>
            <input
              className="form-input"
              type="number"
              placeholder="e.g. 25"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>📝 Notes (optional)</label>
            <textarea
              className="form-input"
              placeholder="e.g. 2 passengers, need help with luggage"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostJob