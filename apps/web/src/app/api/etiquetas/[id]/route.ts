import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { nombre, color, descripcion, orden } = body;

    if (!nombre) {
      return NextResponse.json(
        { ok: false, error: "El nombre de la etiqueta es obligatorio" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      UPDATE etiquetas
      SET nombre = ?, color = ?, descripcion = ?, orden = ?
      WHERE id = ?
      `,
      [nombre, color || "#585123", descripcion || null, orden || 0, id]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Etiqueta actualizada correctamente",
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
      UPDATE etiquetas
      SET activa = 0
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Etiqueta desactivada correctamente",
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