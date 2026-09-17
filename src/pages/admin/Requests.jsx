import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../../components/layout/Navbar'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'

// Estados permitidos por los CHECK de la migración 010.
const ESTADOS_AYUDA = ['pendiente', 'en_revision', 'resuelto']
const ESTADOS_ALIADO = ['pendiente', 'en_revision', 'contactado', 'rechazado']
const ESTADOS_PRO = ['pendiente', 'activa', 'cancelada']

const ETIQUETAS = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  resuelto: 'Resuelta',
  contactado: 'Contactado',
  rechazado: 'Rechazado',
  activa: 'Activa',
  cancelada: 'Cancelada',
}

function fecha(valor) {
  return new Date(valor).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

// Tarjeta de revisión: cambia el estado y guarda la nota que ve el usuario.
function TarjetaRevision({
  titulo,
  subtitulo,
  cuerpo,
  estado,
  estados,
  notas,
  conNotas = true,
  fechaAlta,
  onGuardar,
}) {
  const [nuevoEstado, setNuevoEstado] = useState(estado)
  const [nuevasNotas, setNuevasNotas] = useState(notas || '')
  const [guardando, setGuardando] = useState(false)

  const cambiado = nuevoEstado !== estado || nuevasNotas !== (notas || '')

  async function guardar() {
    setGuardando(true)
    const cambios = conNotas
      ? { status: nuevoEstado, admin_notes: nuevasNotas.trim() || null }
      : { status: nuevoEstado }
    await onGuardar(cambios)
    setGuardando(false)
  }

  return (
    <article className="card p-4">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm">{titulo}</p>
          <p className="text-xs text-ink-faint truncate">{subtitulo}</p>
        </div>
        <span className="text-xs bg-base-muted rounded-full px-2 py-1 flex-shrink-0 h-fit">
          {fecha(fechaAlta)}
        </span>
      </div>

      {cuerpo && <p className="text-sm text-ink-soft mt-3 whitespace-pre-wrap">{cuerpo}</p>}

      <div className="mt-3 space-y-2">
        <select
          className="input-field"
          value={nuevoEstado}
          onChange={(event) => setNuevoEstado(event.target.value)}
        >
          {estados.map((valor) => (
            <option key={valor} value={valor}>
              {ETIQUETAS[valor] || valor}
            </option>
          ))}
        </select>
        {conNotas && (
          <textarea
            className="input-field"
            rows={2}
            placeholder="Respuesta para el usuario (la ve en su cuenta)"
            value={nuevasNotas}
            onChange={(event) => setNuevasNotas(event.target.value)}
          />
        )}
        <button
          type="button"
          onClick={guardar}
          disabled={!cambiado || guardando}
          className="btn-accent w-full disabled:opacity-40"
        >
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </article>
  )
}

export default function Requests() {
  const [support, setSupport] = useState([])
  const [partners, setPartners] = useState([])
  const [pro, setPro] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: supportData }, { data: partnerData }, { data: proData }] = await Promise.all([
        supabase
          .from('support_requests')
          .select('id, subject, message, status, admin_notes, created_at, profiles(full_name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('partner_requests')
          .select(
            'id, business_name, contact, message, status, admin_notes, created_at, profiles(full_name)'
          )
          .order('created_at', { ascending: false }),
        supabase
          .from('pro_subscriptions')
          .select('id, plan, price, status, created_at, profiles(full_name)')
          .order('created_at', { ascending: false }),
      ])
      setSupport(supportData || [])
      setPartners(partnerData || [])
      setPro(proData || [])
      setLoading(false)
    }
    load()
  }, [])

  // Guarda el cambio en la tabla y refleja el nuevo estado en la lista local.
  function actualizar(tabla, setLista) {
    return async (id, cambios) => {
      const { error } = await supabase
        .from(tabla)
        .update({ ...cambios, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) {
        toast.error('No pudimos guardar el cambio')
        return
      }
      setLista((lista) => lista.map((fila) => (fila.id === id ? { ...fila, ...cambios } : fila)))
      toast.success('Cambio guardado')
    }
  }

  const guardarAyuda = actualizar('support_requests', setSupport)
  const guardarAliado = actualizar('partner_requests', setPartners)
  const guardarPro = actualizar('pro_subscriptions', setPro)

  if (loading) return <Spinner className="py-20" />

  const sinRevisar = (lista) => lista.filter((fila) => fila.status === 'pendiente').length

  return (
    <div className="container-app">
      <Navbar title="Solicitudes" back />
      <div className="px-4 py-4 space-y-6">
        <section>
          <h2 className="section-title mb-2">
            Ayuda
            {sinRevisar(support) > 0 && (
              <span className="text-accent"> · {sinRevisar(support)} sin revisar</span>
            )}
          </h2>
          <div className="space-y-2">
            {support.map((request) => (
              <TarjetaRevision
                key={request.id}
                titulo={request.subject}
                subtitulo={request.profiles?.full_name}
                cuerpo={request.message}
                estado={request.status}
                estados={ESTADOS_AYUDA}
                notas={request.admin_notes}
                fechaAlta={request.created_at}
                onGuardar={(cambios) => guardarAyuda(request.id, cambios)}
              />
            ))}
            {!support.length && <p className="text-sm text-ink-faint">No hay solicitudes de ayuda.</p>}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-2">
            Quiero ser aliado
            {sinRevisar(partners) > 0 && (
              <span className="text-accent"> · {sinRevisar(partners)} sin revisar</span>
            )}
          </h2>
          <div className="space-y-2">
            {partners.map((request) => (
              <TarjetaRevision
                key={request.id}
                titulo={request.business_name}
                subtitulo={[request.profiles?.full_name, request.contact].filter(Boolean).join(' · ')}
                cuerpo={request.message}
                estado={request.status}
                estados={ESTADOS_ALIADO}
                notas={request.admin_notes}
                fechaAlta={request.created_at}
                onGuardar={(cambios) => guardarAliado(request.id, cambios)}
              />
            ))}
            {!partners.length && (
              <p className="text-sm text-ink-faint">No hay solicitudes de alianza.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-2">
            Just Minutes Pro
            {sinRevisar(pro) > 0 && (
              <span className="text-accent"> · {sinRevisar(pro)} sin activar</span>
            )}
          </h2>
          <div className="space-y-2">
            {pro.map((sub) => (
              <TarjetaRevision
                key={sub.id}
                titulo={sub.profiles?.full_name || 'Usuario'}
                subtitulo={`Plan ${sub.plan} · $${sub.price}`}
                estado={sub.status}
                estados={ESTADOS_PRO}
                conNotas={false}
                fechaAlta={sub.created_at}
                onGuardar={(cambios) => guardarPro(sub.id, cambios)}
              />
            ))}
            {!pro.length && <p className="text-sm text-ink-faint">No hay solicitudes Pro.</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
