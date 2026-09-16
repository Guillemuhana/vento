// Máquina de estados del pedido. El orden del array define el progreso en el tracker visual.
export const ORDER_STATUS_FLOW = [
  'pendiente',
  'aceptado',
  'preparando',
  'listo_para_retirar',
  'en_camino',
  'entregado',
]

// Los textos de cada estado viven en los diccionarios de idioma, con la clave
// `status.<estado>`. Acá queda solo el flujo y el color.

export const ORDER_STATUS_COLOR = {
  pendiente: 'bg-mango-100 text-mango-700',
  aceptado: 'bg-teal-100 text-teal-700',
  preparando: 'bg-teal-100 text-teal-700',
  listo_para_retirar: 'bg-teal-100 text-teal-700',
  en_camino: 'bg-teal-100 text-teal-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-danger-400/10 text-danger-600',
}

export function nextStatus(current) {
  const idx = ORDER_STATUS_FLOW.indexOf(current)
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null
  return ORDER_STATUS_FLOW[idx + 1]
}

export function statusProgress(current) {
  const idx = ORDER_STATUS_FLOW.indexOf(current)
  if (idx === -1) return 0
  return ((idx + 1) / ORDER_STATUS_FLOW.length) * 100
}
