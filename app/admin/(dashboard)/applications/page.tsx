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
  Modal,
  PageHeader,
  Spinner,
  Textarea,
} from "@/components/admin/ui";

type Application = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  university: string;
  department: string;
  role: string;
  mentorAppStatus: "pending" | "approved" | "rejected" | null;
  mentorAppMessage: string | null;
  mentorAppAt: string | null;
};

type StatusFilter = "pending" | "approved" | "rejected" | "";

const STATUS_LABEL: Record<NonNullable<Application["mentorAppStatus"]>, string> = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};
const STATUS_TONE: Record<
  NonNullable<Application["mentorAppStatus"]>,
  "amber" | "green" | "slate"
> = {
  pending: "amber",
  approved: "green",
  rejected: "slate",
};

export default function ApplicationsPage() {
  const [items, setItems] = useState<Application[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState<Application | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<Application[]>(
        `/api/admin/applications${filter ? `?status=${filter}` : ""}`,
      );
      setItems(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yüklenemedi");
      setItems([]);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(a: Application) {
    setBusy(a.id);
    try {
      await api.post(`/api/admin/applications/${a.id}/approve`, {});
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Onaylanamadı");
    } finally {
      setBusy(null);
    }
  }

  async function reject() {
    if (!rejectOpen) return;
    setBusy(rejectOpen.id);
    try {
      await api.post(`/api/admin/applications/${rejectOpen.id}/reject`, {
        reason: rejectReason,
      });
      setRejectOpen(null);
      setRejectReason("");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Reddedilemedi");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Mentor Başvuruları"
        subtitle={`${items?.length ?? 0} kayıt`}
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {[
          { key: "pending", label: "Bekleyenler" },
          { key: "approved", label: "Onaylananlar" },
          { key: "rejected", label: "Reddedilenler" },
          { key: "", label: "Tümü" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key as StatusFilter)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === f.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ErrorBanner message={error} />

      {items === null ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState text="Bu filtrede listelenecek başvuru yok." />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: a.avatarColor || "#6366F1" }}
                >
                  {a.avatar || a.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {a.name}
                    </h3>
                    {a.mentorAppStatus && (
                      <Badge tone={STATUS_TONE[a.mentorAppStatus]}>
                        {STATUS_LABEL[a.mentorAppStatus]}
                      </Badge>
                    )}
                    {a.role === "teacher" && <Badge tone="indigo">Mentor</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{a.email}</p>
                  {(a.university || a.department) && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {[a.university, a.department].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {a.mentorAppMessage && (
                    <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                      {a.mentorAppMessage}
                    </div>
                  )}
                  {a.mentorAppAt && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      Başvuru: {new Date(a.mentorAppAt).toLocaleString("tr-TR")}
                    </p>
                  )}
                </div>
                {a.mentorAppStatus === "pending" && (
                  <div className="flex flex-col gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => approve(a)}
                      disabled={busy === a.id}
                    >
                      <Icon name="check" size={14} />
                      Onayla
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setRejectReason("");
                        setRejectOpen(a);
                      }}
                      disabled={busy === a.id}
                    >
                      <Icon name="close" size={14} />
                      Reddet
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!rejectOpen}
        title={
          rejectOpen ? `${rejectOpen.name} başvurusunu reddet` : "Reddet"
        }
        onClose={() => setRejectOpen(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectOpen(null)}>
              Vazgeç
            </Button>
            <Button onClick={reject} disabled={!!busy}>
              Reddet
            </Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-slate-600">
          Aday bu mesajı bildirim olarak görür. Boş bırakırsan genel bir mesaj
          iletilir.
        </p>
        <Textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Reddetme sebebi (opsiyonel, en fazla 300 karakter)"
          rows={4}
          maxLength={300}
        />
      </Modal>
    </>
  );
}
