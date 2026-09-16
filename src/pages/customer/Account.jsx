import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'
import ScrollTopPill from '../../components/layout/ScrollTopPill'
import { formatMoney } from '../../utils/format'
import { useT, LANGUAGES } from '../../i18n'
import { IconCrown, IconChevronRight, IconClose } from '../../components/ui/Icon'
import {
  IconPedidos,
  IconAyuda,
  IconMetodosPago,
  IconCreditos,
  IconCupones,
  IconLoyalty,
  IconDirecciones,
  IconFacturacion,
  IconIdioma,
  IconNotificaciones,
  IconAliado,
  IconTerminos,
  IconPrivacidad,
  IconCerrarSesion,
} from '../../components/ui/AccountIcons'

const APP_VERSION = '1.0.0'

// Iniciales para el avatar: "Guillermo Muhana" -> "GM"
function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')
}

// "Guillermo Muhana" -> "Guillermo M."
function shortName(name, fallback) {
  const limpio = (name || '').trim()
  if (!limpio) return fallback
  const [first, last] = limpio.split(/\s+/)
  return last ? `${first} ${last[0].toUpperCase()}.` : first
}

function Row({ icon: Icon, label, to, onClick, value }) {
  const content = (
    <>
      <Icon size={22} className="text-ink flex-shrink-0" />
      <span className="flex-1 text-[16px] text-ink">{label}</span>
      {value ? (
        <span className="text-[16px] font-semibold text-ink">{value}</span>
      ) : (
        <IconChevronRight size={18} className="text-ink-faint" />
      )}
    </>
  )
  const className =
    'w-full flex items-center gap-3.5 py-4 border-b border-base-line last:border-b-0 text-left'

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}

function Section({ title, children }) {
  return (
    <section className="px-4 pt-7">
      <h2 className="section-title mb-1">{title}</h2>
      <div>{children}</div>
    </section>
  )
}

export default function Account() {
  const navigate = useNavigate()
  const { t, lang, setLang } = useT()
  const { profile, signOut } = useAuthStore()
  const [langOpen, setLangOpen] = useState(false)

  const soon = () => toast(t('common.soon'))

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleSignOutAll = async () => {
    await supabase.auth.signOut({ scope: 'global' })
    await signOut()
    navigate('/login')
  }

  const idiomaActual = LANGUAGES.find((l) => l.code === lang)

  return (
    <div className="container-app">
      <ScrollTopPill />

      {/* Bloque superior */}
      <div className="bg-base-muted px-4 pt-6 pb-6">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="h-[72px] w-[72px] rounded-full bg-base-line overflow-hidden flex items-center justify-center font-display font-bold text-[22px] text-ink-soft flex-shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
            ) : (
              initials(profile?.full_name) || '—'
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[22px] leading-tight truncate">
              {shortName(profile?.full_name, t('account.yourAccount'))}
            </p>
            <Link
              to="/cuenta/perfil"
              className="inline-flex items-center gap-1 text-[15px] text-ink-soft mt-0.5"
            >
              {t('account.editProfile')}
              <IconChevronRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <QuickTile icon={IconPedidos} label={t('account.orders')} to="/pedidos" />
          <QuickTile icon={IconAyuda} label={t('account.help')} onClick={soon} />
          <QuickTile icon={IconMetodosPago} label={t('account.payment')} onClick={soon} />
        </div>
      </div>

      <Section title={t('account.benefits')}>
        <Row icon={IconCreditos} label={t('account.credits')} value={formatMoney(0)} />
        <Row icon={IconCupones} label={t('account.coupons')} onClick={soon} />
        <Row icon={IconLoyalty} label={t('account.loyalty')} onClick={soon} />
      </Section>

      <Section title={t('account.myAccount')}>
        <Row icon={IconCrown} label={t('account.pro')} onClick={soon} />
        <Row icon={IconDirecciones} label={t('account.addresses')} onClick={soon} />
        <Row icon={IconMetodosPago} label={t('account.payment')} onClick={soon} />
        <Row icon={IconFacturacion} label={t('account.billing')} onClick={soon} />
        <Row icon={IconAyuda} label={t('account.help')} onClick={soon} />
      </Section>

      <Section title={t('account.settings')}>
        <Row
          icon={IconIdioma}
          label={t('account.language')}
          value={idiomaActual?.nativeLabel}
          onClick={() => setLangOpen(true)}
        />
        <Row icon={IconNotificaciones} label={t('account.notifications')} onClick={soon} />
      </Section>

      <Section title={t('account.moreInfo')}>
        <Row icon={IconAliado} label={t('account.partner')} onClick={soon} />
        <Row icon={IconTerminos} label={t('account.terms')} onClick={soon} />
        <Row icon={IconPrivacidad} label={t('account.privacy')} onClick={soon} />
      </Section>

      <div className="px-4 pt-8 space-y-3">
        <button type="button" onClick={handleSignOut} className="btn-soft">
          <IconCerrarSesion size={20} />
          {t('account.signOut')}
        </button>
        <button type="button" onClick={handleSignOutAll} className="btn-soft-outline">
          <IconCerrarSesion size={20} />
          {t('account.signOutAll')}
        </button>
      </div>

      <footer className="px-4 pt-6 pb-2 text-[12px] text-ink-faint/70 leading-relaxed">
        <p>{t('account.version', { version: APP_VERSION })}</p>
        <p>{t('account.madeIn')}</p>
        <p className="mt-1 font-medium text-ink-faint/80">{t('account.developedBy')}</p>
      </footer>

      <LanguageSheet open={langOpen} onClose={() => setLangOpen(false)} lang={lang} setLang={setLang} title={t('account.chooseLanguage')} />
    </div>
  )
}

// Hoja inferior para elegir idioma. El cambio se aplica al instante y queda
// guardado en el dispositivo.
function LanguageSheet({ open, onClose, lang, setLang, title }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="max-w-md md:max-w-lg mx-auto bg-base rounded-t-3xl px-4 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-[20px]">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 w-9 rounded-full bg-base-muted flex items-center justify-center text-ink"
                >
                  <IconClose size={16} />
                </button>
              </div>

              {LANGUAGES.map((idioma) => {
                const activo = idioma.code === lang
                return (
                  <button
                    key={idioma.code}
                    type="button"
                    onClick={() => {
                      setLang(idioma.code)
                      onClose()
                    }}
                    className={`w-full flex items-center justify-between rounded-2xl px-4 py-4 mb-2 border transition ${
                      activo ? 'border-mango-500 bg-mango-50' : 'border-base-line'
                    }`}
                  >
                    <span className="text-[16px] font-medium text-ink">{idioma.nativeLabel}</span>
                    {activo && (
                      <span className="h-5 w-5 rounded-full bg-mango-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 13 4.5 4.5L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function QuickTile({ icon: Icon, label, to, onClick }) {
  const className =
    'bg-base rounded-2xl h-[104px] px-2 flex flex-col items-center justify-center gap-2 text-center active:scale-[0.97] transition'
  const content = (
    <>
      <Icon size={28} className="text-ink" />
      <span className="text-[13px] leading-tight text-ink font-medium">{label}</span>
    </>
  )
  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  )
}
