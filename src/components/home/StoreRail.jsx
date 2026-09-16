import { Link } from 'react-router-dom'
import StoreCard from '../store/StoreCard'
import { useT } from '../../i18n'

// Sección con header (título + "Ver más") y carrusel horizontal de comercios.
export default function StoreRail({ title, subtitle, moreTo, stores = [] }) {
  const { t } = useT()
  if (!stores.length) return null

  return (
    <section className="mb-7">
      <div className="flex items-end justify-between gap-3 px-4 mb-3">
        <div className="min-w-0">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-[13px] text-ink-faint mt-0.5">{subtitle}</p>}
        </div>
        {moreTo && (
          <Link
            to={moreTo}
            className="flex-shrink-0 rounded-full bg-base-muted text-ink font-semibold text-[13px] px-4 py-2.5"
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
