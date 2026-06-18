"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tutoria = {
  id: number;
  materia_nombre: string;
  materia_codigo: string | null;
  profesor_nombre: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  cupos: number;
  inscritos: number;
  cupos_disponibles: number;
  estado: string;
  etiqueta_nombre?: string | null;
  etiqueta_color?: string | null;
};

export default function ClienteInicioPage() {
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);

  useEffect(() => {
    async function cargarTutorias() {
      const res = await fetch("/api/tutorias");
      const data = await res.json();
      setTutorias(Array.isArray(data) ? data : []);
    }

    cargarTutorias();
  }, []);

  function fechaBonita(fecha: string) {
    const [anio, mes, dia] = String(fecha).slice(0, 10).split("-");
    return `${dia}/${mes}/${anio}`;
  }

  const tutoriasPorFecha = useMemo(() => {
    const grupos: Record<string, Tutoria[]> = {};

    tutorias.forEach((tutoria) => {
      const fecha = String(tutoria.fecha).slice(0, 10);

      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }

      grupos[fecha].push(tutoria);
    });

    return grupos;
  }, [tutorias]);

  return (
    <div>
      <section className="rounded-3xl bg-white/80 backdrop-blur-md shadow p-10 mb-10 border border-white/60">
        <h1 className="text-5xl font-bold text-[#1C3724] mb-5">Inicio</h1>

        <p className="text-2xl text-[#1C3724] max-w-4xl leading-relaxed">
          “La educación no cambia el mundo. Cambia a las personas que van a
          cambiar el mundo.” — Paulo Freire
        </p>
      </section>

      <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow border border-white/70 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#1C3724]">
              Tutorías disponibles
            </h2>
            <p className="text-[#1C3724]/60 mt-1">
              Revisa las próximas tutorías organizadas por fecha.
            </p>
          </div>

          <Link
            href="/cliente/tutorias"
            className="rounded-full bg-[#61370E] text-white px-6 py-3 font-semibold hover:bg-[#4A2809]"
          >
            Ver todas
          </Link>
        </div>

        <div className="space-y-8">
          {Object.entries(tutoriasPorFecha).map(([fecha, lista]) => (
            <div key={fecha}>
              <h3 className="text-xl font-bold text-[#1C3724] mb-4">
                {fechaBonita(fecha)}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {lista.map((tutoria) => (
                  <Link
                    key={tutoria.id}
                    href="/cliente/tutorias"
                    className="block rounded-3xl bg-[#F8F6F2] border border-gray-100 shadow-sm overflow-hidden hover:scale-[1.01] transition"
                  >
                    <div
                      className="h-3"
                      style={{
                        backgroundColor: tutoria.etiqueta_color || "#80A088",
                      }}
                    />

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xl font-bold text-[#1C3724]">
                          {tutoria.materia_codigo
                            ? `${tutoria.materia_codigo} - `
                            : ""}
                          {tutoria.materia_nombre}
                        </h4>

                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold text-white"
                          style={{
                            backgroundColor:
                              tutoria.etiqueta_color || "#80A088",
                          }}
                        >
                          {tutoria.etiqueta_nombre || "Tutoría"}
                        </span>
                      </div>

                      <p className="text-[#1C3724]/70 mt-2">
                        Profesor: {tutoria.profesor_nombre}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-white px-3 py-1 font-semibold">
                          {String(tutoria.hora_inicio).slice(0, 5)} -{" "}
                          {String(tutoria.hora_fin).slice(0, 5)}
                        </span>

                        <span className="rounded-full bg-[#E0C192]/70 px-3 py-1 font-semibold">
                          Cupos: {tutoria.inscritos}/{tutoria.cupos}
                        </span>

                        <span className="rounded-full bg-[#788EA4]/20 px-3 py-1 font-semibold">
                          {tutoria.estado}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {tutorias.length === 0 && (
            <div className="rounded-3xl bg-[#F8F6F2] p-10 text-center text-[#1C3724]/60">
              No hay tutorías disponibles por el momento.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}