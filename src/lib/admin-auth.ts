import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "fortin_admin";
const MAX_AGE = 60 * 60 * 8; // 8 horas

function secret() {
  const s = process.env.TICKET_SECRET;
  if (!s || s.length < 16) throw new Error("Falta TICKET_SECRET");
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(`admin:${value}`).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function isAdmin() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** Devuelve true si la contraseña es correcta y deja la sesión iniciada. */
export async function startAdminSession(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !safeEqual(password, expected)) return false;
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}
