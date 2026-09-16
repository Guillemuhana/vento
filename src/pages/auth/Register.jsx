import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'
import { useT } from '../../i18n'

const ROLES = [
  { value: 'cliente', icon: '🛍️' },
  { value: 'comercio', icon: '🏪' },
  { value: 'repartidor', icon: '🛵' },
]

export default function Register() {
  const navigate = useNavigate()
  const { t } = useT()
  const signUp = useAuthStore((s) => s.signUp)
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '', role: 'cliente' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signUp(form)
      toast.success(t('register.created'))
      navigate('/login')
    } catch (err) {
      toast.error(err.message || t('register.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app px-6 py-10">
      <h1 className="text-2xl font-extrabold mb-1">{t('register.title')}</h1>
      <p className="text-sm text-ink-faint mb-6">{t('register.subtitle')}</p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setForm({ ...form, role: r.value })}
            className={`rounded-xl border p-3 text-center transition ${
              form.role === r.value ? 'border-ink bg-base-muted' : 'border-base-line'
            }`}
          >
            <div className="text-xl mb-1">{r.icon}</div>
            <div className="text-xs font-semibold">{t(`register.${r.value}`)}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-faint mb-4">
        {t(`register.${form.role}Desc`)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder={t('register.fullName')}
          className="input-field"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          required
          placeholder={t('register.phone')}
          className="input-field"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="email"
          required
          placeholder={t('auth.email')}
          className="input-field"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder={t('register.passwordHint')}
          className="input-field"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? t('register.creating') : t('register.create')}
        </button>
      </form>

      <p className="text-center text-sm text-ink-faint mt-6">
        {t('register.haveAccount')}{' '}
        <Link to="/login" className="font-semibold text-ink">
          {t('register.goSignIn')}
        </Link>
      </p>
    </div>
  )
}
