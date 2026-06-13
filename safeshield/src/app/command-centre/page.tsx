"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarClock,
  Building2,
  ArrowRight,
  Gauge,
  ListChecks,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase, ALL_TOOLS } from "@/lib/supabase";
import type { Report, Organisation, School } from "@/lib/supabase";
import { getSubmissions } from "@/lib/submissions";

const REVIEW_PERIOD_DAYS = 365;
const DUE_SOON_DAYS = 60;

function scoreColor(score: number) {
  if (score >= 80) return "#34D399";
  if (score >= 55) return "#FBBF24";
  return "#F87171";
}
function scoreBand(score: number): "compliant" | "attention" | "risk" {
  if (score >= 80) return "compliant";
  if (score >= 55) return "attention";
  return "risk";
}
function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

type LatestPerTool = {
  slug: string;
  name: string;
  score: number;
  rating: string;
  date: string;
  prevScore: number | null;
  reviewDue: "overdue" | "soon" | "ok";
};

type PriorityAction = {
  toolName: string;
  toolSlug: string;
  category: string;
  text: string;
  priority: "high" | "medium" | "low";
};

type SchoolSummary = {
  name: string;
  schoolId: string | null;
  avg: number;
  toolCount: number;
  reports: Report[];
};

// ── visibility mode resolved once on load ────────────────────────────────────
type VisibilityMode =
  | { kind: "super" }          // super admin — sees global picker
  | { kind: "mat"; orgId: string; orgName: string }       // MAT admin — all schools in trust
  | { kind: "school"; schoolId: string | null; orgId: string | null; schoolName: string } // single school view
  | { kind: "own" };           // basic user — own reports only

// ─────────────────────────────────────────────────────────────────────────────

export default function CommandCentrePage() {
  const router = useRouter();
  const { user, loading, isOrgAdmin, enabledTools } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");

  // ── Scope state for super admin drill-down ───────────────────────────────
  const [mode, setMode] = useState<VisibilityMode | null>(null);

  // Super-admin drill-down layers
  const [superOrgs, setSuperOrgs] = useState<Organisation[]>([]);
  const [drillOrg, setDrillOrg] = useState<Organisation | null>(null);    // selected MAT
  const [drillSchool, setDrillSchool] = useState<SchoolSummary | null>(null); // selected school inside MAT
  const [orgSchools, setOrgSchools] = useState<School[]>([]);              // schools of drilled-in MAT

  const [reports, setReports] = useState<Report[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // ── Redirect if not logged in ────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // ── Resolve visibility mode and initial data load ────────────────────────
  useEffect(() => {
    if (!user || loading) return;
    (async () => {
      setDataLoading(true);

      if (isSuperAdmin) {
        // Super admin — load all orgs for picker
        const { data: orgs } = await supabase
          .from("organisations")
          .select("*")
          .order("name");
        setSuperOrgs((orgs as Organisation[]) ?? []);
        setMode({ kind: "super" });
        setDataLoading(false);
        return;
      }

      // Everyone else: resolve from org_members
      const { data: memberRow } = await supabase
        .from("org_members")
        .select("org_id, school_id, role")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!memberRow) {
        // No org membership — show own reports
        const { data } = await supabase
          .from("reports")
          .select("*")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false });
        setReports(toReports(data, user.id));
        setMode({ kind: "own" });
        setDataLoading(false);
        return;
      }

      const { org_id, school_id } = memberRow as { org_id: string | null; school_id: string | null; role: string };

      if (school_id) {
        // Scoped to a single school — ONLY see this school's data (even if inside a MAT)
        const { data: schoolRow } = await supabase
          .from("schools")
          .select("name")
          .eq("id", school_id)
          .maybeSingle();
        const { data } = await supabase
          .from("reports")
          .select("*")
          .eq("school_id", school_id)
          .order("created_at", { ascending: false });
        setReports(toReports(data, user.id));
        setMode({ kind: "school", schoolId: school_id, orgId: org_id, schoolName: (schoolRow as { name: string } | null)?.name ?? "Your School" });
        setDataLoading(false);
        return;
      }

      if (org_id && isOrgAdmin) {
        // Org admin without a specific school — check if this is a MAT or single-school org
        const { data: orgRow } = await supabase
          .from("organisations")
          .select("name, type")
          .eq("id", org_id)
          .maybeSingle();
        const org = orgRow as { name: string; type: "mat" | "school" } | null;

        if (org?.type === "mat") {
          // MAT admin — see all schools in the trust
          const { data } = await supabase
            .from("reports")
            .select("*")
            .eq("org_id", org_id)
            .order("created_at", { ascending: false });
          setReports(toReports(data, user.id));
          setMode({ kind: "mat", orgId: org_id, orgName: org.name });
          setDataLoading(false);
          return;
        }

        // Single-school org admin
        const { data } = await supabase
          .from("reports")
          .select("*")
          .eq("org_id", org_id)
          .order("created_at", { ascending: false });
        setReports(toReports(data, user.id));
        setMode({ kind: "school", schoolId: null, orgId: org_id, schoolName: org?.name ?? "Your School" });
        setDataLoading(false);
        return;
      }

      // Fallback — own reports
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });
      setReports(toReports(data, user.id));
      setMode({ kind: "own" });
      setDataLoading(false);
    })();
  }, [user, loading, isSuperAdmin, isOrgAdmin]);

  // ── Super admin: load reports when drill target changes ──────────────────
  useEffect(() => {
    if (!isSuperAdmin || !user) return;
    if (!drillOrg) { setReports([]); return; }

    (async () => {
      setDataLoading(true);

      if (drillSchool) {
        // Drilled to a specific school
        const filter = drillSchool.schoolId
          ? { column: "school_id", value: drillSchool.schoolId }
          : { column: "school_name", value: drillSchool.name };
        const q = drillSchool.schoolId
          ? supabase.from("reports").select("*").eq("school_id", drillSchool.schoolId).order("created_at", { ascending: false })
          : supabase.from("reports").select("*").eq("org_id", drillOrg.id).eq("school_name", drillSchool.name).order("created_at", { ascending: false });
        void filter; // satisfy ts
        const { data } = await q;
        setReports(toReports(data, user.id));
      } else {
        // Drilled to a MAT — load all schools in that org
        const { data: schools } = await supabase
          .from("schools")
          .select("*")
          .eq("org_id", drillOrg.id)
          .order("name");
        setOrgSchools((schools as School[]) ?? []);

        const { data } = await supabase
          .from("reports")
          .select("*")
          .eq("org_id", drillOrg.id)
          .order("created_at", { ascending: false });
        setReports(toReports(data, user.id));
      }

      setDataLoading(false);
    })();
  }, [isSuperAdmin, user, drillOrg, drillSchool]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const latestPerTool = useMemo<LatestPerTool[]>(() => {
    const bySlug = new Map<string, Report[]>();
    for (const r of reports) {
      const arr = bySlug.get(r.tool_slug) ?? [];
      arr.push(r);
      bySlug.set(r.tool_slug, arr);
    }
    return [...bySlug.entries()]
      .map(([slug, list]) => {
        const sorted = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const latest = sorted[0];
        const age = daysSince(latest.created_at);
        return {
          slug,
          name: latest.tool_name,
          score: latest.score,
          rating: latest.rating,
          date: latest.created_at,
          prevScore: sorted[1]?.score ?? null,
          reviewDue: age > REVIEW_PERIOD_DAYS ? "overdue" : age > REVIEW_PERIOD_DAYS - DUE_SOON_DAYS ? "soon" : "ok",
        } as LatestPerTool;
      })
      .sort((a, b) => a.score - b.score);
  }, [reports]);

  const overallScore = useMemo(() => {
    if (!latestPerTool.length) return null;
    return Math.round(latestPerTool.reduce((a, t) => a + t.score, 0) / latestPerTool.length);
  }, [latestPerTool]);

  const bandCounts = useMemo(() => {
    const c = { compliant: 0, attention: 0, risk: 0 };
    latestPerTool.forEach((t) => c[scoreBand(t.score)]++);
    return c;
  }, [latestPerTool]);

  const priorityActions = useMemo<PriorityAction[]>(() => {
    const latestBySlug = new Map<string, Report>();
    for (const r of reports) {
      const ex = latestBySlug.get(r.tool_slug);
      if (!ex || new Date(r.created_at) > new Date(ex.created_at)) latestBySlug.set(r.tool_slug, r);
    }
    const actions: PriorityAction[] = [];
    for (const r of latestBySlug.values()) {
      if (!r.recommendations) continue;
      for (const g of r.recommendations) {
        actions.push({ toolName: r.tool_name, toolSlug: r.tool_slug, category: g.category, text: g.text, priority: g.priority });
      }
    }
    const rank = { high: 0, medium: 1, low: 2 };
    return actions.sort((a, b) => rank[a.priority] - rank[b.priority]);
  }, [reports]);

  const reviewItems = useMemo(
    () => latestPerTool.filter((t) => t.reviewDue !== "ok").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [latestPerTool]
  );

  const trend = useMemo(() => {
    if (reports.length < 2) return [];
    const byMonth = new Map<string, number[]>();
    for (const r of reports) {
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const arr = byMonth.get(key) ?? [];
      arr.push(r.score);
      byMonth.set(key, arr);
    }
    return [...byMonth.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8)
      .map(([month, scores]) => ({ month, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }));
  }, [reports]);

  // MAT rollup — schools within current report set
  const schoolRollup = useMemo<SchoolSummary[]>(() => {
    if (mode?.kind !== "mat" && !(isSuperAdmin && drillOrg && !drillSchool)) return [];
    const bySchool = new Map<string, Map<string, Report>>();
    for (const r of reports) {
      const key = r.school_name || "Unnamed";
      const tools = bySchool.get(key) ?? new Map<string, Report>();
      const ex = tools.get(r.tool_slug);
      if (!ex || new Date(r.created_at) > new Date(ex.created_at)) tools.set(r.tool_slug, r);
      bySchool.set(key, tools);
    }
    return [...bySchool.entries()]
      .map(([name, tools]) => {
        const list = [...tools.values()];
        const avg = Math.round(list.reduce((a, r) => a + r.score, 0) / list.length);
        const schoolId = list[0]?.school_id ?? null;
        return { name, schoolId, avg, toolCount: tools.size, reports: list };
      })
      .sort((a, b) => a.avg - b.avg);
  }, [reports, mode, isSuperAdmin, drillOrg, drillSchool]);

  const notStarted = useMemo(() => {
    const assessed = new Set(latestPerTool.map((t) => t.slug));
    return ALL_TOOLS.filter(
      (t) =>
        !assessed.has(t.slug) &&
        t.slug !== "policy-analyzer" &&
        t.slug !== "training" &&
        t.slug !== "governor-dashboard" &&
        (isSuperAdmin || enabledTools.includes(t.slug))
    );
  }, [latestPerTool, isSuperAdmin, enabledTools]);

  // ── Loading / gate ───────────────────────────────────────────────────────
  if (loading || !mode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }
  if (!user) return null;

  // ── Super admin: show global org picker ──────────────────────────────────
  if (mode.kind === "super" && !drillOrg) {
    return <SuperOrgPicker orgs={superOrgs} onSelect={(org) => { setDrillSchool(null); setDrillOrg(org); }} />;
  }

  // ── Resolve heading labels for breadcrumb ────────────────────────────────
  const viewLabel =
    mode.kind === "mat" ? mode.orgName :
    mode.kind === "school" ? mode.schoolName :
    drillSchool ? drillSchool.name :
    drillOrg ? drillOrg.name :
    "Your Reports";

  const isMATView = mode.kind === "mat" || (isSuperAdmin && drillOrg && !drillSchool && drillOrg.type === "mat");
  const hasData = latestPerTool.length > 0 || (isMATView && schoolRollup.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb / header */}
        <div className="pt-6 pb-8 flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)" }}
          >
            <Gauge size={22} style={{ color: "#38BDF8" }} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {/* Breadcrumb for super admin drill-down */}
              {isSuperAdmin && drillOrg && (
                <button
                  onClick={() => { setDrillOrg(null); setDrillSchool(null); setReports([]); }}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all hover:bg-white/5"
                  style={{ color: "var(--text-dim)" }}
                >
                  <ChevronLeft size={12} /> All Organisations
                </button>
              )}
              {isSuperAdmin && drillOrg && drillSchool && (
                <>
                  <ChevronRight size={12} style={{ color: "var(--text-dim)" }} />
                  <button
                    onClick={() => setDrillSchool(null)}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all hover:bg-white/5"
                    style={{ color: "var(--text-dim)" }}
                  >
                    {drillOrg.name}
                  </button>
                </>
              )}
              {isSuperAdmin && drillSchool && (
                <ChevronRight size={12} style={{ color: "var(--text-dim)" }} />
              )}
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#38BDF8" }}>
                Compliance Oversight
              </p>
            </div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text)" }}>
              Command Centre
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {viewLabel}
              {isMATView && !drillSchool && " — Multi-Academy Trust overview"}
              {dataLoading && " · Loading…"}
            </p>
          </div>
        </div>

        {dataLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        ) : !hasData ? (
          <GlassCard className="text-center py-20">
            <ShieldCheck size={36} className="mx-auto mb-4 opacity-40" style={{ color: "var(--accent)" }} />
            <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No assessments yet</p>
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              {isSuperAdmin ? "No reports found for this organisation." : "Complete your first tool assessment to build your compliance picture."}
            </p>
            {!isSuperAdmin && (
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                Browse tools <ArrowRight size={14} />
              </Link>
            )}
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-6">

            {/* ── MAT school selector (MAT view) ───────────────────────── */}
            {isMATView && schoolRollup.length > 0 && !drillSchool && (
              <div>
                <SectionHeading icon={<Building2 size={15} />} title={isSuperAdmin ? "Schools in this Trust" : "Schools Across the Trust"} count={schoolRollup.length} />
                <GlassCard>
                  <div className="flex flex-col divide-y divide-white/5">
                    {schoolRollup.map((s, i) => {
                      const c = scoreColor(s.avg);
                      return (
                        <button
                          key={s.name}
                          onClick={() => setDrillSchool(s)}
                          className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 w-full text-left group transition-all hover:bg-white/3"
                        >
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-dim)" }}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{s.name}</p>
                            <p className="text-xs" style={{ color: "var(--text-dim)" }}>{s.toolCount} assessment{s.toolCount !== 1 ? "s" : ""}</p>
                          </div>
                          <div className="hidden sm:block w-32 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full" style={{ width: `${s.avg}%`, background: c }} />
                          </div>
                          <span className="text-sm font-bold px-2.5 py-0.5 rounded-full border shrink-0"
                            style={{ color: c, background: `${c}15`, borderColor: `${c}40` }}>
                            {s.avg}%
                          </span>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: "var(--text-dim)" }} />
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
                {/* Also show trust-wide aggregated data below */}
                {latestPerTool.length > 0 && (
                  <p className="text-xs mt-3 mb-0" style={{ color: "var(--text-dim)" }}>
                    Trust-wide aggregated data shown below. Click a school above to see its individual view.
                  </p>
                )}
              </div>
            )}

            {/* ── School drill-back button (MAT super admin) ──────────── */}
            {isSuperAdmin && drillSchool && (
              <button
                onClick={() => setDrillSchool(null)}
                className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-muted)" }}
              >
                <ChevronLeft size={14} /> Back to {drillOrg?.name}
              </button>
            )}

            {latestPerTool.length > 0 && (
              <>
                {/* ── Hero score + bands + trend ─────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GlassCard className="flex flex-col items-center justify-center py-8">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-dim)" }}>
                      {isMATView && !drillSchool ? "Trust-Wide Score" : "Overall SafeShield Score"}
                    </p>
                    <ScoreRing score={overallScore!} />
                    <p className="text-sm mt-4 font-medium" style={{ color: scoreColor(overallScore!) }}>
                      {scoreBand(overallScore!) === "compliant" ? "Strong compliance" : scoreBand(overallScore!) === "attention" ? "Needs attention" : "Action required"}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                      Across {latestPerTool.length} assessment{latestPerTool.length !== 1 ? "s" : ""}
                    </p>
                  </GlassCard>

                  <GlassCard className="lg:col-span-2 flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-dim)" }}>
                      Compliance Status
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: "Compliant", count: bandCounts.compliant, color: "#34D399", hint: "≥ 80%" },
                        { label: "Needs Attention", count: bandCounts.attention, color: "#FBBF24", hint: "55–79%" },
                        { label: "At Risk", count: bandCounts.risk, color: "#F87171", hint: "< 55%" },
                      ].map((b) => (
                        <div key={b.label} className="rounded-2xl px-4 py-4 text-center"
                          style={{ background: `${b.color}12`, border: `1px solid ${b.color}33` }}>
                          <p className="text-3xl font-bold" style={{ color: b.color }}>{b.count}</p>
                          <p className="text-xs font-medium mt-1" style={{ color: "var(--text)" }}>{b.label}</p>
                          <p className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-dim)" }}>{b.hint}</p>
                        </div>
                      ))}
                    </div>
                    {trend.length >= 2 && (
                      <div className="mt-auto">
                        <p className="text-[0.65rem] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>Score trend</p>
                        <Sparkline points={trend.map((t) => t.score)} />
                      </div>
                    )}
                  </GlassCard>
                </div>

                {/* ── Per-tool grid ───────────────────────────────────── */}
                <div>
                  <SectionHeading icon={<Gauge size={15} />} title="Assessments" count={latestPerTool.length} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {latestPerTool.map((t) => {
                      const c = scoreColor(t.score);
                      const delta = t.prevScore !== null ? t.score - t.prevScore : null;
                      return (
                        <Link key={t.slug} href={`/tools/${t.slug}`}>
                          <GlassCard className="h-full transition-transform hover:-translate-y-0.5">
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text)" }}>{t.name}</p>
                              <span className="text-sm font-bold px-2.5 py-0.5 rounded-full border shrink-0"
                                style={{ color: c, background: `${c}15`, borderColor: `${c}40` }}>{t.score}%</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              {delta !== null && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium"
                                  style={{ color: delta > 0 ? "#34D399" : delta < 0 ? "#F87171" : "var(--text-dim)" }}>
                                  {delta > 0 ? <TrendingUp size={12} /> : delta < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                                  {delta > 0 ? "+" : ""}{delta}%
                                </span>
                              )}
                              {t.reviewDue !== "ok" && (
                                <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full"
                                  style={t.reviewDue === "overdue"
                                    ? { background: "rgba(248,113,113,0.15)", color: "#F87171" }
                                    : { background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}>
                                  <CalendarClock size={10} />
                                  {t.reviewDue === "overdue" ? "Review overdue" : "Review due soon"}
                                </span>
                              )}
                              <span className="text-[0.65rem] ml-auto" style={{ color: "var(--text-dim)" }}>
                                {new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          </GlassCard>
                        </Link>
                      );
                    })}
                  </div>
                  {notStarted.length > 0 && !drillSchool && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>Not yet started:</span>
                      {notStarted.map((t) => (
                        <Link key={t.slug} href={`/tools/${t.slug}`}
                          className="text-xs px-3 py-1 rounded-full border transition-all hover:opacity-80"
                          style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)", color: "var(--text-muted)" }}>
                          {t.name.replace(" Checker", "").replace(" Assessment", "")}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Priority actions + review calendar ──────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <SectionHeading icon={<ListChecks size={15} />} title="Priority Actions" count={priorityActions.length} />
                    {priorityActions.length === 0 ? (
                      <GlassCard className="text-center py-10">
                        <ShieldCheck size={28} className="mx-auto mb-3" style={{ color: "#34D399" }} />
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>No outstanding actions</p>
                      </GlassCard>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {priorityActions.slice(0, 12).map((a, i) => {
                          const pc = a.priority === "high" ? "#F87171" : a.priority === "medium" ? "#FBBF24" : "#34D399";
                          return (
                            <GlassCard key={i} className="py-3">
                              <div className="flex items-start gap-3">
                                <span className="shrink-0 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md mt-0.5"
                                  style={{ color: pc, background: `${pc}18`, border: `1px solid ${pc}40` }}>
                                  {a.priority}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm leading-snug" style={{ color: "var(--text)" }}>{a.text}</p>
                                  <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{a.toolName} · {a.category}</p>
                                </div>
                              </div>
                            </GlassCard>
                          );
                        })}
                        {priorityActions.length > 12 && (
                          <p className="text-xs text-center mt-1" style={{ color: "var(--text-dim)" }}>
                            + {priorityActions.length - 12} more — open each tool&apos;s report to download a full action plan.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <SectionHeading icon={<CalendarClock size={15} />} title="Review Calendar" count={reviewItems.length} />
                    {reviewItems.length === 0 ? (
                      <GlassCard className="text-center py-10">
                        <CalendarClock size={28} className="mx-auto mb-3" style={{ color: "#34D399" }} />
                        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>All up to date</p>
                      </GlassCard>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {reviewItems.map((t) => {
                          const overdue = t.reviewDue === "overdue";
                          const col = overdue ? "#F87171" : "#FBBF24";
                          return (
                            <Link key={t.slug} href={`/tools/${t.slug}`}>
                              <GlassCard className="py-3 transition-transform hover:-translate-y-0.5">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle size={14} style={{ color: col }} className="shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{t.name}</p>
                                    <p className="text-xs" style={{ color: col }}>
                                      {overdue ? "Overdue" : "Due soon"} · last {new Date(t.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                                    </p>
                                  </div>
                                </div>
                              </GlassCard>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Super admin global org picker ────────────────────────────────────────────
function SuperOrgPicker({ orgs, onSelect }: { orgs: Organisation[]; onSelect: (org: Organisation) => void }) {
  const mats = orgs.filter((o) => o.type === "mat");
  const singles = orgs.filter((o) => o.type === "school");
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="pt-6 pb-8 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)" }}>
            <Gauge size={22} style={{ color: "#38BDF8" }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "#38BDF8" }}>Super Admin</p>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Command Centre</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Select an organisation to view its compliance dashboard.
            </p>
          </div>
        </div>
        {orgs.length === 0 ? (
          <GlassCard className="text-center py-16">
            <Building2 size={32} className="mx-auto mb-3 opacity-40" style={{ color: "var(--accent)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>No organisations yet</p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-6">
            {mats.length > 0 && (
              <div>
                <SectionHeading icon={<Building2 size={15} />} title="Multi-Academy Trusts" count={mats.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mats.map((org) => <OrgCard key={org.id} org={org} onSelect={onSelect} />)}
                </div>
              </div>
            )}
            {singles.length > 0 && (
              <div>
                <SectionHeading icon={<Building2 size={15} />} title="Single Schools" count={singles.length} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {singles.map((org) => <OrgCard key={org.id} org={org} onSelect={onSelect} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrgCard({ org, onSelect }: { org: Organisation; onSelect: (o: Organisation) => void }) {
  return (
    <button onClick={() => onSelect(org)} className="text-left w-full group">
      <GlassCard className="transition-transform hover:-translate-y-0.5 group-hover:border-[rgba(56,189,248,0.25)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
            <Building2 size={18} style={{ color: "#38BDF8" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{org.name}</p>
            <p className="text-xs" style={{ color: "var(--text-dim)" }}>
              {org.type === "mat" ? "Multi-Academy Trust" : "Single School"}
              {org.manager_name ? ` · ${org.manager_name}` : ""}
            </p>
          </div>
          <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: "#38BDF8" }} />
        </div>
      </GlassCard>
    </button>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────
function SectionHeading({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: "var(--accent)" }}>{icon}</span>
      <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>{title}</h2>
      <span className="text-xs px-2 py-0.5 rounded-full border"
        style={{ background: "rgba(56,189,248,0.1)", borderColor: "rgba(56,189,248,0.2)", color: "var(--accent)" }}>
        {count}
      </span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const c = scoreColor(score);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative" style={{ width: 140, height: 140 }}>
      <svg width={140} height={140} className="-rotate-90">
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle cx={70} cy={70} r={r} fill="none" stroke={c} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: c }}>{score}</span>
        <span className="text-xs" style={{ color: "var(--text-dim)" }}>/ 100</span>
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const w = 100;
  const h = 28;
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / range) * h]);
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const c = scoreColor(points[points.length - 1]);
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
      <path d={path} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === coords.length - 1 ? 2.2 : 1.3} fill={c} />
      ))}
    </svg>
  );
}

// ── Utility ──────────────────────────────────────────────────────────────────
function toReports(data: Record<string, unknown>[] | null, userId: string): Report[] {
  if (data && data.length > 0) return data as unknown as Report[];
  // localStorage fallback
  if (typeof window === "undefined") return [];
  try {
    const local = getSubmissions();
    return local.map((s) => ({
      id: s.id,
      school_id: null,
      org_id: null,
      tool_slug: s.tool.toLowerCase().replace(/\s+/g, "-"),
      tool_name: s.tool,
      school_name: s.schoolName,
      school_email: s.schoolEmail || null,
      staff_member: s.staffMember || null,
      consultant_name: s.consultantName || null,
      consultant_email: s.consultantEmail || null,
      score: s.score,
      rating: s.rating,
      rating_color: s.ratingColor,
      logo_data_url: s.logoDataUrl || null,
      areas: s.areas || null,
      recommendations: s.gaps || null,
      created_by: userId,
      created_at: s.date,
    }));
  } catch { return []; }
}
