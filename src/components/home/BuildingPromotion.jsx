import { Link } from 'react-router-dom'
import { useT } from '../../i18n'

export default function BuildingPromotion({ building }) {
  const { t } = useT()

  return (
    <section className="mx-4 mb-7 overflow-hidden rounded-2xl bg-ink text-white">
      <img src={building.image} alt={building.name} className="h-36 w-full object-cover" loading="lazy" />
      <div className="px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-mango-300">
          {t('buildingPromo.eyebrow')}
        </p>
        <h2 className="font-display font-bold text-[22px] leading-tight mt-1">{building.name}</h2>
        <p className="text-[13px] leading-snug text-white/75 mt-1.5">{t('buildingPromo.text')}</p>
        <p className="text-[12px] text-white/55 mt-2">{building.address}</p>
        <Link to="/ofertas" className="mt-3 inline-flex rounded-full bg-mango-500 px-4 py-2.5 text-[13px] font-bold text-white">
          {t('buildingPromo.cta')}
        </Link>
      </div>
    </section>
  )
}