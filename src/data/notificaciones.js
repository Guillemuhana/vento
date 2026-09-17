import { NEO_LOFTS_PROMOTION } from './buildingPromotions'

// Novedades que le llegan al cliente. Por ahora se cargan acá a mano; cuando
// haya una tabla en la base, esta lista sale de ahí y el resto no cambia.
//
// `fecha` es ISO para poder ordenar; la pantalla la muestra en el idioma activo.
export const NOTIFICACIONES = [
  {
    id: 'promo-neo-lofts',
    tituloKey: 'notif.buildingPromo.title',
    textoKey: 'notif.buildingPromo.text',
    fecha: '2026-09-17T09:00:00Z',
    to: '/ofertas',
    imagen: NEO_LOFTS_PROMOTION.image,
  },
]

const LEIDAS_KEY = 'just-minutes-notificaciones-leidas'

// Las leídas viven en el navegador de cada persona. Si el almacenamiento está
// bloqueado (modo incógnito, permisos), se devuelve vacío y todo aparece como
// nuevo: molesta menos que romper la pantalla.
export function leerLeidas() {
  try {
    const guardado = JSON.parse(localStorage.getItem(LEIDAS_KEY))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function marcarTodasLeidas() {
  try {
    localStorage.setItem(LEIDAS_KEY, JSON.stringify(NOTIFICACIONES.map((n) => n.id)))
  } catch {
    // Sin almacenamiento el globito vuelve a aparecer, pero nada se rompe.
  }
}

export function contarSinLeer() {
  const leidas = leerLeidas()
  return NOTIFICACIONES.filter((n) => !leidas.includes(n.id)).length
}
