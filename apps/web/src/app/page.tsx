import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center text-[#1C3724]"
      style={{ backgroundImage: "url('/icons/hojas.jpg')" }}
    >
      <div className="min-h-screen bg-white/70 backdrop-blur-sm">
        <header className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold">TutoWiki</h1>

          <nav className="flex gap-4">
            <Link
              href="/login"
              className="rounded-full bg-[#61370E] text-white px-6 py-3 font-semibold"
            >
              Iniciar sesión
            </Link>
          </nav>
        </header>

        <section className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-bold mb-6">
              Tutorías académicas en un solo lugar
            </h2>

            <p className="text-xl mb-8 max-w-xl">
              TutoWiki permite consultar tutorías disponibles, buscar por materia
              o profesor, inscribirse como estudiante y administrar materias,
              profesores y horarios desde un panel administrativo.
            </p>

            <div className="flex gap-4">
              <Link
                href="/login"
                className="rounded-full bg-[#1C3724] text-white px-8 py-4 font-bold"
              >
                Entrar al sistema
              </Link>

              <Link
                href="/cliente/tutorias"
                className="rounded-full border border-[#1C3724] px-8 py-4 font-bold"
              >
                Ver tutorías
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-3xl font-bold mb-6">Módulos principales</h3>

            <ul className="space-y-4 text-lg">
              <li>✅ Registro y administración de estudiantes</li>
              <li>✅ Gestión de materias, profesores y tutorías</li>
              <li>✅ Búsqueda de tutorías disponibles</li>
              <li>✅ Inscripción de estudiantes</li>
              <li>✅ Perfil con tutorías inscritas</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}