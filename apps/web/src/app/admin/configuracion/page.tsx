"use client";

import { useEffect, useState } from "react";

type AdminPerfil = {
  id: number;
  nombre: string;
  correo: string;
  tipo_usuario: string;
  activo: number;
  fecha_creacion: string;
};

export default function ConfiguracionPage() {
  const [admin, setAdmin] = useState<AdminPerfil | null>(null);

  useEffect(() => {
    async function cargarPerfil() {
      const res = await fetch("/api/admin/perfil");
      const data = await res.json();
      setAdmin(data);
    }

    cargarPerfil();
  }, []);

  if (!admin) {
    return <p>Cargando información...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">
        Configuración
      </h1>

      <p className="text-gray-600 mb-8">
        Información del usuario administrador.
      </p>

      <div className="bg-white rounded-2xl shadow p-8 border border-gray-100 max-w-3xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-[#7D533C] text-white flex items-center justify-center text-3xl font-bold">
            {admin.nombre.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">{admin.nombre}</h2>
            <p className="text-gray-500">{admin.correo}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-semibold">{admin.nombre}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Correo</p>
            <p className="font-semibold">{admin.correo}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Tipo de usuario</p>
            <p className="font-semibold">{admin.tipo_usuario}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Estado</p>
            <p className="font-semibold">
              {admin.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}