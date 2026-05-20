import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  verifyAdminToken,
  type AdminTokenPayload,
} from "./jwt";

// Admin oturumu = backend'in ürettiği JWT'nin httpOnly çerezde tutulması.

/** Giriş sonrası backend token'ını çereze yazar. */
export async function createAdminSession(token: string): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
}

/** Oturum çerezini siler (çıkış). */
export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

/** Çerezdeki ham admin token'ını döner. */
export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}

/** Geçerli admin oturumunu döner; yoksa null. */
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const token = await getAdminToken();
  if (!token) return null;
  return verifyAdminToken(token);
}
