import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

// Passwordless "magic link" login. The user types their name + email, we email
// them a one-time sign-in link, and they're logged in when they click it.
export default function LoginPage() {
  const { session } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  // Already signed in? No reason to show the login form — go to the profile.
  if (session) return <Navigate to="/profile" replace />

  async function handleSubmit(e) {
    e.preventDefault() // stop the browser's default full-page form submit
    setStatus('sending')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Where the magic link sends them back to. Works in dev and prod
        // because we derive it from the current origin.
        emailRedirectTo: `${window.location.origin}/profile`,
        // Stashed in user metadata; the DB trigger copies full_name into the
        // new profile row on first sign-up.
        data: { full_name: name },
      },
    })

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <section className="auth">
      <div className="page-intro">
        <h2>Sign in</h2>
        <p className="subtitle">
          We’ll email you a magic link — no password needed.
        </p>
      </div>

      {status === 'sent' ? (
        <p className="status">
          ✅ Check <strong>{email}</strong> for your sign-in link.
        </p>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <button
            className="refresh"
            type="submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send magic link'}
          </button>

          {status === 'error' && (
            <p className="status-error">{errorMsg}</p>
          )}
        </form>
      )}
    </section>
  )
}
