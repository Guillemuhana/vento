import { useT } from '../../i18n'

export default function LocalValueBanner({ role }) {
  const { t } = useT()
  const isCourier = role === 'courier'

  return (
    <aside className="mx-4 mt-3 rounded-2xl bg-ink px-4 py-4 text-white">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-mango-300">{t('localValue.eyebrow')}</p>
      <h2 className="font-display font-bold text-[18px] leading-tight mt-1">
        {t(isCourier ? 'localValue.courierTitle' : 'localValue.storeTitle')}
      </h2>
      <p className="text-[13px] leading-snug text-white/75 mt-1.5">
        {t(isCourier ? 'localValue.courierText' : 'localValue.storeText')}
      </p>
    </aside>
  )
}