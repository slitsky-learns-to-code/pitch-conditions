import { useState, useEffect, useCallback } from 'react'
import { CITIES } from './cities'
import WeatherCard from './WeatherCard'
import Logo from './Logo'

// Build the Open-Meteo request URL for one city.
// We ask only for the `current` fields the app actually displays, in °F.
function buildUrl({ lat, lon }) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,weather_code,wind_speed_10m',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
  })
  return `https://api.open-meteo.com/v1/forecast?${params}`
}

// Fetch one city. Returns { city, current } on success.
// On failure we DON'T throw — we return current: null so one broken city
// doesn't sink the whole page. App decides what counts as a fatal error.
async function fetchCityWeather(city) {
  try {
    const res = await fetch(buildUrl(city))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return { city, current: data.current }
  } catch (err) {
    console.error(`Failed to fetch ${city.name}:`, err)
    return { city, current: null }
  }
}

export default function App() {
  // Three pieces of state drive the whole UI:
  //   results - array of { city, current } once loaded (null current = failed)
  //   loading - true while the initial fetch is in flight
  //   error   - a message if EVERY city failed (a real, page-level error)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // loadAll does the actual fetching. It lives OUTSIDE useEffect now so that
  // both the initial mount AND the Retry button can call the same function.
  //
  // useCallback memoizes it: React hands back the *same* function instance
  // between renders (instead of creating a new one each time). That stable
  // identity matters because we list `loadAll` in the effect's deps below —
  // without useCallback, a fresh function every render would re-trigger the
  // effect endlessly. The empty `[]` deps here mean loadAll never needs to
  // be recreated (it closes over nothing that changes).
  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Promise.all fires every city's fetch at the SAME time and waits for
    // all of them, instead of awaiting them one-by-one in a loop. Because
    // fetchCityWeather never throws, Promise.all won't reject here.
    const all = await Promise.all(CITIES.map(fetchCityWeather))

    // Only treat it as a page-level error if literally nothing loaded
    // (e.g. the user is offline). Partial failures show per-card instead.
    const everythingFailed = all.every((r) => r.current === null)
    setError(everythingFailed
      ? 'Could not load weather. Check your connection and retry.'
      : null)

    setResults(all)
    setLoading(false)
  }, [])

  // useEffect runs side effects (like network requests) AFTER render.
  // Listing `loadAll` as the dependency says "run this whenever loadAll
  // changes" — but because useCallback keeps loadAll stable, it effectively
  // runs just once, on mount. So we still fetch on load and never loop.
  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <main className="app">
      <header className="header">
        {/* h1 wraps the logo so the page still has a top-level heading for
            accessibility/SEO; the logo's aria-label provides its text. */}
        <h1 className="brand">
          <Logo className="logo" />
        </h1>
        <p className="subtitle">Live weather for the World Cup 2026 host cities</p>
        {/* Manual refresh. Disabled while a fetch is in flight so the user
            can't stack overlapping requests. onClick just re-runs loadAll. */}
        <button className="refresh" onClick={loadAll} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {/* Loading state: shown while the first fetch is running */}
      {loading && <p className="status">Loading weather…</p>}

      {/* Page-level error state: only when every city failed.
          The Retry button re-runs the same loadAll function. */}
      {!loading && error && (
        <div className="status status-error">
          <p>{error}</p>
          <button className="retry" onClick={loadAll}>
            Retry
          </button>
        </div>
      )}

      {/* Success state: a responsive grid of cards */}
      {!loading && !error && (
        <section className="grid">
          {results.map(({ city, current }) => (
            <WeatherCard key={city.id} name={city.name} weather={current} />
          ))}
        </section>
      )}
    </main>
  )
}
