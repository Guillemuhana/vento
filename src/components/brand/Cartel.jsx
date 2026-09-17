// El cartel colgante de la marca, con un reflejo que lo cruza cada tanto.
//
// El brillo es una banda de luz en diagonal recortada con la silueta del propio
// PNG (`mask-image`), así el reflejo corre por el disco y el brazo de hierro en
// vez de ser un rectángulo de luz por encima. El detalle del recorte está en
// `.cartel-brillo`, en index.css.
export default function Cartel({ className = '', imgClassName = '' }) {
  return (
    <span className={`relative inline-block flex-shrink-0 ${className}`}>
      <img
        src="/assets/logo/cartel-app.png"
        alt="Just Minutes"
        className={`h-full w-auto object-contain ${imgClassName}`}
      />
      <span aria-hidden="true" className="cartel-brillo pointer-events-none absolute inset-0" />
    </span>
  )
}
