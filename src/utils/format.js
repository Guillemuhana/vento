// Formateo de plata y fechas, atado al idioma activo.
//
// La app opera en Miami: los precios son en dólares. El idioma vive en una
// variable de módulo que setea el I18nProvider, así cualquier componente puede
// llamar a formatMoney() sin recibir el idioma por props.
//
// Las dos variantes son de Estados Unidos (en-US y es-US), así que el formato
// del número es el mismo — $1,234.56 — y lo único que cambia es el idioma de
// los meses y demás. Eso es justamente lo que se quiere: un precio no debería
// escribirse distinto según el idioma del que lo mira.
export const CURRENCY = 'USD'

let locale = 'en-US'

export function setFormatLocale(lang) {
  locale = lang === 'es' ? 'es-US' : 'en-US'
}

export function formatMoney(value) {
  const number = Number(value) || 0
  return number.toLocaleString(locale, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
