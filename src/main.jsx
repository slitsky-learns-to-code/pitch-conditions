import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Entry point: find the #root div from index.html and render <App> into it.
// React.StrictMode adds extra dev-only checks (it intentionally double-invokes
// some functions in development to surface bugs — harmless in production).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
