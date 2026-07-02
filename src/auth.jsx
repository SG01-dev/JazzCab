import { useState } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'
import './auth.css'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState('customer')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) setError(error.message)
else navigate('/dashboard')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
if (error) {
  setError(error.message)
} else if (data.user) {
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: fullName,
    phone,
    user_type: userType
  })
  if (profileError) {
    setError('Account created but profile setup failed. Please contact support.')
  } else {
    navigate('/dashboard')
  }
}
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">🚕 JazzCab</div>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="auth-sub">{isLogin ? 'Sign in to continue' : 'Join JazzCab today'}</p>

        {!isLogin && (
          <div className="user-type-toggle">
            <button
              className={userType === 'customer' ? 'type-btn active' : 'type-btn'}
              onClick={() => setUserType('customer')}
            >
              👤 Customer
            </button>
            <button
              className={userType === 'driver' ? 'type-btn active' : 'type-btn'}
              onClick={() => setUserType('driver')}
            >
              🚖 Driver
            </button>
          </div>
        )}

        {!isLogin && (
          <input
            className="auth-input"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isLogin && (
          <input
            className="auth-input"
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Sign Up' : ' Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Auth