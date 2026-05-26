"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Spinner,
} from "@/components/admin/ui";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  coins: number;
  role: string;
  status: string;
  createdAt: string;
};

const empty = {
  name: "",
  email: "",
  password: "",
  avatarColor: "#6366F1",
  bio: "",
  coins: 10,
  role: "student",
  status: "active",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "teacher">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await api.get<User[]>(
      `/api/admin/users${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    );
    setUsers(data);
  }, [query]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  const visible = useMemo(() => {
    if (!users) return null;
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role === roleFilter) &&
        (statusFilter === "all" || u.status === statusFilter),
    );
  }, [users, roleFilter, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setError("");
    setModalOpen(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      avatarColor: u.avatarColor,
      bio: u.bio,
      coins: u.coins,
      role: u.role,
      status: u.status,
    });
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: form.name,
          avatarColor: form.avatarColor,
          bio: form.bio,
          coins: Number(form.coins),
          role: form.role,
          status: form.status,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/api/admin/users/${editing.id}`, payload);
      } else {
        await api.post("/api/admin/users", {
          name: form.name,
          email: form.email,
          password: form.password,
          avatarColor: form.avatarColor,
          bio: form.bio,
          coins: Number(form.coins),
          role: form.role,
        });
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function remove(u: User) {
    if (!confirm(`"${u.name}" kullanıcısı silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/users/${u.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  async function toggleBan(u: User) {
    try {
      if (u.status === "suspended") {
        await api.post(`/api/admin/users/${u.id}/unban`);
      } else {
        const reason = prompt(`"${u.name}" neden askıya alınıyor?`) ?? "";
        await api.post(`/api/admin/users/${u.id}/ban`, { reason });
      }
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Güncellenemedi");
    }
  }

  return (
    <>
      <PageHeader
        title="Kullanıcılar"
        subtitle={`${visible?.length ?? 0} / ${users?.length ?? 0} kayıt`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/exports/users.csv"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Icon name="download" size={14} />
              CSV
            </a>
            <Button onClick={openCreate}>
              <Icon name="plus" size={16} />
              Yeni Kullanıcı
            </Button>
          </div>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Icon name="search" size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim veya e-postaya göre ara…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value as typeof roleFilter)
          }
        >
          <option value="all">Tüm roller</option>
          <option value="student">Öğrenci</option>
          <option value="teacher">Öğretmen</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
        >
          <option value="all">Tüm durumlar</option>
          <option value="active">Aktif</option>
          <option value="suspended">Askıda</option>
        </Select>
      </div>

      {error && !modalOpen && <ErrorBanner message={error} />}

      {!visible ? (
        <Spinner />
      ) : visible.length === 0 ? (
        <Card>
          <EmptyState text="Eşleşen kullanıcı yok" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Kullanıcı</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">SkillCoin</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar text={u.avatar} color={u.avatarColor} />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={u.role === "teacher" ? "indigo" : "slate"}>
                        {u.role === "teacher" ? "Öğretmen" : "Öğrenci"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Icon name="coin" size={13} />
                        {u.coins}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={u.status === "active" ? "green" : "red"}>
                        {u.status === "active" ? "Aktif" : "Askıda"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Detay"
                        >
                          Detay
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBan(u)}
                          className="hover:bg-amber-50 hover:text-amber-600"
                          aria-label={
                            u.status === "active" ? "Askıya al" : "Aç"
                          }
                        >
                          <Icon name="ban" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(u)}
                        >
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(u)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="trash" size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="user-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad Soyad">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="E-posta">
            <Input
              type="email"
              required
              disabled={!!editing}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field
            label={editing ? "Yeni parola" : "Parola"}
            hint={editing ? "Boş bırakılırsa değişmez" : "En az 6 karakter"}
          >
            <Input
              type="password"
              required={!editing}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          <Field label="Rol">
            <Select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Öğrenci</option>
              <option value="teacher">Öğretmen</option>
            </Select>
          </Field>
          <Field label="SkillCoin bakiyesi">
            <Input
              type="number"
              step="0.5"
              value={form.coins}
              onChange={(e) =>
                setForm({ ...form, coins: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Avatar rengi">
            <input
              type="color"
              value={form.avatarColor}
              onChange={(e) =>
                setForm({ ...form, avatarColor: e.target.value })
              }
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
            />
          </Field>
          {editing && (
            <Field label="Hesap durumu">
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Aktif</option>
                <option value="suspended">Askıda</option>
              </Select>
            </Field>
          )}
          {error && (
            <div className="sm:col-span-2">
              <ErrorBanner message={error} />
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}
