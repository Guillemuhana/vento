// Distancia en línea recta entre dos puntos, en kilómetros (fórmula de haversine).
// Es la distancia "de pájaro", no la del recorrido real por calle: sirve como
// referencia de cuán cerca está el repartidor, no como tiempo de llegada.
const RADIO_TIERRA_KM = 6371

const aRadianes = (grados) => (grados * Math.PI) / 180

export function distanciaKm(a, b) {
  if (!a || !b) return null
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return null

  const dLat = aRadianes(b.lat - a.lat)
  const dLng = aRadianes(b.lng - a.lng)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.lat)) * Math.cos(aRadianes(b.lat)) * Math.sin(dLng / 2) ** 2

  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h))
}
