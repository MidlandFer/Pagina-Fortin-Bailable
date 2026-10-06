export type TicketType = {
  id: string;
  name: string;
  /** Precio en pesos argentinos (ARS). Valores provisorios. */
  price: number;
};

export type FortinEvent = {
  slug: string;
  title: string;
  /** Fecha y hora local de Argentina, formato ISO con offset. */
  date: string;
  description: string;
  tickets: TicketType[];
};

// Datos provisorios: las fechas y precios reales se ajustan luego.
export const events: FortinEvent[] = [
  {
    slug: "sabado-1",
    title: "Fortín Bailable",
    date: "2026-11-07T23:00:00-03:00",
    description: "Vení a disfrutar los mejores sábados en el gigante de la Urquiza.",
    tickets: [{ id: "general", name: "General", price: 10000 }],
  },
  {
    slug: "sabado-2",
    title: "Fortín Bailable",
    date: "2026-11-14T23:00:00-03:00",
    description: "Vení a disfrutar los mejores sábados en el gigante de la Urquiza.",
    tickets: [{ id: "general", name: "General", price: 10000 }],
  },
  {
    slug: "sabado-3",
    title: "Fortín Bailable",
    date: "2026-11-21T23:00:00-03:00",
    description: "Vení a disfrutar los mejores sábados en el gigante de la Urquiza.",
    tickets: [{ id: "general", name: "General", price: 10000 }],
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}
