"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Mail, Calendar, ShieldCheck, FileText, Loader2, KeyRound } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Report, Organisation, School } from "@/lib/supabase";

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

const ORG_TYPE_LABELS: Record<string, string> = {
  la_school: "Local Authority School",
  single_school: "Independent School",
  mat: "Multi-Academy Trust",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [org, setOrg] = useState<Organisation | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setReportsLoading(true);

      // Load reports
      const { data: reportRows, error: reportErr } = await supabase
        .from("reports")
        .select("*")
        .eq("created_by", user!.id)
        .order("created_at", { ascending: false });
      if (reportErr) console.error("[Profile] reports fetch error:", reportErr);
      setReports(reportRows ?? []);

      // Load org membership
      const { data: memberRow } = await supabase
        .from("org_members")
        .select("org_id, school_id")
        .eq("user_id", user!.id)
        .limit(1)
        .single();

      if (memberRow?.org_id) {
        const { data: orgData } = await supabase
          .from("organisations")
          .select("*")
          .eq("id", memberRow.org_id)
          .single();
        setOrg(orgData);
      }

      if (memberRow?.school_id) {
        const { data: schoolData } = await supabase
          .from("schools")
          .select("*")
          .eq("id", memberRow.school_id)
          .single();
        setSchool(schoolData);
      }

      setReportsLoading(false);
    }

    load();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 size={24} className="animate-spin text-[#38BDF8]" /></div>;
  }

  if (!user || !profile) return null;

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <div className="pt-10 pb-8">
          <p className="text-[#38BDF8] text-xs font-medium uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>My Profile</h1>
        </div>

        {/* Profile info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] flex items-center justify-center shrink-0">
                <User size={20} className="text-[#38BDF8]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{profile.full_name ?? "—"}</p>
                <p className="text-xs text-[#64748B] truncate flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5"><Calendar size={10} /> Joined {joinDate}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-[#38BDF8]" />
              </div>
              <div className="min-w-0">
                {org ? (
                  <>
                    <p className="font-semibold text-white truncate">{org.name}</p>
                    <p className="text-xs text-[#64748B]">{ORG_TYPE_LABELS[profile.org_type ?? ""] ?? org.type.toUpperCase()}</p>
                    {school && <p className="text-xs text-[#64748B] truncate mt-0.5">{school.name}</p>}
                  </>
                ) : (
                  <p className="text-sm text-[#64748B]">No organisation assigned</p>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Change password */}
        <ChangePasswordCard />

        {/* Reports */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-[#38BDF8]" />
            <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>My Reports</h2>
            {reports.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.1)] text-[#38BDF8] border border-[rgba(56,189,248,0.2)]">{reports.length}</span>
            )}
          </div>

          {reportsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-[#38BDF8]" />
            </div>
          ) : reports.length === 0 ? (
            <GlassCard className="text-center py-16">
              <ShieldCheck size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
              <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No reports yet</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Complete a tool assessment to generate your first report.</p>
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
                        <p className="text-xs text-[#64748B] truncate">{r.school_name} · {date}</p>
                        {r.staff_member && <p className="text-xs text-[#475569] truncate">{r.staff_member}</p>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold px-2.5 py-0.5 rounded-full border"
                          style={{ color, background: `${color}15`, borderColor: `${color}40` }}>
                          {r.score}%
                        </span>
                        <span className="text-xs hidden sm:block" style={{ color: "var(--text-dim)" }}>{r.rating}</span>
                      </div>
                    </div>
                    {r.areas && r.areas.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[0.65rem] font-medium uppercase tracking-wider text-[#475569] mb-2">Areas covered</p>
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

function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setErr("Passwords do not match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setMsg("Password updated successfully.");
    setPassword(""); setConfirm("");
  }

  return (
    <GlassCard className="mb-8">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound size={16} className="text-[#38BDF8]" />
          <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>Change Password</span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-dim)" }}>{open ? "Cancel" : "Edit"}</span>
      </button>
      {open && (
        <form onSubmit={save} className="mt-4 flex flex-col gap-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" minLength={8} required
            className="px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)]" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" minLength={8} required
            className="px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)]" />
          {err && <p className="text-xs text-red-400">{err}</p>}
          {msg && <p className="text-xs text-green-400">{msg}</p>}
          <button type="submit" disabled={busy} className="self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
            {busy && <Loader2 size={14} className="animate-spin" />} Update Password
          </button>
        </form>
      )}
    </GlassCard>
  );
}
