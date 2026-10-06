export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-fuchsia-900 to-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
        Fortín Bailable
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-fuchsia-200 max-w-xl">
        Comprá tus entradas online con tarjeta de débito, crédito o la
        plataforma de pago que prefieras.
      </p>
      <span className="mt-10 rounded-full bg-white/10 px-6 py-3 text-sm uppercase tracking-widest">
        Próximamente
      </span>
    </main>
  );
}
