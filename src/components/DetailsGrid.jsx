export function DetailsGrid({ details }) {
  const items = [
    { label: 'Vento', value: details.wind },
    { label: 'Umidità', value: details.humidity },
    { label: 'Indice UV', value: details.uv },
    { label: 'Pressione', value: details.pressure },
    { label: 'Visibilità', value: details.visibility },
    { label: 'Alba / Tramonto', value: details.sun, small: true },
  ]

  return (
    <section className="details" aria-label="Dettagli">
      {items.map((item) => (
        <div className="card detail" key={item.label}>
          <div className="detail__label">{item.label}</div>
          <div className={item.small ? 'detail__value detail__value--small' : 'detail__value'}>{item.value}</div>
        </div>
      ))}
    </section>
  )
}
