import './App.css'

function App() {
  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">🚕 JazzCab</div>
        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        <button className="nav-btn">Get a Ride</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌍 Available across the UK</div>
          <h1>Your Ride, <span className="highlight">Your Way</span></h1>
          <p>Connect with the best taxi services near you. Fast, reliable, and affordable.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Book a Ride</button>
            <button className="btn-secondary">List Your Cab</button>
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
      <section className="how-it-works">
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
      <section className="features">
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