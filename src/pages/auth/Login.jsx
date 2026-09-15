import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
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
      toast.error(err.message || 'No pudimos iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app flex flex-col justify-center px-6 py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mango-500 text-2xl mb-3 shadow-[0_6px_18px_rgba(255,74,18,0.4)]">
          ⚡
        </div>
        <h1 className="text-2xl font-extrabold">
          Vento<span className="text-mango-500">.</span>
        </h1>
        <p className="text-sm text-ink-faint">Todo lo que necesitás, en minutos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          className="input-field"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          className="input-field"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-center text-sm text-ink-faint mt-6">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="font-semibold text-ink">
          Registrate
        </Link>
      </p>
    </div>
  )
}
