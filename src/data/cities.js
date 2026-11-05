export const cities = [
  { name: 'Milano', latitude: 45.4643, longitude: 9.1895 },
  { name: 'Torino', latitude: 45.0705, longitude: 7.6868 },
  { name: 'Roma', latitude: 41.8919, longitude: 12.5113 },
  { name: 'Napoli', latitude: 40.8522, longitude: 14.2681 },
]

// La ricerca restituisce coordinate leggermente diverse per la stessa città.
export const isSameCity = (a, b) =>
  a.name === b.name &&
  Math.abs(a.latitude - b.latitude) < 0.2 &&
  Math.abs(a.longitude - b.longitude) < 0.2
