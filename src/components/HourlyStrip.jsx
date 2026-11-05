import { WeatherIcon } from './WeatherIcon.jsx'

export function HourlyStrip({ hours }) {
  return (
    <section className="card hourly" aria-label="Previsioni orarie">
      {hours.map((hour) => (
        <div className="hourly__item" key={hour.label}>
          <div className="hourly__label">{hour.label}</div>
          <WeatherIcon condition={hour.condition} size={22} strokeWidth={5} />
          <div className="hourly__temp">{hour.temp}°</div>
        </div>
      ))}
    </section>
  )
}
