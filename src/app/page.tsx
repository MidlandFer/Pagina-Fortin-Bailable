import Image from "next/image";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { getPublicEvents } from "@/lib/event-store";
import { heroPath, logoPath, site } from "@/lib/site";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  const events = await getPublicEvents().catch((err) => {
    console.error("No se pudieron cargar los eventos:", err);
    return [];
  });
  const hero = heroPath();
  const logo = logoPath();

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-10 px-5 py-20 md:py-28">
          <div>
          <p className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold backdrop-blur">
            📍 {site.city} · Todos los sábados
          </p>
          <h1 className="font-script mt-5 max-w-3xl text-6xl leading-tight drop-shadow-lg md:text-8xl">
            {site.slogan}
          </h1>
          <p className="mt-3 text-xl font-bold md:text-2xl">
            Las mejores noches bailables de {site.city}
          </p>
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
          {logo ? (
            <Image
              src={logo}
              alt="Fortín Bailable"
              width={360}
              height={366}
              priority
              className="hidden w-72 shrink-0 rounded-3xl shadow-2xl ring-1 ring-white/20 md:block lg:w-80"
            />
          ) : null}
        </div>
      </section>

      {/* Fechas */}
      <section id="fechas" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <h2 className="text-3xl font-extrabold text-brand md:text-4xl">Próximas fechas</h2>
        <p className="mt-2 text-foreground/60">Elegí tu noche y asegurá tu lugar.</p>
        {events.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-brand-light p-8 text-center font-semibold text-brand">
            Muy pronto vamos a anunciar las próximas fechas. ¡Seguinos en Instagram!
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {events.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Video */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2">
          <div>
            <h2 className="font-script text-5xl leading-tight md:text-6xl">Viví la noche</h2>
            <p className="mt-4 max-w-md text-lg text-white/80">
              Luces, música y la mejor energía en el gigante de la Urquiza. Mirá cómo se vive un sábado en el Fortín.
            </p>
            <Link href="#fechas" className="mt-6 inline-block rounded-full bg-white px-8 py-3.5 font-bold text-brand hover:bg-brand-light">
              Quiero mi entrada
            </Link>
          </div>
          <div className="mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-3xl bg-black shadow-2xl ring-1 ring-white/20">
            <iframe
              src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1748031813008573%2F&show_text=false&width=340&t=0"
              title="Video de Fortín Bailable"
              className="h-full w-full border-0"
              loading="lazy"
              scrolling="no"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
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
