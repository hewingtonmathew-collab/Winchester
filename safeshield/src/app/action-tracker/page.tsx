"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ListChecks,
  Loader2,
  ArrowUpRight,
  X,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Report } from "@/lib/supabase";

// ── types ─────────────────────────────────────────────────────────────────────

type ActionStatus = "open" | "in_progress" | "done";

type ActionItem = {
  // stable key derived from report id + category + text
  key: string;
  reportId: string;
  toolName: string;
  toolSlug: string;
  schoolName: string;
  category: string;
  text: string;
  priority: "high" | "medium" | "low";
  reportDate: string;
  status: ActionStatus;
  notes: string;
};

type StoredState = { status: ActionStatus; notes: string };

// Persist action states in localStorage keyed by the action key
const LS_KEY = "safeshield_action_states";

function loadStates(): Record<string, StoredState> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); }
  catch { return {}; }
}
function saveStates(s: Record<string, StoredState>) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ── helpers ───────────────────────────────────────────────────────────────────

function priorityWeight(p: "high" | "medium" | "low") {
  return p === "high" ? 0 : p === "medium" ? 1 : 2;
}

function actionKey(reportId: string, category: string, text: string) {
  return `${reportId}::${category}::${text.slice(0, 60)}`;
}

function PriorityChip({ p }: { p: "high" | "medium" | "low" }) {
  const cfg = {
    high:   { bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)", color: "#F87171", icon: <AlertCircle size={10} /> },
    medium: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)",  color: "#FBBF24", icon: <AlertTriangle size={10} /> },
    low:    { bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)", color: "#94A3B8", icon: <Info size={10} /> },
  }[p];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      {cfg.icon} {p}
    </span>
  );
}

function StatusButton({ status, onChange }: { status: ActionStatus; onChange: (s: ActionStatus) => void }) {
  const next: ActionStatus = status === "open" ? "in_progress" : status === "in_progress" ? "done" : "open";
  const cfg = {
    open:        { label: "Open",        color: "#94A3B8", icon: <Circle size={14} /> },
    in_progress: { label: "In Progress", color: "#FBBF24", icon: <Clock size={14} /> },
    done:        { label: "Done",        color: "#34D399", icon: <CheckCircle2 size={14} /> },
  }[status];
  return (
    <button
      onClick={() => onChange(next)}
      title={`Mark as ${next.replace("_", " ")}`}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all hover:opacity-80"
      style={{ color: cfg.color, borderColor: cfg.color + "44", background: cfg.color + "12" }}>
      {cfg.icon} {cfg.label}
    </button>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function ActionTrackerPage() {
  const router = useRouter();
  const { user, loading, enabledTools, isOrgAdmin } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");

  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [states, setStates] = useState<Record<string, StoredState>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

  // Filters
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | ActionStatus>("all");
  const [filterTool, setFilterTool] = useState("all");
  const [filterSchool, setFilterSchool] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  useEffect(() => { setStates(loadStates()); }, []);

  // Load reports scoped to the user's visibility
  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      setDataLoading(true);
      let query = supabase.from("reports").select("*").order("created_at", { ascending: false });

      if (!isSuperAdmin) {
        const { data: membership } = await supabase
          .from("org_members").select("org_id, school_id, role")
          .eq("user_id", user.id).limit(1).maybeSingle();

        if (!membership) {
          query = query.eq("created_by", user.id);
        } else {
          const m = membership as { org_id: string | null; school_id: string | null; role: string };
          if (m.school_id) {
            query = query.eq("school_id", m.school_id);
          } else if (m.org_id && isOrgAdmin) {
            query = query.eq("org_id", m.org_id);
          } else {
            query = query.eq("created_by", user.id);
          }
        }
      }

      const { data } = await query;
      setReports((data as Report[]) ?? []);
      setDataLoading(false);
    })();
  }, [user, loading, isSuperAdmin, isOrgAdmin]);

  // Derive flat list of action items from all reports
  const allActions = useMemo<ActionItem[]>(() => {
    const items: ActionItem[] = [];
    for (const r of reports) {
      if (!r.recommendations?.length) continue;
      for (const rec of r.recommendations) {
        const key = actionKey(r.id, rec.category, rec.text);
        const stored = states[key] ?? { status: "open" as ActionStatus, notes: "" };
        items.push({
          key,
          reportId: r.id,
          toolName: r.tool_name,
          toolSlug: r.tool_slug,
          schoolName: r.school_name,
          category: rec.category,
          text: rec.text,
          priority: rec.priority,
          reportDate: r.created_at,
          status: stored.status,
          notes: stored.notes,
        });
      }
    }
    // Sort: priority then date
    items.sort((a, b) =>
      priorityWeight(a.priority) - priorityWeight(b.priority) ||
      new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
    );
    return items;
  }, [reports, states]);

  const tools = useMemo(() => [...new Set(allActions.map(a => a.toolName))].sort(), [allActions]);
  const schools = useMemo(() => [...new Set(allActions.map(a => a.schoolName))].sort(), [allActions]);
  const showSchoolFilter = schools.length > 1;

  const filtered = useMemo(() => allActions.filter(a => {
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (filterTool !== "all" && a.toolName !== filterTool) return false;
    if (filterSchool !== "all" && a.schoolName !== filterSchool) return false;
    if (search && !a.text.toLowerCase().includes(search.toLowerCase()) &&
        !a.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [allActions, filterPriority, filterStatus, filterTool, filterSchool, search]);

  const counts = useMemo(() => ({
    open: allActions.filter(a => a.status === "open").length,
    in_progress: allActions.filter(a => a.status === "in_progress").length,
    done: allActions.filter(a => a.status === "done").length,
    high: allActions.filter(a => a.priority === "high" && a.status !== "done").length,
  }), [allActions]);

  const pct = allActions.length ? Math.round((counts.done / allActions.length) * 100) : 0;

  function updateStatus(key: string, status: ActionStatus) {
    setStates(prev => {
      const next = { ...prev, [key]: { ...(prev[key] ?? { notes: "" }), status } };
      saveStates(next);
      return next;
    });
  }

  function updateNotes(key: string, text: string) {
    setNotes(prev => ({ ...prev, [key]: text }));
    setStates(prev => {
      const next = { ...prev, [key]: { ...(prev[key] ?? { status: "open" as ActionStatus }), notes: text } };
      saveStates(next);
      return next;
    });
  }

  if (loading || dataLoading) {
    return (
      <main className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#38BDF8]" size={28} />
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks size={20} className="text-[#38BDF8]" />
            <h1 className="text-2xl font-bold text-white">Action Tracker</h1>
          </div>
          <p className="text-[#64748B] text-sm">
            Track and resolve compliance recommendations from your assessments.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Open",        value: counts.open,        color: "#94A3B8" },
            { label: "In Progress", value: counts.in_progress, color: "#FBBF24" },
            { label: "Done",        value: counts.done,        color: "#34D399" },
            { label: "High Priority", value: counts.high,      color: "#F87171" },
          ].map(c => (
            <GlassCard key={c.label}>
              <p className="text-[#64748B] text-xs mb-1">{c.label}</p>
              <p className="text-2xl font-bold" style={{ color: c.color }}>{c.value}</p>
            </GlassCard>
          ))}
        </div>

        {/* Progress bar */}
        {allActions.length > 0 && (
          <GlassCard className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#CBD5E1] font-medium">Overall Progress</span>
              <span className="text-sm font-bold" style={{ color: pct === 100 ? "#34D399" : "#38BDF8" }}>{pct}% complete</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: pct === 100 ? "#34D399" : "linear-gradient(90deg, #38BDF8, #818CF8)" }}
              />
            </div>
            <p className="text-[#475569] text-xs mt-1.5">{counts.done} of {allActions.length} actions completed</p>
          </GlassCard>
        )}

        {/* Filters */}
        <GlassCard className="mb-5">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={13} className="text-[#475569]" />
            <input
              type="text"
              placeholder="Search actions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg text-sm text-white bg-white/[0.04] border border-white/10 focus:outline-none placeholder:text-[#475569]"
            />
            <Select value={filterStatus} onChange={v => setFilterStatus(v as "all" | ActionStatus)}
              options={[["all","All statuses"],["open","Open"],["in_progress","In Progress"],["done","Done"]]} />
            <Select value={filterPriority} onChange={v => setFilterPriority(v as typeof filterPriority)}
              options={[["all","All priorities"],["high","High"],["medium","Medium"],["low","Low"]]} />
            <Select value={filterTool} onChange={setFilterTool}
              options={[["all","All tools"], ...tools.map(t => [t, t] as [string, string])]} />
            {showSchoolFilter && (
              <Select value={filterSchool} onChange={setFilterSchool}
                options={[["all","All schools"], ...schools.map(s => [s, s] as [string, string])]} />
            )}
            {(filterStatus !== "all" || filterPriority !== "all" || filterTool !== "all" || filterSchool !== "all" || search) && (
              <button onClick={() => { setFilterStatus("all"); setFilterPriority("all"); setFilterTool("all"); setFilterSchool("all"); setSearch(""); }}
                className="flex items-center gap-1 text-xs text-[#64748B] hover:text-white transition-colors">
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </GlassCard>

        {/* Action list */}
        {filtered.length === 0 ? (
          <GlassCard>
            <div className="text-center py-10">
              <CheckCircle2 size={32} className="text-[#34D399] mx-auto mb-3" />
              <p className="text-white font-medium mb-1">
                {allActions.length === 0 ? "No actions yet" : "No actions match your filters"}
              </p>
              <p className="text-[#475569] text-sm">
                {allActions.length === 0
                  ? "Complete an assessment to generate compliance recommendations."
                  : "Try adjusting your filters."}
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(action => {
              const noteVal = notes[action.key] ?? action.notes;
              const noteOpen = expandedNotes[action.key] ?? false;
              return (
                <GlassCard key={action.key}
                  className={action.status === "done" ? "opacity-60" : ""}>
                  <div className="flex items-start gap-3">
                    {/* Status toggle */}
                    <div className="pt-0.5 shrink-0">
                      <StatusButton status={action.status} onChange={s => updateStatus(action.key, s)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <PriorityChip p={action.priority} />
                        <span className="text-[10px] text-[#64748B]">{action.category}</span>
                        <span className="text-[10px] text-[#475569]">·</span>
                        <span className="text-[10px] text-[#64748B]">{action.toolName}</span>
                        {showSchoolFilter && (
                          <>
                            <span className="text-[10px] text-[#475569]">·</span>
                            <span className="text-[10px] text-[#64748B]">{action.schoolName}</span>
                          </>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${action.status === "done" ? "line-through text-[#475569]" : "text-[#CBD5E1]"}`}>
                        {action.text}
                      </p>

                      {/* Notes */}
                      <div className="mt-2">
                        <button
                          onClick={() => setExpandedNotes(prev => ({ ...prev, [action.key]: !prev[action.key] }))}
                          className="text-[10px] text-[#475569] hover:text-[#94A3B8] transition-colors flex items-center gap-0.5">
                          <ChevronDown size={10} className={`transition-transform ${noteOpen ? "rotate-180" : ""}`} />
                          {noteVal ? "Edit notes" : "Add notes"}
                        </button>
                        {noteOpen && (
                          <textarea
                            rows={2}
                            value={noteVal}
                            onChange={e => updateNotes(action.key, e.target.value)}
                            placeholder="Add your notes here…"
                            className="mt-1 w-full px-3 py-2 rounded-lg text-xs text-white bg-white/[0.04] border border-white/10 focus:outline-none resize-none placeholder:text-[#475569]"
                          />
                        )}
                        {noteVal && !noteOpen && (
                          <p className="text-[10px] text-[#475569] mt-1 italic truncate">{noteVal}</p>
                        )}
                      </div>
                    </div>

                    {/* Report link */}
                    <a
                      href={`/tools/${action.toolSlug}`}
                      title="Open tool"
                      className="shrink-0 mt-0.5 text-[#475569] hover:text-[#38BDF8] transition-colors">
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        <p className="text-[#334155] text-xs text-center mt-6">
          {filtered.length} action{filtered.length !== 1 ? "s" : ""} shown
          {allActions.length !== filtered.length ? ` · ${allActions.length} total` : ""}
        </p>
      </div>
    </main>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="px-2.5 py-1.5 rounded-lg text-xs text-white bg-white/[0.04] border border-white/10 focus:outline-none appearance-none"
      style={{ backgroundImage: "none" }}>
      {options.map(([v, l]) => (
        <option key={v} value={v} style={{ background: "#0f172a" }}>{l}</option>
      ))}
    </select>
  );
}
