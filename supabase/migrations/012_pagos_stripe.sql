-- Pagos con tarjeta vía Stripe Checkout.
-- Ejecutar después de 011_pro_reintento.sql.
--
-- Regla de oro: el navegador nunca decide si un pedido está pagado.
-- Solo el webhook de Stripe (que corre con la service role) puede tocar
-- estas columnas; el trigger congelar_pago se encarga de hacerlo cumplir.

alter table public.orders
  add column if not exists payment_status text not null default 'no_aplica',
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_payment_status_check'
  ) then
    alter table public.orders
      add constraint orders_payment_status_check
      check (payment_status in ('no_aplica', 'pendiente', 'pagado', 'fallido', 'reembolsado'));
  end if;
end
$$;

create index if not exists idx_orders_stripe_session on public.orders(stripe_session_id);

-- El estado de pago inicial lo decide el servidor según el método elegido:
-- con tarjeta arranca 'pendiente' (hasta que Stripe confirme), el resto 'no_aplica'.
create or replace function public.sanear_pedido_nuevo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.status := 'pendiente';
  new.courier_id := null;
  new.subtotal := 0;
  new.delivery_fee := public.costo_envio_base();
  new.total := new.delivery_fee;

  if new.payment_method = 'tarjeta' then
    new.payment_status := 'pendiente';
  else
    new.payment_status := 'no_aplica';
  end if;
  new.stripe_session_id := null;
  new.stripe_payment_intent_id := null;
  new.paid_at := null;

  return new;
end;
$$;

drop trigger if exists trg_sanear_pedido_nuevo on public.orders;
create trigger trg_sanear_pedido_nuevo
  before insert on public.orders
  for each row execute function public.sanear_pedido_nuevo();

-- Nadie que venga con un JWT de usuario puede modificar los campos de pago.
-- La service role (webhook y Edge Functions) no pasa por esta restricción.
create or replace function public.congelar_pago()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- PostgREST hace SET ROLE service_role cuando la llamada usa la service key.
  if current_user = 'service_role' then
    return new;
  end if;
  -- Sin usuario logueado (SQL editor, jobs internos) tampoco hay nada que frenar.
  if auth.uid() is null then
    return new;
  end if;

  new.payment_status := old.payment_status;
  new.stripe_session_id := old.stripe_session_id;
  new.stripe_payment_intent_id := old.stripe_payment_intent_id;
  new.paid_at := old.paid_at;
  return new;
end;
$$;

drop trigger if exists trg_congelar_pago on public.orders;
create trigger trg_congelar_pago
  before update on public.orders
  for each row execute function public.congelar_pago();
