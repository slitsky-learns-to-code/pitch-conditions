import { useState, useEffect } from 'react'
import { USA_MATCHES } from '../usaMatches'
import MatchCard from '../MatchCard'

// Build the Open-Meteo URL for a SINGLE PAST DAY at the stadium location.
// Unlike the home page (which uses `current=`), here we ask for HOURLY data
// on the match date so we can pick out the weather at kickoff. The forecast
// endpoint serves recent past dates via start_date/end_date — perfect for
// in-tournament games (no multi-day archive delay). `timezone=auto` makes the
// hourly timestamps local to the stadium, so kickoffHour lines up correctly.
function buildMatchUrl(match) {
  const params = new URLSearchParams({
    latitude: match.lat,
    longitude: match.lon,
    start_date: match.date,
    end_date: match.date,
    hourly: 'temperature_2m,weather_code,wind_speed_10m',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
  })
  return `https://api.open-meteo.com/v1/forecast?${params}`
}

// Fetch one match's kickoff weather. Never throws (returns weather: null on
// failure) so a single bad request doesn't break the whole page.
async function fetchMatchWeather(match) {
  try {
    const res = await fetch(buildMatchUrl(match))
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    // The hourly arrays are parallel: time[i] pairs with temperature_2m[i],
    // etc. Find the row whose timestamp matches the kickoff hour, e.g.
    // "2026-06-12T18:00". Fall back to that hour's index if not found.
    const hh = String(match.kickoffHour).padStart(2, '0')
    const target = `${match.date}T${hh}:00`
    const i = data.hourly.time.indexOf(target)
    const idx = i >= 0 ? i : match.kickoffHour

    return {
      match,
      weather: {
        temperature_2m: data.hourly.temperature_2m[idx],
        weather_code: data.hourly.weather_code[idx],
        wind_speed_10m: data.hourly.wind_speed_10m[idx],
      },
    }
  } catch (err) {
    console.error(`Failed to fetch weather for ${match.opponent}:`, err)
    return { match, weather: null }
  }
}

// The "USA at the World Cup" page: each match USA has played, with the
// weather at kickoff. Same fetch pattern as the home page (parallel
// Promise.all, loading/error states) — just a different endpoint and shape.
export default function UsaWeatherPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError(null)
      const all = await Promise.all(USA_MATCHES.map(fetchMatchWeather))
      if (ignore) return
      const everythingFailed = all.every((r) => r.weather === null)
      setError(everythingFailed
        ? 'Could not load game-day weather. Check your connection.'
        : null)
      setResults(all)
      setLoading(false)
    }

    load()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section>
      <div className="page-intro">
        <h2>USA at the 2026 World Cup</h2>
        <p className="subtitle">
          Every match the USMNT has played — and the weather at kickoff
        </p>
      </div>

      {loading && <p className="status">Loading game-day weather…</p>}

      {!loading && error && <p className="status status-error">{error}</p>}

      {!loading && !error && (
        <div className="grid">
          {results.map(({ match, weather }) => (
            <MatchCard key={match.id} match={match} weather={weather} />
          ))}
        </div>
      )}
    </section>
  )
}
