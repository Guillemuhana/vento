// Formateo de plata y fechas, atado al idioma activo.
//
// El idioma vive en una variable de módulo que setea el I18nProvider: así
// cualquier componente puede llamar a formatMoney() sin recibir el idioma por
// props. Los precios siempre son en pesos argentinos; lo que cambia es cómo se
// escriben ($18.500 en castellano, ARS 18,500 en inglés).
let locale = 'en-US'

export function setFormatLocale(lang) {
  locale = lang === 'es' ? 'es-AR' : 'en-US'
}

export function formatMoney(value) {
  const number = Number(value) || 0
  return number.toLocaleString(locale, {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString(locale, {
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
