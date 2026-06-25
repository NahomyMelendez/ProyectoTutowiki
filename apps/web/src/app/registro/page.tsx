"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [carrera, setCarrera] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function registrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nombre.trim() || !correo.trim() || !password.trim()) {
      setError("Nombre, correo y contraseña son obligatorios");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (telefono && !/^[0-9]+$/.test(telefono)) {
      setError("El teléfono solo debe contener números");
      return;
    }

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        correo,
        password,
        telefono,
        universidad,
        carrera,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al registrar estudiante");
      return;
    }

    setMensaje("Registro realizado correctamente. Ahora puedes iniciar sesión.");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-6 py-10"
      style={{ backgroundImage: "url('/icons/Biblioteca.jpg')" }}
    >
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-[#503B31] mb-3">
          Registro de estudiante
        </h1>

        <p className="text-[#705D56] mb-8">
          Crea tu cuenta para inscribirte en tutorías de TutoWiki.
        </p>

        <form onSubmit={registrar} className="space-y-4">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full rounded-full px-6 py-4 border bg-white text-black placeholder:text-gray-500"
            required
          />

          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full rounded-full px-6 py-4 border bg-white text-black placeholder:text-gray-500"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña mínimo 6 caracteres"
            className="w-full rounded-full px-6 py-4 border bg-white text-black placeholder:text-gray-500"
            required
          />

          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono"
            className="w-full rounded-full px-6 py-4 border bg-white text-black placeholder:text-gray-500"
          />

          <input
            value={universidad}
            onChange={(e) => setUniversidad(e.target.value)}
            placeholder="Universidad"
            className="w-full rounded-full px-6 py-4 border bg-white text-black placeholder:text-gray-500"
          />

          <input
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            placeholder="Carrera"
            className="w-full rounded-full px-6 py-4 border bg-white text-black placeholder:text-gray-500"
          />

          {error && (
            <p className="bg-red-100 text-red-800 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          {mensaje && (
            <p className="bg-green-100 text-green-800 px-4 py-3 rounded-xl">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-[#7D533C] text-white py-4 font-bold hover:bg-[#503B31]"
          >
            Registrarme
          </button>
        </form>

       <div className="mt-6 flex items-center justify-center gap-2 text-center">
  <span className="text-[#705D56]">¿Ya tienes cuenta?</span>
  <Link
    href="/login"
    className="font-bold text-[#503B31] hover:underline"
  >
    Iniciar sesión
  </Link>
</div>
      </div>
    </main>
  );
}