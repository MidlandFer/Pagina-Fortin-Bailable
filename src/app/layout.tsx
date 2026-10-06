import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { logoPath, site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortín Bailable Olavarría | Entradas online",
  description:
    "Comprá tus entradas para Fortín Bailable en Olavarría. Pagá online y recibí tu QR por WhatsApp.",
};

export const viewport: Viewport = { themeColor: "#0a3d91" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const logo = logoPath();

  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-30 bg-brand/95 text-white backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-3" aria-label="Fortín Bailable, inicio">
              {logo ? (
                <Image src={logo} alt="Fortín Bailable" width={140} height={48} className="h-10 w-auto" priority />
              ) : (
                <span className="text-xl font-extrabold tracking-tight">Fortín Bailable</span>
              )}
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold">
              <Link href="/#fechas" className="rounded-full px-4 py-2 hover:bg-white/10">
                Fechas
              </Link>
              <Link href="/#como-comprar" className="hidden rounded-full px-4 py-2 hover:bg-white/10 sm:block">
                Cómo comprar
              </Link>
              <Link href="/#preguntas" className="hidden rounded-full px-4 py-2 hover:bg-white/10 sm:block">
                Preguntas
              </Link>
              <Link
                href="/#fechas"
                className="ml-2 rounded-full bg-white px-4 py-2 font-bold text-brand hover:bg-brand-light"
              >
                Comprar
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="bg-brand-dark text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
            <div>
              <p className="text-xl font-extrabold">Fortín Bailable</p>
              <p className="mt-2 text-sm text-white/70">
                Los mejores sábados en {site.city}.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-bold">Dónde estamos</p>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-white/70 hover:text-white hover:underline">
                📍 {site.address}
              </a>
            </div>
            <div className="text-sm">
              <p className="font-bold">Seguinos</p>
              <div className="mt-2 flex flex-col gap-1 text-white/70">
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                  Instagram @fortinbailable
                </a>
                <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
            © {new Date().getFullYear()} Fortín Bailable. Todos los derechos reservados.
          </p>
        </footer>
      </body>
    </html>
  );
}
