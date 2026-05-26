"use client";

import { useCallback, useEffect, useState } from "react";
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

type Admin = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "moderator";
  lastLoginAt: string | null;
  createdAt: string;
};

const ROLE_LABEL: Record<Admin["role"], string> = {
  super_admin: "Süper Admin",
  admin: "Admin",
  moderator: "Moderatör",
};
const ROLE_TONE: Record<Admin["role"], "indigo" | "blue" | "slate"> = {
  super_admin: "indigo",
  admin: "blue",
  moderator: "slate",
};

const empty = {
  name: "",
  email: "",
  password: "",
  role: "admin" as Admin["role"],
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    const data = await api.get<Admin[]>("/api/admin/admins");
    setAdmins(data);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(a: Admin) {
    setEditing(a);
    setForm({ name: a.name, email: a.email, password: "", role: a.role });
    setFormError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: form.name,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/api/admin/admins/${editing.id}`, payload);
      } else {
        await api.post("/api/admin/admins", form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function remove(a: Admin) {
    if (!confirm(`${a.name} adlı admin silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/admins/${a.id}`);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Silinemedi");
    }
  }

  return (
    <>
      <PageHeader
        title="Adminler"
        subtitle="Panel kullanıcıları ve rolleri"
        action={
          <Button onClick={openCreate}>
            <Icon name="plus" size={16} />
            Yeni admin
          </Button>
        }
      />

      {error && <ErrorBanner message={error} />}

      {!admins ? (
        <Spinner />
      ) : admins.length === 0 ? (
        <Card>
          <EmptyState text="Admin yok" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Son giriş</th>
                  <th className="px-4 py-3">Kayıt</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => {
                  const initials = a.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar text={initials} />
                          <div>
                            <p className="font-semibold text-slate-800">
                              {a.name}
                            </p>
                            <p className="text-xs text-slate-400">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={ROLE_TONE[a.role] ?? "slate"}>
                          {ROLE_LABEL[a.role] ?? a.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {a.lastLoginAt
                          ? new Date(a.lastLoginAt).toLocaleString("tr-TR")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(a.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(a)}
                          >
                            <Icon name="edit" size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(a)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Icon name="trash" size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Admini düzenle" : "Yeni admin"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="admin-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form id="admin-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
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
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Admin["role"] })
              }
            >
              <option value="super_admin">Süper Admin (her şey)</option>
              <option value="admin">Admin (çoğu işlem)</option>
              <option value="moderator">Moderatör (sınırlı)</option>
            </Select>
          </Field>
          {formError && (
            <div className="sm:col-span-2">
              <ErrorBanner message={formError} />
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}
