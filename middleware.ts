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

  // console.log(token);

  if(pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }
  if (pathname.startsWith("/client") && token?.role !== "student") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }
  if (pathname.startsWith("/empresa")) {
    if (token?.role !== "company") {
      return NextResponse.redirect(new URL("/redirect", req.url));
    }
    
    // Skip approval check for the waiting-approval page itself
    if (!pathname.includes("/waiting-approval")) {
      // For all other company pages, check if company is approved
      const response = await fetch(`${req.nextUrl.origin}/api/company/me`, {
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && !data.data.isApprove) {
          return NextResponse.redirect(new URL("/empresa/waiting-approval", req.url));
        }
      }
    }
  }
  if (pathname.startsWith("/coordinador") && token?.role !== "coordinator") {
    return NextResponse.redirect(new URL("/redirect", req.url));
  }

  return NextResponse.next();
}
