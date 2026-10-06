import { ensureSchema, sql } from "@/lib/db";
import type { FortinEvent } from "@/lib/events";

type Row = {
  slug: string;
  title: string;
  description: string;
  starts_at: string | Date;
  price: number;
  capacity: number;
  active: boolean;
  sold: number;
};

function toEvent(r: Row): FortinEvent {
  const sold = Number(r.sold);
  return {
    slug: r.slug,
    title: r.title,
    date: new Date(r.starts_at).toISOString(),
    description: r.description,
    tickets: [{ id: "general", name: "General", price: r.price }],
    capacity: r.capacity,
    sold,
    available: Math.max(0, r.capacity - sold),
    active: r.active,
  };
}

/** Eventos públicos: activos y que no terminaron hace más de 12 horas. */
export async function getPublicEvents() {
  await ensureSchema();
  const rows = await sql()`
    SELECT e.*, COALESCE((SELECT SUM(o.quantity) FROM orders o
                          WHERE o.event_slug = e.slug AND o.status = 'paid'), 0)::int AS sold
    FROM events e
    WHERE e.active AND e.starts_at > now() - interval '12 hours'
    ORDER BY e.starts_at`;
  return (rows as Row[]).map(toEvent);
}

/** Todos los eventos, incluso inactivos y pasados (panel de administración). */
export async function getAllEvents() {
  await ensureSchema();
  const rows = await sql()`
    SELECT e.*, COALESCE((SELECT SUM(o.quantity) FROM orders o
                          WHERE o.event_slug = e.slug AND o.status = 'paid'), 0)::int AS sold
    FROM events e
    ORDER BY e.starts_at DESC`;
  return (rows as Row[]).map(toEvent);
}

export async function getEvent(slug: string) {
  await ensureSchema();
  const rows = await sql()`
    SELECT e.*, COALESCE((SELECT SUM(o.quantity) FROM orders o
                          WHERE o.event_slug = e.slug AND o.status = 'paid'), 0)::int AS sold
    FROM events e
    WHERE e.slug = ${slug}`;
  return rows[0] ? toEvent(rows[0] as Row) : null;
}
