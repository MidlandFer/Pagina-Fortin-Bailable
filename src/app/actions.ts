"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { ensureSchema, sql } from "@/lib/db";

export type OrderState = { error?: string } | undefined;

export async function createOrder(
  _prev: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const slug = String(formData.get("event") ?? "");
  const quantity = Number(formData.get("quantity"));
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("whatsapp") ?? "").replace(/\D/g, "");

  if (!slug) return { error: "La fecha elegida no existe." };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return { error: "La cantidad debe ser entre 1 y 10." };
  }
  if (name.length < 3 || name.length > 80) {
    return { error: "Ingresá tu nombre y apellido." };
  }
  if (!/^\d{10}$/.test(phone)) {
    return { error: "El WhatsApp debe tener 10 dígitos (código de área + número)." };
  }

  // Mientras no esté conectado Mercado Pago, la emisión sin pago solo se
  // permite si se habilita explícitamente (pruebas).
  if (process.env.ALLOW_FAKE_PAYMENTS !== "true") {
    return { error: "El pago online todavía no está habilitado." };
  }

  await ensureSchema();
  const db = sql();
  const orderId = randomUUID();

  // En una sola sentencia: el evento debe estar activo, vigente y con cupo.
  // El precio y el total salen de la base de datos, nunca del navegador.
  const created = await db`
    INSERT INTO orders (id, event_slug, ticket_type, quantity, buyer_name, whatsapp, total, status)
    SELECT ${orderId}::uuid, e.slug, 'general', ${quantity}::int, ${name}::text, ${"549" + phone}::text,
           e.price * ${quantity}::int, 'paid'
    FROM events e
    WHERE e.slug = ${slug}
      AND e.active
      AND e.starts_at > now() - interval '12 hours'
      AND e.capacity - COALESCE((SELECT SUM(o.quantity) FROM orders o
                                 WHERE o.event_slug = e.slug AND o.status = 'paid'), 0) >= ${quantity}::int
    RETURNING id`;

  if (created.length === 0) {
    return { error: "No hay entradas suficientes para esta fecha o ya no está a la venta." };
  }

  await db`
    INSERT INTO tickets (id, order_id, event_slug, ticket_type)
    SELECT gen_random_uuid(), ${orderId}::uuid, ${slug}::text, 'general'
    FROM generate_series(1, ${quantity}::int)`;

  redirect(`/pedido/${orderId}`);
}
