import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Fortín Bailable",
  description: "Comprá tus entradas online para Fortín Bailable.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="bg-brand text-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-extrabold tracking-tight">
              Fortín Bailable
            </Link>
            <Link href="/#fechas" className="text-sm font-medium hover:underline">
              Próximas fechas
            </Link>
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="bg-brand-dark text-center text-sm text-white/70 py-6">
          © {new Date().getFullYear()} Fortín Bailable
        </footer>
      </body>
    </html>
  );
}
