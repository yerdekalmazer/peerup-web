import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/backend";
import { getAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// /api/admin/* isteklerini admin token'ıyla peerup-backend'e iletir.
// (Token httpOnly çerezde olduğu için istemci doğrudan backend'e gidemez.)
async function forward(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  const { path } = await ctx.params;
  const url = `${BACKEND_URL}/api/admin/${path.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };
  const init: RequestInit = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    headers["Content-Type"] = "application/json";
    init.body = await request.text();
  }

  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return NextResponse.json(
      { error: "Backend servisine ulaşılamadı" },
      { status: 502 },
    );
  }

  const contentType = res.headers.get("content-type") ?? "application/json";
  const buffer = await res.arrayBuffer();
  const passthrough: Record<string, string> = { "Content-Type": contentType };
  const disp = res.headers.get("content-disposition");
  if (disp) passthrough["Content-Disposition"] = disp;
  return new NextResponse(buffer, {
    status: res.status,
    headers: passthrough,
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
