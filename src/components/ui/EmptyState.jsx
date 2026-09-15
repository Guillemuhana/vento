export default function EmptyState({ icon = '📦', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-faint max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
