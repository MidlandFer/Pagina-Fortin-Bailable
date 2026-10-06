import Link from "next/link";
import { notFound } from "next/navigation";
import PurchaseForm from "@/components/PurchaseForm";
import { getEvent } from "@/lib/event-store";
import { formatDate } from "@/lib/events";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || !event.active) notFound();

  return (
    <main>
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <Link href="/#fechas" className="text-sm font-semibold text-white/75 hover:text-white">
            ← Todas las fechas
          </Link>
          <p className="mt-4 text-sm font-bold uppercase tracking-wide text-white/80">
            {formatDate(event.date)} hs
          </p>
          <h1 className="mt-1 text-4xl font-extrabold md:text-5xl">{event.title}</h1>
          <p className="mt-3 max-w-xl text-white/85">{event.description}</p>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold hover:underline"
          >
            📍 {site.address}
          </a>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_320px]">
        <div>
          <ol className="mb-6 flex items-center gap-3 text-sm font-semibold">
            <li className="flex items-center gap-2 text-brand">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white">1</span>
              Tus datos
            </li>
            <li className="h-px flex-1 bg-brand/20" />
            <li className="flex items-center gap-2 text-foreground/50">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-brand">2</span>
              Pago
            </li>
            <li className="h-px flex-1 bg-brand/20" />
            <li className="flex items-center gap-2 text-foreground/50">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-light text-brand">3</span>
              Tu QR
            </li>
          </ol>
          {event.available === 0 ? (
            <p className="rounded-2xl bg-brand-light p-6 font-bold text-brand">
              Esta fecha está agotada. ¡Mirá las próximas noches!
            </p>
          ) : (
            <PurchaseForm event={event} />
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-brand-light p-6 text-sm md:sticky md:top-24">
          <p className="font-extrabold text-brand">Cómo recibís tu entrada</p>
          <ul className="mt-3 space-y-2 text-foreground/75">
            <li>✅ Te la enviamos por WhatsApp</li>
            <li>📱 La mostrás desde el celular en la puerta</li>
            <li>🔒 QR único e intransferible</li>
            <li>💳 Pagás con débito o crédito</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
