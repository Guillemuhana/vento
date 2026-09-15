import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Navbar from '../../components/layout/Navbar'

export default function Profile() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuthStore()

  return (
    <div className="container-app">
      <Navbar title="Perfil" />
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-14 w-14 rounded-full bg-mango-100 flex items-center justify-center text-xl font-bold">
            {profile?.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold">{profile?.full_name}</p>
            <p className="text-xs text-ink-faint capitalize">{profile?.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="card p-4 flex justify-between text-sm">
            <span className="text-ink-faint">Teléfono</span>
            <span className="font-medium">{profile?.phone || '—'}</span>
          </div>
        </div>

        <button
          onClick={async () => {
            await signOut()
            navigate('/login')
          }}
          className="btn-outline w-full mt-8 text-danger-500"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
