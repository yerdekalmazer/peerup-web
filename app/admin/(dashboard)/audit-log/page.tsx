"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/admin-client";
import Icon from "@/components/admin/Icon";
import {
  Badge,
  Card,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";

type Entry = {
  id: string;
  admin: { id: string; name: string; email: string } | null;
  action: string;
  targetType: string;
  targetId: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

const ACTION_TONE: Record<string, "indigo" | "amber" | "red" | "green" | "slate"> = {
  ban: "red",
  delete: "red",
  unban: "green",
  create: "green",
  refund: "amber",
  cancel: "amber",
  update: "indigo",
  broadcast: "indigo",
};

function actionTone(action: string) {
  for (const key of Object.keys(ACTION_TONE)) {
    if (action.includes(key)) return ACTION_TONE[key];
  }
  return "slate";
}

export default function AuditLogPage() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await api.get<Entry[]>(
        `/api/admin/audit-log${actionFilter ? `?action=${encodeURIComponent(actionFilter)}` : ""}`,
      );
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    }
  }, [actionFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <>
      <PageHeader
        title="Audit Log"
        subtitle="Tüm admin aksiyonlarının kaydı"
      />

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
        <Icon name="search" size={16} className="text-slate-400" />
        <input
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          placeholder="Aksiyon ara (örn. user.ban, session.refund)…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && <ErrorBanner message={error} />}

      {!entries ? (
        <Spinner />
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState text="Kayıt yok" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">Zaman</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Aksiyon</th>
                  <th className="px-4 py-3">Hedef</th>
                  <th className="px-4 py-3">Detay</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-slate-50 last:border-0 align-top hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(e.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-slate-700">
                        {e.admin?.name ?? "—"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {e.admin?.email ?? ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={actionTone(e.action)}>{e.action}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {e.targetType && (
                        <span className="font-semibold">{e.targetType}</span>
                      )}{" "}
                      {e.targetId && (
                        <code className="font-mono">{e.targetId}</code>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {Object.keys(e.payload).length > 0 ? (
                        <code className="block max-w-md overflow-x-auto rounded bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600">
                          {JSON.stringify(e.payload)}
                        </code>
                      ) : (
                        <span className="text-[11px] text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
