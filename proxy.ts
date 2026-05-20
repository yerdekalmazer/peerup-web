import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "./lib/jwt";

// Next.js 16: Middleware artık "Proxy" olarak adlandırılıyor.
// /admin sayfalarını ve /api/admin uçlarını oturum kontrolünden geçirir.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  // Giriş sayfası: zaten girişliyse panele yönlendir
  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Admin API uçları: oturumsuz istek 401
  if (pathname.startsWith("/api/admin")) {
    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  // Admin sayfaları: oturumsuzsa giriş sayfasına
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
