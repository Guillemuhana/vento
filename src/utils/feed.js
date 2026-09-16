// ---------------------------------------------------------------------------
// Armado de las secciones del home.
//
// Todo es determinístico y sale de datos que ya tenemos: promos del comercio,
// tus pedidos anteriores y tus favoritos. Donde usamos una aproximación (por
// ejemplo "populares", que hoy no puede contar pedidos de otros usuarios porque
// las políticas RLS solo te dejan ver los tuyos) está aclarado en el comentario.
// ---------------------------------------------------------------------------

const MAX = 12

const abiertos = (stores) => stores.filter((s) => s.is_open !== false)

const porRating = (a, b) => Number(b.rating || 0) - Number(a.rating || 0)

// Comercios con alguna promo activa: etiqueta de promo o envío gratis.
export function conDescuento(stores = []) {
  return abiertos(stores)
    .filter((s) => s.promo_label || s.free_delivery)
    .sort(porRating)
    .slice(0, MAX)
}

// "Ahorrá y disfrutá": lo más conveniente — envío gratis primero, después los
// que tienen pedido mínimo bajo, y entre iguales el que llega más rápido.
export function ahorraYDisfruta(stores = []) {
  return abiertos(stores)
    .filter((s) => s.free_delivery || s.min_order != null)
    .sort((a, b) => {
      if (a.free_delivery !== b.free_delivery) return a.free_delivery ? -1 : 1
      const minA = a.min_order == null ? Infinity : Number(a.min_order)
      const minB = b.min_order == null ? Infinity : Number(b.min_order)
      if (minA !== minB) return minA - minB
      return (a.eta_minutes || 99) - (b.eta_minutes || 99)
    })
    .slice(0, MAX)
}

// "Los más populares": sin acceso al total de pedidos por comercio (RLS), la
// mejor aproximación disponible es rating alto + entrega rápida.
export function masPopulares(stores = []) {
  return abiertos(stores)
    .filter((s) => s.rating != null)
    .sort((a, b) => {
      const diff = porRating(a, b)
      if (diff !== 0) return diff
      return (a.eta_minutes || 99) - (b.eta_minutes || 99)
    })
    .slice(0, MAX)
}

// "Recomendados para ti": comercios de las categorías que más pediste.
// `categoriasPedidas` es un array de categorías, con repetidos (uno por pedido).
// Sin historial cae en los mejor puntuados, así que la sección nunca queda vacía.
export function recomendadosParaVos(stores = [], categoriasPedidas = []) {
  if (!categoriasPedidas.length) return masPopulares(stores)

  const peso = {}
  for (const categoria of categoriasPedidas) {
    peso[categoria] = (peso[categoria] || 0) + 1
  }

  return abiertos(stores)
    .filter((s) => peso[s.category])
    .sort((a, b) => {
      const diff = (peso[b.category] || 0) - (peso[a.category] || 0)
      return diff !== 0 ? diff : porRating(a, b)
    })
    .slice(0, MAX)
}

// "Inspirado en tus gustos": comercios parecidos a tus favoritos (misma
// categoría), sin repetir los que ya marcaste.
export function inspiradoEnTusGustos(stores = [], favoritosIds = []) {
  if (!favoritosIds.length) return []

  const categoriasFavoritas = new Set(
    stores.filter((s) => favoritosIds.includes(s.id)).map((s) => s.category)
  )
  if (!categoriasFavoritas.size) return []

  return abiertos(stores)
    .filter((s) => categoriasFavoritas.has(s.category) && !favoritosIds.includes(s.id))
    .sort(porRating)
    .slice(0, MAX)
}

// ¿Hoy es el día de la promo semanal? 0 = domingo … 3 = miércoles.
export function esElDia(dia) {
  return new Date().getDay() === dia
}
