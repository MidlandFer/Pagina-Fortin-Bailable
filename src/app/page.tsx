import Image from "next/image";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/events";
import { heroPath, site } from "@/lib/site";

const steps = [
  { n: "1", title: "Elegí tu fecha", text: "Mirá las próximas noches y seleccioná la que quieras." },
  { n: "2", title: "Pagá online", text: "Con tarjeta de débito o crédito, de forma segura." },
  { n: "3", title: "Recibí tu QR", text: "Te llega por WhatsApp. Lo mostrás en la puerta y listo." },
];

const faqs = [
  {
    q: "¿Cómo recibo mi entrada?",
    a: "Después de pagar te enviamos por WhatsApp tu entrada con un código QR. También queda disponible en la página de tu compra.",
  },
  {
    q: "¿Qué tarjetas puedo usar?",
    a: "Podés pagar con tarjetas de débito y crédito a través de Mercado Pago.",
  },
  {
    q: "¿Cómo entro al evento?",
    a: "Mostrá el código QR desde tu celular en la puerta. Cada QR es único y se puede usar una sola vez.",
  },
  {
    q: "¿Puedo comprar más de una entrada?",
    a: "Sí, hasta 10 por compra. Cada una tiene su propio QR.",
  },
  {
    q: "¿Dónde queda el Fortín?",
    a: `En ${site.address}.`,
  },
];

export default function Home() {
  const hero = heroPath();

  return (
    <main>
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-brand-dark text-white">
        {hero ? (
          <Image src={hero} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        ) : null}
        <div
          className={`absolute inset-0 -z-10 ${
            hero
              ? "bg-gradient-to-b from-brand-dark/70 via-brand-dark/60 to-brand-dark"
              : "bg-gradient-to-br from-brand via-brand-dark to-black"
          }`}
        />
        <div className="mx-auto max-w-6xl px-5 py-24 md:py-36">
          <p className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold backdrop-blur">
            📍 {site.city} · Todos los sábados
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Las mejores noches bailables de {site.city}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85 md:text-xl">
            Comprá tu entrada en un minuto, pagá online y recibí tu QR por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#fechas" className="rounded-full bg-white px-8 py-3.5 font-bold text-brand shadow-lg hover:bg-brand-light">
              Comprar entradas
            </Link>
            <Link href="#como-comprar" className="rounded-full border border-white/40 px-8 py-3.5 font-bold hover:bg-white/10">
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Fechas */}
      <section id="fechas" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <h2 className="text-3xl font-extrabold text-brand md:text-4xl">Próximas fechas</h2>
        <p className="mt-2 text-foreground/60">Elegí tu noche y asegurá tu lugar.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </section>

      {/* Cómo comprar */}
      <section id="como-comprar" className="scroll-mt-20 bg-brand-light">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl font-extrabold text-brand md:text-4xl">Comprar es muy fácil</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
                <p className="mt-1 text-sm text-foreground/65">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand p-8 text-white md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="text-3xl font-extrabold">Cómo llegar</h2>
            <p className="mt-2 text-lg text-white/85">📍 {site.address}</p>
          </div>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-8 py-3.5 font-bold text-brand hover:bg-brand-light"
          >
            Abrir en Google Maps
          </a>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section id="preguntas" className="mx-auto max-w-3xl scroll-mt-20 px-5 pb-20">
        <h2 className="text-3xl font-extrabold text-brand md:text-4xl">Preguntas frecuentes</h2>
        <div className="mt-6 divide-y divide-brand/10 rounded-2xl border border-brand/10">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                {f.q}
                <span className="ml-4 text-brand transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm text-foreground/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
