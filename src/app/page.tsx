import Link from "next/link";
import { events, formatDate, formatPrice } from "@/lib/events";

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-b from-brand to-brand-dark text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Fortín Bailable
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white/80 max-w-2xl mx-auto">
            Comprá tus entradas online con tarjeta de débito o crédito. Te las
            enviamos por WhatsApp con tu código QR.
          </p>
          <Link
            href="#fechas"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-brand hover:bg-brand-light"
          >
            Ver fechas
          </Link>
        </div>
      </section>

      <section id="fechas" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-extrabold text-brand">Próximas fechas</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/eventos/${event.slug}`}
              className="rounded-2xl border border-brand/15 bg-brand-light p-6 transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                {formatDate(event.date)}
              </p>
              <h3 className="mt-2 text-xl font-bold">{event.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">
                {event.description}
              </p>
              <p className="mt-4 font-bold text-brand">
                Desde {formatPrice(Math.min(...event.tickets.map((t) => t.price)))}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
