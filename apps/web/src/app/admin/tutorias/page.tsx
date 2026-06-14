"use client";

import { useEffect, useState } from "react";

type Profesor = {
  id: number;
  nombre: string;
};

type Materia = {
  id: number;
  codigo: string | null;
  nombre: string;
};

type Etiqueta = {
  id: number;
  nombre: string;
  color: string;
};

type Tutoria = {
  id: number;
  profesor_id: number;
  profesor_nombre: string;
  materia_id: number;
  materia_codigo: string | null;
  materia_nombre: string;
  cupos: number;
  inscritos: number;
  cupos_disponibles: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  observaciones: string | null;
};

type EstudianteInscrito = {
  inscripcion_id: number;
  cliente_id: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  universidad: string | null;
  carrera: string | null;
  estado: string;
};

export default function TutoriasPage() {
  const [tutorias, setTutorias] = useState<Tutoria[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
  const [estudiantes, setEstudiantes] = useState<EstudianteInscrito[]>([]);

  const [profesorId, setProfesorId] = useState("");
  const [materiaId, setMateriaId] = useState("");
  const [cupos, setCupos] = useState(1);
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [estado, setEstado] = useState("PENDIENTE");
  const [observaciones, setObservaciones] = useState("");
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<number[]>([]);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState<number | null>(null);

  async function cargarDatos() {
    const [tutoriasRes, profesoresRes, materiasRes, etiquetasRes] =
      await Promise.all([
        fetch("/api/tutorias"),
        fetch("/api/profesores"),
        fetch("/api/materias"),
        fetch("/api/etiquetas"),
      ]);

    setTutorias(await tutoriasRes.json());
    setProfesores(await profesoresRes.json());
    setMaterias(await materiasRes.json());
    setEtiquetas(await etiquetasRes.json());
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function limpiarFormulario() {
    setProfesorId("");
    setMateriaId("");
    setCupos(1);
    setFecha("");
    setHoraInicio("");
    setHoraFin("");
    setEstado("PENDIENTE");
    setObservaciones("");
    setEtiquetasSeleccionadas([]);
    setEditandoId(null);
  }

  function toggleEtiqueta(id: number) {
    setEtiquetasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

 async function guardarTutoria(e: React.FormEvent) {
  e.preventDefault();

  const body = {
    profesor_id: Number(profesorId),
    materia_id: Number(materiaId),
    cupos,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
    estado,
    observaciones,
  };

  const url = editandoId ? `/api/tutorias/${editandoId}` : "/api/tutorias";
  const method = editandoId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  let data: any = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.log("Respuesta de la API:");
    console.log(text);

    alert("La API devolvió un error HTML. Mira la consola y la terminal de Next.");

    return;
  }

  if (!res.ok) {
    alert(data.error || `Error ${res.status}`);
    return;
  }

  const tutoriaId = editandoId || data.id;

  if (tutoriaId && etiquetasSeleccionadas.length > 0) {
    await fetch(`/api/tutorias/${tutoriaId}/etiquetas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ etiquetas: etiquetasSeleccionadas }),
    });
  }

  limpiarFormulario();
  cargarDatos();
}

  function editarTutoria(tutoria: Tutoria) {
    setEditandoId(tutoria.id);
    setProfesorId(String(tutoria.profesor_id));
    setMateriaId(String(tutoria.materia_id));
    setCupos(Number(tutoria.cupos));
    setFecha(String(tutoria.fecha).slice(0, 10));
    setHoraInicio(tutoria.hora_inicio);
    setHoraFin(tutoria.hora_fin);
    setEstado(tutoria.estado);
    setObservaciones(tutoria.observaciones || "");
  }

  async function cancelarTutoria(id: number) {
    if (!confirm("¿Deseas cancelar esta tutoría?")) return;

    await fetch(`/api/tutorias/${id}`, {
      method: "DELETE",
    });

    cargarDatos();
  }

  async function verEstudiantes(id: number) {
    setTutoriaSeleccionada(id);

    const res = await fetch(`/api/tutorias/${id}/estudiantes`);
    const data = await res.json();

    setEstudiantes(data);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-[#7D533C] mb-2">Tutorías</h1>
      <p className="text-gray-600 mb-8">
        Crea tutorías, asigna profesor, cupos, fecha, horario y etiquetas.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <form
          onSubmit={guardarTutoria}
          className="bg-white rounded-2xl shadow p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
            {editandoId ? "Editar tutoría" : "Nueva tutoría"}
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium">Profesor</span>
            <select
              value={profesorId}
              onChange={(e) => setProfesorId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            >
              <option value="">Selecciona un profesor</option>
              {profesores.map((profesor) => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Materia</span>
            <select
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            >
              <option value="">Selecciona una materia</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.codigo ? `${materia.codigo} - ` : ""}
                  {materia.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Cupos</span>
            <input
              type="number"
              min={1}
              value={cupos}
              onChange={(e) => setCupos(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-4">
              <span className="text-sm font-medium">Fecha</span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium">Estado</span>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="FINALIZADA">Finalizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-4">
              <span className="text-sm font-medium">Hora inicio</span>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium">Hora fin</span>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
                required
              />
            </label>
          </div>

          <div className="mb-4">
            <span className="text-sm font-medium">Etiquetas</span>

            <div className="flex flex-wrap gap-2 mt-2">
              {etiquetas.map((etiqueta) => (
                <button
                  key={etiqueta.id}
                  type="button"
                  onClick={() => toggleEtiqueta(etiqueta.id)}
                  className={`rounded-full px-4 py-2 text-sm border ${
                    etiquetasSeleccionadas.includes(etiqueta.id)
                      ? "border-[#020202]"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: etiqueta.color }}
                >
                  {etiqueta.nombre}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-6">
            <span className="text-sm font-medium">Observaciones</span>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
              rows={4}
              placeholder="Detalles de la tutoría"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#7D533C] text-white py-3 font-semibold hover:bg-[#705D56]"
          >
            {editandoId ? "Guardar cambios" : "Crear tutoría"}
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

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
              Lista de tutorías
            </h2>

            <div className="space-y-4">
              {tutorias.map((tutoria) => (
                <div
                  key={tutoria.id}
                  className="rounded-2xl border border-gray-100 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        {tutoria.materia_codigo
                          ? `${tutoria.materia_codigo} - `
                          : ""}
                        {tutoria.materia_nombre}
                      </h3>

                      <p className="text-gray-500">
                        Profesor: {tutoria.profesor_nombre}
                      </p>

                     <div className="mt-3 flex flex-wrap gap-2 text-sm">
  <span className="rounded-full bg-[#EEC170]/50 px-3 py-1">
    {(() => {
      const [anio, mes, dia] = String(tutoria.fecha)
        .slice(0, 10)
        .split("-");

      return `${dia}/${mes}/${anio}`;
    })()}
  </span>

                        <span className="rounded-full bg-[#A7BBEC]/40 px-3 py-1">
                          {tutoria.hora_inicio} - {tutoria.hora_fin}
                        </span>

                        <span className="rounded-full bg-[#F2A65A]/40 px-3 py-1">
                          Cupos: {tutoria.inscritos}/{tutoria.cupos}
                        </span>

                        <span className="rounded-full bg-[#7D533C]/10 px-3 py-1">
                          {tutoria.estado}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        {tutoria.observaciones || "Sin observaciones"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => editarTutoria(tutoria)}
                        className="px-3 py-2 rounded-lg bg-[#A7BBEC]/40 text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => verEstudiantes(tutoria.id)}
                        className="px-3 py-2 rounded-lg bg-[#EEC170]/50 text-sm"
                      >
                        Ver estudiantes
                      </button>

                      <button
                        onClick={() => cancelarTutoria(tutoria.id)}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {tutorias.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No hay tutorías registradas.
                </p>
              )}
            </div>
          </div>

          {tutoriaSeleccionada && (
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-[#7D533C] mb-6">
                Estudiantes inscritos
              </h2>

              <div className="space-y-3">
                {estudiantes.map((estudiante) => (
                  <div
                    key={estudiante.inscripcion_id}
                    className="rounded-xl border border-gray-100 p-4"
                  >
                    <h3 className="font-bold">{estudiante.nombre}</h3>
                    <p className="text-gray-500">{estudiante.correo}</p>
                    <p className="text-sm text-gray-600">
                      {estudiante.universidad || "Sin universidad"} -{" "}
                      {estudiante.carrera || "Sin carrera"}
                    </p>
                  </div>
                ))}

                {estudiantes.length === 0 && (
                  <p className="text-gray-500">
                    No hay estudiantes inscritos en esta tutoría.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}