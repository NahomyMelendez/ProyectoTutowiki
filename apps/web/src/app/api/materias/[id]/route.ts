import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { codigo, nombre, descripcion } = body;

    if (!nombre) {
      return NextResponse.json(
        { ok: false, error: "El nombre de la materia es obligatorio" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      UPDATE materias
      SET codigo = ?, nombre = ?, descripcion = ?
      WHERE id = ?
      `,
      [codigo || null, nombre, descripcion || null, id]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Materia actualizada correctamente",
      id,
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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await pool.query(
      `
      UPDATE materias
      SET activa = 0
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Materia desactivada correctamente",
      id,
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