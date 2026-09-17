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
import Cartel from '../../components/brand/Cartel'
import { IconSearch, IconChevronDown, IconBell, IconPin, IconMore } from '../../components/ui/Icon'
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

// La fila de accesos del home: los dos rubros grandes más bebidas y farmacia.
// El resto de las categorías queda detrás del botón "Más".
const ACCESOS_SLUGS = ['bebidas', 'farmacia']
const ACCESOS = [
  ...HERO_CATEGORIES,
  ...ACCESOS_SLUGS.map((slug) => CATEGORIES.find((c) => c.slug === slug)).filter(Boolean),
]
const RESTO_CATEGORIAS = CATEGORIES.filter((c) => !ACCESOS_SLUGS.includes(c.slug))

export default function Home() {
  const navigate = useNavigate()
  const { t } = useT()
  const profile = useAuthStore((s) => s.profile)
  const favoritosIds = useFavoritesStore((s) => s.ids)
  const [stores, setStores] = useState([])
  const [categoriasPedidas, setCategoriasPedidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [hint, setHint] = useState(0)
  const [verTodas, setVerTodas] = useState(false)

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
      [...BANNERS].sort((a, b) => (b.adPriority || 0) - (a.adPriority || 0)).map((banner) => {
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

      {/* Encabezado: el cartel a la izquierda y, a su lado, la ciudad arriba
          del buscador. */}
      <header className="px-4 pt-4 pb-4">
        <div className="flex items-center gap-3">
          <Cartel className="-ml-4 h-[107px]" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigate('/cuenta/perfil')}
                className="flex min-w-0 flex-1 items-center gap-1 text-left"
              >
                <AppIcon
                  path="ui/ubicacion"
                  fallback={IconPin}
                  size={14}
                  className="text-mango-500 flex-shrink-0"
                />
                <span className="truncate text-[13px] font-semibold text-ink">
                  {profile?.address || profile?.city || 'Miami, FL'}
                </span>
                <AppIcon
                  path="ui/chevron-abajo"
                  fallback={IconChevronDown}
                  size={14}
                  className="flex-shrink-0 text-ink-faint"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate('/cuenta/notificaciones')}
                aria-label={t('account.notifications')}
                className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-ink active:scale-90 transition"
              >
                <AppIcon path="ui/campana" fallback={IconBell} size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/buscar')}
              className="mt-2 flex h-12 w-full items-center gap-2 rounded-full bg-base px-4 text-left shadow-pill"
            >
              <AppIcon
                path="ui/buscar"
                fallback={IconSearch}
                size={19}
                className="flex-shrink-0 text-ink"
              />
              <span className="truncate text-[14px] text-ink-faint">
                {t('home.searchPlaceholder', { term: SEARCH_HINTS[hint] })}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fila de accesos redondos, como en las piezas de marca. "Más" despliega
          el resto de las categorías en vez de mandarlas a otra pantalla. */}
      <div className="flex items-start justify-between gap-1 px-4 mb-5">
        {ACCESOS.map((c) => (
          <CategoryTile key={c.slug} category={c} size="circle" />
        ))}
        <button
          type="button"
          onClick={() => setVerTodas((v) => !v)}
          className="flex w-[70px] flex-shrink-0 flex-col items-center gap-1.5 active:scale-95 transition"
        >
          <span className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-base-muted text-ink">
            <AppIcon
              path={verTodas ? 'ui/chevron-abajo' : 'ui/mas'}
              fallback={verTodas ? IconChevronDown : IconMore}
              size={24}
            />
          </span>
          <span className="w-full text-center text-[11px] font-semibold leading-tight text-ink">
            {verTodas ? t('common.less') : t('common.more')}
          </span>
        </button>
      </div>

      {verTodas && (
        <div className="rail px-4 mb-6 animate-fade-up">
          {RESTO_CATEGORIAS.map((c) => (
            <CategoryTile key={c.slug} category={c} size="sm" />
          ))}
        </div>
      )}

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
