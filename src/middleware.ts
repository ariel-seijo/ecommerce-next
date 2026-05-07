import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const session = await getIronSession(request, new NextResponse(), sessionOptions);

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage && session.userId) {
    const destination = session.role === "ADMIN" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isAdminRoute) {
    if (!session.userId) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "ADMIN") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!session.userId) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/checkout/:path*", "/account/:path*", "/profile", "/admin/:path*", "/dashboard"],
};
