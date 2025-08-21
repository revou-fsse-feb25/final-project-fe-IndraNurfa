// file: middleware.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/sign-up");
  const isAdminPage = pathname.startsWith("/admin");
  const isUserPage = pathname.startsWith("/user");

  // Get the role from the nested user object in the token
  const userRole = token?.user?.role as string;

  // 1. Redirect authenticated users from auth pages
  if (isAuthenticated && isAuthPage) {
    const redirectUrl = userRole === "Admin" ? "/admin" : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // 2. Protect admin routes
  if (isAuthenticated && isAdminPage && userRole !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthenticated && isUserPage && userRole !== "User") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. Redirect unauthenticated users from protected pages
  if (!isAuthenticated && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If none of the above, the request is allowed.
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/sign-up", "/admin/:path*", "/user/:path*"],
};
