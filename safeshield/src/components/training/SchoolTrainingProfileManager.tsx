"use client";
/**
 * SchoolTrainingProfileManager
 *
 * Modular, self-contained component for managing per-school safeguarding and
 * data-protection personnel used in training certificates.
 *
 * Data stored here is SCHOOL-SPECIFIC and must never be aggregated or shared
 * at org level. Each school owns its own record.
 *
 * Fields:
 *   • Head Teacher
 *   • Designated Safeguarding Lead (DSL)
 *   • Data Protection Officer (DPO)
 *   • Chair of Governors
 */
import { useEffect, useState, useCallback } from "react";
import { supabase, type SchoolTrainingProfile } from "@/lib/supabase";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Lock,
} from "lucide-react";

type SchoolRow = {
  id: string;
  name: string;
  org_id: string;
  org_name: string | null;
  profile: SchoolTrainingProfile | null;
};

type ProfileForm = {
  head_teacher: string;
  dsl_name: string;
  dpo_name: string;
  chair_of_governors: string;
};

const emptyForm = (): ProfileForm => ({
  head_teacher: "",
  dsl_name: "",
  dpo_name: "",
  chair_of_governors: "",
});

const INPUT_CLS =
  "w-full px-3 py-2 rounded-xl text-sm bg-white/5 border outline-none focus:border-[rgba(139,92,246,0.45)] transition-colors";
const INPUT_STYLE = { borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" };

const FIELDS: { key: keyof ProfileForm; label: string; placeholder: string }[] = [
  { key: "head_teacher",       label: "Head Teacher",           placeholder: "Full name" },
  { key: "dsl_name",           label: "Designated Safeguarding Lead (DSL)", placeholder: "Full name" },
  { key: "dpo_name",           label: "Data Protection Officer (DPO)",      placeholder: "Full name" },
  { key: "chair_of_governors", label: "Chair of Governors",     placeholder: "Full name" },
];

export default function SchoolTrainingProfileManager() {
  const { profile } = useAuth();
  const isAdmin = (profile as { role?: string } | null)?.role === "admin";

  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        // Super admin: load all schools across all orgs
        const { data: schoolRows } = await supabase
          .from("schools")
          .select("id, name, org_id, organisations(name)")
          .eq("status", "active")
          .order("name");

        const { data: profiles } = await supabase
          .from("school_training_profiles")
          .select("*");

        const profileMap: Record<string, SchoolTrainingProfile> = {};
        for (const p of profiles ?? []) profileMap[p.school_id] = p;

        setSchools(
          (schoolRows ?? []).map((s: { id: string; name: string; org_id: string; organisations?: unknown }) => ({
            id: s.id,
            name: s.name,
            org_id: s.org_id,
            org_name: (Array.isArray(s.organisations) ? (s.organisations[0] as { name?: string } | undefined)?.name : (s.organisations as { name?: string } | null)?.name) ?? null,
            profile: profileMap[s.id] ?? null,
          }))
        );
      } else {
        // Org/school admin: load only their school(s)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: memberships } = await supabase
          .from("org_members")
          .select("school_id")
          .eq("user_id", user.id)
          .eq("role", "admin");

        const schoolIds = (memberships ?? []).map((m: { school_id: string | null }) => m.school_id).filter(Boolean) as string[];
        if (schoolIds.length === 0) { setSchools([]); return; }

        const { data: schoolRows } = await supabase
          .from("schools")
          .select("id, name, org_id")
          .in("id", schoolIds);

        const { data: profiles } = await supabase
          .from("school_training_profiles")
          .select("*")
          .in("school_id", schoolIds);

        const profileMap: Record<string, SchoolTrainingProfile> = {};
        for (const p of profiles ?? []) profileMap[p.school_id] = p;

        setSchools(
          (schoolRows ?? []).map((s: { id: string; name: string; org_id: string }) => ({
            id: s.id,
            name: s.name,
            org_id: s.org_id,
            org_name: null,
            profile: profileMap[s.id] ?? null,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { load(); }, [load]);

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  }

  function startEdit(school: SchoolRow) {
    setEditingSchoolId(school.id);
    setForm({
      head_teacher:       school.profile?.head_teacher ?? "",
      dsl_name:           school.profile?.dsl_name ?? "",
      dpo_name:           school.profile?.dpo_name ?? "",
      chair_of_governors: school.profile?.chair_of_governors ?? "",
    });
  }

  async function handleSave(schoolId: string) {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      school_id: schoolId,
      head_teacher:       form.head_teacher.trim() || null,
      dsl_name:           form.dsl_name.trim() || null,
      dpo_name:           form.dpo_name.trim() || null,
      chair_of_governors: form.chair_of_governors.trim() || null,
      updated_at:         new Date().toISOString(),
      updated_by:         user?.id ?? null,
    };

    const { error } = await supabase
      .from("school_training_profiles")
      .upsert(payload, { onConflict: "school_id" });

    if (error) {
      flash("err", error.message);
    } else {
      flash("ok", "School training profile saved");
      setEditingSchoolId(null);
      await load();
    }
    setSaving(false);
  }

  const complete = (p: SchoolTrainingProfile | null) =>
    p?.head_teacher && p?.dsl_name && p?.dpo_name && p?.chair_of_governors;

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 px-4">
        <Loader2 size={16} className="animate-spin text-[#8B5CF6]" />
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading school profiles…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Module header */}
      <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.18)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(139,92,246,0.15)" }}>
          <ShieldCheck size={15} style={{ color: "#8B5CF6" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>School Training Profiles</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Each school must record their key safeguarding and data-protection personnel.
            This information is <strong style={{ color: "var(--text)" }}>school-specific</strong> — it is never shared across
            organisations. It appears on training certificates issued to learners at that school.
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Lock size={10} style={{ color: "var(--text-faint)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>Data is contained per school. No cross-org visibility.</span>
          </div>
        </div>
      </div>

      {/* Flash message */}
      {msg && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${msg.type === "ok" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {msg.type === "ok" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}{msg.text}
        </div>
      )}

      {schools.length === 0 ? (
        <GlassCard className="text-center py-10">
          <Building2 size={32} className="mx-auto mb-3 opacity-30" style={{ color: "#8B5CF6" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No schools found.</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
            Schools appear here once they are added to an organisation.
          </p>
        </GlassCard>
      ) : (
        schools.map((school) => {
          const isEditing = editingSchoolId === school.id;
          const done = complete(school.profile);

          return (
            <GlassCard key={school.id} className="p-0 overflow-hidden">
              {/* School header */}
              <div
                className="flex items-center justify-between gap-3 px-4 py-3"
                style={{ borderBottom: isEditing ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${done ? "bg-[#22c55e]" : "bg-[#f59e0b]"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{school.name}</p>
                    {school.org_name && (
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{school.org_name}</p>
                    )}
                  </div>
                  {!done && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                      Incomplete
                    </span>
                  )}
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => startEdit(school)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0"
                    style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#8B5CF6" }}
                  >
                    <Edit2 size={11} />
                    {done ? "Edit" : "Set Up"}
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingSchoolId(null)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-all shrink-0"
                  >
                    <X size={12} style={{ color: "var(--text-dim)" }} />
                  </button>
                )}
              </div>

              {/* Profile display (not editing) */}
              {!isEditing && school.profile && done && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y divide-white/5">
                  {FIELDS.map(({ key, label }) => (
                    <div key={key} className="px-4 py-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-faint)" }}>{label.split(" (")[0]}</p>
                      <div className="flex items-center gap-1.5">
                        <User size={10} style={{ color: "#8B5CF6" }} />
                        <p className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>
                          {(school.profile ? school.profile[key as keyof SchoolTrainingProfile] as string : null) ?? "—"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit form */}
              {isEditing && (
                <div className="px-4 py-4 flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FIELDS.map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#8B5CF6" }}>
                          {label}
                        </label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          className={INPUT_CLS}
                          style={INPUT_STYLE}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSave(school.id)}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                      style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", color: "#8B5CF6" }}
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Save Profile
                    </button>
                    <button
                      onClick={() => setEditingSchoolId(null)}
                      className="px-4 py-2 rounded-xl text-sm font-medium border glass hover:bg-white/5 transition-all"
                      style={{ borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })
      )}
    </div>
  );
}
