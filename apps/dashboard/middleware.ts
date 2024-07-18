import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");
  const session = await auth();
  const isSignedIn = !!session?.user;

  const shouldRedirectToSignInPage = !isSignedIn && !isAuthPage;
  if (shouldRedirectToSignInPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  if (isSignedIn && !isDashboardPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
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
