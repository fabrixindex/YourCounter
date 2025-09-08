import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_secreta";

export async function middleware(req) {
  /*
  const { pathname } = req.nextUrl;

  // Rutas que queremos proteger
  if (pathname.startsWith("/api/counters") || pathname.startsWith("/api/users")) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      jwt.verify(token, JWT_SECRET);
      // Si el token es válido, dejamos pasar
      return NextResponse.next();
    } catch (err) {
      return new NextResponse(JSON.stringify({ error: "Token inválido" }), { status: 401 });
    }
  }

  // Para otras rutas, dejamos pasar
  return NextResponse.next();
  */
}

// Opcional: definir a qué rutas se aplica el middleware
export const config = {
  matcher: ["/api/counters/:path*", "/api/users/:path*"]
};