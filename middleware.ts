import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/", "/pricing", "/login", "/legal", "/auth"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from login/signup pages
  if ((pathname === "/login" || pathname.startsWith("/auth/sign-up") || pathname.startsWith("/auth/forgot-password")) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect /dashboard/* routes
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /api/drive/* routes
  if (pathname.startsWith("/api/drive") && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
