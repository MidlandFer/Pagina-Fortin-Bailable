import Link from "next/link";
import { formatPrice, type FortinEvent } from "@/lib/events";

const tz = "America/Argentina/Buenos_Aires";

export default function EventCard({ event }: { event: FortinEvent }) {
  const d = new Date(event.date);
  const day = new Intl.DateTimeFormat("es-AR", { day: "numeric", timeZone: tz }).format(d);
  const month = new Intl.DateTimeFormat("es-AR", { month: "short", timeZone: tz })
    .format(d)
    .replace(".", "")
    .toUpperCase();
  const weekday = new Intl.DateTimeFormat("es-AR", { weekday: "long", timeZone: tz }).format(d);
  const time = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(d);
  const from = Math.min(...event.tickets.map((t) => t.price));

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-brand text-white">
        <span className="text-4xl font-extrabold leading-none">{day}</span>
        <span className="mt-1 text-sm font-bold tracking-widest">{month}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand">
            {weekday} · {time} hs
          </p>
          <h3 className="mt-1 text-lg font-extrabold">{event.title}</h3>
          <p className="mt-1 text-sm text-foreground/60">{event.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">
            Desde <strong className="text-base text-brand">{formatPrice(from)}</strong>
          </span>
          {event.available === 0 ? (
            <span className="rounded-full bg-foreground/10 px-4 py-2 text-sm font-bold text-foreground/60">
              Agotado
            </span>
          ) : (
            <span className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white transition group-hover:bg-brand-dark">
              {event.available <= 50 ? `¡Últimas ${event.available}!` : "Comprar"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
