import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import { useT } from '../../i18n'

const STORAGE_KEY = 'just-minutes-notifications'
const DEFAULTS = { orders: true, promotions: true, points: true }

export default function Notifications() {
  const { t } = useT()
  const [settings, setSettings] = useState(DEFAULTS)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (saved) setSettings({ ...DEFAULTS, ...saved })
    } catch {
      setSettings(DEFAULTS)
    }
  }, [])

  function toggle(key) {
    setSettings((current) => {
      const next = { ...current, [key]: !current[key] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const options = [
    ['orders', t('notifications.orders'), t('notifications.ordersDescription')],
    ['promotions', t('notifications.promotions'), t('notifications.promotionsDescription')],
    ['points', t('notifications.points'), t('notifications.pointsDescription')],
  ]

  return (
    <div className="container-app">
      <Navbar title={t('notifications.title')} back />
      <div className="px-4 py-4 space-y-2">
        <p className="text-sm text-ink-soft mb-4">{t('notifications.description')}</p>
        {options.map(([key, title, description]) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className="w-full card p-4 flex items-center gap-3 text-left"
          >
            <span className="flex-1">
              <span className="block font-semibold text-sm">{title}</span>
              <span className="block text-xs text-ink-faint mt-1">{description}</span>
            </span>
            <span className={`w-11 h-6 rounded-full p-1 transition ${settings[key] ? 'bg-mango-500' : 'bg-base-line'}`}>
              <span className={`block w-4 h-4 rounded-full bg-white transition ${settings[key] ? 'translate-x-5' : ''}`} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
