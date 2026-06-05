"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Plus,
  School as SchoolIcon,
  Users,
  ChevronDown,
  ChevronUp,
  Trash2,
  Loader2,
  X,
  UserPlus,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Organisation, School as SchoolType, OrgMember } from "@/lib/supabase";

type OrgWithDetails = Organisation & {
  schools: SchoolType[];
  members: (OrgMember & { email?: string; full_name?: string | null })[];
};

// ── Create Org Form ─────────────────────────────────────────────────────────

function CreateOrgForm({ onCreated }: { onCreated: (org: Organisation) => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState<"school" | "mat">("school");
  const [manager, setManager] = useState("");
  const [notes, setNotes] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase
      .from("organisations")
      .insert({ name: name.trim(), type, manager_name: manager.trim() || null, notes: notes.trim() || null, logo_url: logo || null, created_by: user?.id ?? null })
      .select()
      .single();
    if (err) { setError(err.message); setBusy(false); return; }
    setName(""); setType("school"); setManager(""); setNotes(""); setLogo(null);
    setBusy(false);
    onCreated(data as Organisation);
  }

  const inputCls = "px-3 py-2 rounded-xl text-sm glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Organisation Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Riverside Academy" required className={inputCls} style={{ color: "var(--text)" }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as "school" | "mat")} className={inputCls} style={{ color: "var(--text)" }}>
            <option value="school">Single School</option>
            <option value="mat">MAT</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Manager Name</label>
          <input value={manager} onChange={(e) => setManager(e.target.value)} placeholder="e.g. Jane Smith" className={inputCls} style={{ color: "var(--text)" }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Logo</label>
          <div className="flex items-center gap-2">
            {logo ? (
              <>
                <img src={logo} alt="Logo" className="h-9 w-auto object-contain rounded bg-white/10 p-0.5" />
                <button type="button" onClick={() => setLogo(null)} className="text-xs text-red-400 hover:text-red-300"><X size={12} /></button>
              </>
            ) : (
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10 text-xs cursor-pointer hover:border-white/20 transition-all" style={{ color: "var(--text-dim)" }}>
                <Plus size={12} /> Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader(); r.onload = () => setLogo(r.result as string); r.readAsDataURL(f);
                }} />
              </label>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Consultant Notes <span className="font-normal opacity-60">(optional)</span></label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes about this organisation..."
          className={`${inputCls} resize-none`} style={{ color: "var(--text)" }} />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={busy || !name.trim()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Create Organisation
        </button>
      </div>
    </form>
  );
}

// ── Add School Form ─────────────────────────────────────────────────────────

function AddSchoolForm({ orgId, onAdded }: { orgId: string; onAdded: (school: SchoolType) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    const { data, error: err } = await supabase
      .from("schools")
      .insert({ org_id: orgId, name: name.trim(), email: email.trim() || null, logo_url: logo || null })
      .select()
      .single();
    if (err) { setError(err.message); setBusy(false); return; }
    setName(""); setEmail(""); setLogo(null);
    setBusy(false);
    onAdded(data as SchoolType);
  }

  const inputCls = "px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end mt-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="School name" required className={`${inputCls} w-44`} style={{ color: "var(--text)" }} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className={`${inputCls} w-44`} style={{ color: "var(--text)" }} />
      <div className="flex items-center gap-1.5">
        {logo ? (
          <>
            <img src={logo} alt="" className="h-7 w-auto object-contain rounded bg-white/10 p-0.5" />
            <button type="button" onClick={() => setLogo(null)} className="text-red-400"><X size={10} /></button>
          </>
        ) : (
          <label className={`${inputCls} flex items-center gap-1 cursor-pointer`} style={{ color: "var(--text-dim)" }}>
            <Plus size={10} /> Logo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (!f) return;
              const r = new FileReader(); r.onload = () => setLogo(r.result as string); r.readAsDataURL(f);
            }} />
          </label>
        )}
      </div>
      <button type="submit" disabled={busy || !name.trim()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
        style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
        {busy ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add School
      </button>
      {error && <p className="text-xs text-red-400 w-full">{error}</p>}
    </form>
  );
}

// ── Add Member Form ─────────────────────────────────────────────────────────

function AddMemberForm({
  orgId,
  schools,
  onAdded,
}: {
  orgId: string;
  schools: SchoolType[];
  onAdded: (member: OrgMember & { email?: string; full_name?: string | null }) => void;
}) {
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [userId, setUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<{ id: string; email: string; full_name: string | null }[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("id, email, full_name").eq("status", "active").neq("role", "admin").order("full_name")
      .then(({ data }) => setUsers(data ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    let profile: { id: string; email: string; full_name: string | null } | null = null;

    if (mode === "new") {
      if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
        setError("Name, email and password are all required."); setBusy(false); return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters."); setBusy(false); return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/create-member", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token ?? ""}` },
        body: JSON.stringify({ name: newName.trim(), email: newEmail.trim(), password: newPassword }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Could not create account."); setBusy(false); return; }
      profile = json.user as { id: string; email: string; full_name: string | null };
    } else {
      if (!userId) { setError("Please select a user."); setBusy(false); return; }
      profile = users.find((u) => u.id === userId) ?? null;
      if (!profile) { setError("User not found."); setBusy(false); return; }
    }

    const { data: member, error: memErr } = await supabase
      .from("org_members")
      .insert({ user_id: profile.id, org_id: orgId, school_id: schoolId || null, role })
      .select()
      .single();

    if (memErr) {
      setError(memErr.message.includes("unique") ? "This user is already a member." : memErr.message);
      setBusy(false);
      return;
    }

    setUserId(""); setNewName(""); setNewEmail(""); setNewPassword("");
    setSchoolId(""); setRole("member");
    setBusy(false);
    onAdded({ ...(member as OrgMember), email: profile.email, full_name: profile.full_name ?? null });
  }

  const selectCls = "px-3 py-1.5 rounded-xl text-xs glass border border-white/10 bg-white/5 outline-none focus:border-[rgba(56,189,248,0.4)]";

  return (
    <div className="border border-white/8 rounded-xl p-3 bg-white/[0.02] mt-3">
      <div className="flex gap-2 mb-3">
        <button type="button" onClick={() => setMode("new")}
          className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
          style={{ background: mode === "new" ? "rgba(56,189,248,0.15)" : "transparent", border: mode === "new" ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent", color: mode === "new" ? "#38BDF8" : "#64748B" }}>
          + New person
        </button>
        <button type="button" onClick={() => setMode("existing")}
          className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
          style={{ background: mode === "existing" ? "rgba(56,189,248,0.15)" : "transparent", border: mode === "existing" ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent", color: mode === "existing" ? "#38BDF8" : "#64748B" }}>
          Existing user
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        {mode === "new" ? (
          <>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" required className={`${selectCls} w-36`} style={{ color: "var(--text)" }} />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" type="email" required className={`${selectCls} w-40`} style={{ color: "var(--text)" }} />
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password (min 8)" type="password" required minLength={8} className={`${selectCls} w-36`} style={{ color: "var(--text)" }} />
          </>
        ) : (
          <select value={userId} onChange={(e) => setUserId(e.target.value)} className={`${selectCls} w-52`} style={{ color: userId ? "var(--text)" : "var(--text-dim)" }}>
            <option value="">{users.length === 0 ? "No users available" : "Select a user..."}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name ?? u.email} — {u.email}</option>
            ))}
          </select>
        )}
        {schools.length > 0 && (
          <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className={selectCls} style={{ color: "var(--text)" }}>
            <option value="">No school assignment</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
        <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "member")} className={selectCls} style={{ color: "var(--text)" }}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={busy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
          Add Member
        </button>
        {error && <p className="text-xs text-red-400 w-full">{error}</p>}
      </form>
    </div>
  );
}

// ── Org Card ────────────────────────────────────────────────────────────────

function OrgCard({
  org,
  onDelete,
  canDelete,
}: {
  org: OrgWithDetails;
  onDelete: (id: string) => void;
  canDelete: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolType[]>(org.schools);
  const [members, setMembers] = useState(org.members);
  const [deletingSchool, setDeletingSchool] = useState<string | null>(null);
  const [deletingMember, setDeletingMember] = useState<string | null>(null);

  async function removeSchool(schoolId: string) {
    setDeletingSchool(schoolId);
    const { error } = await supabase.from("schools").delete().eq("id", schoolId);
    if (!error) setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    setDeletingSchool(null);
  }

  async function removeMember(memberId: string) {
    setDeletingMember(memberId);
    const { error } = await supabase.from("org_members").delete().eq("id", memberId);
    if (!error) setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setDeletingMember(null);
  }

  const typeBadgeColor = org.type === "mat" ? "#A78BFA" : "#38BDF8";

  return (
    <GlassCard>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)] overflow-hidden">
            {org.logo_url
              ? <img src={org.logo_url} alt="" className="w-full h-full object-contain p-1" />
              : <Building2 size={18} className="text-[#38BDF8]" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{org.name}</p>
              <span
                className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide border"
                style={{
                  color: typeBadgeColor,
                  background: `${typeBadgeColor}18`,
                  borderColor: `${typeBadgeColor}40`,
                }}
              >
                {org.type === "mat" ? "MAT" : "School"}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {schools.length} school{schools.length !== 1 ? "s" : ""} · {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canDelete && (
            <button
              onClick={() => onDelete(org.id)}
              className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all"
              title="Delete organisation"
            >
              <Trash2 size={13} className="text-red-400" />
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="w-7 h-7 rounded-lg flex items-center justify-center glass hover:bg-white/10 transition-all"
          >
            {open ? <ChevronUp size={13} style={{ color: "var(--text-dim)" }} /> : <ChevronDown size={13} style={{ color: "var(--text-dim)" }} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-5 space-y-5">
          {/* Schools */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SchoolIcon size={13} style={{ color: "var(--text-dim)" }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Schools</p>
            </div>
            {schools.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>No schools yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {schools.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/5 border border-white/10 overflow-hidden">
                        {school.logo_url
                          ? <img src={school.logo_url} alt="" className="w-full h-full object-contain p-0.5" />
                          : <SchoolIcon size={12} style={{ color: "var(--text-dim)" }} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>{school.name}</p>
                        {school.email && <p className="text-[0.65rem] truncate" style={{ color: "var(--text-faint)" }}>{school.email}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link href={`/school/${school.id}`} className="text-[0.65rem] px-2 py-0.5 rounded-lg glass border border-white/10 hover:border-[rgba(56,189,248,0.3)] transition-all" style={{ color: "var(--text-dim)" }}>
                        View Profile
                      </Link>
                      <button
                        onClick={() => removeSchool(school.id)}
                        disabled={deletingSchool === school.id}
                        className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all disabled:opacity-50"
                      >
                      {deletingSchool === school.id ? (
                        <Loader2 size={10} className="animate-spin text-red-400" />
                      ) : (
                        <X size={10} className="text-red-400" />
                      )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <AddSchoolForm orgId={org.id} onAdded={(s) => setSchools((prev) => [...prev, s])} />
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users size={13} style={{ color: "var(--text-dim)" }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>Members</p>
            </div>
            {members.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>No members yet.</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {members.map((member) => {
                  const assignedSchool = schools.find((s) => s.id === member.school_id);
                  const roleColor = member.role === "admin" ? "#38BDF8" : "#94A3B8";
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[0.6rem] font-bold text-[#94A3B8]">
                            {(member.full_name ?? member.email ?? "?")[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>
                            {member.full_name ?? member.email ?? member.user_id}
                          </p>
                          <p className="text-[0.65rem] truncate" style={{ color: "var(--text-faint)" }}>
                            {assignedSchool ? assignedSchool.name : "No school assigned"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-[0.6rem] px-1.5 py-0.5 rounded-full font-semibold border"
                          style={{ color: roleColor, background: `${roleColor}15`, borderColor: `${roleColor}40` }}
                        >
                          {member.role}
                        </span>
                        <button
                          onClick={() => removeMember(member.id)}
                          disabled={deletingMember === member.id}
                          className="w-6 h-6 rounded-lg flex items-center justify-center glass hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          {deletingMember === member.id ? (
                            <Loader2 size={10} className="animate-spin text-red-400" />
                          ) : (
                            <X size={10} className="text-red-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <AddMemberForm
              orgId={org.id}
              schools={schools}
              onAdded={(m) => setMembers((prev) => [...prev, m])}
            />
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function OrgPage() {
  const router = useRouter();
  const { user, profile, loading, isOrgAdmin } = useAuth();
  const [orgs, setOrgs] = useState<OrgWithDetails[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const isAdmin = profile?.role === "admin";

  const loadOrgs = useCallback(async () => {
    if (!user) return;
    setOrgsLoading(true);

    let orgsQuery = supabase.from("organisations").select("*").order("created_at", { ascending: false });

    if (!isAdmin) {
      // Only load orgs where user is an admin member
      const { data: adminMemberships } = await supabase
        .from("org_members")
        .select("org_id")
        .eq("user_id", user.id)
        .eq("role", "admin");
      const orgIds = (adminMemberships ?? []).map((m: { org_id: string }) => m.org_id);
      if (orgIds.length === 0) {
        setOrgs([]);
        setOrgsLoading(false);
        return;
      }
      orgsQuery = orgsQuery.in("id", orgIds);
    }

    const { data: orgRows, error } = await orgsQuery;
    if (error) {
      console.error("Failed to load orgs:", error);
      setOrgsLoading(false);
      return;
    }

    const orgIds = (orgRows ?? []).map((o: Organisation) => o.id);

    const [{ data: schoolRows }, { data: memberRows }] = await Promise.all([
      supabase.from("schools").select("*").in("org_id", orgIds.length ? orgIds : [""]),
      supabase.from("org_members").select("*").in("org_id", orgIds.length ? orgIds : [""]),
    ]);

    // Fetch profile data for members
    const memberUserIds = [...new Set((memberRows ?? []).map((m: OrgMember) => m.user_id))];
    const { data: profileRows } = memberUserIds.length
      ? await supabase.from("profiles").select("id, email, full_name").in("id", memberUserIds)
      : { data: [] };

    const profileMap: Record<string, { email: string; full_name: string | null }> = {};
    for (const p of profileRows ?? []) {
      profileMap[p.id] = { email: p.email, full_name: p.full_name };
    }

    const enrichedOrgs: OrgWithDetails[] = (orgRows ?? []).map((org: Organisation) => ({
      ...org,
      schools: (schoolRows ?? []).filter((s: SchoolType) => s.org_id === org.id),
      members: (memberRows ?? [])
        .filter((m: OrgMember) => m.org_id === org.id)
        .map((m: OrgMember) => ({
          ...m,
          email: profileMap[m.user_id]?.email,
          full_name: profileMap[m.user_id]?.full_name ?? null,
        })),
    }));

    setOrgs(enrichedOrgs);
    setOrgsLoading(false);
  }, [user, isAdmin]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!loading && !isAdmin && !isOrgAdmin) {
      router.replace("/");
      return;
    }
    if (!loading && user) loadOrgs();
  }, [loading, user, isAdmin, isOrgAdmin, router, loadOrgs]);

  async function handleDeleteOrg(orgId: string) {
    if (!confirm("Delete this organisation and all its schools? This cannot be undone.")) return;
    const { error } = await supabase.from("organisations").delete().eq("id", orgId);
    if (!error) setOrgs((prev) => prev.filter((o) => o.id !== orgId));
    else alert(`Failed to delete: ${error.message}`);
  }

  function handleOrgCreated(org: Organisation) {
    const newOrg: OrgWithDetails = { ...org, schools: [], members: [] };
    setOrgs((prev) => [newOrg, ...prev]);
    setShowCreateForm(false);
  }

  if (loading || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin text-[#38BDF8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="pt-10 pb-8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.2)]">
              <Building2 size={22} className="text-[#38BDF8]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#38BDF8] text-xs font-medium uppercase tracking-widest mb-1">Management</p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>Organisations</h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Manage your organisations, schools and members.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all self-end"
            style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}
          >
            {showCreateForm ? <X size={14} /> : <Plus size={14} />}
            {showCreateForm ? "Cancel" : "Create Organisation"}
          </button>
        </div>

        {/* Create form */}
        {showCreateForm && (
          <GlassCard className="mb-6">
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>New Organisation</p>
            <CreateOrgForm onCreated={handleOrgCreated} />
          </GlassCard>
        )}

        {/* Orgs list */}
        {orgsLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#38BDF8]" />
          </div>
        ) : orgs.length === 0 ? (
          <GlassCard className="text-center py-16">
            <Building2 size={32} className="text-[#38BDF8] mx-auto mb-4 opacity-40" />
            <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No organisations yet</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Create an organisation to get started.</p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {orgs.map((org) => (
              <OrgCard
                key={org.id}
                org={org}
                onDelete={handleDeleteOrg}
                canDelete={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
