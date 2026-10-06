"use client";

import { useState } from "react";
import { formatPrice, type FortinEvent } from "@/lib/events";

export default function PurchaseForm({ event }: { event: FortinEvent }) {
  const [ticketId, setTicketId] = useState(event.tickets[0].id);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ticket = event.tickets.find((t) => t.id === ticketId)!;
  const total = ticket.price * quantity;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // El pago con Mercado Pago se conecta en la siguiente fase.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-brand-light p-6">
        <p className="font-bold text-brand">
          ¡Gracias, {name}! El pago online todavía no está habilitado.
        </p>
        <p className="mt-2 text-sm">
          Estamos terminando de conectar Mercado Pago. Muy pronto vas a poder
          pagar y recibir tus {quantity} entrada(s) por WhatsApp.
        </p>
      </div>
    );
  }

  const field =
    "mt-1 w-full rounded-lg border border-brand/30 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-brand/15 p-6">
      <label className="block text-sm font-semibold">
        Tipo de entrada
        <select
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
          type="number"
          min={1}
          max={10}
          className={field}
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.min(10, Math.max(1, Number(e.target.value) || 1)))
          }
        />
      </label>

      <label className="block text-sm font-semibold">
        Nombre y apellido
        <input
          required
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="block text-sm font-semibold">
        WhatsApp (con código de área, sin 0 ni 15)
        <input
          required
          type="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          placeholder="1123456789"
          className={field}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
        />
      </label>

      <div className="flex items-center justify-between border-t border-brand/15 pt-4">
        <span className="text-lg font-bold">Total: {formatPrice(total)}</span>
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark"
        >
          Continuar al pago
        </button>
      </div>
    </form>
  );
}
