import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import { useFavoritesStore } from '../../store/useFavoritesStore'
import CategoryTile from '../../components/home/CategoryTile'
import PromoCarousel from '../../components/home/PromoCarousel'
import PromoSection from '../../components/home/PromoSection'
import StoreRail from '../../components/home/StoreRail'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import ScrollTopPill from '../../components/layout/ScrollTopPill'
import BuildingPromotion from '../../components/home/BuildingPromotion'
import { IconSearch, IconChevronDown } from '../../components/ui/Icon'
import AppIcon from '../../components/ui/AppIcon'
import { useT } from '../../i18n'
import {
  HERO_CATEGORIES,
  CATEGORIES,
  BANNERS,
  SEARCH_HINTS,
  PROMO_DEL_DIA,
} from '../../data/homeContent'
import {
  conDescuento,
  ahorraYDisfruta,
  masPopulares,
  recomendadosParaVos,
  inspiradoEnTusGustos,
  esElDia,
} from '../../utils/feed'
import { NEO_LOFTS_PROMOTION } from '../../data/buildingPromotions'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useT()
  const profile = useAuthStore((s) => s.profile)
  const favoritosIds = useFavoritesStore((s) => s.ids)
  const [stores, setStores] = useState([])
  const [categoriasPedidas, setCategoriasPedidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [hint, setHint] = useState(0)

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

  // Categorías de tus últimos pedidos: alimentan "Recomendados para vos".
  useEffect(() => {
    if (!profile?.id) return
    async function loadHistorial() {
      const { data } = await supabase
        .from('orders')
        .select('stores(category)')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20)
      setCategoriasPedidas((data || []).map((o) => o.stores?.category).filter(Boolean))
    }
    loadHistorial()
  }, [profile?.id])

  // Placeholder rotativo de la barra de búsqueda, como en la referencia.
  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % SEARCH_HINTS.length), 3000)
    return () => clearInterval(id)
  }, [])

  // Los banners con `storeName` enlazan a la ficha de ese comercio.
  const banners = useMemo(
    () =>
      BANNERS.map((banner) => {
        if (!banner.storeName) return banner
        const comercio = stores.find((s) => s.name === banner.storeName)
        return comercio ? { ...banner, to: `/comercio/${comercio.id}` } : banner
      }),
    [stores]
  )

  const descuentos = conDescuento(stores)
  const recomendados = recomendadosParaVos(stores, categoriasPedidas)
  const inspirado = inspiradoEnTusGustos(stores, favoritosIds)
  const populares = masPopulares(stores)
  const ahorra = ahorraYDisfruta(stores)
  const esHoy = esElDia(PROMO_DEL_DIA.dia)

  return (
    <div className="container-app">
      <ScrollTopPill />

      {/* Dirección de entrega */}
      <header className="px-4 pt-4 pb-3">
        <div className="flex justify-center mb-5">
          <img
            src="/assets/logo/just-minutes.png"
            alt="Just Minutes"
            className="h-9 w-auto max-w-[190px] object-contain"
          />
        </div>
        <div>
          <p className="text-[13px] text-ink-faint leading-tight">{profile?.city || 'Córdoba'}</p>
          <button
            type="button"
            onClick={() => navigate('/cuenta/direcciones')}
            className="flex items-center gap-2 text-left"
          >
            <span className="font-display font-bold text-[20px] leading-tight truncate max-w-[75vw]">
              {profile?.address || t('home.addAddress')}
            </span>
            <span className="h-7 w-7 rounded-full bg-base-muted flex items-center justify-center flex-shrink-0 text-ink">
              <AppIcon path="ui/chevron-abajo" fallback={IconChevronDown} size={16} />
            </span>
          </button>
        </div>
      </header>

      {/* Buscador (abre la pantalla de búsqueda) */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => navigate('/buscar')}
          className="w-full h-14 rounded-full bg-base shadow-pill flex items-center gap-3 px-5 text-left"
        >
          <AppIcon
            path="ui/buscar"
            fallback={IconSearch}
            size={22}
            className="text-ink flex-shrink-0"
          />
          <span className="text-[16px] text-ink-faint truncate">
            {t('home.searchPlaceholder', { term: SEARCH_HINTS[hint] })}
          </span>
        </button>
      </div>

      {/* Tiles grandes */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-3">
        {HERO_CATEGORIES.map((c) => (
          <CategoryTile key={c.slug} category={c} size="hero" />
        ))}
      </div>

      {/* Categorías chicas */}
      <div className="rail px-4 mb-6">
        {CATEGORIES.map((c) => (
          <CategoryTile key={c.slug} category={c} size="sm" />
        ))}
      </div>

      {/* Banners */}
      <div className="mb-7">
        <PromoCarousel banners={banners} />
      </div>

      <BuildingPromotion building={NEO_LOFTS_PROMOTION} />

      {loading && <Spinner className="py-10" />}

      {!loading && stores.length === 0 && (
        <EmptyState title={t('home.noStores')} description={t('home.noStoresDesc')} />
      )}

      {/* Promo de la semana */}
      <PromoSection
        title={t(PROMO_DEL_DIA.titleKey)}
        subtitle={t(PROMO_DEL_DIA.subtitleKey)}
        badge={esHoy ? t('home.today') : null}
        moreTo="/ofertas"
        stores={descuentos}
        bg={PROMO_DEL_DIA.bg}
        text={PROMO_DEL_DIA.text}
      />

      <StoreRail
        title={t('home.recommended')}
        subtitle={
          categoriasPedidas.length
            ? t('home.recommendedFromOrders')
            : t('home.recommendedTopRated')
        }
        stores={recomendados}
      />

      <StoreRail
        title={t('home.inspired')}
        subtitle={t('home.inspiredSub')}
        stores={inspirado}
      />

      <StoreRail title={t('home.popular')} moreTo="/categoria/comida" stores={populares} />

      <StoreRail
        title={t('home.save')}
        subtitle={t('home.saveSub')}
        moreTo="/ofertas"
        stores={ahorra}
      />
    </div>
  )
}
