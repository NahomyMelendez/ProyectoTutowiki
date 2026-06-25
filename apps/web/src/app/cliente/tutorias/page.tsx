"use client";

import { useEffect, useState } from "react";

type Tutoria = {
  id: number;
  profesor_nombre: string;
  materia_nombre: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  inscritos: number;
  cupos: number;
};

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  tipo_usuario: string;
};

export default function TutoriasPage() {
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [inscritas, setInscritas] = useState<number[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    await cargarTutorias();
    await cargarTutoriasInscritas();
  }

  async function cargarTutorias() {
    const res = await fetch("/api/tutorias");
    const data = await res.json();
    setTutorias(Array.isArray(data) ? data : []);
  }

  async function obtenerClienteId(usuarioId: number) {
    const res = await fetch(`/api/cliente-actual?usuario_id=${usuarioId}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se encontró el cliente");
    }

    return data.cliente_id;
  }

  async function cargarTutoriasInscritas() {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) return;

    const usuario: Usuario = JSON.parse(usuarioGuardado);

    if (usuario.tipo_usuario !== "CLIENTE") return;

    const clienteId = await obtenerClienteId(usuario.id);

    const res = await fetch(`/api/mis-tutorias?cliente_id=${clienteId}`);
    const data = await res.json();

    if (Array.isArray(data)) {
      const ids = data.map((t) => t.tutoria_id);
      setInscritas(ids);
    }
  }

  async function inscribirse(id: number) {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        alert("Debe iniciar sesión para inscribirse");
        return;
      }

      const usuario: Usuario = JSON.parse(usuarioGuardado);

      if (usuario.tipo_usuario !== "CLIENTE") {
        alert("Solo los estudiantes pueden inscribirse en tutorías");
        return;
      }

      const clienteId = await obtenerClienteId(usuario.id);

      const res = await fetch(`/api/tutorias/${id}/inscribirse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: clienteId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al inscribirse");
        return;
      }

      alert(data.mensaje || "Inscripción realizada correctamente");

      setInscritas((prev) => [...prev, id]);

      await cargarTutorias();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al conectar con el servidor");
    }
  }

  const filtradas = tutorias.filter((t) =>
    `${t.profesor_nombre} ${t.materia_nombre} ${t.fecha}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Tutorías Disponibles</h1>

      <input
        placeholder="Buscar tutoría por materia, profesor o fecha"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border rounded-lg p-3 w-full mb-6"
      />

      <div className="space-y-4">
        {filtradas.map((t) => {
          const yaInscrita = inscritas.includes(t.id);
          const sinCupos = t.inscritos >= t.cupos;

          return (
            <div key={t.id} className="bg-white rounded-xl shadow p-5">
              <h2 className="font-bold text-xl">{t.materia_nombre}</h2>
              <p>Profesor: {t.profesor_nombre}</p>
              <p>Fecha: {new Date(t.fecha).toLocaleDateString("es-CR")}</p>
              <p>
                Hora: {t.hora_inicio.slice(0, 5)} - {t.hora_fin.slice(0, 5)}
              </p>
              <p>
                Cupos: {t.inscritos}/{t.cupos}
              </p>

              <button
                onClick={() => inscribirse(t.id)}
                disabled={yaInscrita || sinCupos}
                className="mt-3 bg-green-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {yaInscrita
                  ? "Inscrita"
                  : sinCupos
                  ? "Sin cupos"
                  : "Inscribirme"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}