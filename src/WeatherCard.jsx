import { describeWeather } from './weatherCodes'

// A "presentational" component: it holds no state and does no fetching.
// It just receives props and renders them. This separation keeps the
// data-fetching logic (in App) apart from how a single city looks.
//
// Props:
//   name     - city display name
//   weather  - the `current` object from Open-Meteo, or null if this
//              particular city failed to load.
export default function WeatherCard({ name, weather }) {
  return (
    <div className="card">
      <h2 className="card-city">{name}</h2>

      {weather ? (
        // Happy path: we have data for this city.
        <>
          <p className="card-temp">{Math.round(weather.temperature_2m)}°F</p>
          <p className="card-desc">{describeWeather(weather.weather_code)}</p>
          <p className="card-wind">
            Wind {Math.round(weather.wind_speed_10m)} mph
          </p>
        </>
      ) : (
        // This city's fetch failed but others may have succeeded,
        // so we show a per-card error instead of breaking the whole grid.
        <p className="card-error">Couldn’t load weather</p>
      )}
    </div>
  )
}
