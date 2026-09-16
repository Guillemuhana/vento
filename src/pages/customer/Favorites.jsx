import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useFavoritesStore } from '../../store/useFavoritesStore'
import StoreCard from '../../components/store/StoreCard'
import StoreRail from '../../components/home/StoreRail'
import Spinner from '../../components/ui/Spinner'
import ScrollTopPill from '../../components/layout/ScrollTopPill'
import { IconHeart } from '../../components/ui/Icon'
import { useT } from '../../i18n'
import AppIcon from '../../components/ui/AppIcon'

export default function Favorites() {
  const { t } = useT()
  const favoriteIds = useFavoritesStore((s) => s.ids)
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

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
  }, [])

  const favorites = stores.filter((s) => favoriteIds.includes(s.id))
  const suggestions = stores.filter((s) => !favoriteIds.includes(s.id)).slice(0, 10)

  return (
    <div className="container-app">
      <ScrollTopPill />

      <h1 className="screen-title text-mango-500 px-4 pt-5 pb-4">{t('favorites.title')}</h1>

      {loading && <Spinner className="py-10" />}

      {!loading && favorites.length === 0 && (
        <div className="flex flex-col items-center text-center px-8 py-10">
          <span className="h-16 w-16 rounded-full bg-base-muted flex items-center justify-center text-ink-faint mb-4">
            <AppIcon path="ui/corazon" fallback={IconHeart} size={30} />
          </span>
          <p className="font-display font-bold text-[17px] text-ink">{t('favorites.emptyTitle')}</p>
          <p className="text-[14px] text-ink-faint mt-1 max-w-xs">
            {t('favorites.emptyDesc')}
          </p>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="px-4 space-y-5 mb-8">
          {favorites.map((store) => (
            <StoreCard key={store.id} store={store} variant="list" />
          ))}
        </div>
      )}

      {!loading && (
        <StoreRail title={t('favorites.suggestions')} stores={suggestions} />
      )}
    </div>
  )
}
