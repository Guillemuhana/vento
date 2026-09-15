import { useNavigate } from 'react-router-dom'

export default function Navbar({ title, back = false, right = null }) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-20 bg-base/95 backdrop-blur border-b border-base-line px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-base-muted text-ink"
            aria-label="Volver"
          >
            ←
          </button>
        )}
        <h1 className="font-display font-bold text-lg truncate">{title}</h1>
      </div>
      {right}
    </header>
  )
}
