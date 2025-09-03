import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'

// ----------------------
// Global Axios settings
// ----------------------

// Base URL for your Laravel API
axios.defaults.baseURL = 'http://127.0.0.1:8001/api'

// Send cookies with every request (required for Sanctum authentication)
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
