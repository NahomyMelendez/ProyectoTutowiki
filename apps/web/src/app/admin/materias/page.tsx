"use client";

import { useEffect, useState } from "react";

type Materia = {
  id: number;
  codigo: string | null;
  nombre: string;
  descripcion: string | null;
};

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function cargarMaterias() {
    const res = await fetch("/api/materias");
    const data = await res.json();
    setMaterias(data);
  }

  useEffect(() => {
    cargarMaterias();
  }, []);

 async function guardarMateria(e: React.FormEvent) {
  e.preventDefault();

  const body = { codigo, nombre, descripcion };

  const url = editandoId ? `/api/materias/${editandoId}` : "/api/materias";
  const method = editandoId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const text = await res.text();
const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    alert(data.error || "Ocurrió un error");
    return;
  }

  alert(data.mensaje || "Guardado correctamente");

  setCodigo("");
  setNombre("");
  setDescripcion("");
  setEditandoId(null);

  cargarMaterias();
}

  function editarMateria(materia: Materia) {
    setEditandoId(materia.id);
    setCodigo(materia.codigo || "");
    setNombre(materia.nombre);
    setDescripcion(materia.descripcion || "");
  }

  async function desactivarMateria(id: number) {
    const confirmar = confirm("¿Deseas desactivar esta materia?");
    if (!confirmar) return;

    await fetch(`/api/materias/${id}`, {
      method: "DELETE",
    });

    cargarMaterias();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">Materias</h1>
      <p className="text-gray-600 mb-8">
        Administra las materias disponibles para las tutorías.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={guardarMateria}
          className="bg-white rounded-2xl shadow p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            {editandoId ? "Editar materia" : "Nueva materia"}
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium">Código</span>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="IF5100"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Bases de Datos"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium">Descripción</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Descripción de la materia"
              rows={4}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#7D533C] text-white py-3 font-semibold hover:bg-[#705D56]"
          >
            {editandoId ? "Guardar cambios" : "Crear materia"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setCodigo("");
                setNombre("");
                setDescripcion("");
              }}
              className="w-full mt-3 rounded-xl bg-gray-100 py-3 font-semibold"
            >
              Cancelar edición
            </button>
          )}
        </form>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            Lista de materias
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Código</th>
                  <th className="py-3">Nombre</th>
                  <th className="py-3">Descripción</th>
                  <th className="py-3">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {materias.map((materia) => (
                  <tr key={materia.id} className="border-b">
                    <td className="py-3">{materia.codigo || "-"}</td>
                    <td className="py-3 font-medium">{materia.nombre}</td>
                    <td className="py-3 text-gray-600">
                      {materia.descripcion || "-"}
                    </td>
                    <td className="py-3 flex gap-2">
                      <button
                        onClick={() => editarMateria(materia)}
                        className="px-3 py-2 rounded-lg bg-[#A7BBEC]/40 text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => desactivarMateria(materia.id)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}

                {materias.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No hay materias registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}