"use client";
import { useRef, useEffect, useState } from "react";
import { Upload, X, Building2, Lock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export type ReportMetaData = {
  schoolName: string;
  schoolEmail: string;
  consultantName: string;
  consultantEmail: string;
  staffMember: string;
  logoDataUrl: string | null;
  // Attribution — set by the school picker so the saved report is recorded
  // against the correct school. Optional so existing checker meta initialisers
  // (which omit these) continue to compile.
  schoolId?: string | null;
  orgId?: string | null;
};

type SchoolOption = { id: string; name: string; org_id: string; email: string | null };

type Props = {
  value: ReportMetaData;
  onChange: (v: ReportMetaData) => void;
  accentColor?: string;
  accentDim?: string;
  accentBorder?: string;
};

export default function ReportMeta({
  value,
  onChange,
  accentColor = "#38BDF8",
  accentDim = "rgba(56,189,248,0.12)",
  accentBorder = "rgba(56,189,248,0.25)",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { user, enabledTools } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [lockedToSchool, setLockedToSchool] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const autoSetRef = useRef(false);

  function set(field: keyof ReportMetaData, val: string) {
    onChange({ ...value, [field]: val });
  }

  // Load the schools this user may attribute an assessment to.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: membership } = await supabase
        .from("org_members")
        .select("org_id, school_id, role")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      // Super admin: every school across all orgs.
      if (isSuperAdmin) {
        const { data } = await supabase
          .from("schools")
          .select("id, name, org_id, email")
          .order("name");
        setSchools((data as SchoolOption[]) ?? []);
        return;
      }

      if (!membership) return; // basic user — free-text only

      const m = membership as { org_id: string | null; school_id: string | null; role: string };

      // School-scoped user: locked to their own school.
      if (m.school_id) {
        const { data } = await supabase
          .from("schools")
          .select("id, name, org_id, email")
          .eq("id", m.school_id)
          .maybeSingle();
        if (data) {
          const s = data as SchoolOption;
          setSchools([s]);
          setLockedToSchool(true);
        }
        return;
      }

      // Org/MAT admin: all schools in their org.
      if (m.org_id) {
        const { data } = await supabase
          .from("schools")
          .select("id, name, org_id, email")
          .eq("org_id", m.org_id)
          .order("name");
        setSchools((data as SchoolOption[]) ?? []);
      }
    })();
  }, [user, isSuperAdmin]);

  // Auto-select when the user is locked to a single school, so attribution is
  // captured even if they never touch the picker.
  useEffect(() => {
    if (autoSetRef.current) return;
    if (lockedToSchool && schools.length === 1 && !value.schoolId) {
      const s = schools[0];
      autoSetRef.current = true;
      onChange({ ...value, schoolName: s.name, schoolId: s.id, orgId: s.org_id, schoolEmail: value.schoolEmail || s.email || "" });
    }
  }, [lockedToSchool, schools, value, onChange]);

  function selectSchool(id: string) {
    if (id === "__manual__") {
      setManualEntry(true);
      onChange({ ...value, schoolId: null, orgId: null });
      return;
    }
    const s = schools.find((x) => x.id === id);
    if (!s) return;
    setManualEntry(false);
    onChange({ ...value, schoolName: s.name, schoolId: s.id, orgId: s.org_id, schoolEmail: value.schoolEmail || s.email || "" });
  }

  const showPicker = schools.length > 0 && !manualEntry;

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...value, logoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const inputClass =
    "w-full px-3 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:outline-none transition-colors placeholder:text-[#475569]";

  return (
    <GlassCard>
      <h2 className="text-white font-semibold text-lg mb-1">Report Details</h2>
      <p className="text-[#64748B] text-xs mb-6 leading-relaxed">
        These details will appear on the generated certificate and improvement report.
      </p>

      <div className="flex flex-col gap-5">
        {/* Logo upload */}
        <div>
          <label className="block text-[#CBD5E1] text-sm mb-1">School Logo</label>
          <p className="text-[#475569] text-xs mb-2">Optional — appears on the certificate and report.</p>
          {value.logoDataUrl ? (
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 p-2" style={{ maxWidth: 200 }}>
                <img
                  src={value.logoDataUrl}
                  alt="School logo"
                  style={{ maxHeight: 80, maxWidth: 176, width: "auto", height: "auto", objectFit: "contain", display: "block" }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 text-[#94A3B8] text-xs hover:text-white hover:border-white/20 transition-all"
                >
                  <Upload size={11} /> Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...value, logoDataUrl: null })}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[#64748B] text-sm hover:text-white hover:border-white/20 transition-all"
            >
              <Upload size={14} /> Upload Logo
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </div>

        {/* School */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1 flex items-center gap-1.5">
              School / Trust Name <span style={{ color: accentColor }}>*</span>
              {lockedToSchool && <Lock size={11} className="text-[#64748B]" />}
            </label>

            {showPicker ? (
              <>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none" />
                  <select
                    value={value.schoolId ?? ""}
                    onChange={(e) => selectSchool(e.target.value)}
                    disabled={lockedToSchool}
                    className={inputClass + " pl-9 appearance-none disabled:opacity-70"}
                    style={{ borderColor: value.schoolId ? accentBorder : undefined }}
                  >
                    <option value="" disabled>Select a school…</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: "#0f172a" }}>{s.name}</option>
                    ))}
                    {!lockedToSchool && (
                      <option value="__manual__" style={{ background: "#0f172a" }}>Other — enter manually…</option>
                    )}
                  </select>
                </div>
                {lockedToSchool && (
                  <p className="text-[#475569] text-xs mt-1">This assessment is recorded against your school.</p>
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={value.schoolName}
                  onChange={(e) => set("schoolName", e.target.value)}
                  className={inputClass}
                  style={{ borderColor: value.schoolName ? accentBorder : undefined }}
                  placeholder="e.g. Oakfield Academy"
                />
                {schools.length > 0 && manualEntry && (
                  <button
                    type="button"
                    onClick={() => { setManualEntry(false); }}
                    className="text-xs mt-1 transition-colors"
                    style={{ color: accentColor }}
                  >
                    ← Choose from my schools instead
                  </button>
                )}
              </>
            )}
          </div>
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">School Email</label>
            <input
              type="email"
              value={value.schoolEmail}
              onChange={(e) => set("schoolEmail", e.target.value)}
              className={inputClass}
              placeholder="admin@school.org.uk"
            />
          </div>
        </div>

        {/* Staff member */}
        <div>
          <label className="block text-[#CBD5E1] text-sm mb-1">
            Staff Member Completing Assessment <span style={{ color: accentColor }}>*</span>
          </label>
          <input
            type="text"
            value={value.staffMember}
            onChange={(e) => set("staffMember", e.target.value)}
            className={inputClass}
            placeholder="e.g. Jane Smith, Deputy Headteacher"
          />
        </div>

        {/* Consultant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">
              Consultant Name <span style={{ color: accentColor }}>*</span>
            </label>
            <input
              type="text"
              value={value.consultantName}
              onChange={(e) => set("consultantName", e.target.value)}
              className={inputClass}
              placeholder="e.g. Matthew Hewington"
            />
          </div>
          <div>
            <label className="block text-[#CBD5E1] text-sm mb-1">Consultant Email</label>
            <input
              type="email"
              value={value.consultantEmail}
              onChange={(e) => set("consultantEmail", e.target.value)}
              className={inputClass}
              placeholder="consultant@winchester.co.uk"
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
