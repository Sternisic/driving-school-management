import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(`Middleware aktiv für: ${request.nextUrl.pathname}`);

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  console.log(`Token gefunden: ${!!token}`);

  // Zugriff auf die Hauptseite und API-Routen erlauben
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/api")) {
    console.log("Zugriff auf Login- oder API-Seite erlaubt");
    return NextResponse.next();
  }

  // Blockiere den Zugriff auf Dashboard-Routen, wenn kein Token vorhanden ist
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    console.log("Kein Token, Umleitung zur Login-Seite");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("Zugriff erlaubt");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Überwache alle Routen unter /dashboard
};
