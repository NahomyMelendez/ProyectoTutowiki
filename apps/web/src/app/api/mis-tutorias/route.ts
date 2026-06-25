import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("cliente_id");

    if (!clienteId) {
      return NextResponse.json(
        { ok: false, error: "cliente_id es obligatorio" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `
      SELECT 
        te.id AS inscripcion_id,
        te.estado,
        te.fecha_inscripcion,
        t.id AS tutoria_id,
        t.fecha,
        t.hora_inicio,
        t.hora_fin,
        u.nombre AS profesor_nombre,
        m.nombre AS materia_nombre
      FROM tutorias_estudiantes te
      INNER JOIN tutorias t ON te.tutoria_id = t.id
      INNER JOIN profesores p ON t.profesor_id = p.id
      INNER JOIN usuarios u ON p.usuario_id = u.id
      INNER JOIN materias m ON t.materia_id = m.id
      WHERE te.cliente_id = ?
        AND te.estado = 'INSCRITO'
      ORDER BY t.fecha ASC, t.hora_inicio ASC
      `,
      [clienteId]
    );

    return NextResponse.json(rows);
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