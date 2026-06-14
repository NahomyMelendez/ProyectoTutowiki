import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id,
        p.usuario_id,
        u.nombre,
        u.correo,
        u.tipo_usuario,
        p.telefono,
        p.especialidad,
        p.descripcion,
        p.activo,
        p.fecha_creacion
      FROM profesores p
      LEFT JOIN usuarios u
      ON p.usuario_id = u.id
      WHERE p.activo = 1
      ORDER BY u.nombre
    `);

    return NextResponse.json(rows);

  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nombre, correo, password, telefono, especialidad, descripcion } = body;

    if (!nombre || !correo || !password) {
      return NextResponse.json(
        { ok: false, error: "Nombre, correo y password son obligatorios" },
        { status: 400 }
      );
    }

    const [usuarioResult]: any = await pool.query(
      `
      INSERT INTO usuarios (nombre, correo, password, tipo_usuario)
      VALUES (?, ?, ?, 'PROFESOR')
      `,
      [nombre, correo, password]
    );

    const usuarioId = usuarioResult.insertId;

    await pool.query(
      `
      INSERT INTO profesores (usuario_id, telefono, especialidad, descripcion)
      VALUES (?, ?, ?, ?)
      `,
      [
        usuarioId,
        telefono || null,
        especialidad || null,
        descripcion || null,
      ]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Profesor creado correctamente",
      usuario_id: usuarioId,
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