// El cartel colgante de la marca. Imagen quieta, sin efectos.
export default function Cartel({ className = '', imgClassName = '' }) {
  return (
    <img
      src="/assets/logo/cartel-app.png"
      alt="Just Minutes"
      className={`flex-shrink-0 object-contain ${className} ${imgClassName}`}
    />
  )
}
