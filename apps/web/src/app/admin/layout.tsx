"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const menuItems = [
  { label: "Inicio", href: "/admin", icon: "/icons/inicio.png" },
  { label: "Materias", href: "/admin/materias", icon: "/icons/materias.png" },
  { label: "Profesores", href: "/admin/profesores", icon: "/icons/profesores.png" },
  { label: "Estudiantes", href: "/admin/clientes", icon: "/icons/estudiantes.png" },
  { label: "Etiquetas", href: "/admin/etiquetas", icon: "/icons/etiquetas.png" },
  { label: "Tutorías", href: "/admin/tutorias", icon: "/icons/tutorias.png" },
];

const bottomItems: {
  label: string;
  href: string;
  icon: string;
}[] = [];

type AdminPerfil = {
  nombre: string;
  correo: string;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminPerfil | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      router.push("/login");
      return;
    }

    const usuarioActual = JSON.parse(usuarioGuardado);

    if (usuarioActual.tipo_usuario !== "ADMIN") {
      router.push("/login");
      return;
    }

    async function cargarAdmin() {
      try {
        const res = await fetch("/api/admin/perfil");
        const data = await res.json();

        if (res.ok) {
          setAdmin(data);
        }
      } catch (error) {
        console.error("Error cargando perfil del administrador:", error);
      }
    }

    cargarAdmin();
  }, [router]);

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#F7F7F7] text-[#020202]">
      <aside className="w-72 min-h-screen bg-[#7D533C] text-white flex flex-col">
        <div className="px-8 py-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">TutoWiki</h1>
            <p className="text-sm text-white/80 mt-1">Tutorías Académicas</p>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#705D56] transition"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="invert"
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-8 py-8 border-t border-white/20 space-y-3">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#705D56] transition"
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className="invert"
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={cerrarSesion}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#705D56] transition text-left"
          >
            <Image
              src="/icons/cerrar-sesion.png"
              alt="Cerrar sesión"
              width={24}
              height={24}
              className="invert"
            />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <section className="flex-1 min-h-screen">
        <header className="h-20 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-10">
          <div>
            <p className="text-sm text-gray-500">Panel administrativo</p>
            <h2 className="text-xl font-semibold text-[#7D533C]">TutoWiki</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7D533C] text-white flex items-center justify-center font-bold">
              {admin?.nombre ? admin.nombre.charAt(0).toUpperCase() : "A"}
            </div>

            <div>
              <p className="font-semibold">
                {admin?.nombre || "Administrador"}
              </p>
              <p className="text-sm text-gray-500">
                {admin?.correo || "admin@tutowiki.com"}
              </p>
            </div>
          </div>
        </header>

        <main className="p-10">{children}</main>
      </section>
    </div>
  );
}