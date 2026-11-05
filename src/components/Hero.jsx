import { HeroIcon } from './WeatherIcon.jsx'

export function Hero({ city }) {
  return (
    <section className="hero">
      <HeroIcon condition={city.condition} isDay={city.isDay} />
      <div>
        <div className="hero__temp">{city.temp}°</div>
        <h1 className="hero__title">
          {city.name} · {city.description}
        </h1>
        <div className="hero__range">
          Max {city.max}° · Min {city.min}° · Percepita {city.feelsLike}°
        </div>
      </div>
    </section>
  )
}
