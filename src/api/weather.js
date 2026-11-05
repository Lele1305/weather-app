const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// Codici WMO usati da Open-Meteo.
const weatherCodes = {
  0: ['clear', 'Sereno'],
  1: ['clear', 'Prevalentemente sereno'],
  2: ['partly-cloudy', 'Parzialmente nuvoloso'],
  3: ['cloudy', 'Coperto'],
  45: ['cloudy', 'Nebbia'],
  48: ['cloudy', 'Nebbia con brina'],
  51: ['rain', 'Pioviggine leggera'],
  53: ['rain', 'Pioviggine'],
  55: ['rain', 'Pioviggine intensa'],
  56: ['rain', 'Pioviggine gelata'],
  57: ['rain', 'Pioviggine gelata intensa'],
  61: ['rain', 'Pioggia leggera'],
  63: ['rain', 'Pioggia'],
  65: ['rain', 'Pioggia intensa'],
  66: ['rain', 'Pioggia gelata'],
  67: ['rain', 'Pioggia gelata intensa'],
  71: ['snow', 'Neve leggera'],
  73: ['snow', 'Neve'],
  75: ['snow', 'Neve intensa'],
  77: ['snow', 'Nevischio'],
  80: ['rain', 'Rovesci leggeri'],
  81: ['rain', 'Rovesci'],
  82: ['rain', 'Rovesci violenti'],
  85: ['snow', 'Rovesci di neve'],
  86: ['snow', 'Forti rovesci di neve'],
  95: ['rain', 'Temporale'],
  96: ['rain', 'Temporale con grandine'],
  99: ['rain', 'Temporale con forte grandine'],
}

const conditionOf = (code) => weatherCodes[code]?.[0] ?? 'cloudy'
const descriptionOf = (code) => weatherCodes[code]?.[1] ?? 'Non disponibile'

const weekday = new Intl.DateTimeFormat('it-IT', { weekday: 'short', timeZone: 'UTC' })

function dayLabel(date, index) {
  if (index === 0) return 'Oggi'
  const label = weekday.format(new Date(`${date}T00:00:00Z`))
  return label[0].toUpperCase() + label.slice(1)
}

const timeOf = (dateTime) => dateTime.slice(11, 16)

function toWeather(city, { current, hourly, daily }) {
  // Gli orari sono nel fuso della città: vanno confrontati come testo, senza Date.
  const nextHours = hourly.time
    .map((time, i) => ({
      time,
      label: timeOf(time),
      condition: conditionOf(hourly.weather_code[i]),
      temp: Math.round(hourly.temperature_2m[i]),
    }))
    .filter((hour) => hour.time > current.time)
    .slice(0, 6)

  return {
    name: city.name,
    isDay: current.is_day === 1,
    condition: conditionOf(current.weather_code),
    description: descriptionOf(current.weather_code),
    temp: Math.round(current.temperature_2m),
    max: Math.round(daily.temperature_2m_max[0]),
    min: Math.round(daily.temperature_2m_min[0]),
    feelsLike: Math.round(current.apparent_temperature),
    hourly: [
      {
        label: 'Ora',
        condition: conditionOf(current.weather_code),
        temp: Math.round(current.temperature_2m),
      },
      ...nextHours,
    ],
    details: {
      wind: `${Math.round(current.wind_speed_10m)} km/h`,
      humidity: `${Math.round(current.relative_humidity_2m)}%`,
      uv: String(Math.round(current.uv_index)),
      pressure: `${Math.round(current.pressure_msl)} hPa`,
      visibility: `${Math.round(current.visibility / 1000)} km`,
      sun: `${timeOf(daily.sunrise[0])} · ${timeOf(daily.sunset[0])}`,
    },
    daily: daily.time.map((date, i) => ({
      label: dayLabel(date, i),
      condition: conditionOf(daily.weather_code[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      max: Math.round(daily.temperature_2m_max[i]),
    })),
  }
}

export async function fetchWeather(city, signal) {
  const params = new URLSearchParams({
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: 'auto',
    forecast_days: 7,
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,pressure_msl,visibility,uv_index,weather_code,is_day',
    hourly: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
  })

  const res = await fetch(`${FORECAST_URL}?${params}`, { signal })
  if (!res.ok) throw new Error(`Errore ${res.status}`)

  return toWeather(city, await res.json())
}

export async function searchCities(name, signal) {
  const params = new URLSearchParams({ name, count: 5, language: 'it' })

  const res = await fetch(`${GEOCODING_URL}?${params}`, { signal })
  if (!res.ok) throw new Error(`Errore ${res.status}`)

  const { results = [] } = await res.json()
  return results.map(({ name, admin1, country, latitude, longitude }) => ({
    name,
    area: [admin1, country].filter(Boolean).join(', '),
    latitude,
    longitude,
  }))
}
