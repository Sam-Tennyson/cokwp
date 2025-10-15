import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSessionStore } from '../stores/session'

const AuthGuard = ({ children }) => {
  const router = useRouter()
  const userSession = useSessionStore((s) => s.userSession)
  const hasHydrated = useSessionStore((s) => s.hasHydrated)
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!hasHydrated) return

    if (!isAuthenticated || !userSession) {
      router.push('/login')
    }
  }, [isAuthenticated, userSession, hasHydrated, router])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center flex-col gap-5">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
        <div className="text-lg text-gray-600 font-semibold">
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !userSession) {
    return null
  }

  return children
}

export default AuthGuard

