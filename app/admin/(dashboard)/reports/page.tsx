"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
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

type Report = {
  id: string;
  targetType: string;
  targetId: string;
  reporterName: string;
  reporterId: string;
  reason: string;
  note: string;
  status: "open" | "resolved" | "dismissed";
  resolvedBy: { id: string; name: string; email: string } | null;
  resolvedAt: string | null;
  createdAt: string;
};

const STATUS_TONE: Record<Report["status"], "amber" | "green" | "slate"> = {
  open: "amber",
  resolved: "green",
  dismissed: "slate",
};
const STATUS_LABEL: Record<Report["status"], string> = {
  open: "Açık",
  resolved: "Çözüldü",
  dismissed: "Reddedildi",
};
const TARGET_LABEL: Record<string, string> = {
  user: "Kullanıcı",
  teacher: "Öğretmen",
  session: "Oturum",
};

const newReportEmpty = {
  targetType: "user",
  targetId: "",
  reporterName: "",
  reason: "",
  note: "",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | Report["status"]>("");
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(newReportEmpty);
  const [createError, setCreateError] = useState("");
  const [saving, setSaving] = useState(false);
  const [noteOpen, setNoteOpen] = useState<Report | null>(null);
  const [noteText, setNoteText] = useState("");

  const load = useCallback(async () => {
    const data = await api.get<Report[]>(
      `/api/admin/reports${statusFilter ? `?status=${statusFilter}` : ""}`,
    );
    setReports(data);
  }, [statusFilter]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  async function updateStatus(r: Report, status: Report["status"]) {
    try {
      await api.put(`/api/admin/reports/${r.id}`, { status });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Güncellenemedi");
    }
  }

  async function remove(r: Report) {
    if (!confirm("Şikayet kaydı silinsin mi?")) return;
    try {
      await api.del(`/api/admin/reports/${r.id}`);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Silinemedi");
    }
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setCreateError("");
    try {
      await api.post("/api/admin/reports", createForm);
      setCreateOpen(false);
      setCreateForm(newReportEmpty);
      await load();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function saveNote() {
    if (!noteOpen) return;
    try {
      await api.put(`/api/admin/reports/${noteOpen.id}`, { note: noteText });
      setNoteOpen(null);
      setNoteText("");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Not kaydedilemedi");
    }
  }

  return (
    <>
      <PageHeader
        title="Şikayetler"
        subtitle={`${reports?.length ?? 0} kayıt`}
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Icon name="plus" size={16} />
            Manuel kayıt
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {[
          { key: "", label: "Tümü" },
          { key: "open", label: "Açık" },
          { key: "resolved", label: "Çözüldü" },
          { key: "dismissed", label: "Reddedildi" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key as typeof statusFilter)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === f.key
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <ErrorBanner message={error} />}

      {!reports ? (
        <Spinner />
      ) : reports.length === 0 ? (
        <Card>
          <EmptyState text="Şikayet yok" />
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone={STATUS_TONE[r.status]}>
                  {STATUS_LABEL[r.status]}
                </Badge>
                <Badge tone="indigo">
                  {TARGET_LABEL[r.targetType] ?? r.targetType}
                </Badge>
                <span className="text-[11px] text-slate-400">
                  {new Date(r.createdAt).toLocaleString("tr-TR")}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                {r.reason}
              </p>
              {r.note && (
                <p className="mt-1 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                  Not: {r.note}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                Hedef: <code className="font-mono">{r.targetId}</code>
                {r.reporterName && (
                  <>
                    {" "}
                    · Şikayet eden: <strong>{r.reporterName}</strong>
                  </>
                )}
                {r.resolvedBy && (
                  <>
                    {" "}
                    · Karar: <strong>{r.resolvedBy.name}</strong>
                  </>
                )}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.status !== "resolved" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(r, "resolved")}
                  >
                    <Icon name="check" size={13} />
                    Çözüldü
                  </Button>
                )}
                {r.status !== "dismissed" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => updateStatus(r, "dismissed")}
                  >
                    Reddet
                  </Button>
                )}
                {r.status !== "open" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateStatus(r, "open")}
                  >
                    Yeniden aç
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNoteOpen(r);
                    setNoteText(r.note);
                  }}
                >
                  Not
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(r)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="trash" size={13} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Manuel Şikayet Kaydı"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="report-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form id="report-form" onSubmit={submitCreate} className="grid gap-4">
          <Field label="Hedef tipi">
            <Select
              value={createForm.targetType}
              onChange={(e) =>
                setCreateForm({ ...createForm, targetType: e.target.value })
              }
            >
              <option value="user">Kullanıcı</option>
              <option value="teacher">Öğretmen</option>
              <option value="session">Oturum</option>
            </Select>
          </Field>
          <Field label="Hedef ID">
            <Input
              required
              value={createForm.targetId}
              onChange={(e) =>
                setCreateForm({ ...createForm, targetId: e.target.value })
              }
            />
          </Field>
          <Field label="Şikayet eden (opsiyonel)">
            <Input
              value={createForm.reporterName}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  reporterName: e.target.value,
                })
              }
            />
          </Field>
          <Field label="Gerekçe">
            <Input
              required
              value={createForm.reason}
              onChange={(e) =>
                setCreateForm({ ...createForm, reason: e.target.value })
              }
            />
          </Field>
          <Field label="Not">
            <Textarea
              value={createForm.note}
              onChange={(e) =>
                setCreateForm({ ...createForm, note: e.target.value })
              }
              rows={3}
            />
          </Field>
          {createError && <ErrorBanner message={createError} />}
        </form>
      </Modal>

      <Modal
        open={!!noteOpen}
        onClose={() => setNoteOpen(null)}
        title="Şikayet notu"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNoteOpen(null)}>
              İptal
            </Button>
            <Button onClick={saveNote}>Kaydet</Button>
          </>
        }
      >
        <Textarea
          rows={5}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </Modal>
    </>
  );
}
