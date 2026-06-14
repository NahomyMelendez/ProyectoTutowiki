import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM materias WHERE activa = 1 ORDER BY nombre"
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
    const { codigo, nombre, descripcion } = body;

    if (!nombre) {
      return NextResponse.json(
        { ok: false, error: "El nombre de la materia es obligatorio" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO materias (codigo, nombre, descripcion)
      VALUES (?, ?, ?)
      `,
      [codigo || null, nombre, descripcion || null]
    );

    return NextResponse.json({
      ok: true,
      mensaje: "Materia creada correctamente",
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