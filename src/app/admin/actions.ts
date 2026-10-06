"use server";

import { redirect } from "next/navigation";
import { endAdminSession, requireAdmin, startAdminSession } from "@/lib/admin-auth";
import { ensureSchema, sql } from "@/lib/db";
import { fromLocalInput } from "@/lib/events";

export type FormState = { error?: string } | undefined;

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ok = await startAdminSession(String(formData.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 1000)); // frena intentos repetidos
    return { error: "Contraseña incorrecta." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}

export async function saveEventAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const slugIn = String(formData.get("slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const when = String(formData.get("starts_at") ?? "");
  const price = Number(formData.get("price"));
  const capacity = Number(formData.get("capacity"));
  const active = formData.get("active") === "on";

  if (title.length < 3 || title.length > 80) return { error: "El título debe tener entre 3 y 80 caracteres." };
  if (description.length > 300) return { error: "La descripción admite hasta 300 caracteres." };
  const startsAt = fromLocalInput(when);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(when) || Number.isNaN(startsAt.getTime())) {
    return { error: "Ingresá una fecha y hora válidas." };
  }
  if (!Number.isInteger(price) || price < 0 || price > 1_000_000) return { error: "El precio debe ser un número entero entre 0 y 1.000.000." };
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 20_000) return { error: "La capacidad debe ser un entero entre 1 y 20.000." };

  await ensureSchema();
  const db = sql();

  if (slugIn) {
    const [sold] = await db`
      SELECT COALESCE(SUM(quantity), 0)::int AS n FROM orders
      WHERE event_slug = ${slugIn} AND status = 'paid'`;
    if (capacity < sold.n) {
      return { error: `Ya se vendieron ${sold.n} entradas; la capacidad no puede ser menor.` };
    }
    await db`
      UPDATE events SET title = ${title}, description = ${description},
        starts_at = ${startsAt.toISOString()}, price = ${price},
        capacity = ${capacity}, active = ${active}
      WHERE slug = ${slugIn}`;
  } else {
    // El slug es la fecha del evento; si ya existe, se le agrega un número.
    const base = when.slice(0, 10);
    let slug = base;
    for (let n = 2; ; n++) {
      const taken = await db`SELECT 1 FROM events WHERE slug = ${slug}`;
      if (taken.length === 0) break;
      slug = `${base}-${n}`;
    }
    await db`
      INSERT INTO events (slug, title, description, starts_at, price, capacity, active)
      VALUES (${slug}, ${title}, ${description}, ${startsAt.toISOString()}, ${price}, ${capacity}, ${active})`;
  }

  redirect("/admin");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  await ensureSchema();
  const db = sql();
  const orders = await db`SELECT 1 FROM orders WHERE event_slug = ${slug} LIMIT 1`;
  if (orders.length === 0) {
    await db`DELETE FROM events WHERE slug = ${slug}`;
  }
  redirect("/admin");
}
