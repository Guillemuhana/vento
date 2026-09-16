import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/useAuthStore'

const CATEGORIES = ['comida', 'super', 'farmacia', 'bebidas', 'mascotas']

export default function StoreSettings() {
  const session = useAuthStore((s) => s.session)
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('stores').select('*').eq('owner_id', session.user.id).single()
      setStore(data)
      setLoading(false)
    }
    if (session) load()
  }, [session])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('stores')
      .update({
        name: store.name,
        description: store.description,
        category: store.category,
        address: store.address,
        eta_minutes: store.eta_minutes,
      })
      .eq('id', store.id)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Cambios guardados')
  }

  if (loading) return <Spinner className="py-20" />
  if (!store) return null

  return (
    <div className="container-app">
      <Navbar title="Ajustes del comercio" back />
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
        <input
          required
          className="input-field"
          placeholder="Nombre del comercio"
          value={store.name}
          onChange={(e) => setStore({ ...store, name: e.target.value })}
        />
        <textarea
          className="input-field"
          rows={3}
          placeholder="Descripción"
          value={store.description || ''}
          onChange={(e) => setStore({ ...store, description: e.target.value })}
        />
        <select
          className="input-field"
          value={store.category}
          onChange={(e) => setStore({ ...store, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          required
          className="input-field"
          placeholder="Dirección"
          value={store.address || ''}
          onChange={(e) => setStore({ ...store, address: e.target.value })}
        />
        <input
          type="number"
          required
          min="1"
          className="input-field"
          placeholder="Tiempo estimado (minutos)"
          value={store.eta_minutes || ''}
          onChange={(e) => setStore({ ...store, eta_minutes: Number(e.target.value) })}
        />
        <button type="submit" disabled={saving} className="btn-accent w-full">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
