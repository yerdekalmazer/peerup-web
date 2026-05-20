import { redirect } from "next/navigation";
import { getAdminSession, getAdminToken } from "@/lib/auth";
import { BACKEND_URL } from "@/lib/backend";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  // proxy.ts zaten koruyor; bu ek bir güvenlik katmanı.
  if (!session) redirect("/admin/login");

  // Görünen ad/e-posta bilgisini backend'den al (ulaşılamazsa zarif yedek).
  let name = "Admin";
  let email = "";
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${await getAdminToken()}` },
      cache: "no-store",
    });
    if (res.ok) {
      const admin = await res.json();
      name = admin.name ?? name;
      email = admin.email ?? "";
    }
  } catch {
    /* backend kapalıysa yedek değerlerle devam et */
  }

  return (
    <AdminShell admin={{ name, email, role: session.role }}>
      {children}
    </AdminShell>
  );
}
