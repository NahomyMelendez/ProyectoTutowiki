import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { correo, password } = await request.json();

    if (!correo || !password) {
      return NextResponse.json(
        { ok: false, error: "Correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `
      SELECT id, nombre, correo, tipo_usuario, activo
      FROM usuarios
      WHERE correo = ? AND password = ? AND activo = 1
      LIMIT 1
      `,
      [correo, password]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const usuario = rows[0];

    let redirect = "/login";

    if (usuario.tipo_usuario === "ADMIN") {
      redirect = "/admin";
    }

    if (usuario.tipo_usuario === "CLIENTE") {
      redirect = "/cliente";
    }

    if (usuario.tipo_usuario === "PROFESOR") {
      redirect = "/profesor";
    }

    return NextResponse.json({
      ok: true,
      usuario,
      redirect,
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