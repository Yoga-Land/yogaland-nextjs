import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "../lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  // 🌍 Add CORS headers for all /api routes
  if (pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight (OPTIONS) requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // ✅ Public API — skip token check
    return response;
  }

  // 🛡️ Allow unauthenticated access to login page
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  // 🔒 Protect private routes (dashboard, videos, ads)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/ads")
  ) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

// ✅ Apply middleware only to relevant paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/videos/:path*",
    "/ads/:path*",
    "/api/:path*",
  ],
};

