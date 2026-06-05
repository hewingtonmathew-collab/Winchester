"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSubmissions, deleteSubmission, type Submission } from "@/lib/submissions";
import { Trash2, Mail, ShieldCheck, LayoutDashboard, ChevronDown, ChevronUp, Users, CheckCircle2, XCircle, Loader2, ToggleLeft, ToggleRight, AlertCircle, UserPlus, X, Building2, Plus, School, Network } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase, ALL_TOOLS, type Profile, type Organisation, type School as SchoolType, type OrgMember } from "@/lib/supabase";

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

// ── Add User Modal ───────────────────────────────────────────────────────────

type OrgType = "la_school" | "single_school" | "mat";

const ORG_TYPE_OPTIONS: { value: OrgType; label: string; description: string; color: string; icon: React.ReactNode }[] = [
  { value: "la_school", label: "Local Authority School", description: "Single school, managed by the LA", color: "#38BDF8", icon: <School size={16} strokeWidth={1.5} /> },
  { value: "single_school", label: "Independent / Single School", description: "Standalone school", color: "#A78BFA", icon: <Building2 size={16} strokeWidth={1.5} /> },
  { value: "mat", label: "Multi-Academy Trust (MAT)", description: "Multiple schools under one trust", color: "#34D399", icon: <Network size={16} strokeWidth={1.5} /> },
];

type ExistingOrg = { id: string; name: string };

function AddUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgType, setOrgType] = useState<OrgType | null>(null);
  const [orgMode, setOrgMode] = useState<"new" | "existing">("new");
  const [newOrgName, setNewOrgName] = useState("");
  const [existingOrgs, setExistingOrgs] = useState<ExistingOrg[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("organisations").select("id, name").order("name").then(({ data }) => {
      setExistingOrgs(data ?? []);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgType) { setError("Please select an organisation type."); return; }
    if (orgMode === "new" && !newOrgName.trim()) { setError("Please enter an organisation name."); return; }
    if (orgMode === "existing" && !selectedOrgId) { setError("Please select an existing organisation."); return; }
    setError("");
    setBusy(true);

    try {
      // Create user via admin API (sign up with temp password)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("No user ID returned.");

      // Update profile org_type
      await supabase.from("profiles").update({ org_type: orgType }).eq("id", userId);

      let orgId: string;

      if (orgMode === "new") {
        const { data: orgData, error: orgError } = await supabase
          .from("organisations")
          .insert({ name: newOrgName.trim(), type: orgType === "mat" ? "mat" : "school", created_by: userId })
          .select("id")
          .single();
        if (orgError) throw orgError;
        orgId = orgData.id;

        // Create school record
        const { data: schoolData, error: schoolError } = await supabase
          .from("schools")
          .insert({ org_id: orgId, name: newOrgName.trim() })
          .select("id")
          .single();
        if (schoolError) throw schoolError;

        await supabase.from("org_members").insert({ user_id: userId, org_id: orgId, school_id: schoolData.id, role: "admin" });
      } else {
        orgId = selectedOrgId;
        await supabase.from("org_members").insert({ user_id: userId, org_id: orgId, school_id: null, role: "member" });
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0F172A] shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">Add User</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-[#475569]">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Basic info */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">User Details</p>
            <div>
              <label className="text-xs text-[#64748B] mb-1 block">Full name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all" />
            </div>
            <div>
              <label className="text-xs text-[#64748B] mb-1 block">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@school.org" required
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all" />
            </div>
            <div>
              <label className="text-xs text-[#64748B] mb-1 block">Temporary password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all" />
            </div>
          </div>

          {/* Org type */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Organisation Type</p>
            <div className="flex flex-col gap-2">
              {ORG_TYPE_OPTIONS.map((opt) => {
                const selected = orgType === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => setOrgType(opt.value)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl border transition-all text-left"
                    style={{ background: selected ? `${opt.color}10` : "rgba(255,255,255,0.02)", borderColor: selected ? `${opt.color}50` : "rgba(255,255,255,0.07)" }}>
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${opt.color}15`, color: opt.color, border: `1px solid ${opt.color}25` }}>
                      {opt.icon}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{opt.label}</p>
                      <p className="text-[0.65rem] text-[#64748B]">{opt.description}</p>
                    </div>
                    {selected && (
                      <span className="ml-auto w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: opt.color }}>
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Org assignment */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Organisation</p>
            <div className="flex gap-2">
              {(["new", "existing"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setOrgMode(m)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${orgMode === m ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "glass border-transparent text-[#64748B] hover:text-white"}`}>
                  {m === "new" ? "Create new" : "Assign existing"}
                </button>
              ))}
            </div>

            {orgMode === "new" ? (
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Organisation name</label>
                <input type="text" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} placeholder="Maple Primary School"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-[#475569] outline-none focus:border-[rgba(56,189,248,0.4)] transition-all" />
              </div>
            ) : (
              <div>
                <label className="text-xs text-[#64748B] mb-1 block">Select organisation</label>
                <select value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#0F172A] border border-white/10 text-white outline-none focus:border-[rgba(56,189,248,0.4)] transition-all">
                  <option value="">-- Choose organisation --</option>
                  {existingOrgs.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main admin page ──────────────────────────────────────────────────────────

// ── Admin Org Card ───────────────────────────────────────────────────────────

type OrgWithDetails = Organisation & {
  schools: SchoolType[];
  members: (OrgMember & { email?: string; full_name?: string | null })[];
};

function AdminOrgCard({ org, onDelete }: { org: OrgWithDetails; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolType[]>(org.schools);
  const [members, setMembers] = useState(org.members);
  const [deletingSchool, setDeletingSchool] = useState<string | null>(null);
  const [deletingMember, setDeletingMember] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [addingSchool, setAddingSchool] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberSchoolId, setMemberSchoolId] = useState("");
  const [memberRole, setMemberRole] = useState<"admin" | "member">("member");
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState("");

  async function removeSchool(id: string) {
    setDeletingSchool(id);
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (!error) setSchools((p) => p.filter((s) => s.id !== id));
    setDeletingSchool(null);
  }

  async function removeMember(id: string) {
    setDeletingMember(id);
    const { error } = await supabase.from("org_members").delete().eq("id", id);
    if (!error) setMembers((p) => p.filter((m) => m.id !== id));
    setDeletingMember(null);
  }

  async function handleAddSchool(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolName.trim()) return;
    setAddingSchool(true);
    const { data, error } = await supabase.from("schools").insert({ org_id: org.id, name: schoolName.trim(), email: schoolEmail.trim() || null }).select().single();
    if (!error) { setSchools((p) => [...p, data as SchoolType]); setSchoolName(""); setSchoolEmail(""); }
    setAddingSchool(false);
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberEmail.trim()) return;
    setAddingMember(true);
    setMemberError("");
    const { data: prof, error: profErr } = await supabase.from("profiles").select("id, email, full_name").eq("email", memberEmail.trim().toLowerCase()).single();
    if (profErr || !prof) { setMemberError("No user found with that email."); setAddingMember(false); return; }
    const { data: mem, error: memErr } = await supabase.from("org_members").insert({ user_id: prof.id, org_id: org.id, school_id: memberSchoolId || null, role: memberRole }).select().single();
    if (memErr) { setMemberError(memErr.message); setAddingMember(false); return; }
    setMembers((p) => [...p, { ...(mem as OrgMember), email: prof.email, full_name: prof.full_name }]);
    setMemberEmail(""); setMemberSchoolId(""); setMemberRole("member"); setAddingMember(false);
  }

  const typeBadgeColor = org.type === "mat" ? "#A78BFA" : "#38BDF8";

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
            <Building2 size={16} className="text-[#38BDF8]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{org.name}</p>
              <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border"
                style={{ color: typeBadgeColor, background: `${typeBadgeColor}18`, borderColor: `${typeBadgeColor}40` }}>
                {org.type === "mat" ? "MAT" : "School"}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {schools.length} school{schools.length !== 1 ? "s" : ""} · {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onDelete(org.id)} className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all" title="Delete">
            <Trash2 size={12} className="text-red-400" />
          </button>
          <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all">
            {open ? <ChevronUp size={13} style={{ color: "var(--text-dim)" }} /> : <ChevronDown size={13} style={{ color: "var(--text-dim)" }} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>Schools</p>
            {schools.length === 0 && <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>No schools yet.</p>}
            <div className="flex flex-col gap-1.5 mb-2">
              {schools.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.name}</p>
                    {s.email && <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>{s.email}</p>}
                  </div>
                  <button onClick={() => removeSchool(s.id)} disabled={deletingSchool === s.id}
                    className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all disabled:opacity-50">
                    {deletingSchool === s.id ? <Loader2 size={10} className="animate-spin text-red-400" /> : <X size={10} className="text-red-400" />}
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddSchool} className="flex flex-wrap gap-2 items-end">
              <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="School name"
                className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-40" style={{ color: "var(--text)" }} />
              <input value={schoolEmail} onChange={(e) => setSchoolEmail(e.target.value)} placeholder="Email (optional)" type="email"
                className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-44" style={{ color: "var(--text)" }} />
              <button type="submit" disabled={addingSchool || !schoolName.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
                {addingSchool ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />} Add School
              </button>
            </form>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>Members</p>
            {members.length === 0 && <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>No members yet.</p>}
            <div className="flex flex-col gap-1.5 mb-2">
              {members.map((m) => {
                const assignedSchool = schools.find((s) => s.id === m.school_id);
                const roleColor = m.role === "admin" ? "#38BDF8" : "#94A3B8";
                return (
                  <div key={m.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[0.55rem] font-bold text-[#94A3B8]">{(m.full_name ?? m.email ?? "?")[0].toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>{m.full_name ?? m.email ?? m.user_id}</p>
                        <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>{assignedSchool?.name ?? "No school"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold border"
                        style={{ color: roleColor, background: `${roleColor}15`, borderColor: `${roleColor}40` }}>{m.role}</span>
                      <button onClick={() => removeMember(m.id)} disabled={deletingMember === m.id}
                        className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all disabled:opacity-50">
                        {deletingMember === m.id ? <Loader2 size={10} className="animate-spin text-red-400" /> : <X size={10} className="text-red-400" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleAddMember} className="flex flex-wrap gap-2 items-end">
              <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="User email" type="email"
                className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-48" style={{ color: "var(--text)" }} />
              {schools.length > 0 && (
                <select value={memberSchoolId} onChange={(e) => setMemberSchoolId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }}>
                  <option value="">No school</option>
                  {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              )}
              <select value={memberRole} onChange={(e) => setMemberRole(e.target.value as "admin" | "member")}
                className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" disabled={addingMember || !memberEmail.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
                {addingMember ? <Loader2 size={11} className="animate-spin" /> : <UserPlus size={11} />} Add Member
              </button>
              {memberError && <p className="text-xs text-red-400 w-full">{memberError}</p>}
            </form>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

type Tab = "assessments" | "users" | "organisations";

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("assessments");

  // Assessments state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [view, setView] = useState<"schools" | "all">("schools");

  // Users state
  const [users, setUsers] = useState<UserWithTools[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // Organisations state
  const [orgs, setOrgs] = useState<OrgWithDetails[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState<"school" | "mat">("school");
  const [newOrgManager, setNewOrgManager] = useState("");
  const [newOrgNotes, setNewOrgNotes] = useState("");
  const [newOrgLogo, setNewOrgLogo] = useState<string | null>(null);
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [showOrgForm, setShowOrgForm] = useState(false);

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

  const loadOrgs = useCallback(async () => {
    setOrgsLoading(true);
    const { data: orgRows, error } = await supabase.from("organisations").select("*").order("created_at", { ascending: false });
    if (error) { console.error("loadOrgs:", error); setOrgsLoading(false); return; }
    const orgIds = (orgRows ?? []).map((o: Organisation) => o.id);
    const [{ data: schoolRows }, { data: memberRows }] = await Promise.all([
      supabase.from("schools").select("*").in("org_id", orgIds.length ? orgIds : [""]),
      supabase.from("org_members").select("*").in("org_id", orgIds.length ? orgIds : [""]),
    ]);
    const memberUserIds = [...new Set((memberRows ?? []).map((m: OrgMember) => m.user_id))];
    const { data: profileRows } = memberUserIds.length
      ? await supabase.from("profiles").select("id, email, full_name").in("id", memberUserIds)
      : { data: [] };
    const profileMap: Record<string, { email: string; full_name: string | null }> = {};
    for (const p of profileRows ?? []) profileMap[p.id] = { email: p.email, full_name: p.full_name };
    setOrgs((orgRows ?? []).map((org: Organisation) => ({
      ...org,
      schools: (schoolRows ?? []).filter((s: SchoolType) => s.org_id === org.id),
      members: (memberRows ?? [])
        .filter((m: OrgMember) => m.org_id === org.id)
        .map((m: OrgMember) => ({ ...m, email: profileMap[m.user_id]?.email, full_name: profileMap[m.user_id]?.full_name ?? null })),
    })));
    setOrgsLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "organisations" && profile?.role === "admin") loadOrgs();
  }, [tab, profile, loadOrgs]);

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrgName.trim() || !user) return;
    setCreatingOrg(true);
    const { data, error } = await supabase
      .from("organisations")
      .insert({ name: newOrgName.trim(), type: newOrgType, manager_name: newOrgManager.trim() || null, notes: newOrgNotes.trim() || null, logo_url: newOrgLogo || null, created_by: user.id })
      .select()
      .single();
    if (error) { alert(`Failed to create: ${error.message}`); setCreatingOrg(false); return; }
    setOrgs((prev) => [{ ...(data as Organisation), schools: [], members: [] }, ...prev]);
    setNewOrgName("");
    setNewOrgType("school");
    setNewOrgManager("");
    setNewOrgNotes("");
    setNewOrgLogo(null);
    setShowOrgForm(false);
    setCreatingOrg(false);
  }

  async function handleDeleteOrg(orgId: string) {
    if (!confirm("Delete this organisation and all its schools? This cannot be undone.")) return;
    const { error } = await supabase.from("organisations").delete().eq("id", orgId);
    if (!error) setOrgs((prev) => prev.filter((o) => o.id !== orgId));
    else alert(`Failed to delete: ${error.message}`);
  }

  async function handleStatusChange(userId: string, status: "active" | "suspended" | "pending") {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
    if (error) { console.error("status update failed:", error); return; }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u));
  }

  async function handleToolToggle(userId: string, slug: string, enabled: boolean) {
    const { error } = await supabase.from("user_tools").upsert(
      { user_id: userId, tool_slug: slug, enabled },
      { onConflict: "user_id,tool_slug" }
    );
    if (error) { console.error("tool toggle failed:", error); alert(`Failed to save: ${error.message}`); return; }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, tools: { ...u.tools, [slug]: enabled } } : u));
  }

  function handleDelete(id: string) {
    deleteSubmission(id);
    setSubmissions(getSubmissions());
  }

  if (loading || profile?.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 size={24} className="animate-spin text-[#38BDF8]" /></div>;
  }

  // Modal
  const addUserModal = showAddUser && (
    <AddUserModal onClose={() => setShowAddUser(false)} onSuccess={loadUsers} />
  );

  const schools = [...new Set(submissions.map((s) => s.schoolName))];
  const toolCounts = submissions.reduce<Record<string, number>>((acc, s) => { acc[s.tool] = (acc[s.tool] ?? 0) + 1; return acc; }, {});
  const pendingCount = users.filter(u => u.status === "pending").length;

  return (
    <>
    {addUserModal}
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
          <button onClick={() => setTab("organisations")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${tab === "organisations" ? "bg-[rgba(56,189,248,0.15)] border-[rgba(56,189,248,0.3)] text-[#38BDF8]" : "glass border-transparent text-[#64748B] hover:text-white"}`}>
            <Building2 size={14} /> Organisations
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
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                {usersLoading ? "Loading…" : `${users.length} user${users.length !== 1 ? "s" : ""}`}
              </p>
              <button
                onClick={() => setShowAddUser(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                style={{ background: "rgba(56,189,248,0.12)", borderColor: "rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                <UserPlus size={14} /> Add User
              </button>
            </div>

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

        {/* ── Organisations tab ── */}
        {tab === "organisations" && (
          <>
            <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Orgs", value: orgs.length },
                  { label: "Schools", value: orgs.reduce((a, o) => a + o.schools.length, 0) },
                  { label: "Members", value: orgs.reduce((a, o) => a + o.members.length, 0) },
                ].map((stat) => (
                  <GlassCard key={stat.label} className="text-center py-3 px-4">
                    <p className="text-xl font-bold text-[#38BDF8]">{stat.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{stat.label}</p>
                  </GlassCard>
                ))}
              </div>
              <button
                onClick={() => setShowOrgForm(!showOrgForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                style={{ background: "rgba(56,189,248,0.15)", borderColor: "rgba(56,189,248,0.3)", color: "#38BDF8" }}
              >
                {showOrgForm ? <X size={14} /> : <Plus size={14} />}
                {showOrgForm ? "Cancel" : "Create Org"}
              </button>
            </div>

            {showOrgForm && (
              <GlassCard className="mb-5">
                <p className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>New Organisation</p>
                <form onSubmit={handleCreateOrg} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Organisation Name *</label>
                      <input value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} placeholder="e.g. Riverside Academy" required
                        className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Type</label>
                      <select value={newOrgType} onChange={(e) => setNewOrgType(e.target.value as "school" | "mat")}
                        className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }}>
                        <option value="school">Single School</option>
                        <option value="mat">MAT</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Manager Name</label>
                      <input value={newOrgManager} onChange={(e) => setNewOrgManager(e.target.value)} placeholder="e.g. Jane Smith"
                        className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Logo</label>
                      <div className="flex items-center gap-2">
                        {newOrgLogo ? (
                          <>
                            <img src={newOrgLogo} alt="Logo" className="h-9 w-auto object-contain rounded bg-white/10 p-0.5" />
                            <button type="button" onClick={() => setNewOrgLogo(null)} className="text-xs text-red-400 hover:text-red-300"><X size={12} /></button>
                          </>
                        ) : (
                          <label className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-xs cursor-pointer hover:border-white/20 transition-all" style={{ color: "var(--text-dim)" }}>
                            <Plus size={12} /> Upload logo
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const f = e.target.files?.[0]; if (!f) return;
                              const r = new FileReader(); r.onload = () => setNewOrgLogo(r.result as string); r.readAsDataURL(f);
                            }} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Consultant Notes <span className="font-normal opacity-60">(optional)</span></label>
                    <textarea value={newOrgNotes} onChange={(e) => setNewOrgNotes(e.target.value)} rows={3}
                      placeholder="Internal notes about this organisation..."
                      className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] resize-none" style={{ color: "var(--text)" }} />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={creatingOrg || !newOrgName.trim()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                      style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                      {creatingOrg ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Organisation
                    </button>
                  </div>
                </form>
              </GlassCard>
            )}

            {orgsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-[#38BDF8]" />
              </div>
            ) : orgs.length === 0 ? (
              <GlassCard className="text-center py-16">
                <Building2 size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
                <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No organisations yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Create one to get started.</p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-4">
                {orgs.map((org) => (
                  <AdminOrgCard key={org.id} org={org} onDelete={handleDeleteOrg} />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
    </>
  );
}
