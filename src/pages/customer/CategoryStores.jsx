import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import StoreCard from '../../components/store/StoreCard'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import ScrollTopPill from '../../components/layout/ScrollTopPill'
import { IconChevronLeft } from '../../components/ui/Icon'
import AppIcon from '../../components/ui/AppIcon'
import { HERO_CATEGORIES, CATEGORIES } from '../../data/homeContent'
import { useT } from '../../i18n'

const ALL = [...HERO_CATEGORIES, ...CATEGORIES]

// Listado de comercios de una categoría (a donde llevan los tiles del home).
export default function CategoryStores() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useT()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  const category = ALL.find((c) => c.slug === slug)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // "envio-rapido" no es una categoría real: no filtra, ordena por tiempo.
      const query = supabase.from('stores').select('*')
      const { data } =
        slug === 'envio-rapido'
          ? await query.order('eta_minutes', { ascending: true })
          : await query.eq('category', slug).order('rating', { ascending: false })
      setStores(data || [])
      setLoading(false)
    }
    load()
  }, [slug])

  return (
    <div className="container-app">
      <ScrollTopPill />

      <header className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('common.back')}
          className="h-10 w-10 rounded-full bg-base-muted flex items-center justify-center text-ink flex-shrink-0"
        >
          <AppIcon path="ui/volver" fallback={IconChevronLeft} size={20} />
        </button>
        <h1 className="font-display font-bold text-[24px] capitalize">
          {category ? t(category.labelKey) : slug}
        </h1>
      </header>

      {loading && <Spinner className="py-10" />}

      {!loading && stores.length === 0 && (
        <EmptyState
          title={t('category.empty')}
          description={t('category.emptyDesc')}
        />
      )}

      <div className="px-4 space-y-5">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} variant="list" />
        ))}
      </div>
    </div>
  )
}
