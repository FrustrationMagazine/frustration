import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@dashboard/auth";

const SIGN_IN_URL = "/auth/signin";

const DASHBOARD_URL = "/dashboard";
const DASHBOARD_INCOME_URL = `${DASHBOARD_URL}/income`;

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard/income", request.url));
  }

  const isSignedIn = !!(await auth())?.user;
  const atAuth = request.nextUrl.pathname.startsWith("/auth");
  const shouldRedirectToLogin = !isSignedIn && !atAuth;
  if (shouldRedirectToLogin) return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));

  const atDashboardHome = request.nextUrl.pathname === DASHBOARD_URL;
  const shouldRedirectDashboardIncome = isSignedIn && atDashboardHome;
  if (shouldRedirectDashboardIncome)
    return NextResponse.redirect(new URL(DASHBOARD_INCOME_URL, request.url));
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
