"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      router.push("/login");
      return;
    }

    const usuarioActual = JSON.parse(usuarioGuardado);

    if (usuarioActual.tipo_usuario !== "CLIENTE") {
      router.push("/login");
      return;
    }

    setAutorizado(true);
  }, [router]);

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    router.push("/login");
  }

  if (!autorizado) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-2xl font-semibold text-[#1C3724]">
        Verificando sesión...
      </p>
    </div>
  );
}
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-[#1C3724]"
      style={{ backgroundImage: "url('/icons/hojas.jpg')" }}
    >
      <div className="min-h-screen bg-white/65 backdrop-blur-[1px]">
        <header className="bg-[#1C3724]/85 text-white shadow backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
            <Link href="/cliente" className="text-3xl font-bold">
              TutoWiki
            </Link>

            <nav className="flex items-center gap-8">
              <Link href="/cliente" className="hover:text-[#E0C192]">
                Inicio
              </Link>

              <Link href="/cliente/tutorias" className="hover:text-[#E0C192]">
                Tutorías
              </Link>

              <Link
                href="/cliente/perfil"
                className="rounded-full bg-[#61370E] px-5 py-2 font-semibold hover:bg-[#4A2809]"
              >
                Perfil
              </Link>

              <button
                onClick={cerrarSesion}
                className="rounded-full bg-red-800 px-5 py-2 font-semibold hover:bg-red-900"
              >
                Cerrar sesión
              </button>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-10">{children}</main>
      </div>
    </div>
  );
}