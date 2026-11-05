import { useEffect, useState } from 'react'
import { searchCities } from '../api/weather.js'
import { isSameCity } from '../data/cities.js'

const MIN_QUERY_LENGTH = 2
const SEARCH_DELAY = 300

export function TopNav({ cities, selected, onSelect }) {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState({ query: '', results: [], failed: false })

  const trimmed = query.trim()
  const isOpen = trimmed.length >= MIN_QUERY_LENGTH
  const isReady = search.query === trimmed

  useEffect(() => {
    if (trimmed.length < MIN_QUERY_LENGTH) return

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed, controller.signal)
        setSearch({ query: trimmed, results, failed: false })
      } catch (err) {
        if (err.name !== 'AbortError') setSearch({ query: trimmed, results: [], failed: true })
      }
    }, SEARCH_DELAY)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trimmed])

  const choose = (city) => {
    onSelect(city)
    setQuery('')
  }

  // Con Invio non aspetta il ritardo della ricerca mentre si digita.
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isOpen) return

    try {
      const results = isReady ? search.results : await searchCities(trimmed)
      if (results.length > 0) choose(results[0])
      else setSearch({ query: trimmed, results, failed: false })
    } catch {
      setSearch({ query: trimmed, results: [], failed: true })
    }
  }

  return (
    <header className="nav">
      <div className="nav__logo">Meteo</div>

      <form className="search" role="search" onSubmit={handleSubmit}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#75726c" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search__input"
          type="search"
          placeholder="Cerca città"
          aria-label="Cerca città"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {isOpen && (
          <ul className="search__results">
            {!isReady && <li className="search__empty">Ricerca in corso...</li>}
            {isReady &&
              search.results.map((city) => (
                <li key={`${city.name}-${city.latitude}-${city.longitude}`}>
                  <button type="button" className="search__result" onClick={() => choose(city)}>
                    <span>{city.name}</span>
                    <span className="search__area">{city.area}</span>
                  </button>
                </li>
              ))}
            {isReady && search.failed && <li className="search__empty">Ricerca non disponibile, riprova</li>}
            {isReady && !search.failed && search.results.length === 0 && (
              <li className="search__empty">Nessuna città trovata</li>
            )}
          </ul>
        )}
      </form>

      <nav className="cities" aria-label="Città">
        {cities.map((city) => {
          const isActive = isSameCity(city, selected)
          return (
            <button
              key={city.name}
              type="button"
              className={isActive ? 'cities__item cities__item--active' : 'cities__item'}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelect(city)}
            >
              {city.name}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
