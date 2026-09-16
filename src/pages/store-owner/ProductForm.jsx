import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import { supabase } from '../../lib/supabase'

export default function ProductForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { storeId, product } = location.state || {}
  const isEditing = Boolean(product)

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    image_url: product?.image_url || '',
    is_available: product?.is_available ?? true,
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const price = Number(form.price)
    if (!storeId) {
      toast.error('No encontramos tu comercio')
      return
    }
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) {
      toast.error('Completá el nombre y un precio válido')
      return
    }
    setSaving(true)
    const payload = { ...form, name: form.name.trim(), price, store_id: storeId }
    const query = isEditing
      ? supabase.from('products').update(payload).eq('id', product.id)
      : supabase.from('products').insert(payload)

    const { error } = await query
    setSaving(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isEditing ? 'Producto actualizado' : 'Producto creado')
      navigate('/comercio/productos')
    }
  }

  return (
    <div className="container-app">
      <Navbar title={isEditing ? 'Editar producto' : 'Nuevo producto'} back />
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
        <input
          required
          placeholder="Nombre del producto"
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          className="input-field"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          required
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Precio"
          className="input-field"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Categoría (ej: hamburguesas, bebidas)"
          className="input-field"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="URL de la imagen (opcional)"
          className="input-field"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
          />
          Disponible para la venta
        </label>
        <button type="submit" disabled={saving} className="btn-accent w-full">
          {saving ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  )
}
