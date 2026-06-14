import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const connection = await pool.getConnection();

  try {
    const { id } = await context.params;
    const body = await request.json();

    const { nombre, correo, telefono, especialidad, descripcion } = body;

    if (!nombre || !correo) {
      return NextResponse.json(
        { ok: false, error: "Nombre y correo son obligatorios" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    const [profesores]: any = await connection.query(
      "SELECT usuario_id FROM profesores WHERE id = ?",
      [id]
    );

    if (profesores.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "Profesor no encontrado" },
        { status: 404 }
      );
    }

    const usuarioId = profesores[0].usuario_id;

    await connection.query(
      `
      UPDATE usuarios
      SET nombre = ?, correo = ?
      WHERE id = ?
      `,
      [nombre, correo, usuarioId]
    );

    await connection.query(
      `
      UPDATE profesores
      SET telefono = ?, especialidad = ?, descripcion = ?
      WHERE id = ?
      `,
      [
        telefono || null,
        especialidad || null,
        descripcion || null,
        id,
      ]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: "Profesor actualizado correctamente",
      id,
    });
  } catch (error) {
    await connection.rollback();

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const connection = await pool.getConnection();

  try {
    const { id } = await context.params;

    await connection.beginTransaction();

    const [profesores]: any = await connection.query(
      "SELECT usuario_id FROM profesores WHERE id = ?",
      [id]
    );

    if (profesores.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "Profesor no encontrado" },
        { status: 404 }
      );
    }

    const usuarioId = profesores[0].usuario_id;

    await connection.query(
      "UPDATE profesores SET activo = 0 WHERE id = ?",
      [id]
    );

    await connection.query(
      "UPDATE usuarios SET activo = 0 WHERE id = ?",
      [usuarioId]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: "Profesor desactivado correctamente",
      id,
    });
  } catch (error) {
    await connection.rollback();

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}