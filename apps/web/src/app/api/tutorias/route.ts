import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id,
        t.profesor_id,
        up.nombre AS profesor_nombre,
        t.materia_id,
        m.codigo AS materia_codigo,
        m.nombre AS materia_nombre,
        t.cupos,
        COUNT(DISTINCT CASE WHEN te.estado = 'INSCRITO' THEN te.id END) AS inscritos,
        (t.cupos - COUNT(DISTINCT CASE WHEN te.estado = 'INSCRITO' THEN te.id END)) AS cupos_disponibles,
        DATE_FORMAT(t.fecha, '%Y-%m-%d') AS fecha,
        t.hora_inicio,
        t.hora_fin,
        t.estado,
        t.requiere_autorizacion,
        t.observaciones,
        t.fecha_creacion,
        MIN(e.nombre) AS etiqueta_nombre,
        MIN(e.color) AS etiqueta_color
      FROM tutorias t
      INNER JOIN profesores p ON t.profesor_id = p.id
      INNER JOIN usuarios up ON p.usuario_id = up.id
      INNER JOIN materias m ON t.materia_id = m.id
      LEFT JOIN tutorias_estudiantes te ON t.id = te.tutoria_id
      LEFT JOIN tutorias_etiquetas tet ON t.id = tet.tutoria_id
      LEFT JOIN etiquetas e ON tet.etiqueta_id = e.id AND e.activa = 1
      WHERE t.estado != 'CANCELADA'
      GROUP BY 
        t.id,
        t.profesor_id,
        up.nombre,
        t.materia_id,
        m.codigo,
        m.nombre,
        t.cupos,
        t.fecha,
        t.hora_inicio,
        t.hora_fin,
        t.estado,
        t.requiere_autorizacion,
        t.observaciones,
        t.fecha_creacion
      ORDER BY t.fecha ASC, t.hora_inicio ASC
    `);

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
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      profesor_id,
      materia_id,
      cupos,
      fecha,
      hora_inicio,
      hora_fin,
      estado,
      observaciones,
      requiere_autorizacion,
    } = body;

    if (hora_inicio >= hora_fin) {
  return NextResponse.json(
    { ok: false, error: "La hora de inicio debe ser menor que la hora fin" },
    { status: 400 }
  );
}

const [choques]: any = await pool.query(
  `
  SELECT t.id, m.nombre AS materia_nombre
  FROM tutorias t
  INNER JOIN materias m ON t.materia_id = m.id
  WHERE t.profesor_id = ?
    AND t.fecha = ?
    AND t.estado != 'CANCELADA'
    AND t.hora_inicio < ?
    AND t.hora_fin > ?
  LIMIT 1
  `,
  [profesor_id, fecha, hora_fin, hora_inicio]
);

if (choques.length > 0) {
  return NextResponse.json(
    {
      ok: false,
      error: `No se puede registrar la tutoría: el profesor ya tiene otra tutoría en ese horario (${choques[0].materia_nombre}).`,
    },
    { status: 400 }
  );
}

    if (!profesor_id || !materia_id || !cupos || !fecha || !hora_inicio || !hora_fin) {
      return NextResponse.json(
        { ok: false, error: "Profesor, materia, cupos, fecha, hora inicio y hora fin son obligatorios" },
        { status: 400 }
      );

      
    }

      await pool.query(
        `
        INSERT INTO tutorias 
        (cliente_id, profesor_id, materia_id, cupos, fecha, hora_inicio, hora_fin, estado, requiere_autorizacion, observaciones)
        VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          profesor_id,
          materia_id,
          cupos,
          fecha,
          hora_inicio,
          hora_fin,
          estado || "PENDIENTE",
          requiere_autorizacion ? 1 : 0,
          observaciones || null,
        ]
      );

    return NextResponse.json({
      ok: true,
      mensaje: "Tutoría creada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}