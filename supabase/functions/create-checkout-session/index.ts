// Crea el pedido y devuelve la URL de pago de Stripe Checkout.
//
// El navegador manda qué productos y qué cantidad, nunca precios: los precios
// salen de la tabla products vía los triggers de 008_seguridad.sql, y el monto
// que se le cobra al cliente es el total que quedó guardado en la base.
//
// Deploy: supabase functions deploy create-checkout-session
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { corsHeaders, json } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

// La moneda depende del país de la cuenta de Stripe, no de la app: una cuenta
// brasilera solo puede cobrar en BRL. Para producción en Miami va 'usd'.
const CURRENCY = (Deno.env.get('STRIPE_CURRENCY') ?? 'usd').toLowerCase()

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. Quién es el usuario. Sin JWT válido no se crea nada.
    const authHeader = req.headers.get('Authorization') ?? ''
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return json({ error: 'No autorizado' }, 401)

    const { storeId, items, address, notes } = await req.json()
    if (!storeId || !Array.isArray(items) || items.length === 0) {
      return json({ error: 'Faltan datos del pedido' }, 400)
    }
    if (!address || !String(address).trim()) {
      return json({ error: 'Falta la dirección de entrega' }, 400)
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // 2. Los productos tienen que existir y ser de ese comercio. Se valida antes
    //    de crear el pedido para no dejar pedidos huérfanos si algo no cierra.
    const ids = [...new Set(items.map((item: Record<string, unknown>) => item.productId))]
    if (ids.some((id) => !id)) return json({ error: 'Hay un producto inválido' }, 400)

    const { data: productos, error: productosError } = await admin
      .from('products')
      .select('id, price, store_id')
      .in('id', ids)
    if (productosError) throw productosError
    if ((productos ?? []).length !== ids.length) {
      return json({ error: 'Alguno de los productos ya no está disponible' }, 409)
    }
    if ((productos ?? []).some((p) => p.store_id !== storeId)) {
      return json({ error: 'Los productos no son de ese comercio' }, 400)
    }

    // 3. El pedido se crea con los triggers de siempre: ellos ponen el precio
    //    real de cada ítem y recalculan subtotal y total.
    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({
        customer_id: user.id,
        store_id: storeId,
        delivery_address: String(address).trim(),
        payment_method: 'tarjeta',
        notes: notes ?? null,
      })
      .select('id')
      .single()
    if (orderError) throw orderError

    const precios = new Map((productos ?? []).map((p) => [p.id, p.price]))
    const filas = items.map((item: Record<string, unknown>) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name ?? 'Producto',
      quantity: Math.max(1, Number(item.quantity) || 1),
      // El trigger precio_real_del_item lo vuelve a escribir desde products.
      unit_price: precios.get(item.productId) ?? 0,
      notes: item.notes ?? null,
    }))
    const { error: itemsError } = await admin.from('order_items').insert(filas)
    if (itemsError) {
      await admin.from('orders').delete().eq('id', order.id)
      throw itemsError
    }

    // 4. Se releen los montos ya validados por la base.
    const [{ data: guardado }, { data: guardados }] = await Promise.all([
      admin.from('orders').select('total, delivery_fee').eq('id', order.id).single(),
      admin.from('order_items').select('product_name, quantity, unit_price').eq('order_id', order.id),
    ])
    if (!guardado) throw new Error('No pudimos leer el pedido recién creado')

    const centavos = (valor: number) => Math.round(Number(valor) * 100)
    const lineItems = (guardados ?? []).map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: centavos(item.unit_price),
        product_data: { name: item.product_name },
      },
    }))
    if (Number(guardado.delivery_fee) > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: centavos(guardado.delivery_fee),
          product_data: { name: 'Envío' },
        },
      })
    }

    // 5. Checkout Session. Stripe cobra; nosotros solo esperamos el webhook.
    const origin = req.headers.get('Origin') ?? Deno.env.get('APP_URL') ?? ''
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      client_reference_id: order.id,
      customer_email: user.email ?? undefined,
      metadata: { order_id: order.id, user_id: user.id },
      success_url: `${origin}/checkout?pago=exito&pedido=${order.id}`,
      cancel_url: `${origin}/checkout?pago=cancelado&pedido=${order.id}`,
      // Stripe exige un mínimo de 30 minutos; se deja margen por el reloj.
      expires_at: Math.floor(Date.now() / 1000) + 35 * 60,
    })

    await admin.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id)

    return json({ url: session.url, orderId: order.id })
  } catch (error) {
    console.error('create-checkout-session', error)
    return json({ error: (error as Error).message ?? 'Error creando el pago' }, 500)
  }
})
