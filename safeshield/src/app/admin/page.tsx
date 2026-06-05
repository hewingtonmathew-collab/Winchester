"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSubmissions, deleteSubmission, type Submission } from "@/lib/submissions";
import { Trash2, Mail, ShieldCheck, LayoutDashboard, ChevronDown, ChevronUp, Users, CheckCircle2, XCircle, Loader2, ToggleLeft, ToggleRight, AlertCircle, UserPlus, X, Building2, Plus, School, Network, Pencil, FileText, PowerOff, Power } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase, ALL_TOOLS, type Profile, type Organisation, type School as SchoolType, type OrgMember, type Report } from "@/lib/supabase";

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

// Reusable tool-access toggle grid. Super admin sets these toggles at the
// user, org, and school level. `enabled` maps tool_slug -> boolean (absent = off).
function ToolAccessGrid({ enabled, onToggle }: {
  enabled: Record<string, boolean>;
  onToggle: (slug: string, next: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {ALL_TOOLS.map((tool) => {
        const on = enabled[tool.slug] ?? false;
        return (
          <button key={tool.slug} type="button" onClick={() => onToggle(tool.slug, !on)}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all hover:bg-white/5 border border-transparent hover:border-white/10">
            <span className="text-xs text-[#94A3B8] text-left">{tool.name}</span>
            {on
              ? <ToggleRight size={20} className="shrink-0" style={{ color: TOOL_COLORS[tool.name] ?? "#38BDF8" }} />
              : <ToggleLeft size={20} className="text-[#334155] shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

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

type OrgType = "la_school" | "single_school" | "mat";

function UserCard({ u, onStatusChange, onToolToggle, onProfileSave }: {
  u: UserWithTools;
  onStatusChange: (id: string, status: "active" | "suspended" | "pending") => Promise<void>;
  onToolToggle: (userId: string, slug: string, enabled: boolean) => Promise<void>;
  onProfileSave: (userId: string, fields: { full_name: string | null; org_type: OrgType | null }) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(u.full_name ?? "");
  const [editOrgType, setEditOrgType] = useState<OrgType | "">(u.org_type ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  async function saveProfile() {
    setSavingProfile(true);
    await onProfileSave(u.id, { full_name: editName.trim() || null, org_type: editOrgType || null });
    setSavingProfile(false);
    setEditing(false);
  }

  function cancelEdit() {
    setEditName(u.full_name ?? "");
    setEditOrgType(u.org_type ?? "");
    setEditing(false);
  }

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
            <p className="text-xs text-[#64748B] truncate">{u.email}{u.org_type ? ` · ${u.org_type}` : ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setEditing((v) => !v)} title="Edit user"
            className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all">
            <Pencil size={12} className="text-[#38BDF8]" />
          </button>
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

      {editing && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">Edit User</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B]">Full name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full name"
                className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#64748B]">Organisation type</label>
              <select value={editOrgType} onChange={(e) => setEditOrgType(e.target.value as OrgType | "")}
                className="px-3 py-2 rounded-xl text-sm bg-[#0F172A] border border-white/10 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }}>
                <option value="">— None —</option>
                <option value="la_school">Local Authority School</option>
                <option value="single_school">Independent / Single School</option>
                <option value="mat">Multi-Academy Trust (MAT)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={saveProfile} disabled={savingProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
              style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
              {savingProfile ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Save
            </button>
            <button onClick={cancelEdit} className="px-3 py-1.5 rounded-xl text-xs font-medium glass border border-white/10 transition-all" style={{ color: "var(--text-dim)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

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

function readFileAsDataUrl(f: File, cb: (url: string) => void) {
  const r = new FileReader();
  r.onload = () => cb(r.result as string);
  r.readAsDataURL(f);
}

function AdminOrgCard({ org, onDelete }: { org: OrgWithDetails; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [orgState, setOrgState] = useState<Organisation>(org);
  const [schools, setSchools] = useState<SchoolType[]>(org.schools);
  const [members, setMembers] = useState(org.members);
  const [deletingSchool, setDeletingSchool] = useState<string | null>(null);
  const [deletingMember, setDeletingMember] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [addingSchool, setAddingSchool] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberSchoolId, setMemberSchoolId] = useState("");
  const [memberRole, setMemberRole] = useState<"admin" | "member">("member");
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [availableUsers, setAvailableUsers] = useState<{ id: string; email: string; full_name: string | null }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Org editing
  const [editingOrg, setEditingOrg] = useState(false);
  const [eName, setEName] = useState(org.name);
  const [eType, setEType] = useState<"school" | "mat">(org.type);
  const [eManager, setEManager] = useState(org.manager_name ?? "");
  const [eNotes, setENotes] = useState(org.notes ?? "");
  const [eLogo, setELogo] = useState<string | null>(org.logo_url);
  const [savingOrg, setSavingOrg] = useState(false);

  // School editing
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [esName, setEsName] = useState("");
  const [esEmail, setEsEmail] = useState("");
  const [esLogo, setEsLogo] = useState<string | null>(null);
  const [savingSchool, setSavingSchool] = useState(false);

  // Reports
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoaded, setReportsLoaded] = useState(false);
  const [expandedSchoolReports, setExpandedSchoolReports] = useState<Record<string, boolean>>({});

  // Org-level tool entitlements (org_tools): tool_slug -> enabled
  const [orgTools, setOrgTools] = useState<Record<string, boolean>>({});
  const [orgToolsLoaded, setOrgToolsLoaded] = useState(false);
  // School-level tool entitlements (school_tools): school_id -> tool_slug -> enabled
  const [schoolTools, setSchoolTools] = useState<Record<string, Record<string, boolean>>>({});
  // Which school's Tool Access grid is expanded
  const [expandedSchoolTools, setExpandedSchoolTools] = useState<Record<string, boolean>>({});
  // Org enable/disable busy flag
  const [togglingOrgStatus, setTogglingOrgStatus] = useState(false);
  const [togglingSchoolStatus, setTogglingSchoolStatus] = useState<string | null>(null);

  // Load available users (active, non-admin) when the card is first opened.
  useEffect(() => {
    if (!open || availableUsers.length > 0 || loadingUsers) return;
    setLoadingUsers(true);
    (async () => {
      const existingIds = members.map((m) => m.user_id);
      const { data } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("status", "active")
        .neq("role", "admin")
        .order("full_name");
      const filtered = (data ?? []).filter((u: { id: string }) => !existingIds.includes(u.id));
      setAvailableUsers(filtered);
      setLoadingUsers(false);
    })();
  }, [open, availableUsers.length, loadingUsers, members]);

  // Load org_tools + school_tools when the card is first opened.
  useEffect(() => {
    if (!open || orgToolsLoaded) return;
    (async () => {
      const { data: orgRows, error: orgErr } = await supabase
        .from("org_tools").select("tool_slug, enabled").eq("org_id", org.id);
      if (orgErr) { console.error("loadOrgTools:", orgErr); }
      else {
        const map: Record<string, boolean> = {};
        for (const r of orgRows ?? []) map[r.tool_slug] = r.enabled;
        setOrgTools(map);
      }
      const schoolIds = schools.map((s) => s.id);
      if (schoolIds.length) {
        const { data: stRows, error: stErr } = await supabase
          .from("school_tools").select("school_id, tool_slug, enabled").in("school_id", schoolIds);
        if (stErr) { console.error("loadSchoolTools:", stErr); }
        else {
          const map: Record<string, Record<string, boolean>> = {};
          for (const r of stRows ?? []) {
            if (!map[r.school_id]) map[r.school_id] = {};
            map[r.school_id][r.tool_slug] = r.enabled;
          }
          setSchoolTools(map);
        }
      }
      setOrgToolsLoaded(true);
    })();
  }, [open, orgToolsLoaded, schools, org.id]);

  async function toggleOrgTool(slug: string, enabled: boolean) {
    const { error } = await supabase.from("org_tools").upsert(
      { org_id: org.id, tool_slug: slug, enabled },
      { onConflict: "org_id,tool_slug" }
    );
    if (error) { alert(`Failed to save tool access: ${error.message}`); return; }
    setOrgTools((p) => ({ ...p, [slug]: enabled }));
  }

  async function toggleSchoolTool(schoolId: string, slug: string, enabled: boolean) {
    const { error } = await supabase.from("school_tools").upsert(
      { school_id: schoolId, tool_slug: slug, enabled },
      { onConflict: "school_id,tool_slug" }
    );
    if (error) { alert(`Failed to save tool access: ${error.message}`); return; }
    setSchoolTools((p) => ({ ...p, [schoolId]: { ...(p[schoolId] ?? {}), [slug]: enabled } }));
  }

  async function toggleOrgStatus() {
    const next = orgState.status === "disabled" ? "active" : "disabled";
    setTogglingOrgStatus(true);
    const { error } = await supabase.from("organisations").update({ status: next }).eq("id", org.id);
    setTogglingOrgStatus(false);
    if (error) { alert(`Failed to update status: ${error.message}`); return; }
    setOrgState((p) => ({ ...p, status: next }));
  }

  async function toggleSchoolStatus(s: SchoolType) {
    const next = s.status === "disabled" ? "active" : "disabled";
    setTogglingSchoolStatus(s.id);
    const { error } = await supabase.from("schools").update({ status: next }).eq("id", s.id);
    setTogglingSchoolStatus(null);
    if (error) { alert(`Failed to update status: ${error.message}`); return; }
    setSchools((p) => p.map((x) => x.id === s.id ? { ...x, status: next } : x));
  }

  useEffect(() => {
    if (!open || reportsLoaded) return;
    (async () => {
      const schoolIds = schools.map((s) => s.id);
      const orParts: string[] = [`org_id.eq.${org.id}`];
      if (schoolIds.length) orParts.push(`school_id.in.(${schoolIds.join(",")})`);
      const { data, error } = await supabase.from("reports").select("*").or(orParts.join(","));
      if (error) { console.error("loadReports:", error); return; }
      setReports((data ?? []) as Report[]);
      setReportsLoaded(true);
    })();
  }, [open, reportsLoaded, schools, org.id]);

  async function deleteReport(id: string) {
    if (!confirm("Delete this report? This cannot be undone.")) return;
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) { alert(`Failed to delete: ${error.message}`); return; }
    setReports((p) => p.filter((r) => r.id !== id));
  }

  async function saveOrg() {
    setSavingOrg(true);
    const fields = { name: eName.trim(), type: eType, manager_name: eManager.trim() || null, notes: eNotes.trim() || null, logo_url: eLogo };
    const { error } = await supabase.from("organisations").update(fields).eq("id", org.id);
    setSavingOrg(false);
    if (error) { alert(`Failed to save: ${error.message}`); return; }
    setOrgState((p) => ({ ...p, ...fields }));
    setEditingOrg(false);
  }

  function cancelOrgEdit() {
    setEName(orgState.name); setEType(orgState.type); setEManager(orgState.manager_name ?? "");
    setENotes(orgState.notes ?? ""); setELogo(orgState.logo_url); setEditingOrg(false);
  }

  function startSchoolEdit(s: SchoolType) {
    setEditingSchoolId(s.id); setEsName(s.name); setEsEmail(s.email ?? ""); setEsLogo(s.logo_url);
  }

  async function saveSchool(id: string) {
    setSavingSchool(true);
    const fields = { name: esName.trim(), email: esEmail.trim() || null, logo_url: esLogo };
    const { error } = await supabase.from("schools").update(fields).eq("id", id);
    setSavingSchool(false);
    if (error) { alert(`Failed to save: ${error.message}`); return; }
    setSchools((p) => p.map((s) => s.id === id ? { ...s, ...fields } : s));
    setEditingSchoolId(null);
  }

  async function updateMember(id: string, fields: { role?: "admin" | "member"; school_id?: string | null }) {
    const { error } = await supabase.from("org_members").update(fields).eq("id", id);
    if (error) { alert(`Failed to update: ${error.message}`); return; }
    setMembers((p) => p.map((m) => m.id === id ? { ...m, ...fields } : m));
  }

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
    if (!memberUserId) return;
    setAddingMember(true);
    setMemberError("");
    const prof = availableUsers.find((u) => u.id === memberUserId);
    if (!prof) { setMemberError("User not found."); setAddingMember(false); return; }
    const { data: mem, error: memErr } = await supabase.from("org_members").insert({ user_id: prof.id, org_id: org.id, school_id: memberSchoolId || null, role: memberRole }).select().single();
    if (memErr) { setMemberError(memErr.message); setAddingMember(false); return; }
    setMembers((p) => [...p, { ...(mem as OrgMember), email: prof.email, full_name: prof.full_name }]);
    setAvailableUsers((p) => p.filter((u) => u.id !== prof.id));
    setMemberUserId(""); setMemberSchoolId(""); setMemberRole("member"); setAddingMember(false);
  }

  const typeBadgeColor = orgState.type === "mat" ? "#A78BFA" : "#38BDF8";

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {orgState.logo_url ? (
            <img src={orgState.logo_url} alt="" className="w-9 h-9 object-contain rounded-xl bg-white/10 p-0.5 shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
              <Building2 size={16} className="text-[#38BDF8]" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{orgState.name}</p>
              <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border"
                style={{ color: typeBadgeColor, background: `${typeBadgeColor}18`, borderColor: `${typeBadgeColor}40` }}>
                {orgState.type === "mat" ? "MAT" : "School"}
              </span>
              {orgState.status === "disabled" && (
                <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border"
                  style={{ color: "#ef4444", background: "#ef444418", borderColor: "#ef444440" }}>
                  Disabled
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {schools.length} school{schools.length !== 1 ? "s" : ""} · {members.length} member{members.length !== 1 ? "s" : ""}
              {orgState.manager_name ? ` · ${orgState.manager_name}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => { setEditingOrg((v) => !v); setOpen(true); }} className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all" title="Edit organisation">
            <Pencil size={12} className="text-[#38BDF8]" />
          </button>
          <button onClick={toggleOrgStatus} disabled={togglingOrgStatus}
            className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all disabled:opacity-50"
            title={orgState.status === "disabled" ? "Enable organisation" : "Disable organisation"}>
            {togglingOrgStatus
              ? <Loader2 size={12} className="animate-spin text-[#475569]" />
              : orgState.status === "disabled"
                ? <Power size={12} className="text-green-400" />
                : <PowerOff size={12} className="text-amber-400" />}
          </button>
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
          {editingOrg && (
            <div className="rounded-xl border border-[rgba(56,189,248,0.2)] bg-[rgba(56,189,248,0.04)] p-4 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Edit Organisation</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "var(--text-dim)" }}>Name</label>
                  <input value={eName} onChange={(e) => setEName(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "var(--text-dim)" }}>Type</label>
                  <select value={eType} onChange={(e) => setEType(e.target.value as "school" | "mat")}
                    className="px-3 py-2 rounded-xl text-sm bg-[#0F172A] border border-white/10 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }}>
                    <option value="school">Single School</option>
                    <option value="mat">MAT</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "var(--text-dim)" }}>Manager Name</label>
                  <input value={eManager} onChange={(e) => setEManager(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text)" }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "var(--text-dim)" }}>Logo</label>
                  <div className="flex items-center gap-2">
                    {eLogo ? (
                      <>
                        <img src={eLogo} alt="Logo" className="h-9 w-auto object-contain rounded bg-white/10 p-0.5" />
                        <button type="button" onClick={() => setELogo(null)} className="text-xs text-red-400 hover:text-red-300"><X size={12} /></button>
                      </>
                    ) : (
                      <label className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-xs cursor-pointer hover:border-white/20 transition-all" style={{ color: "var(--text-dim)" }}>
                        <Plus size={12} /> Upload logo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFileAsDataUrl(f, setELogo); }} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs" style={{ color: "var(--text-dim)" }}>Notes</label>
                <textarea value={eNotes} onChange={(e) => setENotes(e.target.value)} rows={2}
                  className="px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] resize-none" style={{ color: "var(--text)" }} />
              </div>
              <div className="flex gap-2">
                <button onClick={saveOrg} disabled={savingOrg || !eName.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                  style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                  {savingOrg ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />} Save
                </button>
                <button onClick={cancelOrgEdit} className="px-3 py-1.5 rounded-xl text-xs font-medium glass border border-white/10 transition-all" style={{ color: "var(--text-dim)" }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Org-level tool entitlements. Effective access = user_tools AND
              org_tools AND school_tools (see comment in lib/supabase.ts). */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>Tool Access (Organisation)</p>
            <p className="text-[0.65rem] mb-3" style={{ color: "var(--text-faint)" }}>
              Tools this organisation is allowed to use. A user sees a tool only if it is enabled for them AND here AND for their school.
            </p>
            <ToolAccessGrid enabled={orgTools} onToggle={toggleOrgTool} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>Schools</p>
            {schools.length === 0 && <p className="text-xs mb-2" style={{ color: "var(--text-faint)" }}>No schools yet.</p>}
            <div className="flex flex-col gap-1.5 mb-2">
              {schools.map((s) => {
                const schoolReports = reports.filter((r) => r.school_id === s.id);
                const reportsOpen = expandedSchoolReports[s.id];
                return (
                <div key={s.id} className="rounded-xl bg-white/[0.02] border border-white/5">
                  {editingSchoolId === s.id ? (
                    <div className="p-3 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2 items-end">
                        <input value={esName} onChange={(e) => setEsName(e.target.value)} placeholder="School name"
                          className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-40" style={{ color: "var(--text)" }} />
                        <input value={esEmail} onChange={(e) => setEsEmail(e.target.value)} placeholder="Email" type="email"
                          className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-44" style={{ color: "var(--text)" }} />
                        {esLogo ? (
                          <div className="flex items-center gap-1">
                            <img src={esLogo} alt="" className="h-7 w-auto object-contain rounded bg-white/10 p-0.5" />
                            <button type="button" onClick={() => setEsLogo(null)} className="text-red-400"><X size={11} /></button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 text-xs cursor-pointer hover:border-white/20" style={{ color: "var(--text-dim)" }}>
                            <Plus size={11} /> Logo
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFileAsDataUrl(f, setEsLogo); }} />
                          </label>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveSchool(s.id)} disabled={savingSchool || !esName.trim()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                          style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                          {savingSchool ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />} Save
                        </button>
                        <button onClick={() => setEditingSchoolId(null)} className="px-3 py-1.5 rounded-xl text-xs font-medium glass border border-white/10" style={{ color: "var(--text-dim)" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {s.logo_url ? (
                          <img src={s.logo_url} alt="" className="w-6 h-6 object-contain rounded bg-white/10 p-0.5 shrink-0" />
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <School size={11} className="text-[#38BDF8]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>{s.name}</p>
                          {s.email && <p className="text-[0.65rem] truncate" style={{ color: "var(--text-faint)" }}>{s.email}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {s.status === "disabled" && (
                          <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border"
                            style={{ color: "#ef4444", background: "#ef444418", borderColor: "#ef444440" }}>
                            Disabled
                          </span>
                        )}
                        <button onClick={() => setExpandedSchoolReports((p) => ({ ...p, [s.id]: !p[s.id] }))}
                          className="flex items-center gap-1 px-2 h-6 rounded-lg glass hover:bg-white/10 transition-all text-[0.65rem]" style={{ color: "var(--text-dim)" }} title="Reports">
                          <FileText size={10} className="text-[#38BDF8]" /> {schoolReports.length}
                        </button>
                        <button onClick={() => setExpandedSchoolTools((p) => ({ ...p, [s.id]: !p[s.id] }))}
                          className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all" title="Tool access">
                          <ToggleRight size={11} className="text-[#38BDF8]" />
                        </button>
                        <button onClick={() => toggleSchoolStatus(s)} disabled={togglingSchoolStatus === s.id}
                          className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all disabled:opacity-50"
                          title={s.status === "disabled" ? "Enable school" : "Disable school"}>
                          {togglingSchoolStatus === s.id
                            ? <Loader2 size={10} className="animate-spin text-[#475569]" />
                            : s.status === "disabled"
                              ? <Power size={10} className="text-green-400" />
                              : <PowerOff size={10} className="text-amber-400" />}
                        </button>
                        <button onClick={() => startSchoolEdit(s)} className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all" title="Edit">
                          <Pencil size={10} className="text-[#38BDF8]" />
                        </button>
                        <button onClick={() => removeSchool(s.id)} disabled={deletingSchool === s.id}
                          className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all disabled:opacity-50">
                          {deletingSchool === s.id ? <Loader2 size={10} className="animate-spin text-red-400" /> : <X size={10} className="text-red-400" />}
                        </button>
                      </div>
                    </div>
                  )}
                  {expandedSchoolTools[s.id] && (
                    <div className="px-3 pb-3 pt-0">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>Tool Access (School)</p>
                      <ToolAccessGrid
                        enabled={schoolTools[s.id] ?? {}}
                        onToggle={(slug, next) => toggleSchoolTool(s.id, slug, next)}
                      />
                    </div>
                  )}
                  {reportsOpen && (
                    <div className="px-3 pb-3 pt-0">
                      {schoolReports.length === 0 ? (
                        <p className="text-[0.65rem]" style={{ color: "var(--text-faint)" }}>No reports for this school.</p>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {schoolReports.map((r) => <ReportRow key={r.id} r={r} onDelete={deleteReport} />)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                );
              })}
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
                      <select value={m.school_id ?? ""} onChange={(e) => updateMember(m.id, { school_id: e.target.value || null })}
                        className="px-2 py-1 rounded-lg text-[0.65rem] bg-[#0F172A] border border-white/10 outline-none focus:border-[rgba(56,189,248,0.4)]" style={{ color: "var(--text-dim)" }} title="School">
                        <option value="">No school</option>
                        {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <select value={m.role} onChange={(e) => updateMember(m.id, { role: e.target.value as "admin" | "member" })}
                        className="px-2 py-1 rounded-lg text-[0.65rem] bg-[#0F172A] border outline-none focus:border-[rgba(56,189,248,0.4)]"
                        style={{ color: roleColor, borderColor: `${roleColor}40` }} title="Role">
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
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
              <select value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)}
                disabled={loadingUsers}
                className="px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)] w-52" style={{ color: "var(--text)" }}>
                <option value="">{loadingUsers ? "Loading users…" : availableUsers.length === 0 ? "No users available" : "Select user…"}</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name ? `${u.full_name} (${u.email})` : u.email}</option>
                ))}
              </select>
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
              <button type="submit" disabled={addingMember || !memberUserId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
                {addingMember ? <Loader2 size={11} className="animate-spin" /> : <UserPlus size={11} />} Add Member
              </button>
              {memberError && <p className="text-xs text-red-400 w-full">{memberError}</p>}
            </form>
          </div>

          {(() => {
            const orgOnlyReports = reports.filter((r) => !r.school_id);
            if (orgOnlyReports.length === 0) return null;
            return (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-dim)" }}>
                  Org Reports (no school) · {orgOnlyReports.length}
                </p>
                <div className="flex flex-col gap-1.5">
                  {orgOnlyReports.map((r) => <ReportRow key={r.id} r={r} onDelete={deleteReport} />)}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </GlassCard>
  );
}

function ReportRow({ r, onDelete }: { r: Report; onDelete: (id: string) => void }) {
  const color = TOOL_COLORS[r.tool_name] ?? "#38BDF8";
  const date = new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 w-2 h-2 rounded-full" style={{ background: color }} />
        <div className="min-w-0">
          <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>{r.tool_name}</p>
          <p className="text-[0.65rem] truncate" style={{ color: "var(--text-faint)" }}>
            {date}{r.staff_member ? ` · ${r.staff_member}` : ""}{r.rating ? ` · ${r.rating}` : ""}
            {r.areas?.length ? ` · ${r.areas.map((a) => a.name).join(", ")}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <ScoreBadge score={r.score} color={color} />
        <button onClick={() => onDelete(r.id)} className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all" title="Delete report">
          <Trash2 size={10} className="text-red-400" />
        </button>
      </div>
    </div>
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

  const loadSubmissions = useCallback(async () => {
    // Load from Supabase first, fall back to localStorage for legacy data
    const { data: remoteReports } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (remoteReports && remoteReports.length > 0) {
      // Map Supabase reports to Submission shape
      const mapped: Submission[] = remoteReports.map((r) => ({
        id: r.id,
        tool: r.tool_name,
        schoolName: r.school_name,
        schoolEmail: r.school_email ?? "",
        consultantName: r.consultant_name ?? "",
        consultantEmail: r.consultant_email ?? "",
        staffMember: r.staff_member ?? "",
        logoDataUrl: r.logo_data_url ?? null,
        score: r.score,
        rating: r.rating,
        ratingColor: r.rating_color,
        date: r.created_at,
        areas: r.areas ?? undefined,
      }));
      setSubmissions(mapped);
    } else {
      setSubmissions(getSubmissions());
    }
  }, []);

  useEffect(() => {
    if (profile?.role === "admin") loadSubmissions();
  }, [profile, loadSubmissions]);

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

  async function handleProfileSave(userId: string, fields: { full_name: string | null; org_type: OrgType | null }) {
    const { error } = await supabase.from("profiles").update(fields).eq("id", userId);
    if (error) { console.error("profile update failed:", error); alert(`Failed to save: ${error.message}`); return; }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...fields } : u));
  }

  async function handleToolToggle(userId: string, slug: string, enabled: boolean) {
    const { error } = await supabase.from("user_tools").upsert(
      { user_id: userId, tool_slug: slug, enabled },
      { onConflict: "user_id,tool_slug" }
    );
    if (error) { console.error("tool toggle failed:", error); alert(`Failed to save: ${error.message}`); return; }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, tools: { ...u.tools, [slug]: enabled } } : u));
  }

  async function handleDelete(id: string) {
    await supabase.from("reports").delete().eq("id", id);
    deleteSubmission(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
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
                    <UserCard key={u.id} u={u} onStatusChange={handleStatusChange} onToolToggle={handleToolToggle} onProfileSave={handleProfileSave} />
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
