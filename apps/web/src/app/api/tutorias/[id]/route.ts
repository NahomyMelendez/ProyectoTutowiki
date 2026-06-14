import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
    } = body;

    if (
      !profesor_id ||
      !materia_id ||
      !cupos ||
      !fecha ||
      !hora_inicio ||
      !hora_fin
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Profesor, materia, cupos, fecha, hora inicio y hora fin son obligatorios",
        },
        { status: 400 }
      );
    }

    await pool.query(
      `
      UPDATE tutorias
      SET
        profesor_id = ?,
        materia_id = ?,
        cupos = ?,
        fecha = ?,
        hora_inicio = ?,
        hora_fin = ?,
        estado = ?,
        observaciones = ?
      WHERE id = ?
      `,
      [
        profesor_id,
        materia_id,
        cupos,
        fecha,
        hora_inicio,
        hora_fin,
        estado || "PENDIENTE",
        observaciones || null,
        id,
      ]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Tutoría actualizada correctamente",
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
      UPDATE tutorias
      SET estado = 'CANCELADA'
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Tutoría cancelada correctamente",
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