"use client";
import { useState, useEffect } from "react";
import {
  FileText, AlertCircle, AlertTriangle, CheckCircle2, Info,
  Clock, ChevronDown, ChevronUp, Download, Loader2, RefreshCw,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { supabase, type PolicyRegisterEntry } from "@/lib/supabase";

const STATUS_CONFIG = {
  compliant:     { color: "#34D399", label: "Compliant",     Icon: CheckCircle2 },
  needs_update:  { color: "#EAB308", label: "Needs Update",  Icon: AlertTriangle },
  non_compliant: { color: "#EF4444", label: "Non-Compliant", Icon: AlertCircle },
};

const SEVERITY_COLORS = {
  critical: "#EF4444", high: "#F97316", medium: "#EAB308", low: "#38BDF8",
};

const POLICY_TYPE_LABELS: Record<string, string> = {
  data_protection: "Data Protection", online_safety: "Online Safety", ict_aup: "ICT / AUP",
  filtering_monitoring: "Filtering & Monitoring", ai: "AI Policy", cctv: "CCTV",
  photos: "Photographs", foi: "Freedom of Information", privacy_notice: "Privacy Notice", other: "Other",
};

function ReviewDueBadge({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) return null;
  const due = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const overdue = diffDays < 0;
  const soon = diffDays >= 0 && diffDays <= 30;
  const color = overdue ? "#EF4444" : soon ? "#EAB308" : "#34D399";
  return (
    <span
      className="flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
      style={{ color, background: `${color}12`, borderColor: `${color}30` }}
    >
      <Clock size={9} />
      {overdue ? "Overdue" : soon ? "Due soon" : `Due ${due.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
    </span>
  );
}

function EntryRow({ entry }: { entry: PolicyRegisterEntry }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_CONFIG[entry.overall_status];
  const StatusIcon = status.Icon;
  const profile = entry.school_profile as { name?: string };

  function handleDownload() {
    if (!entry.revised_policy) return;
    const blob = new Blob([entry.revised_policy], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entry.policy_title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_revised.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all"
      style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)" }}
    >
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <StatusIcon size={16} style={{ color: status.color, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
            {entry.policy_title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {POLICY_TYPE_LABELS[entry.policy_type] ?? entry.policy_type}
            {profile.name ? ` · ${profile.name}` : ""}
            {" · "}{new Date(entry.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>

        {/* Severity pills */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          {(["critical", "high", "medium", "low"] as const).map(s =>
            entry.stats[s] > 0 ? (
              <span
                key={s}
                className="text-[0.58rem] font-black px-1.5 py-0.5 rounded"
                style={{ background: `${SEVERITY_COLORS[s]}18`, color: SEVERITY_COLORS[s] }}
              >
                {entry.stats[s]} {s}
              </span>
            ) : null
          )}
        </div>

        <ReviewDueBadge dateStr={entry.review_due_at} />

        <span
          className="text-[0.58rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0"
          style={{ color: status.color, background: `${status.color}12`, borderColor: `${status.color}30` }}
        >
          {status.label}
        </span>

        {open
          ? <ChevronUp size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
      </button>

      {open && (
        <div className="px-4 pb-4 border-t flex flex-col gap-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {/* Summary */}
          {entry.summary && (
            <p className="text-xs leading-relaxed pt-3" style={{ color: "var(--text-muted)" }}>{entry.summary}</p>
          )}

          {/* Findings summary */}
          {(entry.findings as object[]).length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Findings ({(entry.findings as object[]).length})
              </p>
              <div className="flex flex-col gap-1.5">
                {(entry.findings as { id: string; category: string; severity: string; location: string; issue: string }[]).map(f => (
                  <div
                    key={f.id}
                    className="flex items-start gap-2 rounded-lg px-3 py-2"
                    style={{
                      background: `${SEVERITY_COLORS[f.severity as keyof typeof SEVERITY_COLORS] ?? "#64748B"}0d`,
                      border: `1px solid ${SEVERITY_COLORS[f.severity as keyof typeof SEVERITY_COLORS] ?? "#64748B"}20`,
                    }}
                  >
                    <Info size={12} style={{ color: SEVERITY_COLORS[f.severity as keyof typeof SEVERITY_COLORS] ?? "#64748B", marginTop: 1, flexShrink: 0 }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                        [{f.id}] {f.category.replace(/_/g, " ")}
                        <span className="ml-1 font-normal" style={{ color: "var(--text-muted)" }}>— {f.location}</span>
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{f.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {entry.revised_policy && (
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "#34D399", color: "#000" }}
              >
                <Download size={12} /> Download revised policy
              </button>
            )}
            {entry.ref_doc_ids.length > 0 && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Grounded against {entry.ref_doc_ids.length} reference doc{entry.ref_doc_ids.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  onNewAnalysis?: () => void;
}

export default function PolicyRegister({ onNewAnalysis }: Props) {
  const [entries, setEntries] = useState<PolicyRegisterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "compliant" | "needs_update" | "non_compliant">("all");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("policy_register")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? entries : entries.filter(e => e.overall_status === filter);

  const counts = {
    all: entries.length,
    compliant: entries.filter(e => e.overall_status === "compliant").length,
    needs_update: entries.filter(e => e.overall_status === "needs_update").length,
    non_compliant: entries.filter(e => e.overall_status === "non_compliant").length,
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["all", "compliant", "needs_update", "non_compliant"] as const).map(s => {
          const cfg = s === "all"
            ? { color: "#A78BFA", label: "All" }
            : STATUS_CONFIG[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className="rounded-xl p-3 text-center border transition-all"
              style={{
                background: filter === s ? `${cfg.color}15` : "rgba(255,255,255,0.02)",
                borderColor: filter === s ? `${cfg.color}40` : "rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-xl font-black" style={{ color: cfg.color }}>{counts[s]}</p>
              <p className="text-[0.6rem] font-black uppercase tracking-widest mt-0.5" style={{ color: cfg.color }}>
                {s === "all" ? "Total" : s.replace("_", " ")}
              </p>
            </button>
          );
        })}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Policy Register {filter !== "all" && `— ${STATUS_CONFIG[filter].label}`}
        </h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={load} className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
            <RefreshCw size={13} style={{ color: "var(--text-muted)" }} />
          </button>
          {onNewAnalysis && (
            <button
              type="button"
              onClick={onNewAnalysis}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
              style={{ background: "#A78BFA", color: "#000" }}
            >
              <FileText size={12} /> New Analysis
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={22} className="animate-spin" style={{ color: "#A78BFA" }} />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <FileText size={28} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {entries.length === 0 ? "No policies analysed yet" : "No policies match this filter"}
            </p>
            {entries.length === 0 && onNewAnalysis && (
              <button
                type="button"
                onClick={onNewAnalysis}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold mt-1"
                style={{ background: "#A78BFA", color: "#000" }}
              >
                Analyse your first policy
              </button>
            )}
          </div>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(entry => <EntryRow key={entry.id} entry={entry} />)}
        </div>
      )}
    </div>
  );
}
