"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";

type Stats = {
  totals: {
    teachers: number;
    users: number;
    sessions: number;
    categories: number;
    chains: number;
    onlineTeachers: number;
    avgRating: number;
    totalReach: number;
  };
  sessions: { upcoming: number; completed: number; cancelled: number };
  categoryDistribution: { label: string; count: number }[];
  recentSessions: {
    id: string;
    teacherName: string;
    teacherAvatar: string;
    avatarColor: string;
    skill: string;
    date: string;
    status: string;
  }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    avatarColor: string;
    role: string;
  }[];
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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Stats>("/api/admin/stats")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <EmptyState text={error} />;
  if (!stats) return <Spinner />;

  const { totals, sessions } = stats;
  const sessionTotal =
    sessions.upcoming + sessions.completed + sessions.cancelled || 1;
  const maxCat = Math.max(...stats.categoryDistribution.map((c) => c.count), 1);

  const cards = [
    { label: "Öğretmenler", value: totals.teachers, icon: "teachers", tone: "indigo" },
    { label: "Kullanıcılar", value: totals.users, icon: "users", tone: "blue" },
    { label: "Oturumlar", value: totals.sessions, icon: "sessions", tone: "amber" },
    { label: "Mentor Zincirleri", value: totals.chains, icon: "chains", tone: "green" },
  ];
  const toneBg: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <>
      <PageHeader
        title="Genel Bakış"
        subtitle="PeerUP platformunun güncel durumu"
      />

      {/* Ana sayaçlar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${toneBg[c.tone]}`}
            >
              <Icon name={c.icon} size={20} />
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{c.value}</p>
            <p className="text-xs font-medium text-slate-500">{c.label}</p>
          </Card>
        ))}
      </div>

      {/* İkinci satır: oturum dağılımı + minik metrikler */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-bold text-slate-700">
            Oturum Durumu
          </h2>
          <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-amber-400"
              style={{ width: `${(sessions.upcoming / sessionTotal) * 100}%` }}
            />
            <div
              className="bg-emerald-500"
              style={{ width: `${(sessions.completed / sessionTotal) * 100}%` }}
            />
            <div
              className="bg-red-400"
              style={{ width: `${(sessions.cancelled / sessionTotal) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { k: "upcoming", v: sessions.upcoming, c: "text-amber-600" },
              { k: "completed", v: sessions.completed, c: "text-emerald-600" },
              { k: "cancelled", v: sessions.cancelled, c: "text-red-500" },
            ].map((s) => (
              <div key={s.k} className="rounded-lg bg-slate-50 py-3">
                <p className={`text-lg font-extrabold ${s.c}`}>{s.v}</p>
                <p className="text-[11px] font-medium text-slate-500">
                  {STATUS_LABEL[s.k]}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-center gap-3 p-5">
          <Metric
            icon="bolt"
            label="Çevrimiçi öğretmen"
            value={totals.onlineTeachers}
          />
          <Metric
            icon="star"
            label="Ortalama puan"
            value={totals.avgRating.toFixed(2)}
          />
          <Metric
            icon="trend"
            label="Toplam zincir erişimi"
            value={totals.totalReach}
          />
        </Card>
      </div>

      {/* Üçüncü satır: kategori dağılımı */}
      <Card className="mt-4 p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-700">
          Kategoriye Göre Öğretmen Dağılımı
        </h2>
        <div className="space-y-2.5">
          {stats.categoryDistribution.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs font-medium text-slate-500">
                {c.label}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(c.count / maxCat) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-xs font-bold text-slate-700">
                {c.count}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dördüncü satır: son oturumlar + son kullanıcılar */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700">
            Son Oturumlar
          </h2>
          {stats.recentSessions.length === 0 ? (
            <EmptyState text="Henüz oturum yok" />
          ) : (
            <div className="space-y-2">
              {stats.recentSessions.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <Avatar
                    text={s.teacherAvatar}
                    color={s.avatarColor}
                    size={34}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-700">
                      {s.skill}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {s.teacherName} · {s.date}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[s.status] ?? "slate"}>
                    {STATUS_LABEL[s.status] ?? s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 text-sm font-bold text-slate-700">
            Yeni Kullanıcılar
          </h2>
          {stats.recentUsers.length === 0 ? (
            <EmptyState text="Henüz kullanıcı yok" />
          ) : (
            <div className="space-y-2">
              {stats.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <Avatar text={u.avatar} color={u.avatarColor} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-700">
                      {u.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {u.email}
                    </p>
                  </div>
                  <Badge tone={u.role === "teacher" ? "indigo" : "slate"}>
                    {u.role === "teacher" ? "Öğretmen" : "Öğrenci"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon name={icon} size={17} />
      </div>
      <div>
        <p className="text-base font-extrabold text-slate-800">{value}</p>
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}
