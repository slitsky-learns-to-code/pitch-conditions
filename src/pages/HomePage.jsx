import { useState, useEffect, useCallback } from 'react'
import { CITIES } from '../cities'
import WeatherCard from '../WeatherCard'

// Build the Open-Meteo request URL for one city's CURRENT weather.
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

// Fetch one city. Never throws: returns current: null on failure so one
// broken city doesn't sink the whole page.
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

// The home page: current weather for every host city.
// (This is the same logic that used to live in App.jsx, now scoped to its
// own page so App can focus on routing.)
export default function HomePage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    const all = await Promise.all(CITIES.map(fetchCityWeather))
    const everythingFailed = all.every((r) => r.current === null)
    setError(everythingFailed
      ? 'Could not load weather. Check your connection and retry.'
      : null)
    setResults(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return (
    <section>
      <div className="page-intro">
        <h2>Host city conditions</h2>
        <p className="subtitle">Live weather across the 2026 host cities</p>
        <button className="refresh" onClick={loadAll} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading && <p className="status">Loading weather…</p>}

      {!loading && error && (
        <div className="status status-error">
          <p>{error}</p>
          <button className="retry" onClick={loadAll}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid">
          {results.map(({ city, current }) => (
            <WeatherCard key={city.id} name={city.name} weather={current} />
          ))}
        </div>
      )}
    </section>
  )
}
