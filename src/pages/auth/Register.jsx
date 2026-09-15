import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/useAuthStore'

const ROLES = [
  { value: 'cliente', label: 'Cliente', icon: '🛍️', desc: 'Quiero pedir comida y productos' },
  { value: 'comercio', label: 'Comercio', icon: '🏪', desc: 'Quiero vender en la plataforma' },
  { value: 'repartidor', label: 'Repartidor', icon: '🛵', desc: 'Quiero hacer entregas' },
]

export default function Register() {
  const navigate = useNavigate()
  const signUp = useAuthStore((s) => s.signUp)
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '', role: 'cliente' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signUp(form)
      toast.success('Cuenta creada. Revisá tu email si pedimos confirmación.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'No pudimos crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app px-6 py-10">
      <h1 className="text-2xl font-extrabold mb-1">Creá tu cuenta</h1>
      <p className="text-sm text-ink-faint mb-6">Elegí cómo vas a usar Vento.</p>

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
            <div className="text-xs font-semibold">{r.label}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-faint mb-4">
        {ROLES.find((r) => r.value === form.role)?.desc}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          required
          placeholder="Nombre completo"
          className="input-field"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          required
          placeholder="Teléfono"
          className="input-field"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
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
          minLength={6}
          placeholder="Contraseña (mín. 6 caracteres)"
          className="input-field"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-sm text-ink-faint mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="font-semibold text-ink">
          Ingresá
        </Link>
      </p>
    </div>
  )
}
