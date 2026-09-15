export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-6 w-6 rounded-full border-2 border-base-line border-t-ink animate-spin" />
    </div>
  )
}
