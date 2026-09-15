import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Spinner className="py-20" />

  return (
    <div className="container-app">
      <Navbar title="Usuarios" back />
      <div className="px-4 py-3 space-y-2">
        {users.map((u) => (
          <div key={u.id} className="card p-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{u.full_name}</p>
              <p className="text-xs text-ink-faint">{u.phone}</p>
            </div>
            <span className="text-xs font-semibold bg-base-muted rounded-full px-2.5 py-1 capitalize">
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
