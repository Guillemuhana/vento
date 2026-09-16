import { ORDER_STATUS_FLOW, statusProgress } from '../../utils/orderStatus'
import { useT } from '../../i18n'

export default function OrderStatusTracker({ status }) {
  const { t } = useT()

  if (status === 'cancelado') {
    return (
      <div className="rounded-xl bg-danger-400/10 text-danger-600 text-sm font-semibold px-4 py-3">
        {t('status.cancelado')}
      </div>
    )
  }

  const progress = statusProgress(status)
  const currentIdx = ORDER_STATUS_FLOW.indexOf(status)

  return (
    <div>
      <div className="h-2 w-full bg-base-muted rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-teal-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-semibold text-sm mb-3">{t(`status.${status}`)}</p>
      <ol className="space-y-2">
        {ORDER_STATUS_FLOW.map((step, idx) => (
          <li key={step} className="flex items-center gap-2 text-xs">
            <span
              className={`h-2 w-2 rounded-full flex-shrink-0 ${
                idx <= currentIdx ? 'bg-teal-500' : 'bg-base-line'
              }`}
            />
            <span className={idx <= currentIdx ? 'text-ink font-medium' : 'text-ink-faint'}>
              {t(`status.${step}`)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
