"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al iniciar sesión");
      return;
    }

    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    router.push(data.redirect);
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-6"
      style={{
        backgroundImage: "url('/icons/Biblioteca.jpg')",
      }}
    >
      <div className="w-full max-w-5xl min-h-[620px] rounded-3xl overflow-hidden shadow-2xl flex bg-white/80 backdrop-blur-sm">
        <section className="w-1/2 bg-white flex flex-col items-center justify-center p-12">
          <Image
            src="/icons/logo2.jpg"
            alt="TutoWiki"
            width={220}
            height={160}
            className="mb-8 rounded-xl"
          />

          <h1 className="text-5xl font-bold text-[#503B31] mb-4">
            TutoWiki
          </h1>

          <p className="text-center text-[#705D56] mb-8 max-w-sm">
            Encuentra tutorías, profesores y espacios de aprendizaje en un solo lugar.
          </p>

          <button className="rounded-full bg-[#A7BBEC] px-8 py-3 font-semibold text-[#020202] hover:bg-[#9097C0] transition">
            Más información
          </button>
        </section>

        <section className="w-1/2 bg-[#705D56]/55 backdrop-blur-md flex flex-col justify-center p-14">
          <h2 className="text-4xl font-bold text-[#020202] mb-3">
            Iniciar sesión
          </h2>

          <p className="text-[#020202]/70 mb-8">
            Ingresa a tu cuenta para continuar en TutoWiki.
          </p>

          <form onSubmit={iniciarSesion} className="space-y-5">
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full rounded-full px-6 py-4 outline-none bg-white/95"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-full px-6 py-4 outline-none bg-white/95"
              required
            />

            {error && (
              <p className="text-sm text-red-900 bg-red-100 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#7D533C] text-white py-4 font-bold hover:bg-[#503B31] transition"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-center text-[#020202]/70">
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="font-bold text-[#020202]">
              Registrarse
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}