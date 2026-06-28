import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './AuthContext'
import './index.css'

// Entry point: find the #root div from index.html and render <App> into it.
// <BrowserRouter> enables client-side routing for the whole app (it must wrap
// anything that uses <Routes>, <Route>, or <NavLink>).
// React.StrictMode adds extra dev-only checks (it intentionally double-invokes
// some functions in development to surface bugs — harmless in production).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider makes the session available everywhere via useAuth() */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
