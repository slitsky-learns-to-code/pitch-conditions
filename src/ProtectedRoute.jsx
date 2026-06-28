import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Wrap any page that should require login. If there's no session, we redirect
// to /login instead of rendering the page. While we're still checking for an
// existing session, show nothing (avoids a flash of the login redirect).
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="status">Loading…</p>
  if (!session) return <Navigate to="/login" replace />
  return children
}
