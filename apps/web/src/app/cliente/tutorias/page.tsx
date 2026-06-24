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

export default function TutoriasPage() {
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [inscritas, setInscritas] = useState<number[]>([]);

  useEffect(() => {
    cargarTutorias();
  }, []);

  async function cargarTutorias() {
    const res = await fetch("/api/tutorias");
    const data = await res.json();

    setTutorias(Array.isArray(data) ? data : []);
  }

  async function inscribirse(id: number) {
    try {
      const res = await fetch(`/api/tutorias/${id}/inscribirse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al inscribirse");
        return;
      }

      alert(data.mensaje);

      setInscritas((prev) => [...prev, id]);

      cargarTutorias();

    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  }

  const filtradas = tutorias.filter((t) =>
    `${t.profesor_nombre} ${t.materia_nombre} ${t.fecha}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-6">
        Tutorías Disponibles
      </h1>

      <input
        placeholder="Buscar tutoría por materia, profesor o fecha"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border rounded-lg p-3 w-full mb-6"
      />

      <div className="space-y-4">

        {filtradas.map((t) => {

          const yaInscrita = inscritas.includes(t.id);

          return (

            <div
              key={t.id}
              className="bg-white rounded-xl shadow p-5"
            >

              <h2 className="font-bold text-xl">
                {t.materia_nombre}
              </h2>

              <p>
                Profesor: {t.profesor_nombre}
              </p>

              <p>
                Fecha: {t.fecha}
              </p>

              <p>
                Hora:
                {" "}
                {t.hora_inicio.slice(0, 5)}
                {" - "}
                {t.hora_fin.slice(0, 5)}
              </p>

              <p>
                Cupos:
                {" "}
                {t.inscritos}
                /
                {t.cupos}
              </p>

              <button
                onClick={() => inscribirse(t.id)}
                disabled={yaInscrita}
                className="mt-3 bg-green-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {yaInscrita ? "Inscrita" : "Inscribirme"}
              </button>

            </div>

          );
        })}

      </div>

    </div>
  );
}