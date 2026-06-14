"use client";

import { useEffect, useState } from "react";

type Estudiante = {
  id: number;
  usuario_id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  universidad: string | null;
  carrera: string | null;
};

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [carrera, setCarrera] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function cargarEstudiantes() {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setEstudiantes(data);
  }

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setCorreo("");
    setPassword("");
    setTelefono("");
    setUniversidad("");
    setCarrera("");
    setEditandoId(null);
  }

  async function guardarEstudiante(e: React.FormEvent) {
    e.preventDefault();

    const body = {
      nombre,
      correo,
      password,
      telefono,
      universidad,
      carrera,
    };

    const url = editandoId ? `/api/clientes/${editandoId}` : "/api/clientes";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      alert(data.error || `Error ${res.status}`);
      return;
    }

    limpiarFormulario();
    cargarEstudiantes();
  }

  function editarEstudiante(estudiante: Estudiante) {
    setEditandoId(estudiante.id);
    setNombre(estudiante.nombre);
    setCorreo(estudiante.correo);
    setPassword("");
    setTelefono(estudiante.telefono || "");
    setUniversidad(estudiante.universidad || "");
    setCarrera(estudiante.carrera || "");
  }

  async function desactivarEstudiante(id: number) {
    const confirmar = confirm("¿Deseas desactivar este estudiante?");
    if (!confirmar) return;

    const res = await fetch(`/api/clientes/${id}`, {
      method: "DELETE",
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      alert(data.error || `Error ${res.status}`);
      return;
    }

    cargarEstudiantes();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">Estudiantes</h1>

      <p className="text-gray-600 mb-8">
        Administra los estudiantes registrados en TutoWiki.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <form
          onSubmit={guardarEstudiante}
          className="bg-white rounded-2xl shadow p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            {editandoId ? "Editar estudiante" : "Nuevo estudiante"}
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium">Nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Juan Pérez"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Correo</span>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="juan@test.com"
              required
            />
          </label>

          {!editandoId && (
            <label className="block mb-4">
              <span className="text-sm font-medium">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                placeholder="123456"
                required
              />
            </label>
          )}

          <label className="block mb-4">
            <span className="text-sm font-medium">Teléfono</span>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="8888-1111"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Universidad</span>
            <input
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="UCR"
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium">Carrera</span>
            <input
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Informática"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#7D533C] text-white py-3 font-semibold hover:bg-[#705D56]"
          >
            {editandoId ? "Guardar cambios" : "Crear estudiante"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="w-full mt-3 rounded-xl bg-gray-100 py-3 font-semibold"
            >
              Cancelar edición
            </button>
          )}
        </form>

        <div className="xl:col-span-2 bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            Lista de estudiantes
          </h2>

          <div className="space-y-4">
            {estudiantes.map((estudiante) => (
              <div
                key={estudiante.id}
                className="rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold">{estudiante.nombre}</h3>
                  <p className="text-gray-500">{estudiante.correo}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-[#EEC170]/40 px-3 py-1">
                      {estudiante.universidad || "Sin universidad"}
                    </span>

                    <span className="rounded-full bg-[#A7BBEC]/40 px-3 py-1">
                      {estudiante.carrera || "Sin carrera"}
                    </span>

                    <span className="rounded-full bg-[#F2A65A]/30 px-3 py-1">
                      {estudiante.telefono || "Sin teléfono"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editarEstudiante(estudiante)}
                    className="px-3 py-2 rounded-lg bg-[#A7BBEC]/40 text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => desactivarEstudiante(estudiante.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            ))}

            {estudiantes.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay estudiantes registrados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}