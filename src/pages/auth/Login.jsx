import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'
import { useT } from '../../i18n'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useT()
  const signIn = useAuthStore((s) => s.signIn)
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(form)
      navigate('/')
    } catch (err) {
      toast.error(err.message || t('auth.signInError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-stage min-h-screen bg-cream px-4 py-5 sm:px-6 sm:py-8">
      <div className="login-shell mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl overflow-hidden rounded-[2rem] bg-base shadow-float sm:min-h-[calc(100vh-4rem)]">
        <div className="relative hidden w-[46%] overflow-hidden bg-ink px-10 py-12 md:flex md:flex-col md:justify-between">
          <div className="login-orb absolute -right-24 -top-24 h-64 w-64 rounded-full bg-mango-500/90" />
          <div className="login-ring absolute -bottom-32 -left-20 h-72 w-72 rounded-full border-[32px] border-white/10" />
          <div className="login-mark relative">
            <img
              src="/assets/logo/just-minutes.png"
              alt="Just Minutes"
              className="w-full max-w-[360px] object-contain brightness-0 invert"
            />
          </div>
          <div className="login-copy relative max-w-xs text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mango-300">Miami, FL</p>
            <p className="mt-3 font-display text-3xl font-bold leading-tight">{t('auth.tagline')}</p>
          </div>
        </div>

        <main className="login-form flex w-full flex-col justify-center px-6 py-10 sm:px-12 md:w-[54%] md:px-16">
          <div className="login-heading mb-9 text-center md:text-left">
            <div className="mb-5 flex justify-center md:hidden">
              <img
                src="/assets/logo/just-minutes.png"
                alt="Just Minutes"
                className="w-[min(88vw,360px)] max-w-full object-contain"
              />
            </div>
            <p className="text-sm text-ink-faint">{t('auth.tagline')}</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{t('auth.signIn')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder={t('auth.email')}
              autoComplete="email"
              className="login-field input-field h-14 text-base"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              required
              placeholder={t('auth.password')}
              autoComplete="current-password"
              className="login-field input-field h-14 text-base"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" disabled={loading} className="login-submit btn-accent mt-2 h-14 w-full text-base">
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-ink-faint">
            {t('auth.noAccount')}{' '}
            <Link to="/registro" className="font-bold text-ink underline decoration-mango-500 decoration-2 underline-offset-4">
              {t('auth.goSignUp')}
            </Link>
          </p>
        </main>
      </div>
    </div>
  )
}
