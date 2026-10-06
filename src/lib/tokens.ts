import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  const s = process.env.TICKET_SECRET;
  if (!s || s.length < 16) {
    throw new Error("Falta TICKET_SECRET (mínimo 16 caracteres)");
  }
  return s;
}

function signature(ticketId: string) {
  return createHmac("sha256", secret())
    .update(ticketId)
    .digest("base64url")
    .slice(0, 22);
}

/** Contenido del QR: id de la entrada + firma, para que no se pueda falsificar. */
export function signTicket(ticketId: string) {
  return `${ticketId}.${signature(ticketId)}`;
}

/** Devuelve el id de la entrada si la firma es válida, o null. */
export function verifyTicketToken(token: string): string | null {
  const [id, sig, ...rest] = token.split(".");
  if (!id || !sig || rest.length) return null;
  const expected = Buffer.from(signature(id));
  const given = Buffer.from(sig);
  if (expected.length !== given.length) return null;
  return timingSafeEqual(expected, given) ? id : null;
}
