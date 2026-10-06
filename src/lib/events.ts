// Tipos y formato: seguro de importar desde componentes de cliente.

export type TicketType = {
  id: string;
  name: string;
  /** Precio en pesos argentinos (ARS). */
  price: number;
};

export type FortinEvent = {
  slug: string;
  title: string;
  /** Fecha y hora de inicio en ISO (UTC). */
  date: string;
  description: string;
  tickets: TicketType[];
  capacity: number;
  sold: number;
  available: number;
  active: boolean;
};

const TZ = "America/Argentina/Buenos_Aires";

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** ISO (UTC) -> "YYYY-MM-DDTHH:mm" en hora argentina, para <input type="datetime-local">. */
export function toLocalInput(iso: string) {
  return new Date(iso)
    .toLocaleString("sv-SE", { timeZone: TZ })
    .replace(" ", "T")
    .slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" (hora argentina, UTC-3 sin horario de verano) -> Date. */
export function fromLocalInput(value: string) {
  return new Date(`${value}:00-03:00`);
}
