import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEventAction } from "@/app/admin/actions";
import EventAdminForm from "@/components/EventAdminForm";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureSchema, sql } from "@/lib/db";
import { getEvent } from "@/lib/event-store";
import { formatPrice, toLocalInput } from "@/lib/events";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar fecha | Fortín Bailable", robots: { index: false } };

export default async function EditEventPage({ params }: PageProps<"/admin/eventos/[slug]">) {
  await requireAdmin();
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  await ensureSchema();
  const orders = await sql()`
    SELECT id, buyer_name, whatsapp, quantity, total, status, created_at
    FROM orders WHERE event_slug = ${slug} ORDER BY created_at DESC LIMIT 200`;

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-brand hover:underline">
        ← Volver
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold text-brand">Editar fecha</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Vendidas: {event.sold} de {event.capacity} · Disponibles: {event.available}
      </p>

      <div className="mt-6">
        <EventAdminForm
          defaults={{
            slug: event.slug,
            title: event.title,
            description: event.description,
            startsAt: toLocalInput(event.date),
            price: event.tickets[0].price,
            capacity: event.capacity,
            active: event.active,
          }}
        />
      </div>

      <h2 className="mt-10 text-xl font-extrabold text-brand">Compras de esta fecha</h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-brand/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-light text-brand">
            <tr>
              <th className="px-4 py-3">Comprador</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Cant.</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand/10">
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-foreground/60">
                  Todavía no hay compras.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 font-semibold">{o.buyer_name}</td>
                <td className="px-4 py-3">{o.whatsapp}</td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3">{formatPrice(o.total)}</td>
                <td className="px-4 py-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <form action={deleteEventAction} className="mt-8">
          <input type="hidden" name="slug" value={event.slug} />
          <button className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50">
            Eliminar esta fecha
          </button>
        </form>
      )}
    </main>
  );
}
