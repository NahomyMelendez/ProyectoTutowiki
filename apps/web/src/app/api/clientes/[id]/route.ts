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

    const { nombre, correo, telefono, universidad, carrera } = body;

    if (!nombre || !correo) {
      return NextResponse.json(
        { ok: false, error: "Nombre y correo son obligatorios" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    const [clientes]: any = await connection.query(
      "SELECT usuario_id FROM clientes WHERE id = ?",
      [id]
    );

    if (clientes.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const usuarioId = clientes[0].usuario_id;

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
      UPDATE clientes
      SET telefono = ?, universidad = ?, carrera = ?
      WHERE id = ?
      `,
      [telefono || null, universidad || null, carrera || null, id]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: "Cliente actualizado correctamente",
      id,
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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const connection = await pool.getConnection();

  try {
    const { id } = await context.params;

    await connection.beginTransaction();

    const [clientes]: any = await connection.query(
      "SELECT usuario_id FROM clientes WHERE id = ?",
      [id]
    );

    if (clientes.length === 0) {
      await connection.rollback();
      return NextResponse.json(
        { ok: false, error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    const usuarioId = clientes[0].usuario_id;

    await connection.query(
      "UPDATE usuarios SET activo = 0 WHERE id = ?",
      [usuarioId]
    );

    await connection.commit();

    return NextResponse.json({
      ok: true,
      mensaje: "Cliente desactivado correctamente",
      id,
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