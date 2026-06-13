"use client";
import { useState, useEffect, useRef } from "react";
import {
  FileText, Star, Download, ArrowRight, X, Loader2, AlertCircle,
  Building2, User, Shield, RefreshCw, Eye, Send,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { supabase, type PolicyTemplate } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#A78BFA";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SchoolDetails {
  school_name: string;
  school_type: string;
  headteacher_name: string;
  dsl_name: string;
  dpo_name: string;
  chair_of_governors: string;
  school_website: string;
  school_email: string;
  approval_date: string;
  review_date: string;
  academic_year: string;
}

// Ordered list of placeholders used across templates
const FIELDS: { key: keyof SchoolDetails; label: string; placeholder: string; type?: string }[] = [
  { key: "school_name",        label: "School name",           placeholder: "e.g. Oakwood Academy" },
  { key: "school_type",        label: "School type",           placeholder: "e.g. Community Primary School" },
  { key: "headteacher_name",   label: "Headteacher",           placeholder: "e.g. Mrs J Smith" },
  { key: "dsl_name",           label: "Designated Safeguarding Lead (DSL)", placeholder: "e.g. Mr A Jones" },
  { key: "dpo_name",           label: "Data Protection Officer (DPO)", placeholder: "e.g. SchoolPro TLC Limited" },
  { key: "chair_of_governors", label: "Chair of Governors",    placeholder: "e.g. Dr P Williams" },
  { key: "school_website",     label: "School website",        placeholder: "e.g. www.oakwoodacademy.co.uk", type: "url" },
  { key: "school_email",       label: "School email",          placeholder: "e.g. office@oakwoodacademy.co.uk", type: "email" },
  { key: "approval_date",      label: "Date approved",         placeholder: "", type: "date" },
  { key: "review_date",        label: "Next review date",      placeholder: "", type: "date" },
  { key: "academic_year",      label: "Academic year",         placeholder: "e.g. 2025–2026" },
];

const POLICY_TYPE_LABELS: Record<string, string> = {
  data_protection: "Data Protection", online_safety: "Online Safety", ict_aup: "ICT / AUP",
  filtering_monitoring: "Filtering & Monitoring", ai: "AI Policy", cctv: "CCTV",
  photos: "Photographs", foi: "Freedom of Information", privacy_notice: "Privacy Notice", other: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  data_protection: "#38BDF8", online_safety: "#34D399", ai: "#A78BFA",
  cctv: "#F59E0B", photos: "#F472B6", ict_aup: "#818CF8",
  filtering_monitoring: "#EF4444", foi: "#FB923C", privacy_notice: "#06B6D4", other: "#64748B",
};

function todayStr() { return new Date().toISOString().split("T")[0]; }
function nextYearStr() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
function academicYear() {
  const now = new Date();
  const y = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return `${y}–${y + 1}`;
}

function substitutePlaceholders(content: string, details: SchoolDetails): string {
  return content
    .replace(/\{\{SCHOOL_NAME\}\}/g, details.school_name || "{{SCHOOL_NAME}}")
    .replace(/\{\{SCHOOL_TYPE\}\}/g, details.school_type || "{{SCHOOL_TYPE}}")
    .replace(/\{\{HEADTEACHER_NAME\}\}/g, details.headteacher_name || "{{HEADTEACHER_NAME}}")
    .replace(/\{\{DSL_NAME\}\}/g, details.dsl_name || "{{DSL_NAME}}")
    .replace(/\{\{DPO_NAME\}\}/g, details.dpo_name || "{{DPO_NAME}}")
    .replace(/\{\{CHAIR_OF_GOVERNORS\}\}/g, details.chair_of_governors || "{{CHAIR_OF_GOVERNORS}}")
    .replace(/\{\{SCHOOL_WEBSITE\}\}/g, details.school_website || "{{SCHOOL_WEBSITE}}")
    .replace(/\{\{SCHOOL_EMAIL\}\}/g, details.school_email || "{{SCHOOL_EMAIL}}")
    .replace(/\{\{APPROVAL_DATE\}\}/g, details.approval_date
      ? new Date(details.approval_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "{{APPROVAL_DATE}}")
    .replace(/\{\{REVIEW_DATE\}\}/g, details.review_date
      ? new Date(details.review_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "{{REVIEW_DATE}}")
    .replace(/\{\{ACADEMIC_YEAR\}\}/g, details.academic_year || "{{ACADEMIC_YEAR}}");
}

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onUse }: { template: PolicyTemplate; onUse: () => void }) {
  const color = TYPE_COLORS[template.policy_type] ?? "#64748B";
  return (
    <div
      className="rounded-2xl border flex flex-col gap-4 p-5 transition-all group"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <FileText size={18} style={{ color }} />
        </div>
        <div className="flex items-center gap-2">
          {template.is_featured && (
            <span className="flex items-center gap-1 text-[0.58rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{ color: "#F59E0B", background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.25)" }}>
              <Star size={8} /> Featured
            </span>
          )}
          <span
            className="text-[0.58rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{ color, background: `${color}12`, borderColor: `${color}28` }}
          >
            {POLICY_TYPE_LABELS[template.policy_type] ?? template.policy_type}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>{template.title}</h3>
        {template.description && (
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{template.description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onUse}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
        style={{ background: ACCENT, color: "#000" }}
      >
        Use template <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ── Generate modal ────────────────────────────────────────────────────────────

interface GenerateModalProps {
  template: PolicyTemplate;
  initialDetails: SchoolDetails;
  onClose: () => void;
  onSendToAnalyzer: (text: string) => void;
}

function GenerateModal({ template, initialDetails, onClose, onSendToAnalyzer }: GenerateModalProps) {
  const [details, setDetails] = useState<SchoolDetails>(initialDetails);
  const [logo, setLogo] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  const generated = substitutePlaceholders(template.content, details);
  const remainingPlaceholders = (generated.match(/\{\{[A-Z_]+\}\}/g) ?? []).filter(
    (v, i, a) => a.indexOf(v) === i,
  );

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleDownload() {
    const logoBlock = logo ? `![${details.school_name} logo](${logo})\n\n` : "";
    const full = logoBlock + generated;
    const blob = new Blob([full], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${details.school_name.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "school"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-5xl my-8 rounded-2xl border flex flex-col"
        style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)" }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-0.5" style={{ color: ACCENT }}>Generate Policy</p>
            <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>{template.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview(p => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: preview ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)", color: preview ? ACCENT : "var(--text-muted)" }}
            >
              <Eye size={13} /> {preview ? "Edit" : "Preview"}
            </button>
            <button type="button" onClick={onClose}><X size={18} style={{ color: "var(--text-muted)" }} /></button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-0 flex-1">
          {/* Left: details form */}
          {!preview && (
            <div className="lg:w-80 shrink-0 flex flex-col gap-4 p-6 border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>
                  School Details
                </h3>
                <div className="flex flex-col gap-3">
                  {FIELDS.map(f => (
                    <div key={f.key} className="flex flex-col gap-1">
                      <label className="text-[0.68rem] font-medium" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                      <input
                        type={f.type ?? "text"}
                        value={details[f.key]}
                        onChange={e => setDetails(d => ({ ...d, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="rounded-lg px-2.5 py-1.5 text-xs border outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo upload */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>
                  School Logo
                </h3>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed flex flex-col items-center gap-2 py-4 text-xs transition-all"
                  style={{ borderColor: logo ? "#34D399" : "rgba(255,255,255,0.15)", background: logo ? "rgba(52,211,153,0.04)" : "transparent" }}
                >
                  {logo ? (
                    <>
                      <img src={logo} alt="Logo preview" className="max-h-12 max-w-full object-contain rounded" />
                      <span style={{ color: "#34D399" }}>Click to replace</span>
                    </>
                  ) : (
                    <>
                      <Building2 size={20} style={{ color: "var(--text-muted)" }} />
                      <span style={{ color: "var(--text-muted)" }}>Upload logo (PNG, JPG, SVG)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Unfilled placeholders warning */}
              {remainingPlaceholders.length > 0 && (
                <div className="rounded-xl px-3 py-2.5 text-xs border"
                  style={{ background: "rgba(234,179,8,0.06)", borderColor: "rgba(234,179,8,0.2)", color: "#EAB308" }}>
                  <p className="font-semibold mb-1">Fields still needed:</p>
                  <ul className="flex flex-col gap-0.5">
                    {remainingPlaceholders.map(p => (
                      <li key={p} className="opacity-80">{p.replace(/\{\{|\}\}/g, "").replace(/_/g, " ").toLowerCase()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Right: preview */}
          <div className="flex-1 flex flex-col p-6 min-h-0">
            {preview ? (
              <div className="flex-1">
                {logo && (
                  <img src={logo} alt="School logo" className="max-h-16 max-w-[200px] object-contain mb-4 rounded" />
                )}
                <pre
                  className="text-xs leading-relaxed whitespace-pre-wrap h-[500px] overflow-y-auto rounded-xl p-4"
                  style={{ background: "rgba(0,0,0,0.2)", color: "var(--text)", fontFamily: "inherit" }}
                >
                  {generated}
                </pre>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-3">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Fill in the details on the left. Placeholders will be replaced in real time.
                  Fields left blank will remain as <code className="px-1 py-0.5 rounded text-[0.65rem]" style={{ background: "rgba(234,179,8,0.1)", color: "#EAB308" }}>{"{{PLACEHOLDER}}"}</code>.
                </p>
                <pre
                  className="text-xs leading-relaxed whitespace-pre-wrap flex-1 max-h-[520px] overflow-y-auto rounded-xl p-4"
                  style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-muted)", fontFamily: "inherit" }}
                >
                  {generated}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t flex-wrap"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {remainingPlaceholders.length === 0
              ? "All fields complete — ready to download."
              : `${remainingPlaceholders.length} field${remainingPlaceholders.length !== 1 ? "s" : ""} still have placeholders.`}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onSendToAnalyzer(generated)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(167,139,250,0.1)", color: ACCENT, border: `1px solid ${ACCENT}30` }}
            >
              <Send size={13} /> Send to Analyzer
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#34D399", color: "#000" }}
            >
              <Download size={14} /> Download .md
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  onSendToAnalyzer?: (text: string) => void;
}

export default function PolicyTemplateLibrary({ onSendToAnalyzer }: Props) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<PolicyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [selected, setSelected] = useState<PolicyTemplate | null>(null);
  const [initialDetails, setInitialDetails] = useState<SchoolDetails>({
    school_name: "", school_type: "", headteacher_name: "", dsl_name: "", dpo_name: "",
    chair_of_governors: "", school_website: "", school_email: "",
    approval_date: todayStr(), review_date: nextYearStr(), academic_year: academicYear(),
  });

  useEffect(() => {
    supabase
      .from("policy_templates")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => { setTemplates(data ?? []); setLoading(false); });
  }, []);

  // Pre-fill from school training profile
  useEffect(() => {
    if (!user) return;
    async function prefill() {
      const { data: member } = await supabase
        .from("org_members")
        .select("school_id")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (!member?.school_id) return;

      const [{ data: profile }, { data: school }] = await Promise.all([
        supabase.from("school_training_profiles").select("*").eq("school_id", member.school_id).maybeSingle(),
        supabase.from("schools").select("name, email").eq("id", member.school_id).maybeSingle(),
      ]);

      setInitialDetails(d => ({
        ...d,
        school_name: school?.name ?? d.school_name,
        school_email: school?.email ?? d.school_email,
        headteacher_name: profile?.head_teacher ?? d.headteacher_name,
        dsl_name: profile?.dsl_name ?? d.dsl_name,
        dpo_name: profile?.dpo_name ?? d.dpo_name,
        chair_of_governors: profile?.chair_of_governors ?? d.chair_of_governors,
      }));
    }
    prefill();
  }, [user]);

  const types = ["all", ...Array.from(new Set(templates.map(t => t.policy_type)))];
  const filtered = filterType === "all" ? templates : templates.filter(t => t.policy_type === filterType);
  const featured = filtered.filter(t => t.is_featured);
  const rest = filtered.filter(t => !t.is_featured);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin" style={{ color: ACCENT }} />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <GlassCard>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <FileText size={28} style={{ color: "var(--text-muted)" }} />
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>No templates yet</p>
          <p className="text-xs max-w-sm" style={{ color: "var(--text-muted)" }}>
            Ask your administrator to run <code className="px-1 rounded" style={{ background: "rgba(255,255,255,0.06)" }}>POLICY_TEMPLATES_SQL.sql</code> in Supabase to load the built-in templates.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      {selected && (
        <GenerateModal
          template={selected}
          initialDetails={initialDetails}
          onClose={() => setSelected(null)}
          onSendToAnalyzer={(text) => {
            setSelected(null);
            onSendToAnalyzer?.(text);
          }}
        />
      )}

      <div className="flex flex-col gap-6">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {types.map(type => {
            const color = type === "all" ? ACCENT : (TYPE_COLORS[type] ?? "#64748B");
            const active = filterType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={active
                  ? { background: `${color}18`, borderColor: `${color}50`, color }
                  : { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }}
              >
                {type === "all" ? "All templates" : (POLICY_TYPE_LABELS[type] ?? type)}
              </button>
            );
          })}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star size={13} style={{ color: "#F59E0B" }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Featured</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(t => <TemplateCard key={t.id} template={t} onUse={() => setSelected(t)} />)}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                More Templates
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map(t => <TemplateCard key={t.id} template={t} onUse={() => setSelected(t)} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
