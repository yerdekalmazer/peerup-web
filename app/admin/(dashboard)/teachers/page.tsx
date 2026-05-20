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
  Textarea,
} from "@/components/admin/ui";

type Teacher = {
  id: string;
  name: string;
  skill: string;
  category: string;
  rating: number;
  reviews: number;
  coinRate: number;
  online: boolean;
  verified: boolean;
  avatar: string;
  avatarColor: string;
  bio: string;
  sessionsCount: number;
  badges: string[];
};
type Category = { id: string; label: string };

const empty = {
  name: "",
  skill: "",
  category: "",
  avatar: "",
  avatarColor: "#6366F1",
  bio: "",
  rating: 0,
  reviews: 0,
  coinRate: 1,
  sessionsCount: 0,
  online: false,
  verified: false,
  badgesText: "",
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await api.get<Teacher[]>(
      `/api/admin/teachers${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    );
    setTeachers(data);
  }, [query]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  useEffect(() => {
    api
      .get<Category[]>("/api/admin/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...empty, category: categories[0]?.label ?? "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(t: Teacher) {
    setEditing(t);
    setForm({
      name: t.name,
      skill: t.skill,
      category: t.category,
      avatar: t.avatar,
      avatarColor: t.avatarColor,
      bio: t.bio,
      rating: t.rating,
      reviews: t.reviews,
      coinRate: t.coinRate,
      sessionsCount: t.sessionsCount,
      online: t.online,
      verified: t.verified,
      badgesText: t.badges.join(", "),
    });
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      skill: form.skill,
      category: form.category,
      avatar: form.avatar,
      avatarColor: form.avatarColor,
      bio: form.bio,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      coinRate: Number(form.coinRate),
      sessionsCount: Number(form.sessionsCount),
      online: form.online,
      verified: form.verified,
      badges: form.badgesText
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
    };
    try {
      if (editing) {
        await api.put(`/api/admin/teachers/${editing.id}`, payload);
      } else {
        await api.post("/api/admin/teachers", payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function remove(t: Teacher) {
    if (!confirm(`"${t.name}" silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/teachers/${t.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  return (
    <>
      <PageHeader
        title="Öğretmenler"
        subtitle={`${teachers?.length ?? 0} kayıt`}
        action={
          <Button onClick={openCreate}>
            <Icon name="plus" size={16} />
            Yeni Öğretmen
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <Icon name="search" size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="İsim veya beceriye göre ara…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && !modalOpen && <ErrorBanner message={error} />}

      {!teachers ? (
        <Spinner />
      ) : teachers.length === 0 ? (
        <Card>
          <EmptyState text="Öğretmen bulunamadı" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Öğretmen</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Puan</th>
                  <th className="px-4 py-3">Oturum</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar text={t.avatar} color={t.avatarColor} />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {t.name}
                          </p>
                          <p className="text-xs text-slate-400">{t.skill}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{t.category}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <Icon
                          name="star"
                          size={13}
                          className="text-amber-400"
                        />
                        {t.rating.toFixed(1)}
                        <span className="font-normal text-slate-400">
                          ({t.reviews})
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {t.sessionsCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.verified && <Badge tone="indigo">Doğrulanmış</Badge>}
                        <Badge tone={t.online ? "green" : "slate"}>
                          {t.online ? "Çevrimiçi" : "Çevrimdışı"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(t)}
                        >
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(t)}
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
        title={editing ? "Öğretmeni Düzenle" : "Yeni Öğretmen"}
        wide
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="teacher-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form id="teacher-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <Field label="Ad Soyad">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Beceri">
            <Input
              required
              value={form.skill}
              onChange={(e) => setForm({ ...form, skill: e.target.value })}
            />
          </Field>
          <Field label="Kategori">
            <Select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Seçiniz</option>
              {categories.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Avatar (baş harfler)" hint="Boş bırakılırsa otomatik">
            <Input
              value={form.avatar}
              maxLength={3}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
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
          <Field label="SkillCoin oranı">
            <Input
              type="number"
              step="0.1"
              value={form.coinRate}
              onChange={(e) =>
                setForm({ ...form, coinRate: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Puan (0-5)">
            <Input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Değerlendirme sayısı">
            <Input
              type="number"
              value={form.reviews}
              onChange={(e) =>
                setForm({ ...form, reviews: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Oturum sayısı">
            <Input
              type="number"
              value={form.sessionsCount}
              onChange={(e) =>
                setForm({ ...form, sessionsCount: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Rozetler" hint="Virgülle ayırın">
            <Input
              value={form.badgesText}
              onChange={(e) =>
                setForm({ ...form, badgesText: e.target.value })
              }
              placeholder="Doğrulanmış, Top Öğretmen"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Biyografi">
              <Textarea
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.online}
              onChange={(e) =>
                setForm({ ...form, online: e.target.checked })
              }
            />
            Çevrimiçi
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(e) =>
                setForm({ ...form, verified: e.target.checked })
              }
            />
            Doğrulanmış hesap
          </label>
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
