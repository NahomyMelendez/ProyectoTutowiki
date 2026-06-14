import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const connection = await pool.getConnection();

  try {
    const { id } = await context.params;
    const { cliente_id } = await request.json();

    if (!cliente_id) {
      return NextResponse.json(
        { ok: false, error: "cliente_id es obligatorio" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    const [cuposRows]: any = await connection.query(
      `
      SELECT 
        t.cupos,
        COUNT(CASE WHEN te.estado = 'INSCRITO' THEN 1 END) AS inscritos
      FROM tutorias t
      LEFT JOIN tutorias_estudiantes te ON t.id = te.tutoria_id
      WHERE t.id = ?
      GROUP BY t.id, t.cupos
      `,
      [id]
    );

    if (cuposRows.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "Tutoría no encontrada" },
        { status: 404 }
      );
    }

    const cupos = Number(cuposRows[0].cupos);
    const inscritos = Number(cuposRows[0].inscritos);

    if (inscritos >= cupos) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "No hay cupos disponibles" },
        { status: 400 }
      );
    }

    await connection.query(
      `
      INSERT INTO tutorias_estudiantes (tutoria_id, cliente_id, estado)
      VALUES (?, ?, 'INSCRITO')
      ON DUPLICATE KEY UPDATE estado = 'INSCRITO'
      `,
      [id, cliente_id]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: "Inscripción realizada correctamente",
    });
  } catch (error) {
    await connection.rollback();

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}