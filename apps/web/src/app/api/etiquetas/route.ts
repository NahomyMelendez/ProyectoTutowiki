import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM etiquetas WHERE activa = 1 ORDER BY orden, nombre"
    );

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
    const { nombre, color, descripcion, orden } = body;

    if (!nombre) {
      return NextResponse.json(
        { ok: false, error: "El nombre de la etiqueta es obligatorio" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO etiquetas (nombre, color, descripcion, orden)
      VALUES (?, ?, ?, ?)
      `,
      [
        nombre,
        color || "#3B82F6",
        descripcion || null,
        orden || 0,
      ]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Etiqueta creada correctamente",
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