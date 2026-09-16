import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/layout/Navbar'
import ProductCard from '../../components/store/ProductCard'
import Spinner from '../../components/ui/Spinner'
import { useCartStore } from '../../store/useCartStore'
import { useT } from '../../i18n'
import { getFioritoProductImage, getFioritoStoreImage } from '../../data/fioritoImages'

export default function StoreDetail() {
  const { id } = useParams()
  const { t } = useT()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)
  const cartStoreId = useCartStore((s) => s.storeId)
  const clearCart = useCartStore((s) => s.clear)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: storeData }, { data: productsData }] = await Promise.all([
        supabase.from('stores').select('*').eq('id', id).single(),
        supabase.from('products').select('*').eq('store_id', id).order('category'),
      ])
      setStore(storeData)
      setProducts(
        (productsData || []).map((product) => ({
          ...product,
          image_url: getFioritoProductImage(storeData?.name, product.name) || product.image_url,
        }))
      )
      setLoading(false)
    }
    load()
  }, [id])

  function handleAdd(product) {
    try {
      addItem(id, store.name, product, 1)
      toast.success(t('store.added', { product: product.name }))
    } catch (err) {
      if (err.message === 'DIFFERENT_STORE') {
        if (confirm(t('store.differentStore'))) {
          clearCart()
          addItem(id, store.name, product, 1)
          toast.success(t('store.added', { product: product.name }))
        }
      }
    }
  }

  if (loading) return <Spinner className="py-20" />
  if (!store) return null

  const grouped = products.reduce((acc, p) => {
    const key = p.category || t('common.other')
    acc[key] = acc[key] || []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <div className="container-app">
      <Navbar title={store.name} back />
      <div className="h-32 bg-base-muted flex items-center justify-center text-5xl">
        {store.cover_url || store.logo_url || getFioritoStoreImage(store.name) ? (
          <img
            src={store.cover_url || store.logo_url || getFioritoStoreImage(store.name)}
            alt={store.name}
            className="h-full w-full object-cover"
          />
        ) : (
          '🏪'
        )}
      </div>
      <div className="px-4 py-3 border-b border-base-line">
        <p className="text-xs text-ink-faint capitalize">{store.category}</p>
        <div className="flex items-center gap-2 text-xs text-ink-soft mt-1">
          <span>⭐ {store.rating?.toFixed(1) || t('store.new')}</span>
          <span>·</span>
          <span>{store.eta_minutes || 25}-{(store.eta_minutes || 25) + 10} min</span>
          <span>·</span>
          <span>{store.is_open ? t('store.open') : t('common.closed')}</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-5">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="font-semibold text-sm mb-2 capitalize">{cat}</h3>
            <div className="space-y-2">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} />
              ))}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-ink-faint text-center py-10">{t('store.noProducts')}</p>
        )}
      </div>
    </div>
  )
}
