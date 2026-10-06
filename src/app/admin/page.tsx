import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllEvents } from "@/lib/event-store";
import { formatDate, formatPrice } from "@/lib/events";

export const dynamic = "force-dynamic";
export const metadata = { title: "Administración | Fortín Bailable", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();
  const events = await getAllEvents();
  const totalSold = events.reduce((n, e) => n + e.sold, 0);
  const revenue = events.reduce((n, e) => n + e.sold * e.tickets[0].price, 0);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-brand">Administración</h1>
        <div className="flex gap-2">
          <Link href="/admin/eventos/nuevo" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-dark">
            + Nueva fecha
          </Link>
          <form action={logoutAction}>
            <button className="rounded-full border border-brand/30 px-5 py-2.5 text-sm font-bold text-brand hover:bg-brand-light">
              Salir
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Fechas cargadas" value={String(events.length)} />
        <Stat label="Entradas vendidas" value={String(totalSold)} />
        <Stat label="Recaudado" value={formatPrice(revenue)} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-brand/15">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-light text-brand">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Vendidas</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand/10">
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                  Todavía no cargaste ninguna fecha. Usá “Nueva fecha”.
                </td>
              </tr>
            )}
            {events.map((e) => (
              <tr key={e.slug}>
                <td className="px-4 py-3 capitalize">{formatDate(e.date)}</td>
                <td className="px-4 py-3 font-semibold">{e.title}</td>
                <td className="px-4 py-3">
                  {e.sold} / {e.capacity}
                  {e.available === 0 && <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">AGOTADO</span>}
                </td>
                <td className="px-4 py-3">{formatPrice(e.tickets[0].price)}</td>
                <td className="px-4 py-3">{e.active ? "Visible" : "Oculto"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/eventos/${e.slug}`} className="font-bold text-brand hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-brand-light p-5">
      <p className="text-sm font-semibold text-brand">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
