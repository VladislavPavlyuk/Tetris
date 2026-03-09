import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress Chrome extension messaging error (extension's receiving end not loaded)
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason?.message === 'Could not establish connection. Receiving end does not exist.') {
    e.preventDefault()
  }
})

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<p style="padding:1rem;font-family:sans-serif;">#root not found.</p>'
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
