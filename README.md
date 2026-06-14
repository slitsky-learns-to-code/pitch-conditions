# World Cup 2026 — Host City Weather

A small React + Vite app that shows live current weather for the 2026 World Cup
host cities. Built as a learning project to practice `useState`, `useEffect`,
and data fetching.

## What it does

- On load, fetches current weather for every host city **in parallel**
- Renders each city as a card in a responsive grid: city name, temperature,
  a readable conditions description, and wind speed
- Shows a loading state while fetching and an error state if a fetch fails
- A **Refresh** button re-fetches on demand

## Data source

[Open-Meteo](https://open-meteo.com) — free, no API key required. The app calls
the forecast endpoint with `current=temperature_2m,weather_code,wind_speed_10m`
in Fahrenheit / mph.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL.

## Project structure

```
src/
├── main.jsx        Entry point: renders <App> into #root
├── App.jsx         State + parallel fetching (the "smart" component)
├── WeatherCard.jsx Renders one city (presentational component)
├── cities.js       Host cities — add more here, nothing else changes
├── weatherCodes.js Maps Open-Meteo numeric codes to readable text
└── index.css       Styling (no UI library)
```

## Adding a city

Append one entry to `src/cities.js`:

```js
{ id: 'kc', name: 'Kansas City', lat: 39.10, lon: -94.58 },
```

The grid maps over that array, so the new card appears automatically.
