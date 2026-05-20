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

type Session = {
  id: string;
  teacherName: string;
  teacherAvatar: string;
  avatarColor: string;
  skill: string;
  date: string;
  time: string;
  duration: number;
  cost: number;
  status: string;
  type: string;
  rating: number | null;
};

const STATUS_TONE: Record<string, "green" | "amber" | "red"> = {
  upcoming: "amber",
  completed: "green",
  cancelled: "red",
};
const STATUS_LABEL: Record<string, string> = {
  upcoming: "Yaklaşan",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

const empty = {
  teacherName: "",
  skill: "",
  date: "",
  time: "",
  duration: 60,
  cost: 1,
  status: "upcoming",
  type: "online",
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await api.get<Session[]>(
      `/api/admin/sessions${filter ? `?status=${filter}` : ""}`,
    );
    setSessions(data);
  }, [filter]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setError("");
    setModalOpen(true);
  }

  function openEdit(s: Session) {
    setEditing(s);
    setForm({
      teacherName: s.teacherName,
      skill: s.skill,
      date: s.date,
      time: s.time,
      duration: s.duration,
      cost: s.cost,
      status: s.status,
      type: s.type,
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
        await api.put(`/api/admin/sessions/${editing.id}`, form);
      } else {
        await api.post("/api/admin/sessions", form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function remove(s: Session) {
    if (!confirm(`"${s.skill}" oturumu silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/sessions/${s.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  const filters = [
    { key: "", label: "Tümü" },
    { key: "upcoming", label: "Yaklaşan" },
    { key: "completed", label: "Tamamlandı" },
    { key: "cancelled", label: "İptal" },
  ];

  return (
    <>
      <PageHeader
        title="Oturumlar"
        subtitle={`${sessions?.length ?? 0} kayıt`}
        action={
          <Button onClick={openCreate}>
            <Icon name="plus" size={16} />
            Yeni Oturum
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && !modalOpen && <ErrorBanner message={error} />}

      {!sessions ? (
        <Spinner />
      ) : sessions.length === 0 ? (
        <Card>
          <EmptyState text="Oturum bulunamadı" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Oturum</th>
                  <th className="px-4 py-3">Tarih / Saat</th>
                  <th className="px-4 py-3">Süre</th>
                  <th className="px-4 py-3">Ücret</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          text={s.teacherAvatar}
                          color={s.avatarColor}
                        />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {s.skill}
                          </p>
                          <p className="text-xs text-slate-400">
                            {s.teacherName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {s.date} · {s.time}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {s.duration} dk
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Icon name="coin" size={13} />
                        {s.cost}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[s.status] ?? "slate"}>
                        {STATUS_LABEL[s.status] ?? s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(s)}
                        >
                          <Icon name="edit" size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(s)}
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
        title={editing ? "Oturumu Düzenle" : "Yeni Oturum"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="session-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form
          id="session-form"
          onSubmit={save}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field label="Öğretmen adı">
            <Input
              required
              value={form.teacherName}
              onChange={(e) =>
                setForm({ ...form, teacherName: e.target.value })
              }
            />
          </Field>
          <Field label="Beceri / Konu">
            <Input
              required
              value={form.skill}
              onChange={(e) => setForm({ ...form, skill: e.target.value })}
            />
          </Field>
          <Field label="Tarih" hint="örn. 12 Mayıs 2026">
            <Input
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Field>
          <Field label="Saat" hint="örn. 15:00">
            <Input
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </Field>
          <Field label="Süre (dakika)">
            <Input
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Ücret (SkillCoin)">
            <Input
              type="number"
              step="0.1"
              value={form.cost}
              onChange={(e) =>
                setForm({ ...form, cost: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Durum">
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="upcoming">Yaklaşan</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal</option>
            </Select>
          </Field>
          <Field label="Tür">
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="online">Çevrimiçi</option>
              <option value="inperson">Yüz yüze</option>
            </Select>
          </Field>
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
