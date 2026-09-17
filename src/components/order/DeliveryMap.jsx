import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'

// Marcadores dibujados en HTML (divIcon) en vez de los PNG que trae Leaflet.
// Además de quedar en el lenguaje visual de la app, evita el clásico problema
// de los íconos rotos de Leaflet cuando el proyecto se compila con un bundler.
function pin({ color, ring, svg }) {
  return L.divIcon({
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    html: `
      <div style="
        width:42px;height:42px;border-radius:50%;
        background:${color};
        border:3px solid #fff;
        box-shadow:0 4px 12px rgba(16,24,40,.28);
        display:flex;align-items:center;justify-content:center;
        ${ring ? `outline:8px solid ${ring};outline-offset:0;` : ''}
      ">${svg}</div>`,
  })
}

const SVG_MOTO = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/>
  <path d="M8.5 17h7l-3-7h-3M12.5 10 14 6h3"/></svg>`

const SVG_TIENDA = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4.5 9.5h15V19a1.4 1.4 0 0 1-1.4 1.4H5.9A1.4 1.4 0 0 1 4.5 19V9.5Z"/>
  <path d="M3.5 9.5 5 5h14l1.5 4.5"/></svg>`

const ICONO_REPARTIDOR = pin({ color: '#F4692F', ring: 'rgba(244,105,47,.18)', svg: SVG_MOTO })
const ICONO_COMERCIO = pin({ color: '#13312A', svg: SVG_TIENDA })

// Encuadra el mapa para que entren todos los puntos, y lo vuelve a hacer
// cuando el repartidor se mueve.
function Encuadrar({ puntos }) {
  const map = useMap()
  const clave = puntos.map((p) => p.join(',')).join('|')

  useEffect(() => {
    if (!puntos.length) return
    if (puntos.length === 1) {
      map.setView(puntos[0], 15, { animate: true })
      return
    }
    map.fitBounds(L.latLngBounds(puntos), { padding: [48, 48], maxZoom: 16, animate: true })
    // `clave` cambia cuando cambian las coordenadas, no la identidad del array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, map])

  return null
}

/**
 * Mapa de seguimiento.
 * - `courier`  { lat, lng, label }  posición en vivo del repartidor
 * - `store`    { lat, lng, label }  de dónde se retira el pedido
 * - `height`   alto en clases de Tailwind
 */
export default function DeliveryMap({ courier, store, height = 'h-72', className = '' }) {
  const puntos = useMemo(() => {
    const p = []
    if (courier?.lat != null && courier?.lng != null) p.push([courier.lat, courier.lng])
    if (store?.lat != null && store?.lng != null) p.push([store.lat, store.lng])
    return p
  }, [courier?.lat, courier?.lng, store?.lat, store?.lng])

  if (!puntos.length) return null

  return (
    <div className={`${height} overflow-hidden ${className}`}>
      <MapContainer
        center={puntos[0]}
        zoom={15}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Línea entre el comercio y el repartidor */}
        {puntos.length === 2 && (
          <Polyline
            positions={puntos}
            pathOptions={{ color: '#F4692F', weight: 4, opacity: 0.55, dashArray: '1 10', lineCap: 'round' }}
          />
        )}

        {store?.lat != null && store?.lng != null && (
          <Marker position={[store.lat, store.lng]} icon={ICONO_COMERCIO}>
            {store.label && (
              <Tooltip direction="top" offset={[0, -22]}>
                {store.label}
              </Tooltip>
            )}
          </Marker>
        )}

        {courier?.lat != null && courier?.lng != null && (
          <Marker position={[courier.lat, courier.lng]} icon={ICONO_REPARTIDOR} zIndexOffset={500}>
            {courier.label && (
              <Tooltip direction="top" offset={[0, -24]} permanent>
                {courier.label}
              </Tooltip>
            )}
          </Marker>
        )}

        <Encuadrar puntos={puntos} />
      </MapContainer>
    </div>
  )
}
