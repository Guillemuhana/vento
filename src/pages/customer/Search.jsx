import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import StoreCard from '../../components/store/StoreCard'
import Spinner from '../../components/ui/Spinner'
import { IconSearch, IconClose } from '../../components/ui/Icon'
import AppIcon from '../../components/ui/AppIcon'
import { TOP_SEARCHES } from '../../data/homeContent'
import { useT } from '../../i18n'

const RECENTS_KEY = 'vento-recent-searches'

function readRecents() {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY)) || []
  } catch {
    return []
  }
}

function pushRecent(term) {
  const clean = term.trim()
  if (!clean) return readRecents()
  const next = [clean, ...readRecents().filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 8)
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  } catch {
    /* storage bloqueado: no pasa nada, es solo una comodidad */
  }
  return next
}

// Buscador full-screen: el input va abajo, pegado al teclado, como en la referencia.
export default function Search() {
  const navigate = useNavigate()
  const { t } = useT()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [recents, setRecents] = useState(readRecents)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('stores')
        .select('*')
        .order('rating', { ascending: false })
      setStores(data || [])
      setLoading(false)
    }
    load()
    inputRef.current?.focus()
  }, [])

  const term = query.trim().toLowerCase()
  const results = term
    ? stores.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          (s.category || '').toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term)
      )
    : []

  const runSearch = (value) => {
    setQuery(value)
    setRecents(pushRecent(value))
  }

  return (
    <div className="max-w-md md:max-w-lg mx-auto min-h-screen bg-base pb-32">
      {/* Comercios vistos recientemente */}
      {!term && stores.length > 0 && (
        <div className="rail px-4 pt-5 pb-6">
          {stores.slice(0, 8).map((store) => (
            <Link key={store.id} to={`/comercio/${store.id}`} className="flex flex-col items-center gap-1 w-[76px]">
              <span className="h-[70px] w-[70px] rounded-full bg-base-muted overflow-hidden border border-base-line flex items-center justify-center">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-ink-soft">{store.name[0]}</span>
                )}
              </span>
              <span className="text-[11px] text-ink-soft truncate w-full text-center">{store.name}</span>
            </Link>
          ))}
        </div>
      )}

      {!term && recents.length > 0 && (
        <section className="px-4 mb-6">
          <h2 className="section-title mb-3">{t('search.recent')}</h2>
          <div className="flex flex-wrap gap-2">
            {recents.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className="rounded-full bg-base-muted px-4 py-2.5 text-[14px] font-medium text-ink"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {!term && (
        <section className="px-4">
          <h2 className="section-title mb-3">{t('search.top')}</h2>
          <div className="flex flex-wrap gap-2">
            {TOP_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => runSearch(item)}
                className="rounded-full border border-base-line px-4 py-2.5 text-[14px] font-medium text-ink"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {term && (
        <section className="px-4 pt-5 space-y-5">
          {loading && <Spinner className="py-10" />}
          {!loading && results.length === 0 && (
            <p className="text-center text-[14px] text-ink-faint py-10">
              {t('search.noResults', { term: query })}
            </p>
          )}
          {results.map((store) => (
            <StoreCard key={store.id} store={store} variant="list" />
          ))}
        </section>
      )}

      {/* Input abajo */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md md:max-w-lg mx-auto bg-base px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center gap-2 border-t border-base-line">
          <div className="flex-1 h-12 rounded-full bg-base-muted flex items-center gap-2 px-4">
            <AppIcon path="ui/buscar" fallback={IconSearch} size={20} className="text-ink-faint flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSearch(query)
              }}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent outline-none text-[16px] text-ink placeholder:text-ink-faint"
            />
            {query && (
              <button type="button" aria-label={t('search.clear')} onClick={() => setQuery('')} className="text-ink-faint">
                <IconClose size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label={t('common.close')}
            onClick={() => navigate(-1)}
            className="h-12 w-12 flex-shrink-0 rounded-full bg-base-muted flex items-center justify-center text-ink"
          >
            <AppIcon path="ui/cerrar" fallback={IconClose} size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
