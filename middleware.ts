// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Rutas que requieren login
  const protectedPaths = ["/dashboard", "/admin", "/perfil"];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }
  if (pathname.startsWith("/client") && token?.role !== "student") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }
  if (pathname.startsWith("/empresa") && token?.role !== "company") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }
  if (pathname.startsWith("/coordinador") && token?.role !== "coordinator") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }

  return NextResponse.next();
}
