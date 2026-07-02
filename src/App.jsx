import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">🚕 JazzCab</div>
        <div className="nav-links">
          <a href="#">Home</a>
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
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

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌍 Available across the UK</div>
          <h1>Your Ride, <span className="highlight">Your Way</span></h1>
          <p>Connect with the best taxi services near you. Fast, reliable, and affordable.</p>
          <div className="hero-buttons">
            <Link to="/directory"><button className="btn-primary">Find a Cab</button></Link>
            <Link to="/post-job"><button className="btn-secondary">Post a Job</button></Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-num">500+</span>
          <span className="stat-lbl">Drivers</span>
        </div>
        <div className="stat">
          <span className="stat-num">50+</span>
          <span className="stat-lbl">Cities</span>
        </div>
        <div className="stat">
          <span className="stat-num">4.8★</span>
          <span className="stat-lbl">Rating</span>
        </div>
        <div className="stat">
          <span className="stat-num">24/7</span>
          <span className="stat-lbl">Support</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">📍</div>
            <h3>Enter Location</h3>
            <p>Tell us where you are and where you're going.</p>
          </div>
          <div className="step">
            <div className="step-icon">🚖</div>
            <h3>Choose a Cab</h3>
            <p>Pick from a list of verified drivers near you.</p>
          </div>
          <div className="step">
            <div className="step-icon">✅</div>
            <h3>Ride & Pay</h3>
            <p>Enjoy your ride and pay securely in-app.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <h2>Why JazzCab?</h2>
        <div className="feature-grid">
          <div className="feature-card">⚡ Fast Booking</div>
          <div className="feature-card">🔒 Safe & Secure</div>
          <div className="feature-card">💰 Best Prices</div>
          <div className="feature-card">🌍 Wide Coverage</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 JazzCab. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App