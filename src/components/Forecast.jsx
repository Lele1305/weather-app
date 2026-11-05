import { WeatherIcon } from './WeatherIcon.jsx'

export function Forecast({ days }) {
  return (
    <section className="card forecast">
      <h2 className="forecast__title">7 giorni</h2>
      {days.map((day) => (
        <div className="forecast__row" key={day.label}>
          <div className="forecast__day">{day.label}</div>
          <WeatherIcon condition={day.condition} size={18} strokeWidth={6} />
          <div className="forecast__range">
            {day.min}°/{day.max}°
          </div>
        </div>
      ))}
    </section>
  )
}
