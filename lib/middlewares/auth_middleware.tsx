// middleware.js

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: any) {
  const token = request.cookies.get("token"); // Access the token from cookies

  // If the token is not present, redirect to the login page
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login"; // Redirect to login page
    return NextResponse.redirect(url);
  }

  // Allow access if token is present
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/**"], // Apply middleware to specific routes
};
