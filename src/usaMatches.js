// USA men's national team matches at the 2026 World Cup.
//
// Same idea as cities.js: a plain array you extend as the tournament goes on.
// When USA plays a knockout game, add a row here and the page picks it up —
// nothing else changes.
//
// `lat`/`lon` are the stadium location (used to look up that day's weather).
// `kickoffHour` is the local kickoff hour in 24h time, used to grab the
// weather AT kickoff from the hourly data. The Türkiye time is confirmed
// (10pm ET = 7pm PT); the first two are approximate evening kickoffs — tweak
// if you find the exact times.
//
// Source: ESPN / FIFA 2026 World Cup fixtures & results (verified June 2026).
export const USA_MATCHES = [
  {
    id: 'usa-paraguay',
    date: '2026-06-12',
    opponent: 'Paraguay',
    round: 'Group D',
    outcome: 'W',
    score: '4–1',
    city: 'Los Angeles',
    venue: 'SoFi Stadium, Inglewood',
    lat: 33.9535,
    lon: -118.3392,
    kickoffHour: 18,
  },
  {
    id: 'usa-australia',
    date: '2026-06-19',
    opponent: 'Australia',
    round: 'Group D',
    outcome: 'W',
    score: '2–0',
    city: 'Seattle',
    venue: 'Lumen Field',
    lat: 47.5952,
    lon: -122.3316,
    kickoffHour: 18,
  },
  {
    id: 'usa-turkiye',
    date: '2026-06-25',
    opponent: 'Turkey',
    round: 'Group D',
    outcome: 'L',
    score: '2–3',
    city: 'Los Angeles',
    venue: 'SoFi Stadium, Inglewood',
    lat: 33.9535,
    lon: -118.3392,
    kickoffHour: 19,
  },
]
