import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'

// View and edit the signed-in user's profile. ProtectedRoute guarantees there
// IS a logged-in user by the time this renders, so we can use user.id directly.
export default function ProfilePage() {
  const { user, signOut } = useAuth()

  const [form, setForm] = useState({
    full_name: '',
    favorite_team: '',
    home_city: '',
    temp_unit: 'fahrenheit',
  })
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('idle') // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState('')

  // Load this user's profile row once on mount.
  useEffect(() => {
    let ignore = false

    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, favorite_team, home_city, temp_unit')
        .eq('id', user.id)
        .single() // we expect exactly one row (the trigger created it)

      if (ignore) return
      if (error) {
        setErrorMsg(
          'Could not load your profile. Did you run the SQL setup in Supabase?',
        )
      } else if (data) {
        // Fill the form, keeping defaults for any null columns.
        setForm({
          full_name: data.full_name ?? '',
          favorite_team: data.favorite_team ?? '',
          home_city: data.home_city ?? '',
          temp_unit: data.temp_unit ?? 'fahrenheit',
        })
      }
      setLoading(false)
    }

    loadProfile()
    return () => {
      ignore = true
    }
  }, [user.id])

  // One handler updates whichever field changed, keyed by the input's name.
  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setStatus('saving')
    setErrorMsg('')

    // update() only touches this user's row; RLS also enforces that server-side.
    const { error } = await supabase
      .from('profiles')
      .update(form)
      .eq('id', user.id)

    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('saved')
    }
  }

  if (loading) return <p className="status">Loading your profile…</p>

  return (
    <section className="auth">
      <div className="page-intro">
        <h2>Your profile</h2>
        <p className="subtitle">{user.email}</p>
      </div>

      <form className="auth-form" onSubmit={handleSave}>
        <label>
          Name
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Favorite national team
          <input
            type="text"
            name="favorite_team"
            value={form.favorite_team}
            onChange={handleChange}
            placeholder="e.g. USA"
          />
        </label>

        <label>
          Home / favorite city
          <input
            type="text"
            name="home_city"
            value={form.home_city}
            onChange={handleChange}
            placeholder="e.g. Miami"
          />
        </label>

        <label>
          Preferred temperature unit
          <select name="temp_unit" value={form.temp_unit} onChange={handleChange}>
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="celsius">Celsius (°C)</option>
          </select>
        </label>

        <button className="refresh" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save profile'}
        </button>

        {status === 'saved' && <p className="status-saved">Saved ✓</p>}
        {status === 'error' && <p className="status-error">{errorMsg}</p>}
      </form>

      <button className="signout" onClick={signOut}>
        Sign out
      </button>
    </section>
  )
}
