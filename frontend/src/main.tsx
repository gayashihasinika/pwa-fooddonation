import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios'
import { LanguageProvider } from "./context/LanguageContext"

// ----------------------
// Global Axios settings
// ----------------------
axios.defaults.baseURL = 'http://127.0.0.1:8001/api'
axios.defaults.withCredentials = true

// ----------------------
// Render App
// ----------------------
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
