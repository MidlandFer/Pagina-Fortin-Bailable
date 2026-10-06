import { existsSync } from "node:fs";
import path from "node:path";

export const site = {
  name: "Fortín Bailable",
  city: "Olavarría",
  address: "Av. Urquiza 2981, Olavarría",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av+Urquiza+2981+Olavarr%C3%ADa",
  instagram: "https://www.instagram.com/fortinbailable",
  facebook: "https://www.facebook.com/fortinbailableolavarria/",
  // Completar cuando se tenga el número de contacto (formato 549 + código de área + número).
  whatsapp: undefined as string | undefined,
};

/** Devuelve la ruta pública si el archivo existe en /public, o null. */
export function assetIfExists(...candidates: string[]) {
  for (const c of candidates) {
    if (existsSync(path.join(process.cwd(), "public", c))) return `/${c}`;
  }
  return null;
}

export const logoPath = () =>
  assetIfExists("logo-blanco.png", "logo-blanco.svg", "logo-blanco.webp", "logo.png", "logo.svg", "logo.webp");

export const heroPath = () =>
  assetIfExists("fotos/hero.jpg", "fotos/hero.jpeg", "fotos/hero.webp", "fotos/hero.png");
