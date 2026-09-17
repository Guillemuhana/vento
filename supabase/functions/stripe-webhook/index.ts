// Único lugar del sistema que puede marcar un pedido como pagado.
// Stripe llama acá; se verifica la firma antes de tocar nada.
//
// Deploy: supabase functions deploy stripe-webhook --no-verify-jwt
// (--no-verify-jwt porque quien llama es Stripe, no un usuario logueado.)
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

function orderIdDe(objeto: Record<string, any>): string | null {
  return objeto?.metadata?.order_id ?? objeto?.client_reference_id ?? null
}

Deno.serve(async (req) => {
  const firma = req.headers.get('stripe-signature')
  if (!firma) return new Response('Falta la firma', { status: 400 })

  const cuerpo = await req.text()
  let evento: Stripe.Event
  try {
    evento = await stripe.webhooks.constructEventAsync(
      cuerpo,
      firma,
      WEBHOOK_SECRET,
      undefined,
      Stripe.createSubtleCryptoProvider()
    )
  } catch (error) {
    console.error('Firma inválida', error)
    return new Response('Firma inválida', { status: 400 })
  }

  try {
    const objeto = evento.data.object as Record<string, any>
    const orderId = orderIdDe(objeto)

    switch (evento.type) {
      case 'checkout.session.completed': {
        // Con pagos en efectivo diferidos Stripe avisa completed antes de cobrar.
        if (objeto.payment_status !== 'paid') break
        if (!orderId) break
        await admin
          .from('orders')
          .update({
            payment_status: 'pagado',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: objeto.payment_intent ?? null,
          })
          .eq('id', orderId)
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        if (!orderId) break
        await admin
          .from('orders')
          .update({
            payment_status: 'pagado',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: objeto.payment_intent ?? null,
          })
          .eq('id', orderId)
        break
      }

      // El cliente no pagó a tiempo o el pago se rechazó: el pedido no va.
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        if (!orderId) break
        await admin
          .from('orders')
          .update({ payment_status: 'fallido', status: 'cancelado' })
          .eq('id', orderId)
          .eq('payment_status', 'pendiente')
        break
      }

      case 'charge.refunded': {
        const intentId = objeto.payment_intent
        if (!intentId) break
        await admin
          .from('orders')
          .update({ payment_status: 'reembolsado' })
          .eq('stripe_payment_intent_id', intentId)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    // Un 500 hace que Stripe reintente el evento más tarde.
    console.error('stripe-webhook', evento.type, error)
    return new Response('Error procesando el evento', { status: 500 })
  }
})
