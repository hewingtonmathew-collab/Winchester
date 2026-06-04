"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSubmissions, deleteSubmission, type Submission } from "@/lib/submissions";
import { Trash2, Mail, ShieldCheck, LayoutDashboard, ChevronDown, ChevronUp, Users, CheckCircle2, XCircle, Loader2, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase, ALL_TOOLS, type Profile } from "@/lib/supabase";

const TOOL_COLORS: Record<string, string> = {
  "Safeguarding Risk Checker": "#34D399",
  "Governance Compliance Checker": "#A78BFA",
  "AI Readiness Assessment": "#FB923C",
  "DPIA Wizard": "#FCD34D",
  "Web Accessibility Checker": "#F472B6",
  "Ofsted Ready Checker": "#4ADE80",
  "AI Content Detector": "#38BDF8",
  "Digital Standards Checker": "#818CF8",
  "Health & Safety Checker": "#F97316",
};

// ── Assessments tab ──────────────────────────────────────────────────────────

function ScoreBadge({ score, color }: { score: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
      style={{ color, background: `${color}15`, borderColor: `${color}40` }}>
      {score}%
    </span>
  );
}

function sendCertificateEmail(s: Submission) {
  const subject = encodeURIComponent(`${s.tool} Certificate — ${s.schoolName}`);
  const date = new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const body = encodeURIComponent(
    `Dear ${s.schoolName},\n\nPlease find below your ${s.tool} certificate completed on ${date}.\n\nAssessment Summary:\n• Score: ${s.score}%\n• Rating: ${s.rating}\n• Staff Member: ${s.staffMember}\n• Consultant: ${s.consultantName}\n\nKind regards,\n${s.consultantName}\nSafeShield`
  );
  window.location.href = `mailto:${s.schoolEmail}?subject=${subject}&body=${body}`;
}

function GroupedBySchool({ submissions, onDelete }: { submissions: Submission[]; onDelete: (id: string) => void }) {
  const schools = [...new Set(submissions.map((s) => s.schoolName))];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  return (
    <div className="flex flex-col gap-4">
      {schools.map((school) => {
        const schoolSubs = submissions.filter((s) => s.schoolName === school);
        const isOpen = expanded[school] !== false;
        return (
          <GlassCard key={school}>
            <button className="w-full flex items-center justify-between" onClick={() => setExpanded((p) => ({ ...p, [school]: !isOpen }))}>
              <div className="flex items-center gap-3">
                {schoolSubs[0]?.logoDataUrl ? (
                  <img src={schoolSubs[0].logoDataUrl} alt="" className="h-8 w-8 object-contain rounded bg-white/10 p-0.5" />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <ShieldCheck size={14} className="text-[#38BDF8]" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{school}</p>
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>{schoolSubs.length} assessment{schoolSubs.length !== 1 ? "s" : ""} · {schoolSubs[0]?.consultantName}</p>
                </div>
              </div>
              {isOpen ? <ChevronUp size={14} style={{ color: "var(--text-dim)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-dim)" }} />}
            </button>
            {isOpen && (
              <div className="mt-4 flex flex-col gap-2.5">
                {schoolSubs.map((s) => {
                  const color = TOOL_COLORS[s.tool] ?? "#38BDF8";
                  const date = new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                  return (
                    <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: color }} />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>{s.tool}</p>
                          <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>{date} · {s.staffMember}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <ScoreBadge score={s.score} color={color} />
                        {s.schoolEmail && (
                          <button onClick={() => sendCertificateEmail(s)} className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all" title="Send certificate">
                            <Mail size={12} className="text-[#38BDF8]" />
                          </button>
                        )}
                        <button onClick={() => onDelete(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all" title="Delete">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}

// ── Users tab ────────────────────────────────────────────────────────────────

type UserWithTools = Profile & { tools: Record<string, boolean> };

function UserCard({ u, onStatusChange, onToolToggle }: {
  u: UserWithTools;
  onStatusChange: (id: string, status: "active" | "suspended" | "pending") => Promise<void>;
  onToolToggle: (userId: string, slug: string, enabled: boolean) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const statusColor = u.status === "active" ? "#22c55e" : u.status === "pending" ? "#f59e0b" : "#ef4444";
  const statusLabel = u.status === "active" ? "Active" : u.status === "pending" ? "Pending" : "Suspended";

  async function changeStatus(status: "active" | "suspended" | "pending") {
    setBusy(true);
    await onStatusChange(u.id, status);
    setBusy(false);
  }

  async function toggleTool(slug: string) {
    const current = u.tools[slug] ?? false;
    await onToolToggle(u.id, slug, !current);
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-[#94A3B8]">{(u.full_name ?? u.email)[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{u.full_name ?? "—"}</p>
            <p className="text-xs text-[#64748B] truncate">{u.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium border"
            style={{ color: statusColor, background: `${statusColor}15`, borderColor: `${statusColor}40` }}>
            {statusLabel}
          </span>

          {busy ? (
            <Loader2 size={14} className="animate-spin text-[#475569]" />
          ) : (
            <>
              {u.status !== "active" && (
                <button onClick={() => changeStatus("active")} title="Approve"
                  className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-green-500/10 transition-all">
                  <CheckCircle2 size={13} className="text-green-400" />
                </button>
              )}
              {u.status !== "suspended" && (
                <button onClick={() => changeStatus("suspended")} title="Suspend"
                  className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all">
                  <XCircle size={13} className="text-red-400" />
                </button>
              )}
            </>
          )}

          <button onClick={() => setOpen(!open)}
            className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all">
            {open ? <ChevronUp size={13} className="text-[#64748B]" /> : <ChevronDown size={13} className="text-[#64748B]" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-3">Tool Access</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ALL_TOOLS.map((tool) => {
              const enabled = u.tools[tool.slug] ?? false;
              return (
                <button key={tool.slug} onClick={() => toggleTool(tool.slug)}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10">
                  <span className="text-xs text-[#94A3B8] text-left">{tool.name}</span>
                  {enabled
                    ? <ToggleRight size={20} className="shrink-0" style={{ color: TOOL_COLORS[tool.name] ?? "#38BDF8" }} />
                    : <ToggleLeft size={20} className="text-[#334155] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ── Main admin page ──────────────────────────────────────────────────────────

type Tab = "assessments" | "users";

export default function AdminPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("assessments");

  // Assessments state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [view, setView] = useState<"schools" | "all">("schools");

  // Users state
  const [users, setUsers] = useState<UserWithTools[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (!loading && profile?.role !== "admin") router.replace("/");
  }, [loading, profile, router]);

  useEffect(() => {
    if (profile?.role === "admin") setSubmissions(getSubmissions());
  }, [profile]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*").neq("role", "admin").order("created_at", { ascending: false });
    const { data: toolRows } = await supabase.from("user_tools").select("user_id, tool_slug, enabled");

    const toolMap: Record<string, Record<string, boolean>> = {};
    for (const row of toolRows ?? []) {
      if (!toolMap[row.user_id]) toolMap[row.user_id] = {};
      toolMap[row.user_id][row.tool_slug] = row.enabled;
    }

    setUsers((profiles ?? []).map((p: Profile) => ({ ...p, tools: toolMap[p.id] ?? {} })));
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "users" && profile?.role === "admin") loadUsers();
  }, [tab, profile, loadUsers]);

  async function handleStatusChange(userId: string, status: "active" | "suspended" | "pending") {
    await supabase.from("profiles").update({ status }).eq("id", userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u));
  }

  async function handleToolToggle(userId: string, slug: string, enabled: boolean) {
    await supabase.from("user_tools").upsert({ user_id: userId, tool_slug: slug, enabled }, { onConflict: "user_id,tool_slug" });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, tools: { ...u.tools, [slug]: enabled } } : u));
  }

  function handleDelete(id: string) {
    deleteSubmission(id);
    setSubmissions(getSubmissions());
  }

  if (loading || profile?.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 size={24} className="animate-spin text-[#38BDF8]" /></div>;
  }

  const schools = [...new Set(submissions.map((s) => s.schoolName))];
  const toolCounts = submissions.reduce<Record<string, number>>((acc, s) => { acc[s.tool] = (acc[s.tool] ?? 0) + 1; return acc; }, {});
  const pendingCount = users.filter(u => u.status === "pending").length;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="pt-10 pb-8 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
            <LayoutDashboard size={22} className="text-[#38BDF8]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[#38BDF8] text-xs font-medium uppercase tracking-widest mb-1">Admin</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Admin Panel</h1>
            <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Manage users, control tool access, and view assessment results.
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab("assessments")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${tab === "assessments" ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "glass border-transparent text-[#64748B] hover:text-white"}`}>
            <ShieldCheck size={14} /> Assessments
          </button>
          <button onClick={() => setTab("users")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${tab === "users" ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "glass border-transparent text-[#64748B] hover:text-white"}`}>
            <Users size={14} /> Users
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[0.6rem] font-bold flex items-center justify-center">{pendingCount}</span>
            )}
          </button>
        </div>

        {/* ── Assessments tab ── */}
        {tab === "assessments" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Schools", value: schools.length },
                { label: "Assessments", value: submissions.length },
                { label: "Avg Score", value: submissions.length ? `${Math.round(submissions.reduce((s, x) => s + x.score, 0) / submissions.length)}%` : "—" },
                { label: "Tools Used", value: Object.keys(toolCounts).length },
              ].map((stat) => (
                <GlassCard key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-[#38BDF8]">{stat.value}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{stat.label}</p>
                </GlassCard>
              ))}
            </div>

            {submissions.length === 0 ? (
              <GlassCard className="text-center py-16">
                <ShieldCheck size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
                <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No assessments yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Completed assessments from any tool will appear here.</p>
              </GlassCard>
            ) : (
              <>
                <div className="flex gap-2 mb-5">
                  {(["schools", "all"] as const).map((v) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all border ${view === v ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "glass border-transparent"}`}
                      style={{ color: view === v ? "#38BDF8" : "var(--text-dim)" }}>
                      {v === "schools" ? "By School" : "All Submissions"}
                    </button>
                  ))}
                </div>
                {view === "schools" ? (
                  <GroupedBySchool submissions={submissions} onDelete={handleDelete} />
                ) : (
                  <div className="flex flex-col gap-3">
                    {submissions.map((s) => {
                      const color = TOOL_COLORS[s.tool] ?? "#38BDF8";
                      const date = new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                      return (
                        <GlassCard key={s.id} className="flex items-center gap-4">
                          {s.logoDataUrl ? (
                            <img src={s.logoDataUrl} alt="" className="h-10 w-10 object-contain rounded bg-white/10 p-0.5 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{s.schoolName}</p>
                            <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{s.tool} · {date} · {s.staffMember}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <ScoreBadge score={s.score} color={color} />
                            {s.schoolEmail && (
                              <button onClick={() => sendCertificateEmail(s)} className="w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all">
                                <Mail size={14} className="text-[#38BDF8]" />
                              </button>
                            )}
                            <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all">
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            <p className="text-xs mt-8 text-center" style={{ color: "var(--text-faint)" }}>
              Assessment records are stored locally in your browser.
            </p>
          </>
        )}

        {/* ── Users tab ── */}
        {tab === "users" && (
          <>
            {usersLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[#38BDF8]" />
              </div>
            ) : users.length === 0 ? (
              <GlassCard className="text-center py-16">
                <Users size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
                <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No users yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>When users register they will appear here for approval.</p>
              </GlassCard>
            ) : (
              <>
                {pendingCount > 0 && (
                  <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5">
                    <AlertCircle size={14} className="text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-400">{pendingCount} user{pendingCount !== 1 ? "s" : ""} waiting for approval</p>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {users.map((u) => (
                    <UserCard key={u.id} u={u} onStatusChange={handleStatusChange} onToolToggle={handleToolToggle} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}
