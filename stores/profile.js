import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { supabase } from '../services/supabase'

export const useProfileStore = create()(
  devtools(
    persist(
      (set) => ({
        profile: null,
        isAdmin: false,
        setIsAdmin: (isAdmin) => set({ isAdmin }, false, 'setIsAdmin'),
        setProfile: (profile) => set({ profile }, false, 'setProfile'),
        fetchProfile: async (userId) => {
          const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', userId)
            .single()
          if (data) {
            set({ profile: data, isAdmin: data.isAdmin }, false, 'fetchProfile')
          }
          if (error) {
            console.error(error)
          }
        },
      }),
      { name: 'profile-store' }
    )
  )
)

