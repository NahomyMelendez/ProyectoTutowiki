import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [[materias]]: any = await pool.query(
      "SELECT COUNT(*) AS total FROM materias WHERE activa = 1"
    );

    const [[profesores]]: any = await pool.query(`
      SELECT COUNT(*) AS total
      FROM profesores p
      INNER JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.activo = 1 AND u.activo = 1
    `);

    const [[estudiantes]]: any = await pool.query(`
      SELECT COUNT(*) AS total
      FROM clientes c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE u.activo = 1
    `);

    const [[tutorias]]: any = await pool.query(
      "SELECT COUNT(*) AS total FROM tutorias WHERE estado != 'CANCELADA'"
    );

    return NextResponse.json({
      materias: materias.total,
      profesores: profesores.total,
      estudiantes: estudiantes.total,
      tutorias: tutorias.total,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}