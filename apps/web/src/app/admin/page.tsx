"use client";

import { useEffect, useState } from "react";

type DashboardStats = {
  materias: number;
  profesores: number;
  estudiantes: number;
  tutorias: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    materias: 0,
    profesores: 0,
    estudiantes: 0,
    tutorias: 0,
  });

  useEffect(() => {
    async function cargarStats() {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data);
    }

    cargarStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">Inicio</h1>

      <p className="text-gray-600 mb-8">
        Bienvenido al panel de administración de TutoWiki.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <p className="text-gray-500">Materias</p>
          <h2 className="text-4xl font-bold mt-4">{stats.materias}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <p className="text-gray-500">Profesores</p>
          <h2 className="text-4xl font-bold mt-4">{stats.profesores}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <p className="text-gray-500">Estudiantes</p>
          <h2 className="text-4xl font-bold mt-4">{stats.estudiantes}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <p className="text-gray-500">Tutorías</p>
          <h2 className="text-4xl font-bold mt-4">{stats.tutorias}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-[#7D533C] mb-4">
          Acciones rápidas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a className="p-4 rounded-xl bg-[#A7BBEC]/30 hover:bg-[#A7BBEC]/50" href="/admin/materias">
            Nueva materia
          </a>

          <a className="p-4 rounded-xl bg-[#7D533C]/10 hover:bg-[#7D533C]/20" href="/admin/profesores">
            Nuevo profesor
          </a>

          <a className="p-4 rounded-xl bg-[#9097C0]/20 hover:bg-[#9097C0]/30" href="/admin/clientes">
            Nuevo estudiante
          </a>

          <a className="p-4 rounded-xl bg-[#A7BBEC]/30 hover:bg-[#A7BBEC]/50" href="/admin/tutorias">
            Nueva tutoría
          </a>
        </div>
      </div>
    </div>
  );
}