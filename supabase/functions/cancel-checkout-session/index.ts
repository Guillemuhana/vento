// Cuando el cliente vuelve de Stripe sin pagar, cancela el pedido en el acto
// en vez de dejarlo colgado hasta que expire la sesión (30 minutos).
//
// Deploy: supabase functions deploy cancel-checkout-session
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { corsHeaders, json } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return json({ error: 'No autorizado' }, 401)

    const { orderId } = await req.json()
    if (!orderId) return json({ error: 'Falta el pedido' }, 400)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // Solo el dueño del pedido puede cancelarlo, y solo si sigue sin pagarse.
    const { data: order } = await admin
      .from('orders')
      .select('id, customer_id, payment_status, stripe_session_id')
      .eq('id', orderId)
      .single()
    if (!order || order.customer_id !== user.id) return json({ error: 'No autorizado' }, 403)
    if (order.payment_status !== 'pendiente') return json({ ok: true, skipped: true })

    if (order.stripe_session_id) {
      // Si ya se pagó entre medio, Stripe rechaza la expiración: no se cancela.
      try {
        await stripe.checkout.sessions.expire(order.stripe_session_id)
      } catch (error) {
        console.warn('No se pudo expirar la sesión', (error as Error).message)
        return json({ ok: false, reason: 'sesion-no-expirable' })
      }
    }

    await admin
      .from('orders')
      .update({ payment_status: 'fallido', status: 'cancelado' })
      .eq('id', orderId)
      .eq('payment_status', 'pendiente')

    return json({ ok: true })
  } catch (error) {
    console.error('cancel-checkout-session', error)
    return json({ error: (error as Error).message ?? 'Error cancelando el pago' }, 500)
  }
})
