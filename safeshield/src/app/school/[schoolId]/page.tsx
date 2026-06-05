"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { School as SchoolIcon, Mail, Users, FileText, ShieldCheck, Loader2, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { School, Organisation, Report, OrgMember } from "@/lib/supabase";

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

type MemberWithProfile = OrgMember & { email?: string; full_name?: string | null };

export default function SchoolProfilePage() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const router = useRouter();
  const { user, profile, loading, enabledTools } = useAuth();
  const isAdmin = enabledTools.includes("*");

  const [school, setSchool] = useState<School | null>(null);
  const [org, setOrg] = useState<Organisation | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || !schoolId) return;

    async function load() {
      setPageLoading(true);

      // Load school
      const { data: schoolData, error: schoolErr } = await supabase
        .from("schools").select("*").eq("id", schoolId).single();

      if (schoolErr || !schoolData) { router.replace("/org"); return; }
      setSchool(schoolData);

      // Load org
      const { data: orgData } = await supabase
        .from("organisations").select("*").eq("id", schoolData.org_id).single();
      setOrg(orgData);

      // Load reports for this school
      const { data: reportRows } = await supabase
        .from("reports").select("*").eq("school_id", schoolId).order("created_at", { ascending: false });
      setReports(reportRows ?? []);

      // Load members assigned to this school
      const { data: memberRows } = await supabase
        .from("org_members").select("*").eq("school_id", schoolId);
      if (memberRows?.length) {
        const userIds = memberRows.map((m: OrgMember) => m.user_id);
        const { data: profileRows } = await supabase
          .from("profiles").select("id, email, full_name").in("id", userIds);
        const pMap: Record<string, { email: string; full_name: string | null }> = {};
        for (const p of profileRows ?? []) pMap[p.id] = p;
        setMembers(memberRows.map((m: OrgMember) => ({ ...m, ...pMap[m.user_id] })));
      } else {
        setMembers([]);
      }

      setPageLoading(false);
    }

    load();
  }, [user, schoolId, router]);

  if (loading || pageLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 size={24} className="animate-spin text-[#38BDF8]" /></div>;
  }

  if (!school) return null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="pt-10 pb-8">
          <Link href="/org" className="inline-flex items-center gap-1.5 text-xs mb-4 hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
            <ArrowLeft size={12} /> Back to Organisations
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 overflow-hidden">
              {school.logo_url
                ? <img src={school.logo_url} alt="" className="w-full h-full object-contain p-1.5" />
                : <SchoolIcon size={24} style={{ color: "var(--text-dim)" }} />}
            </div>
            <div>
              <p className="text-[#38BDF8] text-xs font-medium uppercase tracking-widest mb-0.5">School Profile</p>
              <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{school.name}</h1>
              {school.email && <p className="text-sm flex items-center gap-1 mt-1" style={{ color: "var(--text-muted)" }}><Mail size={12} />{school.email}</p>}
            </div>
          </div>

          {org && (
            <div className="flex items-center gap-2 mt-3">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 overflow-hidden shrink-0">
                {org.logo_url ? <img src={org.logo_url} alt="" className="w-full h-full object-contain" /> : <Building2 size={10} style={{ color: "var(--text-dim)" }} />}
              </div>
              <span className="text-xs" style={{ color: "var(--text-dim)" }}>{org.name}</span>
              <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wide"
                style={{ color: org.type === "mat" ? "#A78BFA" : "#38BDF8", background: org.type === "mat" ? "#A78BFA18" : "#38BDF818", borderColor: org.type === "mat" ? "#A78BFA40" : "#38BDF840" }}>
                {org.type === "mat" ? "MAT" : "School"}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Reports", value: reports.length },
            { label: "Members", value: members.length },
            { label: "Avg Score", value: reports.length ? `${Math.round(reports.reduce((s, r) => s + r.score, 0) / reports.length)}%` : "—" },
          ].map((s) => (
            <GlassCard key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#38BDF8]">{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{s.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Members */}
        {members.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-[#38BDF8]" />
              <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Members</h2>
            </div>
            <div className="flex flex-col gap-2">
              {members.map((m) => (
                <GlassCard key={m.id} className="flex items-center gap-3 py-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#94A3B8]">{(m.full_name ?? m.email ?? "?")[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{m.full_name ?? "—"}</p>
                    <p className="text-xs text-[#64748B] truncate">{m.email}</p>
                  </div>
                  <span className="text-[0.6rem] px-2 py-0.5 rounded-full border font-medium"
                    style={{ color: m.role === "admin" ? "#38BDF8" : "#94A3B8", background: m.role === "admin" ? "#38BDF818" : "#94A3B818", borderColor: m.role === "admin" ? "#38BDF840" : "#94A3B840" }}>
                    {m.role}
                  </span>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-[#38BDF8]" />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Reports</h2>
            {reports.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.1)] text-[#38BDF8] border border-[rgba(56,189,248,0.2)]">{reports.length}</span>
            )}
          </div>

          {reports.length === 0 ? (
            <GlassCard className="text-center py-16">
              <ShieldCheck size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
              <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No reports yet</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Reports will appear here when assessments are completed for this school.</p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {reports.map((r) => {
                const color = TOOL_COLORS[r.tool_name] ?? "#38BDF8";
                const date = new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                return (
                  <GlassCard key={r.id}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">{r.tool_name}</p>
                        <p className="text-xs text-[#64748B]">{date}{r.staff_member ? ` · ${r.staff_member}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold px-2.5 py-0.5 rounded-full border"
                          style={{ color, background: `${color}15`, borderColor: `${color}40` }}>
                          {r.score}%
                        </span>
                        <span className="text-xs hidden sm:block" style={{ color: "var(--text-dim)" }}>{r.rating}</span>
                      </div>
                    </div>
                    {r.areas && r.areas.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {r.areas.map((a, i) => (
                            <span key={i} className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: "var(--text-dim)" }}>
                              {a.name}{a.score !== undefined ? ` · ${a.score}%` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
