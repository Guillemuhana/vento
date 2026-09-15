export function formatMoney(value) {
  const number = Number(value) || 0
  return number.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatEta(minutes) {
  if (!minutes) return '—'
  return `${minutes} min`
}
