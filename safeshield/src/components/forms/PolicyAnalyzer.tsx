"use client";
import { useState, useRef } from "react";
import {
  Upload, FileText, AlertTriangle, AlertCircle, Info, CheckCircle2,
  ChevronDown, ChevronUp, Check, X, Loader2, Download, RotateCcw, ArrowRight,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type PolicyType =
  | "data_protection" | "online_safety" | "ict_aup" | "filtering_monitoring"
  | "ai" | "cctv" | "photos" | "foi" | "privacy_notice" | "other";

type Severity = "critical" | "high" | "medium" | "low";
type Category =
  | "LEGAL_GAP" | "GUIDANCE_GAP" | "MISSING_LINK" | "BROKEN_LINK"
  | "ROLE_GAP" | "DATE_GAP" | "SEND_GAP" | "WORDING_RISK" | "STRUCTURE" | "CONSOLIDATION";

interface Finding {
  id: string;
  category: Category;
  severity: Severity;
  location: string;
  quote: string;
  issue: string;
  recommendation: string;
  link_status: "verified" | "unverified" | "n/a";
}

interface AnalyseResult {
  policy_title: string;
  policy_type: PolicyType;
  overall_status: "compliant" | "needs_update" | "non_compliant";
  summary: string;
  findings: Finding[];
  stats: { critical: number; high: number; medium: number; low: number };
}

interface Change {
  id: string;
  location: string;
  before: string;
  after: string;
}

interface SchoolProfile {
  name: string;
  type: string;
  dpo: string;
  review_cycle: string;
}

type Step = "upload" | "analysing" | "findings" | "recommending" | "diff" | "applying" | "done";

// ── Helpers ───────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  critical: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", Icon: AlertCircle },
  high:     { color: "#F97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", Icon: AlertTriangle },
  medium:   { color: "#EAB308", bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.2)",  Icon: Info },
  low:      { color: "#38BDF8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)", Icon: Info },
};

const STATUS_CONFIG = {
  compliant:    { color: "#34D399", label: "Compliant" },
  needs_update: { color: "#EAB308", label: "Needs Update" },
  non_compliant:{ color: "#EF4444", label: "Non-Compliant" },
};

const CATEGORY_LABELS: Record<Category, string> = {
  LEGAL_GAP: "Legal Gap", GUIDANCE_GAP: "Guidance Gap", MISSING_LINK: "Missing Link",
  BROKEN_LINK: "Broken Link", ROLE_GAP: "Role Gap", DATE_GAP: "Date Gap",
  SEND_GAP: "SEND Gap", WORDING_RISK: "Wording Risk", STRUCTURE: "Structure", CONSOLIDATION: "Consolidation",
};

const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  data_protection: "Data Protection", online_safety: "Online Safety", ict_aup: "ICT / AUP",
  filtering_monitoring: "Filtering & Monitoring", ai: "AI Policy", cctv: "CCTV",
  photos: "Photographs", foi: "Freedom of Information", privacy_notice: "Privacy Notice", other: "Other",
};

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // mammoth is ESM-only in browser context; use dynamic import
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FindingCard({
  finding, accepted, onToggle,
}: {
  finding: Finding;
  accepted: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = SEVERITY_CONFIG[finding.severity];
  const SevIcon = cfg.Icon;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{ background: cfg.bg, borderColor: accepted ? cfg.color : cfg.border }}
    >
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen(!open)}
      >
        <SevIcon size={16} style={{ color: cfg.color, flexShrink: 0 }} />
        <span className="flex-1 text-sm font-medium" style={{ color: "var(--text)" }}>
          [{finding.id}] {CATEGORY_LABELS[finding.category]}
          <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
            {finding.location}
          </span>
        </span>
        <span
          className="text-[0.6rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0"
          style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        >
          {finding.severity}
        </span>
        {open ? <ChevronUp size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {finding.quote && (
            <blockquote
              className="text-xs italic px-3 py-2 rounded-lg border-l-2"
              style={{ color: "var(--text-muted)", borderColor: cfg.color, background: "rgba(255,255,255,0.03)" }}
            >
              "{finding.quote}"
            </blockquote>
          )}
          <p className="text-xs leading-relaxed" style={{ color: "var(--text)" }}>{finding.issue}</p>
          <p className="text-xs leading-relaxed font-medium" style={{ color: cfg.color }}>
            Recommendation: {finding.recommendation}
          </p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={accepted
              ? { background: cfg.color, color: "#000" }
              : { background: "rgba(255,255,255,0.06)", border: `1px solid ${cfg.border}`, color: cfg.color }
            }
          >
            {accepted ? <><Check size={12} /> Accepted</> : <><Plus size={12} /> Accept fix</>}
          </button>
        </div>
      )}
    </div>
  );
}

function Plus({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function DiffCard({ change }: { change: Change }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="px-4 py-2 text-xs font-semibold" style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.03)" }}>
        {change.id} — {change.location}
      </div>
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="p-4">
          <p className="text-[0.6rem] font-black uppercase tracking-widest mb-2" style={{ color: "#EF4444" }}>Before</p>
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>{change.before}</p>
        </div>
        <div className="p-4">
          <p className="text-[0.6rem] font-black uppercase tracking-widest mb-2" style={{ color: "#34D399" }}>After</p>
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text)" }}>{change.after}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PolicyAnalyzer() {
  const { profile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);

  // Upload step
  const [file, setFile] = useState<File | null>(null);
  const [policyText, setPolicyText] = useState("");
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
    name: "", type: "mainstream", dpo: "", review_cycle: "annual",
  });

  // Analysis
  const [analysis, setAnalysis] = useState<AnalyseResult | null>(null);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());

  // Recommend / diff
  const [changes, setChanges] = useState<Change[]>([]);

  // Apply
  const [revisedPolicy, setRevisedPolicy] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError(null);
    try {
      const text = await extractTextFromDocx(f);
      setPolicyText(text);
    } catch {
      setError("Could not extract text from file. Make sure it is a valid .docx document.");
      setFile(null);
    }
  }

  async function handleAnalyse() {
    if (!policyText) { setError("Please upload a .docx policy document first."); return; }
    setStep("analysing");
    setError(null);
    try {
      const res = await fetch("/api/policy-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "ANALYSE", school_profile: schoolProfile, policy_text: policyText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data);
      setAccepted(new Set()); // reset selections
      setStep("findings");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
      setStep("upload");
    }
  }

  async function handleRecommend() {
    if (accepted.size === 0) { setError("Select at least one finding to fix."); return; }
    setStep("recommending");
    setError(null);
    try {
      const res = await fetch("/api/policy-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "RECOMMEND", school_profile: schoolProfile, policy_text: policyText, accepted_ids: Array.from(accepted) }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChanges(data.changes ?? []);
      setStep("diff");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Recommendation failed. Please try again.");
      setStep("findings");
    }
  }

  async function handleApply() {
    setStep("applying");
    setError(null);
    try {
      const res = await fetch("/api/policy-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "APPLY", policy_text: policyText, accepted_changes: changes }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRevisedPolicy(data.text ?? "");
      setStep("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Apply failed. Please try again.");
      setStep("diff");
    }
  }

  function handleDownload() {
    const blob = new Blob([revisedPolicy], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (analysis?.policy_title ?? "policy").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    a.download = `${safeName}_revised.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep("upload"); setFile(null); setPolicyText(""); setAnalysis(null);
    setAccepted(new Set()); setChanges([]); setRevisedPolicy(""); setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const toggleAccept = (id: string) => {
    setAccepted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const isLoading = step === "analysing" || step === "recommending" || step === "applying";

  const loadingLabel = step === "analysing" ? "Analysing policy…"
    : step === "recommending" ? "Generating recommendations…"
    : step === "applying" ? "Applying changes…" : "";

  return (
    <div className="flex flex-col gap-6">

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {(["upload", "findings", "diff", "done"] as const).map((s, i) => {
          const labels = ["Upload", "Findings", "Preview", "Download"];
          const steps: Step[] = ["upload", "findings", "diff", "done"];
          const idx = steps.indexOf(step);
          const done = idx > i;
          const current = idx === i;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black"
                  style={current
                    ? { background: "#A78BFA", color: "#000" }
                    : done ? { background: "#34D399", color: "#000" } : { background: "rgba(255,255,255,0.08)", color: "var(--text-muted)" }
                  }
                >
                  {done ? <Check size={10} /> : i + 1}
                </span>
                <span className="text-xs font-medium hidden sm:block" style={{ color: current ? "#A78BFA" : done ? "#34D399" : "var(--text-muted)" }}>
                  {labels[i]}
                </span>
              </div>
              {i < 3 && <div className="w-8 h-px" style={{ background: done ? "#34D399" : "rgba(255,255,255,0.1)" }} />}
            </div>
          );
        })}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <GlassCard>
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 size={32} className="animate-spin" style={{ color: "#A78BFA" }} />
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{loadingLabel}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>This may take 15–30 seconds for detailed policies.</p>
          </div>
        </GlassCard>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-xl px-4 py-3 border flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertCircle size={16} style={{ color: "#EF4444", flexShrink: 0, marginTop: 1 }} />
          <p className="text-sm" style={{ color: "#EF4444" }}>{error}</p>
        </div>
      )}

      {/* ── Step: Upload ─────────────────────────────────────────────────── */}
      {step === "upload" && (
        <>
          <GlassCard>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text)" }}>
              School Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>School name</label>
                <input
                  type="text"
                  value={schoolProfile.name}
                  onChange={e => setSchoolProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Oakwood Academy"
                  className="rounded-lg px-3 py-2 text-sm border outline-none focus:ring-1"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>School type</label>
                <select
                  value={schoolProfile.type}
                  onChange={e => setSchoolProfile(p => ({ ...p, type: e.target.value }))}
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                >
                  <option value="mainstream">Mainstream</option>
                  <option value="specialist SEND">Specialist SEND</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="MAT">MAT</option>
                  <option value="free school">Free School</option>
                  <option value="independent">Independent</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>DPO name / provider</label>
                <input
                  type="text"
                  value={schoolProfile.dpo}
                  onChange={e => setSchoolProfile(p => ({ ...p, dpo: e.target.value }))}
                  placeholder="e.g. SchoolPro TLC Limited"
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Review cycle</label>
                <select
                  value={schoolProfile.review_cycle}
                  onChange={e => setSchoolProfile(p => ({ ...p, review_cycle: e.target.value }))}
                  className="rounded-lg px-3 py-2 text-sm border outline-none"
                  style={{ background: "var(--glass-fill)", borderColor: "rgba(255,255,255,0.1)", color: "var(--text)" }}
                >
                  <option value="annual">Annual</option>
                  <option value="biennial">Biennial</option>
                  <option value="termly">Termly</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text)" }}>
              Upload Policy Document
            </h2>
            <input
              ref={fileRef}
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed flex flex-col items-center gap-3 py-10 transition-all"
              style={{
                borderColor: file ? "#34D399" : "rgba(167,139,250,0.3)",
                background: file ? "rgba(52,211,153,0.04)" : "rgba(167,139,250,0.03)",
              }}
            >
              {file ? (
                <>
                  <FileText size={32} style={{ color: "#34D399" }} />
                  <p className="text-sm font-medium" style={{ color: "#34D399" }}>{file.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Click to replace</p>
                </>
              ) : (
                <>
                  <Upload size={32} style={{ color: "#A78BFA" }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Click to upload .docx policy</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Word documents only · text extracted client-side · nothing stored</p>
                </>
              )}
            </button>

            {policyText && (
              <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                Extracted {policyText.split(/\s+/).length.toLocaleString()} words from document.
              </p>
            )}

            <button
              type="button"
              disabled={!policyText}
              onClick={handleAnalyse}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-40"
              style={{ background: "#A78BFA", color: "#000" }}
            >
              Analyse Policy <ArrowRight size={15} />
            </button>
          </GlassCard>
        </>
      )}

      {/* ── Step: Findings ───────────────────────────────────────────────── */}
      {step === "findings" && analysis && (
        <>
          {/* Summary card */}
          <GlassCard>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                  {POLICY_TYPE_LABELS[analysis.policy_type]}
                </p>
                <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>{analysis.policy_title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{analysis.summary}</p>
              </div>
              <div className="shrink-0">
                <span
                  className="text-sm font-black px-4 py-2 rounded-full"
                  style={{
                    background: `${STATUS_CONFIG[analysis.overall_status].color}18`,
                    color: STATUS_CONFIG[analysis.overall_status].color,
                    border: `1px solid ${STATUS_CONFIG[analysis.overall_status].color}35`,
                  }}
                >
                  {STATUS_CONFIG[analysis.overall_status].label}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {(["critical", "high", "medium", "low"] as Severity[]).map(s => (
                <div key={s} className="rounded-xl p-3 text-center" style={{ background: SEVERITY_CONFIG[s].bg, border: `1px solid ${SEVERITY_CONFIG[s].border}` }}>
                  <p className="text-xl font-black" style={{ color: SEVERITY_CONFIG[s].color }}>{analysis.stats[s]}</p>
                  <p className="text-[0.6rem] font-black uppercase tracking-widest mt-0.5" style={{ color: SEVERITY_CONFIG[s].color }}>{s}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Findings list */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                Findings ({analysis.findings.length})
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAccepted(new Set(analysis.findings.map(f => f.id)))}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA" }}
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => setAccepted(new Set())}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {analysis.findings.map(f => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  accepted={accepted.has(f.id)}
                  onToggle={() => toggleAccept(f.id)}
                />
              ))}
              {analysis.findings.length === 0 && (
                <div className="flex items-center gap-3 py-6 text-center">
                  <CheckCircle2 size={20} style={{ color: "#34D399" }} />
                  <p className="text-sm" style={{ color: "#34D399" }}>No findings — policy appears compliant.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
              >
                <RotateCcw size={14} /> Start over
              </button>
              <button
                type="button"
                disabled={accepted.size === 0}
                onClick={handleRecommend}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: "#A78BFA", color: "#000" }}
              >
                Get fix previews ({accepted.size} selected) <ArrowRight size={15} />
              </button>
            </div>
          </GlassCard>
        </>
      )}

      {/* ── Step: Diff ───────────────────────────────────────────────────── */}
      {step === "diff" && changes.length > 0 && (
        <GlassCard>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--text)" }}>
            Proposed Changes ({changes.length})
          </h2>
          <div className="flex flex-col gap-4">
            {changes.map(c => <DiffCard key={c.id} change={c} />)}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep("findings")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
            >
              Back to findings
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold"
              style={{ background: "#34D399", color: "#000" }}
            >
              Apply all changes <ArrowRight size={15} />
            </button>
          </div>
        </GlassCard>
      )}

      {/* ── Step: Done ───────────────────────────────────────────────────── */}
      {step === "done" && revisedPolicy && (
        <>
          <GlassCard>
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 size={22} style={{ color: "#34D399" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Revised policy ready</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  All {changes.length} change{changes.length !== 1 ? "s" : ""} applied. Download as Markdown and paste into your document template.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "#34D399", color: "#000" }}
              >
                <Download size={15} /> Download .md
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
              >
                <RotateCcw size={14} /> Analyse another policy
              </button>
            </div>
          </GlassCard>

          {/* Preview */}
          <GlassCard>
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text)" }}>
              Policy preview
            </h2>
            <pre
              className="text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto rounded-xl p-4"
              style={{ background: "rgba(0,0,0,0.2)", color: "var(--text-muted)", fontFamily: "inherit" }}
            >
              {revisedPolicy}
            </pre>
          </GlassCard>
        </>
      )}
    </div>
  );
}
