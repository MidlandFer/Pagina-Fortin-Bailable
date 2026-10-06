"use client";

import { useActionState, useState } from "react";
import { createOrder } from "@/app/actions";
import { formatPrice, type FortinEvent } from "@/lib/events";

export default function PurchaseForm({ event }: { event: FortinEvent }) {
  const [state, action, pending] = useActionState(createOrder, undefined);
  const [ticketId, setTicketId] = useState(event.tickets[0].id);
  const [quantity, setQuantity] = useState(1);
  const [whatsapp, setWhatsapp] = useState("");

  const ticket = event.tickets.find((t) => t.id === ticketId)!;
  const maxQty = Math.min(10, event.available);
  const total = ticket.price * quantity;

  const field =
    "mt-1 w-full rounded-lg border border-brand/30 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-brand/15 p-6">
      <input type="hidden" name="event" value={event.slug} />

      <label className="block text-sm font-semibold">
        Tipo de entrada
        <select
          name="ticket"
          className={field}
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        >
          {event.tickets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {formatPrice(t.price)}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold">
        Cantidad
        <input
          name="quantity"
          type="number"
          min={1}
          max={maxQty}
          className={field}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))
          }
        />
      </label>

      <label className="block text-sm font-semibold">
        Nombre y apellido
        <input name="name" required minLength={3} maxLength={80} className={field} />
      </label>

      <label className="block text-sm font-semibold">
        WhatsApp (con código de área, sin 0 ni 15)
        <input
          name="whatsapp"
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          placeholder="1123456789"
          className={field}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
        />
      </label>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-brand/15 pt-4">
        <span className="text-lg font-bold">Total: {formatPrice(total)}</span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Procesando…" : "Continuar"}
        </button>
      </div>
    </form>
  );
}
