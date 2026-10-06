import { neon } from "@neondatabase/serverless";

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Falta la variable de entorno DATABASE_URL");
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

/** Crea las tablas la primera vez que se usa la base de datos. */
export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = sql();
    await db`
      CREATE TABLE IF NOT EXISTS events (
        slug text PRIMARY KEY,
        title text NOT NULL,
        description text NOT NULL DEFAULT '',
        starts_at timestamptz NOT NULL,
        price integer NOT NULL,
        capacity integer NOT NULL,
        active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    await db`
      CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY,
        event_slug text NOT NULL,
        ticket_type text NOT NULL,
        quantity integer NOT NULL,
        buyer_name text NOT NULL,
        whatsapp text NOT NULL,
        total integer NOT NULL,
        status text NOT NULL DEFAULT 'pending',
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    await db`
      CREATE TABLE IF NOT EXISTS tickets (
        id uuid PRIMARY KEY,
        order_id uuid NOT NULL REFERENCES orders(id),
        event_slug text NOT NULL,
        ticket_type text NOT NULL,
        status text NOT NULL DEFAULT 'valid',
        used_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
  })().catch((err) => {
    schemaReady = null;
    throw err;
  });
  return schemaReady;
}
