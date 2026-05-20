import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/backend";
import { createAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/auth/admin/login — backend'e iletir, dönen token'ı çereze yazar
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(
      { error: "Backend servisine ulaşılamadı (peerup-backend çalışıyor mu?)" },
      { status: 502 },
    );
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return NextResponse.json(
      data ?? { error: "Giriş başarısız" },
      { status: res.status },
    );
  }

  await createAdminSession(data.token);
  return NextResponse.json({ admin: data.admin });
}
