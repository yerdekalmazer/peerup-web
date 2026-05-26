"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";

type Point = {
  date: string;
  newUsers: number;
  newSessions: number;
  completed: number;
  coinFlow: number;
};

type Timeseries = { days: number; points: Point[] };

type Revenue = {
  coin: { spent: number; earned: number; refunded: number; net: number };
  completedSessionCoinSum: number;
  topCategories: { label: string; sessions: number }[];
};

const RANGE_OPTIONS = [7, 14, 30, 60, 90];

export default function AnalyticsPage() {
  const [range, setRange] = useState(30);
  const [ts, setTs] = useState<Timeseries | null>(null);
  const [rev, setRev] = useState<Revenue | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [t, r] = await Promise.all([
        api.get<Timeseries>(`/api/admin/analytics/timeseries?days=${range}`),
        api.get<Revenue>("/api/admin/analytics/revenue"),
      ]);
      setTs(t);
      setRev(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    }
  }, [range]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (error) return <ErrorBanner message={error} />;
  if (!ts || !rev) return <Spinner />;

  const totals = ts.points.reduce(
    (a, p) => ({
      users: a.users + p.newUsers,
      sessions: a.sessions + p.newSessions,
      completed: a.completed + p.completed,
      coinFlow: a.coinFlow + p.coinFlow,
    }),
    { users: 0, sessions: 0, completed: 0, coinFlow: 0 },
  );

  return (
    <>
      <PageHeader
        title="Analitik & Raporlar"
        subtitle={`Son ${ts.days} günün verisi`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              {RANGE_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    range === r
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {r}g
                </button>
              ))}
            </div>
            <a
              href="/api/admin/exports/users.csv"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Icon name="download" size={14} />
              Kullanıcılar CSV
            </a>
            <a
              href="/api/admin/exports/sessions.csv"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Icon name="download" size={14} />
              Oturumlar CSV
            </a>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Yeni kullanıcı"
          value={totals.users}
          icon="users"
          tone="bg-sky-50 text-sky-600"
        />
        <Stat
          label="Yeni oturum"
          value={totals.sessions}
          icon="sessions"
          tone="bg-amber-50 text-amber-600"
        />
        <Stat
          label="Tamamlanan"
          value={totals.completed}
          icon="check"
          tone="bg-emerald-50 text-emerald-600"
        />
        <Stat
          label="Coin akışı"
          value={totals.coinFlow.toFixed(1)}
          icon="coin"
          tone="bg-indigo-50 text-indigo-600"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Yeni kullanıcı / gün"
          points={ts.points}
          field="newUsers"
          color="#0EA5E9"
        />
        <ChartCard
          title="Yeni oturum / gün"
          points={ts.points}
          field="newSessions"
          color="#F59E0B"
        />
      </div>

      <Card className="mt-4 p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-700">
          SkillCoin Akışı
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <CoinTile label="Harcanan" value={rev.coin.spent} tone="text-red-500" />
          <CoinTile label="Kazanılan" value={rev.coin.earned} tone="text-emerald-600" />
          <CoinTile label="İade" value={rev.coin.refunded} tone="text-amber-600" />
          <CoinTile
            label="Net (kazanılan − harcanan)"
            value={rev.coin.net}
            tone={rev.coin.net >= 0 ? "text-emerald-600" : "text-red-500"}
          />
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Tamamlanan oturumların toplam ücreti:{" "}
          <strong className="text-slate-600">
            {rev.completedSessionCoinSum.toFixed(1)} coin
          </strong>
        </p>
      </Card>

      <Card className="mt-4 p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-700">
          En aktif kategoriler
        </h2>
        {rev.topCategories.length === 0 ? (
          <EmptyState text="Veri yok" />
        ) : (
          <div className="space-y-2.5">
            {rev.topCategories.map((c) => {
              const max =
                Math.max(...rev.topCategories.map((x) => x.sessions), 1);
              return (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs font-medium text-slate-500">
                    {c.label}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${(c.sessions / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-slate-700">
                    {c.sessions}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}

function Stat({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: string;
  tone: string;
}) {
  return (
    <Card className="p-5">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}
      >
        <Icon name={icon} size={20} />
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </Card>
  );
}

function CoinTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-4 py-3">
      <p className={`text-xl font-extrabold ${tone}`}>{value.toFixed(1)}</p>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function ChartCard({
  title,
  points,
  field,
  color,
}: {
  title: string;
  points: Point[];
  field: keyof Pick<Point, "newUsers" | "newSessions" | "completed" | "coinFlow">;
  color: string;
}) {
  const values = points.map((p) => p[field] as number);
  const max = Math.max(...values, 1);
  const W = 600;
  const H = 140;
  const pad = 8;
  const step = points.length > 1 ? (W - pad * 2) / (points.length - 1) : 0;
  const path = values
    .map((v, i) => {
      const x = pad + i * step;
      const y = H - pad - (v / max) * (H - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPath = `${path} L${pad + (points.length - 1) * step},${H - pad} L${pad},${H - pad} Z`;

  return (
    <Card className="p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
        <span className="text-xs text-slate-400">
          en yüksek: <strong className="text-slate-600">{max}</strong>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-36 w-full"
        preserveAspectRatio="none"
      >
        <path d={areaPath} fill={color} fillOpacity={0.1} />
        <path d={path} stroke={color} strokeWidth={2} fill="none" />
        {values.map((v, i) => {
          const x = pad + i * step;
          const y = H - pad - (v / max) * (H - pad * 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.8}
              fill={color}
              opacity={0.7}
            >
              <title>{`${points[i].date}: ${v}`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </Card>
  );
}
