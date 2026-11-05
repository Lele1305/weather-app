// Icone piccole usate nella striscia oraria e nelle previsioni.
export function WeatherIcon({ condition, size, strokeWidth }) {
  const sunny = condition === 'clear' || condition === 'partly-cloudy'
  const stroke = sunny ? '#9a978f' : '#57544f'

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" role="img" aria-label={labels[condition]}>
      {sunny ? (
        <circle cx="50" cy="50" r="22" stroke={stroke} strokeWidth={strokeWidth} />
      ) : (
        <ellipse cx="55" cy="58" rx="26" ry="16" stroke={stroke} strokeWidth={strokeWidth} />
      )}
      {condition === 'rain' && (
        <line x1="40" y1="82" x2="36" y2="92" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      )}
      {condition === 'snow' && <circle cx="42" cy="88" r="4" fill={stroke} />}
    </svg>
  )
}

// La falce è disegnata attorno all'origine per un raggio di 22.
function Moon({ cx, cy, r }) {
  return (
    <path
      d="M6 -21 A22 22 0 1 0 21 7 A18 18 0 0 1 6 -21 Z"
      transform={`translate(${cx} ${cy}) scale(${r / 22})`}
      fill="#f2f1ee"
      opacity="0.9"
    />
  )
}

// Icona grande dell'intestazione.
export function HeroIcon({ condition, isDay }) {
  return (
    <svg className="hero__icon" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {condition === 'clear' &&
        (isDay ? (
          <>
            <circle cx="50" cy="50" r="22" fill="#f2f1ee" opacity="0.9" />
            <g stroke="#f2f1ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
              <line x1="50" y1="12" x2="50" y2="20" />
              <line x1="50" y1="80" x2="50" y2="88" />
              <line x1="12" y1="50" x2="20" y2="50" />
              <line x1="80" y1="50" x2="88" y2="50" />
              <line x1="23" y1="23" x2="29" y2="29" />
              <line x1="71" y1="71" x2="77" y2="77" />
              <line x1="77" y1="23" x2="71" y2="29" />
              <line x1="29" y1="71" x2="23" y2="77" />
            </g>
          </>
        ) : (
          <Moon cx={50} cy={50} r={26} />
        ))}

      {condition === 'partly-cloudy' &&
        (isDay ? (
          <>
            <circle cx="38" cy="36" r="17" fill="#f2f1ee" opacity="0.9" />
            <g stroke="#f2f1ee" strokeWidth="2.5" strokeLinecap="round" opacity="0.7">
              <line x1="38" y1="6" x2="38" y2="13" />
              <line x1="59" y1="15" x2="54" y2="20" />
              <line x1="8" y1="36" x2="15" y2="36" />
            </g>
          </>
        ) : (
          <Moon cx={38} cy={36} r={20} />
        ))}

      {condition !== 'clear' && (
        <>
          <ellipse cx="58" cy="66" rx="30" ry="18" fill="#2a292e" stroke="#57544f" strokeWidth="2.5" />
          <ellipse cx="42" cy="60" rx="16" ry="13" fill="#2a292e" stroke="#57544f" strokeWidth="2.5" />
        </>
      )}

      {condition === 'rain' && (
        <g stroke="#9a978f" strokeWidth="2.5" strokeLinecap="round">
          <line x1="42" y1="88" x2="39" y2="95" />
          <line x1="58" y1="88" x2="55" y2="95" />
          <line x1="74" y1="88" x2="71" y2="95" />
        </g>
      )}

      {condition === 'snow' && (
        <g fill="#9a978f">
          <circle cx="42" cy="91" r="2.5" />
          <circle cx="58" cy="91" r="2.5" />
          <circle cx="74" cy="91" r="2.5" />
        </g>
      )}
    </svg>
  )
}

const labels = {
  clear: 'Sereno',
  'partly-cloudy': 'Parzialmente nuvoloso',
  cloudy: 'Nuvoloso',
  rain: 'Pioggia',
  snow: 'Neve',
}
