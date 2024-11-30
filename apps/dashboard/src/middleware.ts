import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@dashboard/auth";

const SIGN_IN_URL = "/auth/signin";

const DASHBOARD_URL = "/dashboard";
const DASHBOARD_INCOME_URL = `${DASHBOARD_URL}/income`;

export async function middleware(request: NextRequest) {
  const atRoot = request.nextUrl.pathname === "/";
  const isProd = process.env.NODE_ENV === "production";

  /* ❌ Not signed in */
  if (isProd) {
    const isSignedIn = !!(await auth())?.user;
    const atAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const shouldRedirectToLogin = !isSignedIn && !atAuthPage;
    if (shouldRedirectToLogin)
      return NextResponse.redirect(new URL(SIGN_IN_URL, request.url));
  }

  /* ✅ Signed in */

  const atDashboardHomepage = request.nextUrl.pathname === DASHBOARD_URL;
  const atDashboardSubpage =
    !atDashboardHomepage && request.nextUrl.pathname.startsWith("/dashboard");

  if (atDashboardSubpage) return NextResponse.next();
  if (atDashboardHomepage || atRoot)
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
