"use client";

import { useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
  Badge,
  Button,
  Card,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from "@/components/admin/ui";

type Audience = "all" | "students" | "teachers";

const AUDIENCE_LABEL: Record<Audience, string> = {
  all: "Tüm kullanıcılar",
  students: "Öğrenciler",
  teachers: "Öğretmenler",
};

const TYPE_OPTIONS: { value: string; label: string; tone: "indigo" | "amber" | "green" | "red" }[] = [
  { value: "info", label: "Bilgi", tone: "indigo" },
  { value: "warning", label: "Uyarı", tone: "amber" },
  { value: "success", label: "Başarı", tone: "green" },
  { value: "alert", label: "Acil", tone: "red" },
];

type HistoryEntry = {
  id: string;
  audience: Audience;
  title: string;
  body: string;
  type: string;
  sent: number;
  at: string;
};

export default function NotificationsPage() {
  const [audience, setAudience] = useState<Audience>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("info");
  const [icon, setIcon] = useState("notifications-outline");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Başlık zorunlu");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await api.post<{ ok: boolean; sent: number }>(
        "/api/admin/notifications/broadcast",
        { audience, title, body, type, icon },
      );
      setHistory((prev) => [
        {
          id: `${Date.now()}`,
          audience,
          title,
          body,
          type,
          sent: res.sent,
          at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gönderilemedi");
    } finally {
      setSending(false);
    }
  }

  const typeTone =
    TYPE_OPTIONS.find((t) => t.value === type)?.tone ?? "indigo";

  return (
    <>
      <PageHeader
        title="Bildirim Gönder"
        subtitle="Seçilen segmente in-app bildirim yayınla"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <form onSubmit={send} className="grid gap-4">
            <Field label="Hedef kitle">
              <Select
                value={audience}
                onChange={(e) => setAudience(e.target.value as Audience)}
              >
                <option value="all">Tüm kullanıcılar</option>
                <option value="students">Sadece öğrenciler</option>
                <option value="teachers">Sadece öğretmenler</option>
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tür">
                <Select value={type} onChange={(e) => setType(e.target.value)}>
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Icon adı"
                hint="Ionicons (örn. notifications-outline)"
              >
                <Input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </Field>
            </div>

            <Field label="Başlık">
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </Field>

            <Field label="Gövde" hint="Birkaç cümle, isteğe bağlı">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                maxLength={500}
              />
            </Field>

            {error && <ErrorBanner message={error} />}

            <div className="flex justify-end">
              <Button type="submit" disabled={sending}>
                <Icon name="send" size={15} />
                {sending ? "Gönderiliyor…" : "Yayınla"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700">Önizleme</h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <Icon name="bell" size={16} />
              </div>
              <Badge tone={typeTone}>
                {TYPE_OPTIONS.find((t) => t.value === type)?.label ?? type}
              </Badge>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {title || "Bildirim başlığı"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {body || "Bildirim gövdesi burada görünür."}
            </p>
            <p className="mt-3 text-[11px] text-slate-400">
              {AUDIENCE_LABEL[audience]}
            </p>
          </div>
        </Card>
      </div>

      {history.length > 0 && (
        <Card className="mt-4 p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700">
            Bu oturumda gönderilenler
          </h2>
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-700">
                    {h.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {AUDIENCE_LABEL[h.audience]} ·{" "}
                    {new Date(h.at).toLocaleTimeString("tr-TR")}
                  </p>
                </div>
                <Badge tone="indigo">{h.sent} kişiye gönderildi</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
