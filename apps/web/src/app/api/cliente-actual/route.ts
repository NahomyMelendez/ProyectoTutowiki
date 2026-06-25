import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get("usuario_id");

    if (!usuarioId) {
      return NextResponse.json(
        { ok: false, error: "usuario_id es obligatorio" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT 
        c.id AS cliente_id,
        c.usuario_id,
        u.nombre,
        u.correo,
        u.tipo_usuario,
        c.telefono,
        c.universidad,
        c.carrera
      FROM clientes c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.usuario_id = ?
      LIMIT 1
      `,
      [usuarioId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Este usuario no tiene perfil de cliente" },
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