"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { ensureSchema, sql } from "@/lib/db";
import { getEvent } from "@/lib/events";

export type OrderState = { error?: string } | undefined;

export async function createOrder(
  _prev: OrderState,
  formData: FormData,
): Promise<OrderState> {
  const event = getEvent(String(formData.get("event")));
  const ticket = event?.tickets.find(
    (t) => t.id === String(formData.get("ticket")),
  );
  const quantity = Number(formData.get("quantity"));
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("whatsapp") ?? "").replace(/\D/g, "");

  if (!event || !ticket) return { error: "La entrada elegida no existe." };
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
  const total = ticket.price * quantity; // el precio sale del servidor, no del cliente

  await db`
    INSERT INTO orders (id, event_slug, ticket_type, quantity, buyer_name, whatsapp, total, status)
    VALUES (${orderId}, ${event.slug}, ${ticket.id}, ${quantity}, ${name}, ${"549" + phone}, ${total}, 'paid')`;

  for (let i = 0; i < quantity; i++) {
    await db`
      INSERT INTO tickets (id, order_id, event_slug, ticket_type)
      VALUES (${randomUUID()}, ${orderId}, ${event.slug}, ${ticket.id})`;
  }

  redirect(`/pedido/${orderId}`);
}
