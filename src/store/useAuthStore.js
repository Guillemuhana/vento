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

  signUp: async ({ email, password, fullName, phone, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        phone,
        role: role || 'cliente',
      })
      if (profileError) throw profileError

      if (role === 'comercio') {
        await supabase.from('stores').insert({
          owner_id: data.user.id,
          name: `Comercio de ${fullName}`,
          category: 'general',
          is_open: false,
        })
      }
      if (role === 'repartidor') {
        await supabase.from('couriers').insert({
          user_id: data.user.id,
          vehicle_type: 'moto',
          is_available: false,
        })
      }
    }
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
