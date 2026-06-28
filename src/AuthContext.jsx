import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

// React Context lets us share the auth state with ANY component without
// passing props down through every level ("prop drilling"). Components read it
// via the useAuth() hook below.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // Start in "loading" so we don't flash the login page before we've checked
  // whether a session already exists (e.g. the user is already signed in).
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1) Get any existing session on first load (persisted in localStorage).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 2) Subscribe to future auth changes: sign-in (incl. arriving back from a
    //    magic link), sign-out, token refresh. This keeps the whole app in
    //    sync automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup: unsubscribe when the provider unmounts.
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Small convenience hook so components just call useAuth() instead of
// useContext(AuthContext).
export function useAuth() {
  return useContext(AuthContext)
}
