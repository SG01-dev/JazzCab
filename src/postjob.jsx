import { useState } from 'react'
import { supabase } from './supabase'
import { useNavigate, Link } from 'react-router-dom'
import './postjob.css'

function PostJob() {
  const [pickup, setPickup] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destination, setDestination] = useState('')
  const [destSuggestions, setDestSuggestions] = useState([])
  const [dateTime, setDateTime] = useState('')
  const [notes, setNotes] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const searchAddress = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=gb&format=json&limit=5`
    )
    const data = await res.json()
    setSuggestions(data)
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
                searchAddress(e.target.value, setPickupSuggestions)
              }}
            />
            {pickupSuggestions.length > 0 && (
              <div className="suggestions">
                {pickupSuggestions.map((s, i) => (
                  <div
                    key={i}
                    className="suggestion-item"
                    onClick={() => {
                      setPickup(s.display_name)
                      setPickupSuggestions([])
                    }}
                  >
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
                searchAddress(e.target.value, setDestSuggestions)
              }}
            />
            {destSuggestions.length > 0 && (
              <div className="suggestions">
                {destSuggestions.map((s, i) => (
                  <div
                    key={i}
                    className="suggestion-item"
                    onClick={() => {
                      setDestination(s.display_name)
                      setDestSuggestions([])
                    }}
                  >
                    🏁 {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

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
            <label>💰 Your Budget (£)</label>
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