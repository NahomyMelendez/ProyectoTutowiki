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


export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { inscripcion_id, estado } = await request.json();

    if (!inscripcion_id || !estado) {
      return NextResponse.json(
        { ok: false, error: "inscripcion_id y estado son obligatorios" },
        { status: 400 }
      );
    }

    if (!["INSCRITO", "CANCELADO"].includes(estado)) {
      return NextResponse.json(
        { ok: false, error: "Estado inválido" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      UPDATE tutorias_estudiantes
      SET estado = ?
      WHERE id = ? AND tutoria_id = ?
      `,
      [estado, inscripcion_id, id]
    );

    return NextResponse.json({
      ok: true,
      mensaje:
        estado === "INSCRITO"
          ? "Estudiante autorizado correctamente"
          : "Solicitud rechazada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}