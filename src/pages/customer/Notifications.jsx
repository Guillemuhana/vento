import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import { useT } from '../../i18n'
import { NOTIFICACIONES, leerLeidas, marcarTodasLeidas } from '../../data/notificaciones'

const STORAGE_KEY = 'just-minutes-notifications'
const DEFAULTS = { orders: true, promotions: true, points: true }

export default function Notifications() {
  const { t, lang } = useT()
  const [settings, setSettings] = useState(DEFAULTS)
  // Cuáles estaban sin leer al entrar: se congela al montar para que las nuevas
  // sigan marcadas mientras la persona lee la pantalla, y no se apaguen solas.
  const [nuevas, setNuevas] = useState([])

  useEffect(() => {
    const leidas = leerLeidas()
    setNuevas(NOTIFICACIONES.filter((n) => !leidas.includes(n.id)).map((n) => n.id))
    marcarTodasLeidas()
  }, [])

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
      {NOTIFICACIONES.length > 0 && (
        <section className="px-4 pt-4">
          <h2 className="section-title mb-2">{t('notif.latest')}</h2>
          <div className="space-y-2">
            {NOTIFICACIONES.map((n) => (
              <Link key={n.id} to={n.to} className="card flex gap-3 overflow-hidden">
                {n.imagen && (
                  <img
                    src={n.imagen}
                    alt=""
                    loading="lazy"
                    className="h-[84px] w-[84px] flex-shrink-0 object-cover"
                  />
                )}
                <div className="min-w-0 flex-1 py-3 pr-3">
                  <div className="flex items-start gap-2">
                    <p className="flex-1 font-semibold text-sm leading-tight">{t(n.tituloKey)}</p>
                    {nuevas.includes(n.id) && (
                      <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-mango-500" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-soft line-clamp-2">{t(n.textoKey)}</p>
                  <p className="mt-1 text-[11px] text-ink-faint">
                    {new Date(n.fecha).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-US', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="px-4 py-4 space-y-2">
        <h2 className="section-title mb-1">{t('notif.settings')}</h2>
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
