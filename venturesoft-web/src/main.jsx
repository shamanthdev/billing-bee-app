import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker (basic PWA support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err)
    })
  })
}

// Optional analytics beacon
const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL
if (ANALYTICS_URL) {
  try {
    const payload = JSON.stringify({
      type: 'pageview',
      path: window.location.pathname,
      ts: Date.now(),
    })
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_URL, payload)
    } else {
      fetch(ANALYTICS_URL, { method: 'POST', body: payload, keepalive: true })
    }
  } catch (e) {
    console.warn('Analytics send failed:', e)
  }
}
