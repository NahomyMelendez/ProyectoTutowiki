import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.usuario_id,
        u.nombre,
        u.correo,
        u.tipo_usuario,
        u.activo,
        c.telefono,
        c.universidad,
        c.carrera
      FROM clientes c
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      WHERE u.activo = 1
      ORDER BY u.nombre
    `);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const connection = await pool.getConnection();

  try {
    const body = await request.json();
    const { nombre, correo, password, telefono, universidad, carrera } = body;

    if (!nombre || !correo || !password) {
      return NextResponse.json(
        { ok: false, error: "Nombre, correo y password son obligatorios" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    const [usuarioResult]: any = await connection.query(
      `
      INSERT INTO usuarios (nombre, correo, password, tipo_usuario, activo)
      VALUES (?, ?, ?, 'CLIENTE', 1)
      `,
      [nombre, correo, password]
    );

    const usuarioId = usuarioResult.insertId;

    await connection.query(
      `
      INSERT INTO clientes (usuario_id, telefono, universidad, carrera)
      VALUES (?, ?, ?, ?)
      `,
      [usuarioId, telefono || null, universidad || null, carrera || null]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: "Cliente creado correctamente",
      usuario_id: usuarioId,
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