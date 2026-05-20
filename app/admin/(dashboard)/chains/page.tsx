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

type ChainNode = {
  id?: string;
  name: string;
  shortName: string;
  avatar: string;
  avatarColor: string;
  role: string;
  sessions: number;
  rating: number;
  isOnline: boolean;
  joinedDate: string | null;
  mockId: string | null;
  parentMockId: string | null;
  position: number;
};
type Chain = {
  id: string;
  skill: string;
  category: string;
  color: string;
  gradient: string[];
  icon: string;
  depth: number;
  totalReach: number;
  nodes: ChainNode[];
};

const ROLE_LABEL: Record<string, string> = {
  root: "Kök Mentor",
  grandmentor: "Üst Mentor",
  mentor: "Mentor",
  you: "Kullanıcı",
  student: "Öğrenci",
  grandstudent: "Alt Öğrenci",
};
const ROLES = Object.keys(ROLE_LABEL);

const emptyMeta = {
  skill: "",
  category: "Programlama",
  color: "#6366F1",
  icon: "git-network-outline",
  depth: 1,
  totalReach: 0,
};

function newNode(pos: number): ChainNode {
  return {
    name: "",
    shortName: "",
    avatar: "",
    avatarColor: "#6366F1",
    role: "student",
    sessions: 0,
    rating: 0,
    isOnline: false,
    joinedDate: null,
    mockId: null,
    parentMockId: null,
    position: pos,
  };
}

export default function ChainsPage() {
  const [chains, setChains] = useState<Chain[] | null>(null);
  const [error, setError] = useState("");

  // meta modal
  const [metaOpen, setMetaOpen] = useState(false);
  const [editingChain, setEditingChain] = useState<Chain | null>(null);
  const [meta, setMeta] = useState(emptyMeta);

  // node modal
  const [nodesOpen, setNodesOpen] = useState(false);
  const [nodeChain, setNodeChain] = useState<Chain | null>(null);
  const [nodes, setNodes] = useState<ChainNode[]>([]);

  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setChains(await api.get<Chain[]>("/api/admin/chains"));
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  function openCreate() {
    setEditingChain(null);
    setMeta(emptyMeta);
    setError("");
    setMetaOpen(true);
  }

  function openMeta(c: Chain) {
    setEditingChain(c);
    setMeta({
      skill: c.skill,
      category: c.category,
      color: c.color,
      icon: c.icon,
      depth: c.depth,
      totalReach: c.totalReach,
    });
    setError("");
    setMetaOpen(true);
  }

  async function saveMeta(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...meta, gradient: [meta.color, "#7C3AED"] };
    try {
      if (editingChain) {
        await api.put(`/api/admin/chains/${editingChain.id}`, payload);
      } else {
        await api.post("/api/admin/chains", payload);
      }
      setMetaOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function removeChain(c: Chain) {
    if (!confirm(`"${c.skill}" zinciri silinsin mi?`)) return;
    try {
      await api.del(`/api/admin/chains/${c.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  function openNodes(c: Chain) {
    setNodeChain(c);
    setNodes(c.nodes.map((n) => ({ ...n })));
    setError("");
    setNodesOpen(true);
  }

  function updateNode(i: number, patch: Partial<ChainNode>) {
    setNodes((prev) =>
      prev.map((n, idx) => (idx === i ? { ...n, ...patch } : n)),
    );
  }

  async function saveNodes() {
    if (!nodeChain) return;
    setSaving(true);
    setError("");
    try {
      await api.put(`/api/admin/chains/${nodeChain.id}`, {
        nodes: nodes.map((n, i) => ({ ...n, position: i })),
      });
      setNodesOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Mentor Zincirleri"
        subtitle={`${chains?.length ?? 0} zincir`}
        action={
          <Button onClick={openCreate}>
            <Icon name="plus" size={16} />
            Yeni Zincir
          </Button>
        }
      />

      {error && !metaOpen && !nodesOpen && <ErrorBanner message={error} />}

      {!chains ? (
        <Spinner />
      ) : chains.length === 0 ? (
        <Card>
          <EmptyState text="Zincir bulunamadı" />
        </Card>
      ) : (
        <div className="space-y-4">
          {chains.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{ background: c.color }}
                  >
                    <Icon name="chains" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{c.skill}</p>
                    <p className="text-xs text-slate-400">{c.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="indigo">Derinlik {c.depth}</Badge>
                  <Badge tone="blue">{c.totalReach} erişim</Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openNodes(c)}
                  >
                    Düğümler ({c.nodes.length})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openMeta(c)}
                  >
                    <Icon name="edit" size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeChain(c)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Icon name="trash" size={15} />
                  </Button>
                </div>
              </div>

              {c.nodes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {[...c.nodes]
                    .sort((a, b) => a.position - b.position)
                    .map((n) => (
                      <div
                        key={n.id ?? n.mockId ?? n.name}
                        className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5"
                      >
                        <Avatar
                          text={n.avatar}
                          color={n.avatarColor}
                          size={26}
                        />
                        <div className="leading-tight">
                          <p className="text-xs font-semibold text-slate-700">
                            {n.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {ROLE_LABEL[n.role] ?? n.role}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Meta modal */}
      <Modal
        open={metaOpen}
        onClose={() => setMetaOpen(false)}
        title={editingChain ? "Zinciri Düzenle" : "Yeni Zincir"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMetaOpen(false)}>
              İptal
            </Button>
            <Button type="submit" form="chain-form" disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </>
        }
      >
        <form id="chain-form" onSubmit={saveMeta} className="grid gap-4 sm:grid-cols-2">
          <Field label="Beceri">
            <Input
              required
              value={meta.skill}
              onChange={(e) => setMeta({ ...meta, skill: e.target.value })}
            />
          </Field>
          <Field label="Kategori">
            <Input
              required
              value={meta.category}
              onChange={(e) => setMeta({ ...meta, category: e.target.value })}
            />
          </Field>
          <Field label="Renk">
            <input
              type="color"
              value={meta.color}
              onChange={(e) => setMeta({ ...meta, color: e.target.value })}
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200"
            />
          </Field>
          <Field label="İkon" hint="Ionicons adı">
            <Input
              value={meta.icon}
              onChange={(e) => setMeta({ ...meta, icon: e.target.value })}
            />
          </Field>
          <Field label="Derinlik">
            <Input
              type="number"
              value={meta.depth}
              onChange={(e) =>
                setMeta({ ...meta, depth: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Toplam erişim">
            <Input
              type="number"
              value={meta.totalReach}
              onChange={(e) =>
                setMeta({ ...meta, totalReach: Number(e.target.value) })
              }
            />
          </Field>
          {error && (
            <div className="sm:col-span-2">
              <ErrorBanner message={error} />
            </div>
          )}
        </form>
      </Modal>

      {/* Düğüm yönetimi modal */}
      <Modal
        open={nodesOpen}
        onClose={() => setNodesOpen(false)}
        title={`Düğümler — ${nodeChain?.skill ?? ""}`}
        wide
        footer={
          <>
            <Button variant="secondary" onClick={() => setNodesOpen(false)}>
              İptal
            </Button>
            <Button onClick={saveNodes} disabled={saving}>
              {saving ? "Kaydediliyor…" : "Düğümleri Kaydet"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Ağaç ilişkisi için <b>Kod</b> (mockId) ve <b>Üst kod</b>
            (parentMockId) alanlarını kullanın. Kök düğümün üst kodu boş kalır.
          </p>
          {nodes.map((n, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-4"
            >
              <Input
                placeholder="Ad Soyad"
                value={n.name}
                onChange={(e) => updateNode(i, { name: e.target.value })}
              />
              <Input
                placeholder="Avatar (kısaltma)"
                value={n.avatar}
                maxLength={3}
                onChange={(e) =>
                  updateNode(i, {
                    avatar: e.target.value,
                    shortName: e.target.value,
                  })
                }
              />
              <Select
                value={n.role}
                onChange={(e) => updateNode(i, { role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </Select>
              <input
                type="color"
                value={n.avatarColor}
                onChange={(e) =>
                  updateNode(i, { avatarColor: e.target.value })
                }
                className="h-9 w-full cursor-pointer rounded-lg border border-slate-200"
              />
              <Input
                type="number"
                placeholder="Oturum"
                value={n.sessions}
                onChange={(e) =>
                  updateNode(i, { sessions: Number(e.target.value) })
                }
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Puan"
                value={n.rating}
                onChange={(e) =>
                  updateNode(i, { rating: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Kod (mockId)"
                value={n.mockId ?? ""}
                onChange={(e) =>
                  updateNode(i, { mockId: e.target.value || null })
                }
              />
              <Input
                placeholder="Üst kod"
                value={n.parentMockId ?? ""}
                onChange={(e) =>
                  updateNode(i, { parentMockId: e.target.value || null })
                }
              />
              <div className="flex items-center justify-between sm:col-span-4">
                <label className="flex items-center gap-2 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={n.isOnline}
                    onChange={(e) =>
                      updateNode(i, { isOnline: e.target.checked })
                    }
                  />
                  Çevrimiçi
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setNodes((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Icon name="trash" size={14} />
                  Sil
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setNodes((prev) => [...prev, newNode(prev.length)])
            }
          >
            <Icon name="plus" size={15} />
            Düğüm Ekle
          </Button>
          {error && <ErrorBanner message={error} />}
        </div>
      </Modal>
    </>
  );
}
