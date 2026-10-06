"use client";

import { useActionState } from "react";
import { saveEventAction } from "@/app/admin/actions";

type Defaults = {
  slug?: string;
  title: string;
  description: string;
  startsAt: string;
  price: number;
  capacity: number;
  active: boolean;
};

export default function EventAdminForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveEventAction, undefined);
  const field =
    "mt-1 w-full rounded-lg border border-brand/30 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-brand/15 p-6">
      {defaults.slug && <input type="hidden" name="slug" value={defaults.slug} />}

      <label className="block text-sm font-semibold">
        Título
        <input name="title" required minLength={3} maxLength={80} defaultValue={defaults.title} className={field} />
      </label>

      <label className="block text-sm font-semibold">
        Descripción (artistas, música, etc.)
        <textarea name="description" rows={3} maxLength={300} defaultValue={defaults.description} className={field} />
      </label>

      <label className="block text-sm font-semibold">
        Fecha y hora de inicio (hora de Argentina)
        <input name="starts_at" type="datetime-local" required defaultValue={defaults.startsAt} className={field} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Precio entrada General (ARS)
          <input name="price" type="number" min={0} max={1000000} step={1} required defaultValue={defaults.price} className={field} />
        </label>
        <label className="block text-sm font-semibold">
          Capacidad (entradas disponibles)
          <input name="capacity" type="number" min={1} max={20000} step={1} required defaultValue={defaults.capacity} className={field} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input name="active" type="checkbox" defaultChecked={defaults.active} className="h-4 w-4" />
        Visible en la web y a la venta
      </label>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
