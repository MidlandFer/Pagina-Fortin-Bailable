import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ensureSchema, sql } from "@/lib/db";
import { formatDate, getEvent } from "@/lib/events";
import { signTicket } from "@/lib/tokens";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function OrderPage({ params }: PageProps<"/pedido/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  await ensureSchema();
  const db = sql();
  const [order] = await db`
    SELECT id, event_slug, buyer_name, quantity, status FROM orders WHERE id = ${id}`;
  if (!order) notFound();

  const event = getEvent(order.event_slug);
  const tickets = await db`
    SELECT id, ticket_type, status FROM tickets WHERE order_id = ${id} ORDER BY created_at, id`;

  const qrs = await Promise.all(
    tickets.map((t) =>
      QRCode.toDataURL(signTicket(t.id), {
        width: 320,
        margin: 2,
        color: { dark: "#0a3d91", light: "#ffffff" },
      }),
    ),
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-extrabold text-brand">
        ¡Listo, {order.buyer_name}!
      </h1>
      <p className="mt-2 text-foreground/70">
        {event ? `${event.title} — ${formatDate(event.date)}` : order.event_slug}
      </p>
      <p className="mt-1 text-sm text-foreground/70">
        Presentá cada código QR en la puerta. Guardá esta página: es tu entrada.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {tickets.map((t, i) => (
          <div
            key={t.id}
            className="rounded-2xl border border-brand/15 bg-brand-light p-5 text-center"
          >
            <p className="font-bold text-brand">
              Entrada {i + 1} de {tickets.length}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrs[i]}
              alt={`Código QR de la entrada ${i + 1}`}
              width={240}
              height={240}
              className="mx-auto mt-3 rounded-lg bg-white"
            />
            <p className="mt-2 text-xs uppercase tracking-wide text-foreground/60">
              {t.ticket_type} · {t.status === "valid" ? "válida" : "usada"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
