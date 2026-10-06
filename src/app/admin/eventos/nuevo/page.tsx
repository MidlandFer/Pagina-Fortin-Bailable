import Link from "next/link";
import EventAdminForm from "@/components/EventAdminForm";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Nueva fecha | Fortín Bailable", robots: { index: false } };

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <Link href="/admin" className="text-sm font-semibold text-brand hover:underline">
        ← Volver
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold text-brand">Nueva fecha</h1>
      <div className="mt-6">
        <EventAdminForm
          defaults={{
            title: "Fortín Bailable",
            description: "",
            startsAt: "",
            price: 10000,
            capacity: 1000,
            active: true,
          }}
        />
      </div>
    </main>
  );
}
