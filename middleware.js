import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/login", "/register"];

  if (protectedRoutes.some(r => pathname.startsWith(r)) && !decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (authRoutes.some(r => pathname.startsWith(r)) && decoded) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};