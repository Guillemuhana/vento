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
    <div className="container-app flex flex-col justify-center px-6 py-10">
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <img
            src="/assets/logo/just-minutes.png"
            alt="Just Minutes"
            className="w-60 max-w-full h-auto object-contain"
          />
        </div>
        <p className="text-sm text-ink-faint">{t('auth.tagline')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder={t('auth.email')}
          autoComplete="email"
          className="input-field"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          required
          placeholder={t('auth.password')}
          autoComplete="current-password"
          className="input-field"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? t('auth.signingIn') : t('auth.signIn')}
        </button>
      </form>

      <p className="text-center text-sm text-ink-faint mt-6">
        {t('auth.noAccount')}{' '}
        <Link to="/registro" className="font-semibold text-ink">
          {t('auth.goSignUp')}
        </Link>
      </p>
    </div>
  )
}
