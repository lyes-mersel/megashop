import { NextRequest, NextResponse } from "next/server";

import getAuth from "@/lib/auth/getAuth";
import { ROOT, PUBLIC_ROUTES, AUTH_ROUTES, VERIFY_EMAIL } from "@/lib/routes";

export async function middleware(req: NextRequest) {
  const session = await getAuth();
  const { pathname } = req.nextUrl;
  console.log("Middleware : ", pathname);

  //  Allow public routes without authentication
  if (
    pathname === ROOT ||
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Don't allow authenticated users to access auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect to verify-email if email is not verified
  if (!session.user.emailVerifie && pathname !== VERIFY_EMAIL) {
    return NextResponse.redirect(new URL("/auth/verify-email", req.url));
  }

  // Redirect to /dashboard if email is verified
  if (pathname === VERIFY_EMAIL && session.user.emailVerifie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all routes except :
export const config = {
  matcher: [
    "/((?!api|icons|images|manifest|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|sitemap.xml|robots.txt).*)",
  ],
};
