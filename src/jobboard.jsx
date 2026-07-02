import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Link } from 'react-router-dom'
import './jobboard.css'

function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState({})
  const [bidMessage, setBidMessage] = useState({})
  const [submitting, setSubmitting] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (!error) setJobs(data)
    setLoading(false)
  }

  const handleBid = async (jobId) => {
    setSubmitting(jobId)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be signed in as a driver to place a bid')
      setSubmitting(null)
      return
    }

    const { error } = await supabase.from('bids').insert({
      job_id: jobId,
      driver_id: user.id,
      amount: parseFloat(bidAmount[jobId]),
      message: bidMessage[jobId] || ''
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Bid placed successfully!')
      setBidAmount({ ...bidAmount, [jobId]: '' })
      setBidMessage({ ...bidMessage, [jobId]: '' })
    }

    setSubmitting(null)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="jobboard-page">
      <nav className="navbar">
        <Link to="/" className="logo">🚕 JazzCab</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/directory">Directory</Link>
          <Link to="/jobs">Job Board</Link>
        </div>
        <Link to="/auth"><button className="nav-btn">Sign In</button></Link>
      </nav>

      <div className="jobboard-header">
        <h1>Live <span className="highlight">Job Board</span></h1>
        <p>Browse open ride requests and place your bids</p>
        <Link to="/post-job"><button className="post-btn">+ Post a Job</button></Link>
      </div>

      <div className="jobs-container">
        {loading ? (
          <p className="loading-text">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No open jobs at the moment</p>
            <Link to="/post-job"><button className="post-btn">Be the first to post!</button></Link>
          </div>
        ) : (
          jobs.map(job => (
            <div className="job-card" key={job.id}>
              <div className="job-header">
                <div className="job-route">
                  <span className="job-pickup">📍 {job.pickup}</span>
                  <span className="job-arrow">→</span>
                  <span className="job-dest">🏁 {job.destination}</span>
                </div>
                <span className="job-budget">£{job.budget}</span>
              </div>

              <div className="job-meta">
                <span>📅 {formatDate(job.date_time)}</span>
                {job.notes && <span>📝 {job.notes}</span>}
              </div>

              <div className="bid-section">
                <input
                  className="bid-input"
                  type="number"
                  placeholder="Your bid (£)"
                  value={bidAmount[job.id] || ''}
                  onChange={(e) => setBidAmount({ ...bidAmount, [job.id]: e.target.value })}
                />
                <input
                  className="bid-input"
                  type="text"
                  placeholder="Message to customer (optional)"
                  value={bidMessage[job.id] || ''}
                  onChange={(e) => setBidMessage({ ...bidMessage, [job.id]: e.target.value })}
                />
                <button
                  className="bid-btn"
                  onClick={() => handleBid(job.id)}
                  disabled={submitting === job.id}
                >
                  {submitting === job.id ? 'Placing bid...' : 'Place Bid'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default JobBoard