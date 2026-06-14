"use client";

import { useEffect, useState } from "react";

type Profesor = {
  id: number;
  usuario_id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  especialidad: string | null;
  descripcion: string | null;
};

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function cargarProfesores() {
    const res = await fetch("/api/profesores");
    const data = await res.json();
    setProfesores(data);
  }

  useEffect(() => {
    cargarProfesores();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setCorreo("");
    setPassword("");
    setTelefono("");
    setEspecialidad("");
    setDescripcion("");
    setEditandoId(null);
  }

  async function guardarProfesor(e: React.FormEvent) {
    e.preventDefault();

    const body = {
      nombre,
      correo,
      password,
      telefono,
      especialidad,
      descripcion,
    };

    const url = editandoId
      ? `/api/profesores/${editandoId}`
      : "/api/profesores";

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
    cargarProfesores();
  }

  function editarProfesor(profesor: Profesor) {
    setEditandoId(profesor.id);
    setNombre(profesor.nombre);
    setCorreo(profesor.correo);
    setPassword("");
    setTelefono(profesor.telefono || "");
    setEspecialidad(profesor.especialidad || "");
    setDescripcion(profesor.descripcion || "");
  }

  async function desactivarProfesor(id: number) {
    const confirmar = confirm("¿Deseas desactivar este profesor?");
    if (!confirmar) return;

    const res = await fetch(`/api/profesores/${id}`, {
      method: "DELETE",
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      alert(data.error || `Error ${res.status}`);
      return;
    }

    cargarProfesores();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">Profesores</h1>

      <p className="text-gray-600 mb-8">
        Administra los profesores disponibles para las tutorías.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <form
          onSubmit={guardarProfesor}
          className="bg-white rounded-2xl shadow p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            {editandoId ? "Editar profesor" : "Nuevo profesor"}
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium">Nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Carlos Ramírez"
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
              placeholder="carlos@test.com"
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
              placeholder="8888-8888"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Especialidad</span>
            <input
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bases de Datos"
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium">Descripción</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Profesor especializado en SQL"
              rows={4}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#7D533C] text-white py-3 font-semibold hover:bg-[#705D56]"
          >
            {editandoId ? "Guardar cambios" : "Crear profesor"}
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
            Lista de profesores
          </h2>

          <div className="space-y-4">
            {profesores.map((profesor) => (
              <div
                key={profesor.id}
                className="rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold">{profesor.nombre}</h3>
                  <p className="text-gray-500">{profesor.correo}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-[#EEC170]/40 px-3 py-1">
                      {profesor.especialidad || "Sin especialidad"}
                    </span>

                    <span className="rounded-full bg-[#A7BBEC]/40 px-3 py-1">
                      {profesor.telefono || "Sin teléfono"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-3">
                    {profesor.descripcion || "Sin descripción"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editarProfesor(profesor)}
                    className="px-3 py-2 rounded-lg bg-[#A7BBEC]/40 text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => desactivarProfesor(profesor.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            ))}

            {profesores.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay profesores registrados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}