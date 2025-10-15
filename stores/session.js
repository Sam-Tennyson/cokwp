
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { supabase } from '../services/supabase'

export const useSessionStore = create()(

  devtools(
    persist(
      (set) => ({
        userSession: null,
        isAuthenticated: false,
        hasHydrated: false,
        setHasHydrated: (state) => set({ hasHydrated: state }),
        setSession: (session) => set(() => ({ userSession: session, isAuthenticated: !!session })),
        clearSession: () => set(() => ({ userSession: null, isAuthenticated: false })),
        handleSignIn: async (email, password) => {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (data) {
            console.log(data, "data")
            set(() => ({ userSession: data.user, isAuthenticated: true }))
          }
          if (error) {
            console.error('Error logging in:', error)
            throw new Error(error.message)
          }
        },
        handleSignOut: async () => {
          console.log('Signing out...')
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.error('Error logging out:', error)
            throw new Error(error.message)
          }
          set(() => ({ userSession: null, isAuthenticated: false }))
        },
      }),
      {
        name: 'user-session',
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true)
        },
      }
    ),
  )
)