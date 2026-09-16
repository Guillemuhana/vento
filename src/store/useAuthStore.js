import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// Roles soportados por la app: cliente | comercio | repartidor | admin
export const useAuthStore = create((set, get) => ({
  session: null,
  profile: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ session })
    if (session) {
      await get().fetchProfile(session.user.id)
    }
    set({ loading: false })

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session })
      if (session) {
        await get().fetchProfile(session.user.id)
      } else {
        set({ profile: null })
      }
    })
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (!error) set({ profile: data })
    return data
  },

  // El perfil (y el comercio / registro de repartidor según el rol) lo crea un
  // trigger en la base a partir de estos metadatos: ver la migración 004.
  // Hacerlo desde acá fallaba cuando el signUp no devuelve sesión, que es lo que
  // pasa con la confirmación de email activada.
  signUp: async ({ email, password, fullName, phone, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role: role || 'cliente',
        },
      },
    })
    if (error) throw error
    return data
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (data.session) await get().fetchProfile(data.session.user.id)
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, profile: null })
  },
}))
