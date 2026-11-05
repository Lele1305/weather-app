import { useEffect, useState } from 'react'
import { fetchWeather } from './api/weather.js'
import { cities } from './data/cities.js'
import { TopNav } from './components/TopNav.jsx'
import { Hero } from './components/Hero.jsx'
import { HourlyStrip } from './components/HourlyStrip.jsx'
import { DetailsGrid } from './components/DetailsGrid.jsx'
import { Forecast } from './components/Forecast.jsx'

function App() {
  const [city, setCity] = useState(cities[0])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadWeather() {
      setLoading(true)
      setError(false)
      try {
        setWeather(await fetchWeather(city, controller.signal))
      } catch (err) {
        if (err.name === 'AbortError') return
        setWeather(null)
        setError(true)
      }
      setLoading(false)
    }
    loadWeather()

    return () => controller.abort()
  }, [city, attempt])

  return (
    <div className="app">
      <TopNav cities={cities} selected={city} onSelect={setCity} />

      {error && (
        <main className="status">
          <p role="alert">Impossibile caricare il meteo di {city.name}.</p>
          <button type="button" className="status__retry" onClick={() => setAttempt(attempt + 1)}>
            Riprova
          </button>
        </main>
      )}

      {!error && !weather && (
        <main className="status" role="status">
          <p>Caricamento...</p>
        </main>
      )}

      {weather && (
        <main className={loading ? 'main main--loading' : 'main'} aria-busy={loading}>
          <Hero city={weather} />
          <HourlyStrip hours={weather.hourly} />
          <div className="bottom">
            <DetailsGrid details={weather.details} />
            <Forecast days={weather.daily} />
          </div>
          <footer className="credit">
            Dati meteo di{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>
          </footer>
        </main>
      )}
    </div>
  )
}

export default App
