import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'

const DEMO_USERS = {
  cliente: { email: 'cliente@demo.com', password: '123456' },
  comercio: { email: 'comercio@demo.com', password: '123456' },
  repartidor: { email: 'repartidor@demo.com', password: '123456' },
}

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

  async function handleDemoLogin(role) {
    const demoUser = DEMO_USERS[role]
    if (!demoUser) return

    setLoading(true)
    try {
      setForm(demoUser)
      await signIn(demoUser)
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'No pudimos iniciar sesión con la cuenta demo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app flex flex-col justify-center px-6 py-10">
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <img
            src="/assets/logo/logovento.png"
            alt="Vento logo"
            className="h-24 w-auto object-contain"
          />
        </div>
        <p className="text-sm text-ink-faint">Todo lo que necesitás, en minutos.</p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleDemoLogin('cliente')}
          disabled={loading}
          className="btn-outline text-xs py-2 px-2"
        >
          Cliente
        </button>
        <button
          type="button"
          onClick={() => handleDemoLogin('comercio')}
          disabled={loading}
          className="btn-outline text-xs py-2 px-2"
        >
          Comercio
        </button>
        <button
          type="button"
          onClick={() => handleDemoLogin('repartidor')}
          disabled={loading}
          className="btn-outline text-xs py-2 px-2"
        >
          Repartidor
        </button>
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
