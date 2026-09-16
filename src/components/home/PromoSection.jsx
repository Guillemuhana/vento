import { Link } from 'react-router-dom'
import StoreCard from '../store/StoreCard'
import { useT } from '../../i18n'

// Sección destacada con fondo de color (la de "Miércoles de descuentos locos").
// Se diferencia del StoreRail común en que el carrusel va dentro de un bloque
// coloreado, como los especiales del día de la referencia.
export default function PromoSection({
  title,
  subtitle,
  badge,
  moreTo,
  stores = [],
  bg = 'bg-promo',
  text = 'text-ink',
}) {
  const { t } = useT()

  if (!stores.length) return null

  return (
    <section className={`${bg} mx-4 mb-7 rounded-2xl py-5 overflow-hidden`}>
      <div className="flex items-start justify-between gap-3 px-4 mb-4">
        <div className="min-w-0">
          {badge && (
            <span className="inline-block rounded-full bg-ink text-white text-[11px] font-bold px-2.5 py-1 mb-2">
              {badge}
            </span>
          )}
          <h2 className={`font-display font-bold text-[24px] leading-tight ${text}`}>{title}</h2>
          {subtitle && <p className={`text-[13px] mt-1 opacity-70 ${text}`}>{subtitle}</p>}
        </div>
        {moreTo && (
          <Link
            to={moreTo}
            className="flex-shrink-0 rounded-full bg-base text-ink font-semibold text-[13px] px-4 py-2.5 shadow-card"
          >
            {t('common.seeAll')}
          </Link>
        )}
      </div>

      <div className="rail px-4">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </section>
  )
}
