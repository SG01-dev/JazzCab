import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { Link, useNavigate } from 'react-router-dom'
import './dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [jobs, setJobs] = useState([])
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserAndData()
  }, [])

  const fetchUserAndData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { navigate('/auth'); return }
    setUser(user)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setUserType(profile.user_type)
      if (profile.user_type === 'customer') {
        fetchCustomerJobs(user.id)
      } else {
        fetchDriverBids(user.id)
      }
    } else {
      // No profile yet - fetch jobs as customer by default
      setUserType('customer')
      fetchCustomerJobs(user.id)
    }
  }

  const fetchCustomerJobs = async (userId) => {
    const { data } = await supabase
      .from('jobs')
      .select('*, bids(*)')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  const fetchDriverBids = async (userId) => {
    const { data } = await supabase
      .from('bids')
      .select('*, jobs(*)')
      .eq('driver_id', userId)
      .order('created_at', { ascending: false })
    setBids(data || [])
    setLoading(false)
  }

  const acceptBid = async (bidId, jobId) => {
    await supabase.from('bids').update({ status: 'accepted' }).eq('id', bidId)
    await supabase.from('jobs').update({ status: 'accepted' }).eq('id', jobId)
    await supabase.from('bids').update({ status: 'declined' }).neq('id', bidId).eq('job_id', jobId)
    fetchCustomerJobs(user.id)
  }

  const declineBid = async (bidId) => {
    await supabase.from('bids').update({ status: 'declined' }).eq('id', bidId)
    fetchCustomerJobs(user.id)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <Link to="/" className="logo">🚕 JazzCab</Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Job Board</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <button className="nav-btn" onClick={handleSignOut}>Sign Out</button>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{userType === 'driver' ? '🚖 Driver' : '👤 Customer'} <span className="highlight">Dashboard</span></h1>
          <p>{userType === 'driver' ? 'Manage your bids and jobs' : 'Track your ride requests and bids'}</p>
          {userType === 'customer' && (
            <Link to="/post-job"><button className="post-btn">+ Post New Job</button></Link>
          )}
        </div>

        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : userType === 'customer' ? (
          <div className="jobs-list">
            {jobs.length === 0 ? (
              <div className="empty-state">
                <p>You haven't posted any jobs yet</p>
                <Link to="/post-job"><button className="post-btn">Post your first job</button></Link>
              </div>
            ) : jobs.map(job => (
              <div className="dash-card" key={job.id}>
                <div className="dash-card-header">
                  <div className="job-route">
                    <span className="job-pickup">📍 {job.pickup}</span>
                    <span className="job-arrow">→</span>
                    <span className="job-dest">🏁 {job.destination}</span>
                  </div>
                  <span className={`status-badge ${job.status}`}>{job.status}</span>
                </div>
                <div className="job-meta">
                  <span>📅 {formatDate(job.date_time)}</span>
                  <span>💰 £{job.budget}</span>
                </div>

                {job.bids && job.bids.length > 0 && (
                  <div className="bids-list">
                    <h4>Bids ({job.bids.length})</h4>
                    {job.bids.map(bid => (
                      <div className="bid-item" key={bid.id}>
                        <div className="bid-info">
                          <span className="bid-amount">£{bid.amount}</span>
                          {bid.message && <span className="bid-msg">{bid.message}</span>}
                          <span className={`bid-status ${bid.status}`}>{bid.status}</span>
                        </div>
                        {bid.status === 'pending' && job.status === 'open' && (
                          <div className="bid-actions">
                            <button className="accept-btn" onClick={() => acceptBid(bid.id, job.id)}>✅ Accept</button>
                            <button className="decline-btn" onClick={() => declineBid(bid.id)}>❌ Decline</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {job.bids && job.bids.length === 0 && (
                  <p className="no-bids">No bids yet — drivers will bid soon!</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="jobs-list">
            {bids.length === 0 ? (
              <div className="empty-state">
                <p>You haven't placed any bids yet</p>
                <Link to="/jobs"><button className="post-btn">Browse jobs</button></Link>
              </div>
            ) : bids.map(bid => (
              <div className="dash-card" key={bid.id}>
                <div className="dash-card-header">
                  <div className="job-route">
                    <span className="job-pickup">📍 {bid.jobs?.pickup}</span>
                    <span className="job-arrow">→</span>
                    <span className="job-dest">🏁 {bid.jobs?.destination}</span>
                  </div>
                  <span className={`status-badge ${bid.status}`}>{bid.status}</span>
                </div>
                <div className="job-meta">
                  <span>💰 Your bid: £{bid.amount}</span>
                  {bid.message && <span>📝 {bid.message}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard