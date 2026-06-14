import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        id,
        nombre,
        correo,
        tipo_usuario,
        activo,
        fecha_creacion
      FROM usuarios
      WHERE tipo_usuario = 'ADMIN'
      LIMIT 1
    `);

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No hay administrador registrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
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