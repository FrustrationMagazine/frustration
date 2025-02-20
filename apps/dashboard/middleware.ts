import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the paths that require authentication
const protectedPaths = ["/dashboard"];

export function middleware(req: NextRequest) {
  // const token = req.cookies.get("authToken"); // Replace with your actual token check logic

  // // Check if the request is for a protected path
  // const isProtectedPath = protectedPaths.some((path) =>
  //   req.nextUrl.pathname.startsWith(path),
  // );

  // // If the user is not authenticated and trying to access a protected path
  // if (!token && isProtectedPath) {
  //   return NextResponse.redirect(new URL("/auth/signin", req.url));
  // }
  return NextResponse.next();
}

//
