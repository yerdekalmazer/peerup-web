"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  Modal,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";

type Category = { id: string; label: string; icon: string; order: number };

const ICON_OPTIONS = [
  "grid-outline",
  "code-slash-outline",
  "language-outline",
  "musical-notes-outline",
  "brush-outline",
  "calculator-outline",
  "camera-outline",
  "fitness-outline",
  "book-outline",
  "briefcase-outline",
];

const empty = { label: "", icon: "grid-outline", order: 0 };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setCategories(await api.get<Category[]>("/api/admin/categories"));
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm({ ...empty, order: (categories?.length ?? 0) + 1 });
    setError("");
    setModalOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({ label: c.label, icon: c.icon, order: c.order });
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/api/admin/categories/${editing.id}`, form);
      } else {
        await api.post("/api/admin/categories", form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Category) {
    if (!confirm(`"${c.label}" kategorisi silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/categories/${c.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  return (
    <>
      <PageHeader
        title="Kategoriler"
        subtitle={`${categories?.length ?? 0} kategori`}
        action={
          <Button onClick={openCreate}>
            <Icon name="plus" size={16} />
            Yeni Kategori
          </Button>
        }
      />

      {error && !modalOpen && <ErrorBanner message={error} />}

      {!categories ? (
        <Spinner />
      ) : categories.length === 0 ? (
        <Card>
          <EmptyState text="Kategori bulunamadı" />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card
              key={c.id}
              className="flex items-center gap-3 p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon name="categories" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800">{c.label}</p>
                <p className="truncate text-xs text-slate-400">
                  #{c.order} · {c.icon}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                  <Icon name="edit" size={15} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(c)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="trash" size={15} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Kategoriyi Düzenle" : "Yeni Kategori"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="category-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={save} className="grid gap-4">
          <Field label="Kategori adı">
            <Input
              required
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />
          </Field>
          <Field label="İkon" hint="Mobil uygulamadaki Ionicons adı">
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {ICON_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sıra">
            <Input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </Field>
          {error && <ErrorBanner message={error} />}
        </form>
      </Modal>
    </>
  );
}
