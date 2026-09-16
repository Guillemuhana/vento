import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// El carrito está atado a un único comercio a la vez (igual que Rappi/apps reales):
// si el usuario agrega un producto de otro comercio, se le pregunta si quiere vaciar el carrito.
export const useCartStore = create(
  persist(
    (set, get) => ({
      storeId: null,
      storeName: null,
      items: [], // { productId, name, price, quantity, notes, imageUrl }

      addItem: (storeId, storeName, product, quantity = 1, notes = '') => {
        const state = get()
        if (state.storeId && state.storeId !== storeId) {
          throw new Error('DIFFERENT_STORE')
        }
        const existing = state.items.find((i) => i.productId === product.id && i.notes === notes)
        let items
        if (existing) {
          items = state.items.map((i) =>
            i.productId === product.id && i.notes === notes
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        } else {
          items = [
            ...state.items,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.image_url,
              quantity,
              notes,
            },
          ]
        }
        set({ storeId, storeName, items })
      },

      updateQuantity: (productId, notes, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, notes)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.notes === notes ? { ...i, quantity } : i
          ),
        })
      },

      removeItem: (productId, notes) => {
        const items = get().items.filter((i) => !(i.productId === productId && i.notes === notes))
        set({ items, storeId: items.length ? get().storeId : null, storeName: items.length ? get().storeName : null })
      },

      clear: () => set({ storeId: null, storeName: null, items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'just-minutes-cart' }
  )
)
