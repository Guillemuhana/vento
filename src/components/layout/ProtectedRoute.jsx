import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Spinner from '../ui/Spinner'

// roles: array opcional de roles permitidos. Si no se pasa, alcanza con estar logueado.
export default function ProtectedRoute({ children, roles }) {
  const { session, profile, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
