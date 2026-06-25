"use client";

import { useEffect, useState } from "react";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  tipo_usuario: string;
};

type Cliente = {
  cliente_id: number;
  usuario_id: number;
  nombre: string;
  correo: string;
  tipo_usuario: string;
  telefono: string;
  universidad: string;
  carrera: string;
};

type TutoriaInscrita = {
  inscripcion_id: number;
  estado: string;
  fecha_inscripcion: string;
  tutoria_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  profesor_nombre: string;
  materia_nombre: string;
};

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [tutorias, setTutorias] = useState<TutoriaInscrita[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  async function cargarPerfil() {
    try {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (!usuarioGuardado) {
        setCargando(false);
        return;
      }

      const usuarioActual: Usuario = JSON.parse(usuarioGuardado);
      setUsuario(usuarioActual);

      if (usuarioActual.tipo_usuario !== "CLIENTE") {
        setCargando(false);
        return;
      }

      const resCliente = await fetch(
        `/api/cliente-actual?usuario_id=${usuarioActual.id}`
      );

      const dataCliente = await resCliente.json();

      if (!resCliente.ok) {
        setCargando(false);
        return;
      }

      setCliente(dataCliente);

      const resTutorias = await fetch(
        `/api/mis-tutorias?cliente_id=${dataCliente.cliente_id}`
      );

      const dataTutorias = await resTutorias.json();

      setTutorias(Array.isArray(dataTutorias) ? dataTutorias : []);
      setCargando(false);
    } catch (error) {
      setTutorias([]);
      setCargando(false);
    }
  }

  if (cargando) {
    return <p>Cargando perfil...</p>;
  }

  if (!usuario) {
    return <p>Debe iniciar sesión para ver su perfil.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <section className="bg-white rounded-2xl shadow p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Mi perfil</h1>

        <p>
          <strong>Nombre:</strong> {usuario.nombre}
        </p>

        <p>
          <strong>Correo:</strong> {usuario.correo}
        </p>

        <p>
          <strong>Tipo de usuario:</strong> {usuario.tipo_usuario}
        </p>

        {cliente && (
          <>
            <p>
              <strong>Teléfono:</strong> {cliente.telefono || "No registrado"}
            </p>

            <p>
              <strong>Universidad:</strong>{" "}
              {cliente.universidad || "No registrada"}
            </p>

            <p>
              <strong>Carrera:</strong> {cliente.carrera || "No registrada"}
            </p>
          </>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold mb-6">Mis tutorías inscritas</h2>

        {usuario.tipo_usuario !== "CLIENTE" ? (
          <p>Solo los estudiantes pueden tener tutorías inscritas.</p>
        ) : tutorias.length === 0 ? (
          <p>No tienes tutorías inscritas todavía.</p>
        ) : (
          <div className="space-y-4">
            {tutorias.map((t) => (
              <div key={t.inscripcion_id} className="border rounded-xl p-5">
                <h3 className="text-xl font-bold">{t.materia_nombre}</h3>

                <p>
                  <strong>Profesor:</strong> {t.profesor_nombre}
                </p>

                <p>
                  <strong>Fecha:</strong>{" "}
                    {new Date(t.fecha).toLocaleDateString("es-CR")}
                </p>

                <p>
                  <strong>Hora:</strong>{" "}
                  {t.hora_inicio.slice(0, 5)} - {t.hora_fin.slice(0, 5)}
                </p>

                <p>
                  <strong>Estado:</strong> {t.estado}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}