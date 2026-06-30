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
        t.id,
        t.cupos,
        t.fecha,
        t.hora_inicio,
        t.hora_fin,
        t.requiere_autorizacion,
        COUNT(CASE WHEN te.estado = 'INSCRITO' THEN 1 END) AS inscritos
      FROM tutorias t
      LEFT JOIN tutorias_estudiantes te ON t.id = te.tutoria_id
      WHERE t.id = ?
      GROUP BY 
        t.id,
        t.cupos,
        t.fecha,
        t.hora_inicio,
        t.hora_fin,
        t.requiere_autorizacion
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

    const tutoria = cuposRows[0];
    const cupos = Number(tutoria.cupos);
    const inscritos = Number(tutoria.inscritos);
    const requiereAutorizacion = Number(tutoria.requiere_autorizacion) === 1;

    if (inscritos >= cupos) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "No hay cupos disponibles" },
        { status: 400 }
      );
    }

    const [choques]: any = await connection.query(
      `
      SELECT t.id, m.nombre AS materia_nombre
      FROM tutorias_estudiantes te
      INNER JOIN tutorias t ON te.tutoria_id = t.id
      INNER JOIN materias m ON t.materia_id = m.id
      WHERE te.cliente_id = ?
        AND te.estado IN ('INSCRITO', 'PENDIENTE')
        AND t.estado != 'CANCELADA'
        AND t.id <> ?
        AND t.fecha = ?
        AND t.hora_inicio < ?
        AND t.hora_fin > ?
      LIMIT 1
      `,
      [
        cliente_id,
        id,
        tutoria.fecha,
        tutoria.hora_fin,
        tutoria.hora_inicio,
      ]
    );

    if (choques.length > 0) {
      await connection.rollback();
      return NextResponse.json(
        {
          ok: false,
          error: `No puedes inscribirte: ya tienes otra tutoría en ese horario (${choques[0].materia_nombre}).`,
        },
        { status: 400 }
      );
    }

    const estadoInscripcion = requiereAutorizacion ? "PENDIENTE" : "INSCRITO";

    await connection.query(
      `
      INSERT INTO tutorias_estudiantes (tutoria_id, cliente_id, estado)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE estado = VALUES(estado)
      `,
      [id, cliente_id, estadoInscripcion]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: requiereAutorizacion
        ? "Solicitud enviada. El profesor debe autorizar tu inscripción."
        : "Inscripción realizada correctamente",
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