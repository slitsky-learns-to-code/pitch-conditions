import { describeWeather } from './weatherCodes'

// Format an ISO date ('2026-06-12') as 'Jun 12'. We append T12:00 so the
// Date is built at midday and the day never shifts due to timezone.
function formatDate(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// One USA match: the matchup + result, the venue, and the weather AT kickoff.
// Props:
//   match   - an entry from usaMatches.js
//   weather - { temperature_2m, weather_code, wind_speed_10m } or null on fail
export default function MatchCard({ match, weather }) {
  const won = match.outcome === 'W'

  return (
    <div className="card match-card">
      <div className="match-head">
        <span className="match-date">{formatDate(match.date)}</span>
        {/* Win = green badge, loss/draw = red. */}
        <span className={`match-result ${won ? 'is-win' : 'is-loss'}`}>
          {match.outcome} {match.score}
        </span>
      </div>

      <h2 className="card-city">USA vs {match.opponent}</h2>
      <p className="match-venue">
        {match.round} · {match.venue}
      </p>

      {/* The weather that day at kickoff, reusing the same fields/shape as the
          host-city cards. */}
      {weather ? (
        <div className="match-weather">
          <span className="match-temp">
            {Math.round(weather.temperature_2m)}°F
          </span>
          <span className="match-desc">
            {describeWeather(weather.weather_code)} · Wind{' '}
            {Math.round(weather.wind_speed_10m)} mph
          </span>
          <span className="match-when">at kickoff (local)</span>
        </div>
      ) : (
        <p className="card-error">Couldn’t load game-day weather</p>
      )}
    </div>
  )
}
