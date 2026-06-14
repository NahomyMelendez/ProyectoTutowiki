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
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-[#1C3724]">
      Calendario de tutorías
    </h2>
    <p className="text-[#1C3724]/60 mt-1">
      Revisa las tutorías disponibles del mes.
    </p>
  </div>

  <div className="grid grid-cols-7 border rounded-2xl overflow-hidden bg-white">
    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((dia) => (
      <div
        key={dia}
        className="bg-[#1C3724] text-white text-center font-semibold py-3"
      >
        {dia}
      </div>
    ))}

    {Array.from({
      length: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).getDay(),
    }).map((_, i) => (
      <div key={`empty-${i}`} className="min-h-32 border bg-[#F8F6F2]" />
    ))}

    {Array.from({
      length: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).getDate(),
    }).map((_, index) => {
      const dia = index + 1;
      const fecha = `${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

      const eventos = tutorias.filter(
        (tutoria) => String(tutoria.fecha).slice(0, 10) === fecha
      );

      return (
        <div key={dia} className="min-h-32 border p-2 bg-white">
          <p className="font-bold text-[#1C3724] mb-2">{dia}</p>

          <div className="space-y-2">
            {eventos.map((tutoria) => (
              <div
                key={tutoria.id}
                className="rounded-lg px-2 py-2 text-xs text-white shadow"
                style={{
                  backgroundColor: tutoria.etiqueta_color || "#80A088",
                }}
              >
                <p className="font-bold leading-tight">
                  {String(tutoria.hora_inicio).slice(0, 5)}
                </p>
                <p className="leading-tight">
                  {tutoria.materia_codigo
                    ? `${tutoria.materia_codigo} - `
                    : ""}
                  {tutoria.materia_nombre}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
</section>s
    </div>
  );
}