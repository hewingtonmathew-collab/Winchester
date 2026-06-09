"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import { AlertTriangle, CheckCircle2, Clock, FileText, TrendingUp } from "lucide-react";

const SUITE_TOOLS = [
  { slug: "screen-use",          name: "Screen Use & Wellbeing",         color: "#06B6D4" },
  { slug: "ai-risk",             name: "AI Use Risk Assessment",         color: "#F59E0B" },
  { slug: "send-digital",        name: "SEND Digital Impact",            color: "#8B5CF6" },
  { slug: "filtering-monitoring",name: "Filtering & Monitoring",         color: "#EF4444" },
  { slug: "data-privacy",        name: "Data Protection & AI Privacy",   color: "#3B82F6" },
];

const ALL_SUITE_SLUGS = SUITE_TOOLS.map(t => t.slug);

type ReportRow = {
  id: string;
  tool_slug: string;
  tool_name: string;
  school_name: string;
  score: number;
  rating: string;
  rating_color: string;
  created_at: string;
  areas: { name: string; score?: number }[] | null;
};

export default function GovernorDashboard() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "suite" | "core">("all");

  useEffect(() => {
    async function load() {
      const { data: membership } = await supabase
        .from("org_members")
        .select("org_id, school_id")
        .eq("user_id", profile?.id ?? "")
        .maybeSingle();

      let query = supabase
        .from("reports")
        .select("id, tool_slug, tool_name, school_name, score, rating, rating_color, created_at, areas")
        .order("created_at", { ascending: false });

      if (membership?.org_id) query = query.eq("org_id", membership.org_id);

      const { data } = await query;
      setReports(data ?? []);
      setLoading(false);
    }
    if (profile) load();
  }, [profile]);

  const filtered = reports.filter(r =>
    filter === "all"   ? true :
    filter === "suite" ? ALL_SUITE_SLUGS.includes(r.tool_slug) :
                         !ALL_SUITE_SLUGS.includes(r.tool_slug)
  );

  const highRisk  = reports.filter(r => r.score < 50).length;
  const medRisk   = reports.filter(r => r.score >= 50 && r.score < 75).length;
  const lowRisk   = reports.filter(r => r.score >= 75).length;
  const suiteReports = reports.filter(r => ALL_SUITE_SLUGS.includes(r.tool_slug));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Assessments", value: reports.length, color: "#10B981", icon: FileText },
          { label: "High Risk",         value: highRisk,        color: "#EF4444", icon: AlertTriangle },
          { label: "In Progress",       value: medRisk,         color: "#F59E0B", icon: Clock },
          { label: "Assured",           value: lowRisk,         color: "#22c55e", icon: CheckCircle2 },
        ].map(({ label, value, color, icon: Icon }) => (
          <GlassCard key={label} className="text-center">
            <Icon size={20} className="mx-auto mb-2" style={{ color }} />
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Suite Module Status */}
      <GlassCard>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-white">Digital Safety Suite — Module Status</h2>
        <div className="flex flex-col gap-3">
          {SUITE_TOOLS.map(tool => {
            const latest = suiteReports
              .filter(r => r.tool_slug === tool.slug)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
            return (
              <div
                key={tool.slug}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ background: tool.color }} />
                  <span className="text-sm text-white">{tool.name}</span>
                </div>
                {latest ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold" style={{ color: latest.rating_color }}>
                      {latest.score}% — {latest.rating}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                      {new Date(latest.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                ) : (
                  <span
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                  >
                    Not Assessed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Recent Reports Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">Recent Assessments</h2>
          <div className="flex gap-2">
            {(["all", "suite", "core"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filter === f ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${filter === f ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: filter === f ? "#10B981" : "var(--text-muted)",
                }}
              >
                {f === "all" ? "All" : f === "suite" ? "Suite" : "Core Tools"}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-sm py-8" style={{ color: "var(--text-faint)" }}>No assessments found.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {filtered.slice(0, 10).map(r => (
              <div key={r.id} className="flex items-center justify-between py-3 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-white">{r.tool_name}</span>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                    {r.school_name} · {new Date(r.created_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: r.rating_color }}>{r.score}%</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-lg"
                    style={{ background: `${r.rating_color}18`, color: r.rating_color }}
                  >
                    {r.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Governor Notes */}
      <GlassCard>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 text-white">Governor Monitoring Notes</h2>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          Record challenge questions, monitoring observations or scrutiny notes for the board.
        </p>
        <textarea
          rows={4}
          placeholder="Enter governor challenge questions or monitoring observations here..."
          className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-[#475569] outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <button
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}
        >
          <TrendingUp size={12} /> Save Notes
        </button>
      </GlassCard>
    </div>
  );
}
