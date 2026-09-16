import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Favoritos del cliente. Por ahora viven en el dispositivo (localStorage):
// alcanza para la UI y no depende de una tabla nueva. Para que sincronicen entre
// dispositivos hay que correr la migración `supabase/migrations/002_favorites.sql`
// y cambiar este store por lecturas/escrituras a la tabla `favorites`.
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],

      isFavorite: (storeId) => get().ids.includes(storeId),

      toggle: (storeId) => {
        const ids = get().ids
        set({
          ids: ids.includes(storeId) ? ids.filter((id) => id !== storeId) : [...ids, storeId],
        })
        return !ids.includes(storeId)
      },

      clear: () => set({ ids: [] }),
    }),
    { name: 'vento-favorites' }
  )
)
