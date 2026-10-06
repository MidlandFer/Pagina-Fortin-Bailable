import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Acceso | Fortín Bailable", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="mx-auto max-w-sm px-5 py-20">
      <h1 className="text-2xl font-extrabold text-brand">Panel de administración</h1>
      <LoginForm />
    </main>
  );
}
