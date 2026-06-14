"use client";

import { useEffect, useState } from "react";

const COLORES_ETIQUETAS = [
  "#585123",
  "#EEC170",
  "#F2A65A",
  "#F58549",
  "#772F1A",
];

type Etiqueta = {
  id: number;
  nombre: string;
  color: string;
  descripcion: string | null;
  orden: number;
};

export default function EtiquetasPage() {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState(COLORES_ETIQUETAS[0]);
  const [descripcion, setDescripcion] = useState("");
  const [orden, setOrden] = useState(0);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function cargarEtiquetas() {
    const res = await fetch("/api/etiquetas");
    const data = await res.json();
    setEtiquetas(data);
  }

  useEffect(() => {
    cargarEtiquetas();
  }, []);

  async function guardarEtiqueta(e: React.FormEvent) {
    e.preventDefault();

    const body = { nombre, color, descripcion, orden };

    const url = editandoId ? `/api/etiquetas/${editandoId}` : "/api/etiquetas";
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

    setNombre("");
    setColor(COLORES_ETIQUETAS[0]);
    setDescripcion("");
    setOrden(0);
    setEditandoId(null);

    cargarEtiquetas();
  }

  function editarEtiqueta(etiqueta: Etiqueta) {
    setEditandoId(etiqueta.id);
    setNombre(etiqueta.nombre);
    setColor(etiqueta.color || COLORES_ETIQUETAS[0]);
    setDescripcion(etiqueta.descripcion || "");
    setOrden(etiqueta.orden || 0);
  }

  async function desactivarEtiqueta(id: number) {
    const confirmar = confirm("¿Deseas desactivar esta etiqueta?");
    if (!confirmar) return;

    await fetch(`/api/etiquetas/${id}`, {
      method: "DELETE",
    });

    cargarEtiquetas();
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">Etiquetas</h1>

      <p className="text-gray-600 mb-8">
        Administra las etiquetas usadas para clasificar las tutorías.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={guardarEtiqueta}
          className="bg-white rounded-2xl shadow p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            {editandoId ? "Editar etiqueta" : "Nueva etiqueta"}
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium">Nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Tecnología"
              required
            />
          </label>

          <div className="mb-4">
            <span className="text-sm font-medium">Color</span>

            <div className="grid grid-cols-5 gap-3 mt-2">
              {COLORES_ETIQUETAS.map((colorItem) => (
                <button
                  key={colorItem}
                  type="button"
                  onClick={() => setColor(colorItem)}
                  className={`h-12 rounded-xl border-4 transition ${
                    color === colorItem
                      ? "border-[#020202]"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: colorItem }}
                  title={colorItem}
                />
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Color seleccionado: {color}
            </p>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-medium">Descripción</span>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              placeholder="Descripción de la etiqueta"
              rows={4}
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium">Orden</span>
            <input
              type="number"
              value={orden}
              onChange={(e) => setOrden(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#7D533C] text-white py-3 font-semibold hover:bg-[#705D56]"
          >
            {editandoId ? "Guardar cambios" : "Crear etiqueta"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setNombre("");
                setColor(COLORES_ETIQUETAS[0]);
                setDescripcion("");
                setOrden(0);
              }}
              className="w-full mt-3 rounded-xl bg-gray-100 py-3 font-semibold"
            >
              Cancelar edición
            </button>
          )}
        </form>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            Lista de etiquetas
          </h2>

          <div className="space-y-3">
            {etiquetas.map((etiqueta) => (
              <div
                key={etiqueta.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl"
                    style={{ backgroundColor: etiqueta.color }}
                  />

                  <div>
                    <h3 className="font-semibold">{etiqueta.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {etiqueta.descripcion || "Sin descripción"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Orden: {etiqueta.orden}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editarEtiqueta(etiqueta)}
                    className="px-3 py-2 rounded-lg bg-[#A7BBEC]/40 text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => desactivarEtiqueta(etiqueta.id)}
                    className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            ))}

            {etiquetas.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No hay etiquetas registradas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}