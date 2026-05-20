"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./Icon";
import { Avatar } from "./ui";
import { api } from "@/lib/admin-client";

const NAV = [
  { href: "/admin", label: "Genel Bakış", icon: "dashboard" },
  { href: "/admin/teachers", label: "Öğretmenler", icon: "teachers" },
  { href: "/admin/users", label: "Kullanıcılar", icon: "users" },
  { href: "/admin/sessions", label: "Oturumlar", icon: "sessions" },
  { href: "/admin/categories", label: "Kategoriler", icon: "categories" },
  { href: "/admin/chains", label: "Mentor Zincirleri", icon: "chains" },
];

type Admin = { name: string; email: string; role: string };

export default function AdminShell({
  admin,
  children,
}: {
  admin: Admin;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await api.post("/api/auth/admin/logout").catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = admin.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-base font-extrabold text-white">
            P
          </div>
          <div>
            <p className="text-sm font-extrabold leading-tight text-slate-800">
              PeerUP
            </p>
            <p className="text-[11px] text-slate-400">Yönetim Paneli</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar text={initials} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-700">
                {admin.name}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {admin.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Icon name="logout" size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobil arka plan */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* İçerik */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <Icon name="menu" size={22} />
          </button>
          <span className="text-sm font-extrabold text-slate-800">
            PeerUP Admin
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
