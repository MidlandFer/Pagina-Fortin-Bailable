"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-semibold">
        Contraseña
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-brand/30 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
