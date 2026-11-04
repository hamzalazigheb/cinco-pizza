import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token      = req.cookies.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN;
  const { pathname } = req.nextUrl;

  /* Protect /admin/* */
  if (pathname.startsWith("/admin")) {
    if (!token || token !== adminToken) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  /* Redirect already-logged-in users away from /login */
  if (pathname === "/login" && token && token === adminToken) {
    const adminUrl = req.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
