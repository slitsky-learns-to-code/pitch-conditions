// The list of World Cup 2026 host cities we fetch weather for.
//
// To add a city later, just append an object here with a unique `id`,
// a display `name`, and its `lat`/`lon`. Nothing else in the app needs
// to change — the UI maps over this array.
export const CITIES = [
  { id: 'miami', name: 'Miami', lat: 25.78, lon: -80.21 },
  { id: 'nynj', name: 'New York / New Jersey', lat: 40.74, lon: -74.07 },
  { id: 'la', name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { id: 'dallas', name: 'Dallas', lat: 32.78, lon: -96.8 },
  { id: 'mexico', name: 'Mexico City', lat: 19.43, lon: -99.13 },
  { id: 'toronto', name: 'Toronto', lat: 43.65, lon: -79.38 },
]
