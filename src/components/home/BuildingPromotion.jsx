import { Link } from 'react-router-dom'
import { useT } from '../../i18n'

export default function BuildingPromotion({ building }) {
  const { t } = useT()

  return (
    <section className="relative mx-4 mb-7 min-h-[330px] overflow-hidden rounded-2xl bg-ink text-white shadow-card">
      <img src={building.image} alt={building.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/15" />
      <div className="relative flex min-h-[330px] flex-col justify-end p-5">
        <div className="max-w-xl rounded-2xl bg-black/35 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-[2px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-mango-300">
          {t('buildingPromo.eyebrow')}
        </p>
        <h2 className="mt-1 font-display text-[26px] font-bold leading-tight text-white drop-shadow-md">{building.name}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-mango-500 px-3 py-1.5 text-[12px] font-bold text-white">
            {t('buildingPromo.daysLabel')}
          </span>
          <span className="rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">
            {t('buildingPromo.tuesday')}
          </span>
          <span className="rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">
            {t('buildingPromo.thursday')}
          </span>
        </div>
        <p className="mt-2 max-w-md text-[13px] leading-snug text-white drop-shadow-sm">{t('buildingPromo.text')}</p>
        <p className="mt-2 text-[12px] text-white/90">{building.address}</p>
        <Link to="/ofertas" className="mt-3 inline-flex w-fit rounded-full bg-mango-500 px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(244,105,47,0.35)]">
          {t('buildingPromo.cta')}
        </Link>
        </div>
      </div>
    </section>
  )
}