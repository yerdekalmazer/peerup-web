import { jwtVerify } from "jose";

// Admin token'ları peerup-backend tarafından üretilir; burada yalnızca
// doğrulanır. Anahtar backend'deki ADMIN_JWT_SECRET ile aynı olmalı.
const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "dev-admin-secret",
);

export const ADMIN_COOKIE = "peerup_admin";

export type AdminTokenPayload = {
  sub: string;
  role: string;
};

/** Backend'in ürettiği admin token'ını doğrular; geçersizse null. */
export async function verifyAdminToken(
  token: string,
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return { sub: String(payload.sub), role: String(payload.role) };
  } catch {
    return null;
  }
}
