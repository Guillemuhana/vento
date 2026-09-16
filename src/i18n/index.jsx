import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import es from './es'
import { setFormatLocale } from '../utils/format'

// Sistema de idiomas propio, sin librerías: son dos diccionarios planos y un
// contexto. Alcanza de sobra para esta app y no suma peso al bundle.
//
// Inglés es el idioma por defecto. Si falta una clave en castellano, cae al
// inglés en vez de mostrar la clave cruda.
export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Castellano' },
]

const DICCIONARIOS = { en, es }
const STORAGE_KEY = 'just-minutes-lang'
const POR_DEFECTO = 'en'

const I18nContext = createContext(null)

function idiomaGuardado() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (guardado && DICCIONARIOS[guardado]) return guardado
  } catch {
    /* storage bloqueado: seguimos con el idioma por defecto */
  }
  return POR_DEFECTO
}

function traducir(lang, key, vars) {
  const texto = DICCIONARIOS[lang]?.[key] ?? DICCIONARIOS[POR_DEFECTO][key] ?? key
  if (!vars) return texto
  return texto.replace(/\{(\w+)\}/g, (_, nombre) => (vars[nombre] != null ? vars[nombre] : ''))
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(idiomaGuardado)

  useEffect(() => {
    setFormatLocale(lang)
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* si no se puede guardar, el idioma dura lo que dura la pestaña */
    }
  }, [lang])

  const setLang = useCallback((nuevo) => {
    if (DICCIONARIOS[nuevo]) setLangState(nuevo)
  }, [])

  const valor = useMemo(
    () => ({
      lang,
      setLang,
      t: (key, vars) => traducir(lang, key, vars),
    }),
    [lang, setLang]
  )

  return <I18nContext.Provider value={valor}>{children}</I18nContext.Provider>
}

export function useT() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useT tiene que usarse dentro de <I18nProvider>')
  return ctx
}
