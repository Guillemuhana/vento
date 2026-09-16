import { Link } from 'react-router-dom'
import { useFavoritesStore } from '../../store/useFavoritesStore'
import { IconHeart, IconHeartSolid, IconStar, IconBolt } from '../ui/Icon'
import AppIcon from '../ui/AppIcon'
import { useT } from '../../i18n'
import { getStoreImage } from '../../data/storeImages'
import { getFioritoStoreImage } from '../../data/fioritoImages'

// Card de comercio con foto 16:9, badge de promo y fila de metadatos.
// `variant`:
//   - 'rail' (default): ancho fijo, pensada para carruseles horizontales.
//   - 'list': ancho completo, para listados verticales.
export default function StoreCard({ store, variant = 'rail' }) {
  const { t } = useT()
  const isFavorite = useFavoritesStore((s) => s.ids.includes(store.id))
  const toggleFavorite = useFavoritesStore((s) => s.toggle)

  const image = getStoreImage(store.name) || store.cover_url || store.logo_url || getFioritoStoreImage(store.name)
  const eta = store.eta_minutes || 25
  const closed = store.is_open === false

  return (
    <Link
      to={`/comercio/${store.id}`}
      className={`block group ${variant === 'rail' ? 'w-[272px]' : 'w-full'}`}
    >
      <div className="relative rounded-2xl overflow-hidden bg-base-muted aspect-[16/10]">
        {image ? (
          <img
            src={image}
            alt={store.name}
            loading="lazy"
            className={`h-full w-full object-cover transition group-active:scale-[1.02] ${
              closed ? 'grayscale opacity-60' : ''
            }`}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink-faint text-xs font-semibold">
            {t('common.noPhoto')}
          </div>
        )}

        <button
          type="button"
          aria-label={isFavorite ? t('favorites.remove') : t('favorites.add')}
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(store.id)
          }}
          className="absolute top-2.5 right-2.5 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-card active:scale-90 transition"
        >
          <AppIcon
            path={isFavorite ? 'ui/corazon-activo' : 'ui/corazon'}
            fallback={isFavorite ? IconHeartSolid : IconHeart}
            size={19}
            className={isFavorite ? 'text-mango-500' : 'text-ink'}
          />
        </button>

        {store.promo_label && (
          <span className="badge-promo absolute bottom-0 left-0 rounded-none rounded-tr-md px-2.5 py-1.5 text-[12px]">
            {store.promo_label}
          </span>
        )}

        {closed && (
          <span className="absolute bottom-2.5 right-2.5 rounded-md bg-ink/85 text-white text-[11px] font-bold px-2 py-1">
            {t('common.closed')}
          </span>
        )}
      </div>

      <div className="pt-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-[17px] leading-tight text-ink truncate">
            {store.name}
          </h3>
          {store.rating != null && (
            <span className="flex items-center gap-1 text-[14px] font-semibold text-ink flex-shrink-0">
              <AppIcon path="ui/estrella" fallback={IconStar} size={14} />
              {Number(store.rating).toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 text-[13px] text-ink-soft">
          <span className="flex items-center gap-1 font-medium">
            <AppIcon path="ui/rayo" fallback={IconBolt} size={13} />
            {eta} {t('common.min')}
          </span>
          {store.free_delivery && <span className="badge-promo">{t('common.freeDelivery')}</span>}
          {store.distance_km != null && (
            <span className="text-ink-faint">{Number(store.distance_km).toFixed(1)} {t('common.km')}</span>
          )}
          {!store.free_delivery && store.distance_km == null && (
            <span className="text-ink-faint capitalize">{store.category}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
