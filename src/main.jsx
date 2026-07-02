import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Directory from './Directory.jsx'
import Auth from './auth.jsx'
import PostJob from './postjob.jsx'
import JobBoard from './jobboard.jsx'
import Dashboard from './dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)