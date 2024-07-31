import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@dashboard/auth";

const SIGN_IN_URL = "/auth/signin";
const DASHBOARD_URL = "/dashboard";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const atAuth = request.nextUrl.pathname.startsWith("/auth");
  const atDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const session = await auth();
  const logged = !!session?.user;

  const redirectLogin = !logged && !atAuth;
  const redirectDashboard = logged && !atDashboard;

  if (redirectLogin) return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
  if (redirectDashboard) return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
