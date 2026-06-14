import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const [rows] = await pool.query(
      `
      SELECT 
        te.id AS inscripcion_id,
        c.id AS cliente_id,
        u.nombre,
        u.correo,
        c.telefono,
        c.universidad,
        c.carrera,
        te.fecha_inscripcion,
        te.estado
      FROM tutorias_estudiantes te
      INNER JOIN clientes c ON te.cliente_id = c.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE te.tutoria_id = ?
      ORDER BY te.fecha_inscripcion DESC
      `,
      [id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}