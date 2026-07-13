/* ── API endpoints ── */
const API_WEATHER = 'https://api.open-meteo.com/v1/forecast';
const API_GEO     = 'https://geocoding-api.open-meteo.com/v1/search';

/* ── Lingua corrente ── */
let lang = 'it';

/* ── Traduzioni ── */
const T = {
  it: {
    appName:       'Meteo',
    search:        'Cerca città',
    citiesLabel:   'Città',
    feelsLike:     'Percepita',
    next7days:     'Prossimi 7 giorni',
    today:         'Oggi',
    now:           'Ora',
    noResults:     'Nessun risultato trovato',
    fullDays:      ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'],
    shortDays:     ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'],
    months:        ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
    details:       ['Vento','Umidità','Indice UV','Pressione','Visibilità','Alba / Tramonto'],
    uvLevels:      ['Basso','Moderato','Alto','Molto alto','Estremo'],
  },
  en: {
    appName:       'Weather',
    search:        'Search city',
    citiesLabel:   'Cities',
    feelsLike:     'Feels like',
    next7days:     'Next 7 days',
    today:         'Today',
    now:           'Now',
    noResults:     'No results found',
    fullDays:      ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    shortDays:     ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    months:        ['January','February','March','April','May','June','July','August','September','October','November','December'],
    details:       ['Wind','Humidity','UV Index','Pressure','Visibility','Sunrise / Sunset'],
    uvLevels:      ['Low','Moderate','High','Very high','Extreme'],
  },
};

/* ── WMO weather codes ── */
const WMO = {
  0:  { it: 'Cielo sereno',            en: 'Clear sky',            icon: 'sunny'    },
  1:  { it: 'Prevalentemente sereno',  en: 'Mainly clear',         icon: 'sunny'    },
  2:  { it: 'Parzialmente nuvoloso',   en: 'Partly cloudy',        icon: 'cloudy'   },
  3:  { it: 'Coperto',                 en: 'Overcast',             icon: 'overcast' },
  45: { it: 'Nebbia',                  en: 'Foggy',                icon: 'overcast' },
  48: { it: 'Nebbia ghiacciata',       en: 'Icy fog',              icon: 'overcast' },
  51: { it: 'Pioggerellina leggera',   en: 'Light drizzle',        icon: 'rainy'    },
  53: { it: 'Pioggerellina moderata',  en: 'Moderate drizzle',     icon: 'rainy'    },
  55: { it: 'Pioggerellina intensa',   en: 'Heavy drizzle',        icon: 'rainy'    },
  61: { it: 'Pioggia leggera',         en: 'Light rain',           icon: 'rainy'    },
  63: { it: 'Pioggia moderata',        en: 'Moderate rain',        icon: 'rainy'    },
  65: { it: 'Pioggia intensa',         en: 'Heavy rain',           icon: 'rainy'    },
  71: { it: 'Neve leggera',            en: 'Light snow',           icon: 'overcast' },
  73: { it: 'Neve moderata',           en: 'Moderate snow',        icon: 'overcast' },
  75: { it: 'Neve intensa',            en: 'Heavy snow',           icon: 'overcast' },
  77: { it: 'Granelli di neve',        en: 'Snow grains',          icon: 'overcast' },
  80: { it: 'Acquazzoni',              en: 'Rain showers',         icon: 'rainy'    },
  81: { it: 'Acquazzoni moderati',     en: 'Moderate showers',     icon: 'rainy'    },
  82: { it: 'Acquazzoni violenti',     en: 'Violent showers',      icon: 'rainy'    },
  85: { it: 'Neve debole',             en: 'Light snow showers',   icon: 'overcast' },
  86: { it: 'Neve forte',              en: 'Heavy snow showers',   icon: 'overcast' },
  95: { it: 'Temporale',               en: 'Thunderstorm',         icon: 'rainy'    },
  96: { it: 'Temporale con grandine',  en: 'Thunderstorm w/ hail', icon: 'rainy'    },
  99: { it: 'Temporale con grandine',  en: 'Thunderstorm w/ hail', icon: 'rainy'    },
};

function wmo(code) {
  const entry = WMO[code] ?? { it: 'Non disponibile', en: 'Not available', icon: 'cloudy' };
  return { label: entry[lang], icon: entry.icon };
}

function uvLabel(v) {
  const n      = Math.round(v);
  const levels = T[lang].uvLevels;
  let level;
  if (n <= 2)       { level = levels[0]; }
  else if (n <= 5)  { level = levels[1]; }
  else if (n <= 7)  { level = levels[2]; }
  else if (n <= 10) { level = levels[3]; }
  else              { level = levels[4]; }
  return `${n}, ${level}`;
}

function fmtTime(isoStr) {
  if (isoStr) {
    return isoStr.slice(11, 16);
  } else {
    return '--:--';
  }
}

/* ── SVG icons (hero 140x140) ── */
const ICONS = {
  sunny: `<svg width="140" height="140" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="22" fill="none" stroke="#c9c5bb" stroke-width="2.5"/>
    <g stroke="#c9c5bb" stroke-width="2.5" stroke-linecap="round">
      <line x1="50" y1="10" x2="50" y2="19"/>
      <line x1="50" y1="81" x2="50" y2="90"/>
      <line x1="10" y1="50" x2="19" y2="50"/>
      <line x1="81" y1="50" x2="90" y2="50"/>
      <line x1="21" y1="21" x2="28" y2="28"/>
      <line x1="72" y1="72" x2="79" y2="79"/>
      <line x1="79" y1="21" x2="72" y2="28"/>
      <line x1="28" y1="72" x2="21" y2="79"/>
    </g>
  </svg>`,
  cloudy: `<svg width="140" height="140" viewBox="0 0 100 100" fill="none">
    <circle cx="38" cy="38" r="18" fill="none" stroke="#c9c5bb" stroke-width="2.5"/>
    <g stroke="#c9c5bb" stroke-width="2.5" stroke-linecap="round">
      <line x1="38" y1="8"  x2="38" y2="15"/>
      <line x1="60" y1="17" x2="55" y2="22"/>
      <line x1="8"  y1="38" x2="15" y2="38"/>
      <line x1="16" y1="17" x2="21" y2="22"/>
    </g>
    <ellipse cx="58" cy="66" rx="30" ry="18" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
    <ellipse cx="42" cy="60" rx="16" ry="13" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
  </svg>`,
  overcast: `<svg width="140" height="140" viewBox="0 0 100 100" fill="none">
    <ellipse cx="58" cy="60" rx="33" ry="20" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
    <ellipse cx="40" cy="52" rx="20" ry="16" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
    <ellipse cx="62" cy="46" rx="16" ry="13" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
  </svg>`,
  rainy: `<svg width="140" height="140" viewBox="0 0 100 100" fill="none">
    <ellipse cx="58" cy="55" rx="30" ry="18" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
    <ellipse cx="40" cy="48" rx="16" ry="13" fill="#f7f6f3" stroke="#8a867d" stroke-width="2.5"/>
    <line x1="36" y1="76" x2="32" y2="88" stroke="#8a867d" stroke-width="3" stroke-linecap="round"/>
    <line x1="52" y1="76" x2="48" y2="88" stroke="#8a867d" stroke-width="3" stroke-linecap="round"/>
    <line x1="68" y1="76" x2="64" y2="88" stroke="#8a867d" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
};

const ICONS_SMALL = {
  sunny:    `<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="22" fill="none" stroke="#c9c5bb" stroke-width="6"/></svg>`,
  cloudy:   `<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><ellipse cx="55" cy="58" rx="28" ry="17" fill="none" stroke="#8a867d" stroke-width="6"/><ellipse cx="38" cy="50" rx="15" ry="12" fill="none" stroke="#8a867d" stroke-width="6"/></svg>`,
  overcast: `<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><ellipse cx="55" cy="58" rx="28" ry="17" fill="none" stroke="#8a867d" stroke-width="6"/></svg>`,
  rainy:    `<svg width="20" height="20" viewBox="0 0 100 100" fill="none"><ellipse cx="55" cy="52" rx="28" ry="17" fill="none" stroke="#8a867d" stroke-width="6"/><line x1="40" y1="76" x2="36" y2="88" stroke="#8a867d" stroke-width="6" stroke-linecap="round"/><line x1="58" y1="76" x2="54" y2="88" stroke="#8a867d" stroke-width="6" stroke-linecap="round"/></svg>`,
};

const ICONS_HOURLY = {
  sunny:    `<svg width="26" height="26" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="22" fill="none" stroke="#c9c5bb" stroke-width="4"/></svg>`,
  cloudy:   `<svg width="26" height="26" viewBox="0 0 100 100" fill="none"><ellipse cx="55" cy="58" rx="26" ry="16" fill="none" stroke="#8a867d" stroke-width="4"/><ellipse cx="38" cy="50" rx="14" ry="11" fill="none" stroke="#8a867d" stroke-width="4"/></svg>`,
  overcast: `<svg width="26" height="26" viewBox="0 0 100 100" fill="none"><ellipse cx="55" cy="58" rx="26" ry="16" fill="none" stroke="#8a867d" stroke-width="4"/></svg>`,
  rainy:    `<svg width="26" height="26" viewBox="0 0 100 100" fill="none"><ellipse cx="55" cy="52" rx="26" ry="16" fill="none" stroke="#8a867d" stroke-width="4"/><line x1="40" y1="76" x2="36" y2="88" stroke="#8a867d" stroke-width="4" stroke-linecap="round"/><line x1="56" y1="76" x2="52" y2="88" stroke="#8a867d" stroke-width="4" stroke-linecap="round"/></svg>`,
};

/* ── Default cities ── */
let cities = [
  { id: 'milano',  name: 'Milano',  region: 'Lombardia', country: 'IT', lat: 45.4642, lon: 9.1900,  weather: null },
  { id: 'torino',  name: 'Torino',  region: 'Piemonte',  country: 'IT', lat: 45.0703, lon: 7.6869,  weather: null },
  { id: 'roma',    name: 'Roma',    region: 'Lazio',     country: 'IT', lat: 41.8919, lon: 12.5113, weather: null },
  { id: 'napoli',  name: 'Napoli',  region: 'Campania',  country: 'IT', lat: 40.8518, lon: 14.2681, weather: null },
  { id: 'venezia', name: 'Venezia', region: 'Veneto',    country: 'IT', lat: 45.4408, lon: 12.3155, weather: null },
];

let selectedId  = 'milano';
let searchTimer = null;

/* ── Fetch weather ── */
async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude:  lat,
    longitude: lon,
    current: [
      'temperature_2m','apparent_temperature','weather_code',
      'wind_speed_10m','relative_humidity_2m','surface_pressure','visibility',
    ].join(','),
    hourly:          'temperature_2m,weather_code',
    daily:           'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
    timezone:        'auto',
    forecast_days:   7,
    wind_speed_unit: 'kmh',
  });
  const res = await fetch(`${API_WEATHER}?${params}`);
  if (!res.ok) { throw new Error('Errore API meteo'); }
  return parseWeather(await res.json());
}

function parseWeather(data) {
  const c = data.current;
  const h = data.hourly;
  const d = data.daily;

  const nowHour = new Date().toISOString().slice(0, 13);
  let hi = h.time.findIndex(t => t.startsWith(nowHour));
  if (hi < 0) { hi = 0; }

  const hourly = Array.from({ length: 7 }, (_, i) => ({
    timeLabel:   i === 0 ? null : fmtTime(h.time[hi + i]),
    temp:        Math.round(h.temperature_2m[hi + i]),
    weatherCode: h.weather_code[hi + i],
  }));

  const week = d.time.map((dateStr, i) => ({
    dow:         new Date(dateStr + 'T12:00:00').getDay(),
    isToday:     i === 0,
    min:         Math.round(d.temperature_2m_min[i]),
    max:         Math.round(d.temperature_2m_max[i]),
    weatherCode: d.weather_code[i],
  }));

  return {
    temp:        Math.round(c.temperature_2m),
    feelsLike:   Math.round(c.apparent_temperature),
    weatherCode: c.weather_code,
    min:         Math.round(d.temperature_2m_min[0]),
    max:         Math.round(d.temperature_2m_max[0]),
    hourly,
    week,
    raw: {
      windSpeed:  Math.round(c.wind_speed_10m),
      humidity:   c.relative_humidity_2m,
      uvIndex:    d.uv_index_max?.[0] ?? 0,
      pressure:   Math.round(c.surface_pressure),
      visibility: c.visibility != null ? Math.round(c.visibility / 1000) : null,
      sunrise:    d.sunrise[0],
      sunset:     d.sunset[0],
    },
  };
}

/* ── Helpers ── */
function getDateString() {
  const d  = new Date();
  const t  = T[lang];
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (lang === 'it') {
    return `${t.fullDays[d.getDay()]} ${d.getDate()} ${t.months[d.getMonth()]} — ${hh}:${mm}`;
  } else {
    return `${t.fullDays[d.getDay()]}, ${t.months[d.getMonth()]} ${d.getDate()} — ${hh}:${mm}`;
  }
}

function cityId(lat, lon) {
  return `${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

/* ── Render testi statici (non dipendono dai dati meteo) ── */
function renderStaticUI() {
  const t = T[lang];
  document.querySelector('.sidebar-logo').textContent        = t.appName;
  document.getElementById('searchInput').placeholder        = t.search;
  document.querySelector('.city-section-label').textContent = t.citiesLabel;
  document.getElementById('feelsLikeLabel').textContent     = t.feelsLike;
  document.getElementById('weekTitle').textContent          = t.next7days;
  document.getElementById('langToggle').textContent         = lang === 'it' ? 'EN' : 'IT';
  document.querySelector('title').textContent               = t.appName;
}

/* ── Render city list ── */
function renderCityList() {
  const list = document.getElementById('cityList');
  list.innerHTML = cities.map(c => {
    const condition = c.weather ? wmo(c.weather.weatherCode).label : '…';
    const tempHtml  = c.weather
      ? `<div class="city-temp">${c.weather.temp}°</div>`
      : `<div class="city-temp city-temp-loading">—°</div>`;
    return `
      <div class="city-item ${c.id === selectedId ? 'active' : ''}" data-id="${c.id}">
        <div>
          <div class="city-name">${c.name}</div>
          <div class="city-cond">${condition}</div>
        </div>
        ${tempHtml}
      </div>`;
  }).join('');

  list.querySelectorAll('.city-item').forEach(el => {
    el.addEventListener('click', () => selectCity(el.dataset.id));
  });
}

/* ── Render main dashboard ── */
function renderMain() {
  const city = cities.find(c => c.id === selectedId);
  if (!city?.weather) { return; }
  const w = city.weather;
  const t = T[lang];
  const r = w.raw;

  document.getElementById('headerDate').textContent      = getDateString();
  document.getElementById('headerCity').textContent      = city.region ? `${city.name}, ${city.region}` : city.name;
  document.getElementById('headerFeelsLike').textContent = `${w.feelsLike}°`;
  document.getElementById('heroTemp').textContent        = `${w.temp}°`;
  document.getElementById('heroCondition').textContent   = wmo(w.weatherCode).label;
  document.getElementById('heroMinMax').textContent      = `Max ${w.max}° · Min ${w.min}°`;
  document.getElementById('heroIcon').innerHTML          = ICONS[wmo(w.weatherCode).icon];

  document.getElementById('hourlyRow').innerHTML = w.hourly.map(h => `
    <div class="hourly-card">
      <div class="hourly-time">${h.timeLabel ?? t.now}</div>
      ${ICONS_HOURLY[wmo(h.weatherCode).icon]}
      <div class="hourly-temp">${h.temp}°</div>
    </div>`).join('');

  document.getElementById('weekList').innerHTML = w.week.map(row => `
    <div class="week-row">
      <div class="week-day">${row.isToday ? t.today : t.shortDays[row.dow]}</div>
      ${ICONS_SMALL[wmo(row.weatherCode).icon]}
      <div class="week-temps">${row.min}° / ${row.max}°</div>
    </div>`).join('');

  const vis = r.visibility != null ? `${r.visibility} km` : '—';
  document.getElementById('detailsGrid').innerHTML = `
    <div class="detail-card"><div class="detail-label">${t.details[0]}</div><div class="detail-value">${r.windSpeed} km/h</div></div>
    <div class="detail-card"><div class="detail-label">${t.details[1]}</div><div class="detail-value">${r.humidity}%</div></div>
    <div class="detail-card"><div class="detail-label">${t.details[2]}</div><div class="detail-value">${uvLabel(r.uvIndex)}</div></div>
    <div class="detail-card"><div class="detail-label">${t.details[3]}</div><div class="detail-value">${r.pressure} hPa</div></div>
    <div class="detail-card"><div class="detail-label">${t.details[4]}</div><div class="detail-value">${vis}</div></div>
    <div class="detail-card"><div class="detail-label">${t.details[5]}</div><div class="detail-value small">${fmtTime(r.sunrise)} · ${fmtTime(r.sunset)}</div></div>`;
}

/* ── Render completo ── */
function renderAll() {
  renderStaticUI();
  renderCityList();
  renderMain();
}

/* ── Loading overlay ── */
function setLoading(on) {
  document.getElementById('loadingOverlay').classList.toggle('d-none', !on);
}

/* ── Select city ── */
async function selectCity(id) {
  if (id === selectedId) { return; }
  const main = document.querySelector('.main-area');
  main.classList.add('fading');
  await new Promise(r => setTimeout(r, 150));

  selectedId = id;
  renderCityList();

  const city = cities.find(c => c.id === id);
  if (!city) { main.classList.remove('fading'); return; }

  if (!city.weather) {
    setLoading(true);
    try {
      city.weather = await fetchWeather(city.lat, city.lon);
      renderCityList();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  renderMain();
  main.classList.remove('fading');
}

/* ── Language toggle ── */
document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'it' ? 'en' : 'it';
  renderAll();
});

/* ── Search ── */
const searchInput    = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');

searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  const q = searchInput.value.trim();
  if (q.length < 2) { hideDropdown(); return; }
  searchTimer = setTimeout(() => runSearch(q), 400);
});

async function runSearch(q) {
  try {
    showDropdown(await geocodeCity(q));
  } catch {
    hideDropdown();
  }
}

async function geocodeCity(query) {
  const params = new URLSearchParams({ name: query, count: 8, language: lang, format: 'json' });
  const res    = await fetch(`${API_GEO}?${params}`);
  if (!res.ok) { return []; }
  return (await res.json()).results ?? [];
}

function showDropdown(results) {
  if (!results.length) {
    searchDropdown.innerHTML = `<div class="search-no-results">${T[lang].noResults}</div>`;
    searchDropdown.classList.remove('d-none');
    return;
  }
  searchDropdown.innerHTML = results.map(r => {
    const sub = [r.admin1, r.country_code].filter(Boolean).join(' · ');
    return `
      <div class="search-result"
           data-lat="${r.latitude}" data-lon="${r.longitude}"
           data-name="${r.name}" data-region="${r.admin1 || ''}" data-country="${r.country_code || ''}">
        <div class="search-result-name">${r.name}</div>
        <div class="search-result-sub">${sub}</div>
      </div>`;
  }).join('');
  searchDropdown.querySelectorAll('.search-result').forEach(el => {
    el.addEventListener('click', () => addCity(el.dataset));
  });
  searchDropdown.classList.remove('d-none');
}

function hideDropdown() {
  searchDropdown.classList.add('d-none');
  searchDropdown.innerHTML = '';
}

async function addCity(data) {
  hideDropdown();
  searchInput.value = '';
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  const id  = cityId(lat, lon);
  const existing = cities.find(c => c.id === id);
  if (existing) { selectCity(id); return; }
  cities.push({ id, name: data.name, region: data.region || '', country: data.country || '', lat, lon, weather: null });
  renderCityList();
  selectCity(id);
}

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrapper')) { hideDropdown(); }
});

/* ── Init ── */
async function init() {
  renderStaticUI();
  renderCityList();
  await Promise.allSettled(
    cities.map(async city => {
      try {
        city.weather = await fetchWeather(city.lat, city.lon);
        renderCityList();
        if (city.id === selectedId) { renderMain(); }
      } catch (e) {
        console.error(`Errore per ${city.name}:`, e);
      }
    })
  );
}

init();

setInterval(() => {
  document.getElementById('headerDate').textContent = getDateString();
}, 60000);
