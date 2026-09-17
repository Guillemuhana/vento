import { motion, useReducedMotion } from 'framer-motion'

// El cartel colgante de la marca, encendido.
//
// Son tres capas, y cada una imita algo que pasa en un letrero real:
//   1. el resplandor que el cartel tira sobre la pared,
//   2. el arranque: dos chispazos antes de quedar prendido,
//   3. el balanceo, porque el cartel cuelga de un brazo.
//
// El disco verde no está centrado en el PNG (arriba a la izquierda va el brazo
// de hierro), así que el resplandor se posiciona a mano sobre el disco y el eje
// del balanceo cae donde el cartel se engancha al soporte.
const DISCO = { left: '8%', top: '4%', width: '88%', height: '88%' }
const EJE = '64% 6%'

// Arranque del tubo: prende, se corta, vuelve, titila y queda firme.
const CHISPAZOS = [0.15, 1, 0.2, 0.95, 0.45, 1]
const TIEMPOS = [0, 0.12, 0.2, 0.34, 0.46, 1]

export default function CartelPrendido({ className = '', imgClassName = '' }) {
  const sinMovimiento = useReducedMotion()

  const balanceo = sinMovimiento
    ? {}
    : {
        animate: { rotate: [-1.1, 1.1] },
        transition: {
          duration: 5.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        },
      }

  const arranque = sinMovimiento
    ? { animate: { opacity: 1 } }
    : {
        initial: { opacity: 0.15 },
        animate: { opacity: CHISPAZOS },
        transition: { duration: 1.6, times: TIEMPOS, ease: 'easeOut' },
      }

  return (
    <motion.div
      className={`relative flex-shrink-0 ${className}`}
      style={{ transformOrigin: EJE }}
      {...balanceo}
    >
      {/* Luz que el cartel tira alrededor. Va detrás y no recibe clicks. */}
      <motion.span
        aria-hidden="true"
        className="cartel-resplandor pointer-events-none absolute rounded-full"
        style={DISCO}
        {...arranque}
      />

      {/* El cartel. El brillo propio arranca apagado y se enciende con los
          mismos chispazos que la luz de alrededor. */}
      <motion.img
        src="/assets/logo/cartel-app.png"
        alt="Just Minutes"
        className={`relative h-full w-auto object-contain ${imgClassName}`}
        initial={sinMovimiento ? false : { filter: 'brightness(0.62) saturate(0.72)' }}
        animate={{
          filter: sinMovimiento
            ? 'brightness(1)'
            : [
                'brightness(0.62) saturate(0.72)',
                'brightness(1.14) saturate(1.06)',
                'brightness(0.66) saturate(0.76)',
                'brightness(1.1) saturate(1.04)',
                'brightness(0.86) saturate(0.92)',
                'brightness(1) saturate(1)',
              ],
        }}
        transition={sinMovimiento ? { duration: 0 } : { duration: 1.6, times: TIEMPOS }}
      />
    </motion.div>
  )
}
