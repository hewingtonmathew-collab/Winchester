"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import { BarChart3, ShieldCheck, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

const SUITE_TOOLS = [
  { slug: "screen-use", name: "Screen Use & Wellbeing" },
  { slug: "ai-risk", name: "AI Use Risk" },
  { slug: "send-digital", name: "SEND Digital Impact" },
  { slug: "filtering-monitoring", name: "Filtering & Monitoring" },
  { slug: "data-privacy", name: "Data Protection & AI Privacy" },
];

const CORE_TOOLS = [
  { slug: "safeguarding", name: "Safeguarding" },
  { slug: "governance", name: "Governance" },
  { slug: "ai-readiness", name: "AI Readiness" },
  { slug: "dpia", name: "DPIA" },
  { slug: "accessibility", name: "Web Accessibility" },
  { slug: "ofsted", name: "Ofsted Ready" },
  { slug: "ai-detector", name: "AI Content Detector" },
  { slug: "digital-standards", name: "Digital Standards" },
  { slug: "health-safety", name: "Health & Safety" },
];

type ReportRow = {
  id: string;
  tool_slug: string;
  tool_name: string;
  school_name: string;
  score: number;
  rating: string;
  rating_color: string;
  created_at: string;
};

export default function GovernorDashboard() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "suite" | "core">("all");
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Get user's org membership
      const { data: member } = await supabase
        .from("org_members")
        .select("org_id, school_id")
        .eq("user_id", user.id)
        .maybeSingle();

      let query = supabase.from("reports").select("id, tool_slug, tool_name, school_name, score, rating, rating_color, created_at").order("created_at", { ascending: false }).limit(50);

      // Filter to the user's specific school first; fall back to org only if no school assigned
      if (member?.school_id) query = query.eq("school_id", member.school_id);
      else if (member?.org_id) query = query.eq("org_id", member.org_id);

      const { data } = await query;
      setReports(data ?? []);
      setLoading(false);

      // Load saved notes
      const saved = localStorage.getItem("governor_dashboard_notes");
      if (saved) setNotes(saved);
    }
    load();
  }, []);

  function saveNotes() {
    localStorage.setItem("governor_dashboard_notes", notes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const allTools = [...SUITE_TOOLS, ...CORE_TOOLS];
  const latestByTool = allTools.reduce<Record<string, ReportRow>>((acc, t) => {
    const r = reports.find(rep => rep.tool_slug === t.slug);
    if (r) acc[t.slug] = r;
    return acc;
  }, {});

  const assessed = Object.values(latestByTool);
  const highRisk = assessed.filter(r => r.score < 50).length;
  const assured = assessed.filter(r => r.score >= 75).length;

  const filteredReports = reports.filter(r => {
    if (filter === "suite") return SUITE_TOOLS.some(t => t.slug === r.tool_slug);
    if (filter === "core") return CORE_TOOLS.some(t => t.slug === r.tool_slug);
    return true;
  });

  if (loading) return <div className="text-[#64748B] text-sm p-8">Loading dashboard…</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Assessments", value: assessed.length, icon: BarChart3, color: "#10B981" },
          { label: "High Risk", value: highRisk, icon: AlertTriangle, color: "#EF4444" },
          { label: "In Progress", value: allTools.length - assessed.length, icon: Clock, color: "#F59E0B" },
          { label: "Assured", value: assured, icon: ShieldCheck, color: "#22c55e" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlassCard key={label} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon size={15} style={{ color }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{label}</span>
            </div>
            <span className="text-3xl font-bold" style={{ color: "var(--text)" }}>{value}</span>
          </GlassCard>
        ))}
      </div>

      {/* Suite module status */}
      <GlassCard>
        <h2 className="font-semibold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--text)" }}>Digital Safety Suite Status</h2>
        <div className="flex flex-col divide-y divide-white/5">
          {SUITE_TOOLS.map(tool => {
            const r = latestByTool[tool.slug];
            return (
              <div key={tool.slug} className="flex items-center justify-between py-2.5">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{tool.name}</span>
                {r ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${r.score}%`, background: r.rating_color }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: r.rating_color }}>{r.score}%</span>
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>{r.rating}</span>
                  </div>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: "var(--text-faint)" }}>Not Assessed</span>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Recent assessments table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text)" }}>Recent Assessments</h2>
          <div className="flex gap-1.5">
            {(["all", "suite", "core"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1 rounded-lg transition-all capitalize ${filter === f ? "bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] text-[#10B981]" : "border border-white/10 text-[#64748B] hover:text-white"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        {filteredReports.length === 0 ? (
          <p className="text-sm text-[#475569]">No assessments found.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {filteredReports.slice(0, 10).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2.5 gap-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{r.tool_name}</span>
                  <span className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{r.school_name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold" style={{ color: r.rating_color }}>{r.score}%</span>
                  <span className="text-xs hidden sm:block" style={{ color: "var(--text-faint)" }}>{r.rating}</span>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>{new Date(r.created_at).toLocaleDateString("en-GB")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Governor notes */}
      <GlassCard>
        <h2 className="font-semibold text-sm uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>Governor Notes</h2>
        <textarea
          rows={4}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Record governance observations, actions, or questions here…"
          className="w-full bg-black/30 border border-white/8 rounded-xl px-4 py-3 text-sm placeholder-[#334155] focus:outline-none focus:border-[rgba(16,185,129,0.4)] transition-colors resize-y"
          style={{ color: "var(--text)" }}
        />
        <button onClick={saveNotes}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}>
          {notesSaved ? <><CheckCircle2 size={13} /> Saved</> : "Save Notes"}
        </button>
      </GlassCard>
    </div>
  );
}
