"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  bannedAt: string | null;
  bannedReason: string;
  university: string;
  department: string;
  createdAt: string;
};

type Session = {
  id: string;
  teacherName: string;
  skill: string;
  date: string;
  time: string;
  status: string;
  cost: number;
};

type Transaction = {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
};

type Detail = {
  user: User;
  sessions: Session[];
  transactions: Transaction[];
  counts: { sessions: number; conversations: number; notifications: number };
};

const STATUS_TONE: Record<string, "amber" | "green" | "red"> = {
  upcoming: "amber",
  completed: "green",
  cancelled: "red",
};
const STATUS_LABEL: Record<string, string> = {
  upcoming: "Yaklaşan",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [coinOpen, setCoinOpen] = useState(false);
  const [coinAmount, setCoinAmount] = useState("");
  const [coinReason, setCoinReason] = useState("");
  const [coinSaving, setCoinSaving] = useState(false);
  const [coinError, setCoinError] = useState("");

  const load = useCallback(async () => {
    const data = await api.get<Detail>(`/api/admin/users/${params.id}`);
    setDetail(data);
  }, [params.id]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  async function toggleBan() {
    if (!detail) return;
    try {
      if (detail.user.status === "suspended") {
        await api.post(`/api/admin/users/${detail.user.id}/unban`);
      } else {
        const reason =
          prompt(`"${detail.user.name}" neden askıya alınıyor?`) ?? "";
        await api.post(`/api/admin/users/${detail.user.id}/ban`, { reason });
      }
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Güncellenemedi");
    }
  }

  async function remove() {
    if (!detail) return;
    if (!confirm(`"${detail.user.name}" kullanıcısı silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/users/${detail.user.id}`);
      router.replace("/admin/users");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Silinemedi");
    }
  }

  async function submitCoin(e: React.FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setCoinSaving(true);
    setCoinError("");
    try {
      await api.post(`/api/admin/users/${detail.user.id}/coins`, {
        amount: Number(coinAmount),
        description: coinReason || "Admin düzeltmesi",
      });
      setCoinOpen(false);
      setCoinAmount("");
      setCoinReason("");
      await load();
    } catch (err) {
      setCoinError(err instanceof Error ? err.message : "İşlem başarısız");
    } finally {
      setCoinSaving(false);
    }
  }

  if (error) return <ErrorBanner message={error} />;
  if (!detail) return <Spinner />;

  const { user, sessions, transactions, counts } = detail;
  const initials = user.avatar || user.name.slice(0, 2).toUpperCase();

  return (
    <>
      <div className="mb-3">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
        >
          ← Kullanıcılar
        </Link>
      </div>

      <PageHeader
        title={user.name}
        subtitle={user.email}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setCoinOpen(true)}>
              <Icon name="coin" size={14} />
              Coin düzenle
            </Button>
            <Button
              variant={user.status === "suspended" ? "primary" : "secondary"}
              onClick={toggleBan}
            >
              <Icon name="ban" size={14} />
              {user.status === "suspended" ? "Askıyı kaldır" : "Askıya al"}
            </Button>
            <Button variant="danger" onClick={remove}>
              <Icon name="trash" size={14} />
              Sil
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <Avatar text={initials} color={user.avatarColor} size={56} />
            <div>
              <p className="text-base font-extrabold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <div className="mt-1 flex gap-1">
                <Badge tone={user.role === "teacher" ? "indigo" : "slate"}>
                  {user.role === "teacher" ? "Öğretmen" : "Öğrenci"}
                </Badge>
                <Badge tone={user.status === "active" ? "green" : "red"}>
                  {user.status === "active" ? "Aktif" : "Askıda"}
                </Badge>
              </div>
            </div>
          </div>

          <dl className="space-y-2 border-t border-slate-100 pt-3 text-xs">
            <Row label="SkillCoin">
              <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                <Icon name="coin" size={13} />
                {user.coins}
              </span>
            </Row>
            <Row label="Üniversite">{user.university || "—"}</Row>
            <Row label="Bölüm">{user.department || "—"}</Row>
            <Row label="Kayıt">
              {new Date(user.createdAt).toLocaleDateString("tr-TR")}
            </Row>
            {user.status === "suspended" && (
              <Row label="Askı sebebi">
                <span className="text-red-600">
                  {user.bannedReason || "—"}
                </span>
              </Row>
            )}
          </dl>

          {user.bio && (
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
              {user.bio}
            </p>
          )}
        </Card>

        <div className="lg:col-span-2">
          <div className="mb-4 grid grid-cols-3 gap-3">
            <MiniStat label="Oturum" value={counts.sessions} />
            <MiniStat label="Sohbet" value={counts.conversations} />
            <MiniStat label="Bildirim" value={counts.notifications} />
          </div>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-bold text-slate-700">
              Son Oturumlar
            </h2>
            {sessions.length === 0 ? (
              <EmptyState text="Henüz oturum yok" />
            ) : (
              <div className="space-y-2">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {s.skill}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {s.teacherName} · {s.date} {s.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <Icon name="coin" size={11} />
                        {s.cost}
                      </span>
                      <Badge tone={STATUS_TONE[s.status] ?? "slate"}>
                        {STATUS_LABEL[s.status] ?? s.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="mt-4 p-5">
            <h2 className="mb-3 text-sm font-bold text-slate-700">
              Coin Geçmişi
            </h2>
            {transactions.length === 0 ? (
              <EmptyState text="Coin hareketi yok" />
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-slate-700">
                        {t.description || t.type}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(t.createdAt).toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        t.amount >= 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={coinOpen}
        onClose={() => setCoinOpen(false)}
        title="SkillCoin Düzeltmesi"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCoinOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="coin-form" disabled={coinSaving}>
              {coinSaving ? "İşleniyor…" : "Uygula"}
            </Button>
          </>
        }
      >
        <form
          id="coin-form"
          onSubmit={submitCoin}
          className="grid gap-4"
        >
          <Field
            label="Miktar"
            hint="Pozitif: ekle, negatif: çıkar. Örn: 5 veya -3.5"
          >
            <Input
              type="number"
              step="0.5"
              required
              value={coinAmount}
              onChange={(e) => setCoinAmount(e.target.value)}
            />
          </Field>
          <Field label="Açıklama">
            <Input
              value={coinReason}
              onChange={(e) => setCoinReason(e.target.value)}
              placeholder="Örn: hatalı oturum iadesi"
            />
          </Field>
          {coinError && <ErrorBanner message={coinError} />}
        </form>
      </Modal>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-700">{children}</dd>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-xl font-extrabold text-slate-800">{value}</p>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
    </Card>
  );
}
