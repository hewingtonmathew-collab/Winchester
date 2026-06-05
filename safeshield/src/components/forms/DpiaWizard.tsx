"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, ChevronLeft, FileText } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import ReportMeta, { type ReportMetaData } from "@/components/report/ReportMeta";
import Certificate from "@/components/report/Certificate";

const defaultMeta: ReportMetaData = {
  schoolName: "", schoolEmail: "", consultantName: "", consultantEmail: "", staffMember: "", logoDataUrl: null,
};

type StepId =
  | "scope"
  | "necessity"
  | "proportionality"
  | "risks"
  | "mitigations"
  | "consultation";

type FieldType = "text" | "textarea" | "radio" | "checkbox";

type Field = {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  hint?: string;
};

type Step = {
  id: StepId;
  title: string;
  description: string;
  fields: Field[];
};

const steps: Step[] = [
  {
    id: "scope",
    title: "Processing Overview",
    description: "Describe the nature, scope, context, and purpose of the processing activity.",
    fields: [
      { id: "project_name", label: "Project / Processing Activity Name", type: "text", required: true },
      { id: "data_controller", label: "Data Controller (School / Trust)", type: "text", required: true },
      { id: "purpose", label: "What is the purpose of the processing?", type: "textarea", required: true, hint: "Describe why you are processing personal data and what you hope to achieve." },
      { id: "data_types", label: "What categories of personal data will be processed?", type: "checkbox", options: ["Pupil names / identifiers", "Special category data (health, SEND, etc.)", "Biometric data", "Staff personal data", "Parental / guardian data", "Behavioural / monitoring data", "Financial data", "Images / video footage"] },
      { id: "data_subjects", label: "Who are the data subjects?", type: "checkbox", options: ["Pupils", "Staff", "Parents / Guardians", "Governors / Trustees", "Third parties / visitors"] },
      { id: "third_parties", label: "Are personal data shared with or processed by third parties (including AI/EdTech vendors)?", type: "radio", options: ["Yes", "No", "Unsure"], required: true },
    ],
  },
  {
    id: "necessity",
    title: "Necessity & Lawful Basis",
    description: "Confirm the processing is necessary and identify the lawful basis under UK GDPR.",
    fields: [
      { id: "lawful_basis", label: "What is the lawful basis for processing?", type: "radio", options: ["Consent", "Contract", "Legal obligation", "Vital interests", "Public task", "Legitimate interests"], required: true },
      { id: "special_category_basis", label: "If special category data is involved, what is the Article 9 condition?", type: "radio", options: ["Explicit consent", "Employment / social protection law", "Vital interests", "Substantial public interest", "Health or social care", "Not applicable"] },
      { id: "least_intrusive", label: "Could the same purpose be achieved with less personal data or less intrusive means?", type: "radio", options: ["No — this is the minimum necessary", "Possibly — alternatives not fully explored", "Yes — data minimisation measures being applied"], required: true },
      { id: "retention", label: "How long will the data be retained?", type: "text", required: true, hint: "Reference your retention schedule if applicable." },
    ],
  },
  {
    id: "proportionality",
    title: "Proportionality & Data Minimisation",
    description: "Assess whether the processing is proportionate and that privacy rights are respected.",
    fields: [
      { id: "minimisation", label: "Have you applied data minimisation (only collecting what is strictly necessary)?", type: "radio", options: ["Yes", "Partially", "No"], required: true },
      { id: "accuracy", label: "What steps are in place to ensure data accuracy?", type: "textarea", hint: "E.g. regular review, staff training, correction procedures." },
      { id: "subject_rights", label: "Which data subject rights have you considered?", type: "checkbox", options: ["Right of access", "Right to rectification", "Right to erasure", "Right to restrict processing", "Right to data portability", "Right to object", "Rights related to automated decision-making"] },
      { id: "privacy_by_design", label: "Have privacy-by-design principles been applied to this activity?", type: "radio", options: ["Yes", "Partially", "No — to be addressed"], required: true },
    ],
  },
  {
    id: "risks",
    title: "Risk Identification",
    description: "Identify the risks to individuals arising from the processing.",
    fields: [
      { id: "risk_unauthorised_access", label: "Risk: Unauthorised access to personal data", type: "radio", options: ["High", "Medium", "Low", "Not applicable"], required: true },
      { id: "risk_data_breach", label: "Risk: Data breach or accidental disclosure", type: "radio", options: ["High", "Medium", "Low", "Not applicable"], required: true },
      { id: "risk_profiling", label: "Risk: Profiling or automated decision-making affecting individuals", type: "radio", options: ["High", "Medium", "Low", "Not applicable"], required: true },
      { id: "risk_third_party", label: "Risk: Third-party processor failing to comply with UK GDPR obligations", type: "radio", options: ["High", "Medium", "Low", "Not applicable"], required: true },
      { id: "risk_safeguarding", label: "Risk: Processing creating a safeguarding vulnerability for pupils", type: "radio", options: ["High", "Medium", "Low", "Not applicable"], required: true },
      { id: "risk_other", label: "Any other identified risks?", type: "textarea", hint: "Describe any additional risks not covered above." },
    ],
  },
  {
    id: "mitigations",
    title: "Risk Mitigations",
    description: "Describe the technical and organisational measures in place to address identified risks.",
    fields: [
      { id: "technical_measures", label: "What technical measures are in place?", type: "checkbox", options: ["Encryption at rest and in transit", "Access controls / role-based permissions", "Audit logging", "Pseudonymisation or anonymisation", "Data Loss Prevention (DLP) tools", "Secure disposal processes"] },
      { id: "org_measures", label: "What organisational measures are in place?", type: "checkbox", options: ["Staff data protection training", "Data processing agreements with third parties", "Clear data retention and deletion policy", "Incident response / breach reporting procedure", "DPO involvement", "Privacy notices issued to data subjects"] },
      { id: "residual_risk", label: "After mitigations, what is the residual risk level?", type: "radio", options: ["High — ICO consultation required", "Medium — acceptable with ongoing monitoring", "Low — proportionate to the purpose"], required: true },
      { id: "dpo_consulted", label: "Has the Data Protection Officer (DPO) been consulted?", type: "radio", options: ["Yes", "No — will be consulted before go-live", "No DPO in place"], required: true },
    ],
  },
  {
    id: "consultation",
    title: "Consultation & Sign-off",
    description: "Record consultation with data subjects and confirm accountability measures.",
    fields: [
      { id: "subject_consultation", label: "Have data subjects (or their representatives) been consulted about this processing?", type: "radio", options: ["Yes", "No — not required for this activity", "No — to be completed"], required: true },
      { id: "ico_consultation", label: "Is ICO prior consultation required (high residual risk)?", type: "radio", options: ["Yes — consultation initiated", "No — residual risk is acceptable", "Unsure — seeking DPO advice"], required: true },
      { id: "review_date", label: "When will this DPIA be reviewed?", type: "text", required: true, hint: "E.g. annually, or when the processing changes materially." },
      { id: "owner", label: "DPIA Owner (name / role)", type: "text", required: true },
      { id: "notes", label: "Additional notes or actions", type: "textarea" },
    ],
  },
];

type Answers = Record<string, string | string[]>;

function riskColor(val: string) {
  if (val === "High") return "text-red-400";
  if (val === "Medium") return "text-amber-400";
  if (val === "Low") return "text-green-400";
  return "text-[#64748B]";
}

function overallRisk(answers: Answers): "high" | "medium" | "low" {
  const residual = answers["residual_risk"] as string | undefined;
  if (!residual) return "medium";
  if (residual.startsWith("High")) return "high";
  if (residual.startsWith("Low")) return "low";
  return "medium";
}

function RadioGroup({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {field.options!.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
            value === opt
              ? "bg-[rgba(251,191,36,0.15)] border-[rgba(251,191,36,0.4)] text-amber-300"
              : "glass text-[#64748B] hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ field, value, onChange }: { field: Field; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2 mt-1">
      {field.options!.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <span
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                checked ? "bg-[rgba(251,191,36,0.2)] border-amber-400" : "border-white/10 group-hover:border-white/20"
              }`}
            >
              {checked && <CheckCircle2 size={10} className="text-amber-300" />}
            </span>
            <span
              className="text-xs leading-relaxed"
              style={{ color: checked ? "#FCD34D" : "#64748B" }}
              onClick={() => {
                onChange(checked ? value.filter((v) => v !== opt) : [...value, opt]);
              }}
            >
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function DpiaWizard() {
  const [meta, setMeta] = useState<ReportMetaData>(defaultMeta);
  const [showMeta, setShowMeta] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);
  const metaValid = meta.schoolName.trim() && meta.staffMember.trim() && meta.consultantName.trim();

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function get(id: string): string {
    return (answers[id] as string) ?? "";
  }
  function getArr(id: string): string[] {
    return (answers[id] as string[]) ?? [];
  }
  function set(id: string, val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  }

  const requiredFilled = step.fields
    .filter((f) => f.required)
    .every((f) => {
      const v = answers[f.id];
      return v && (Array.isArray(v) ? v.length > 0 : v.trim() !== "");
    });

  const risk = overallRisk(answers);

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        {/* Summary banner */}
        <GlassCard glow className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={risk === "low" ? "#22c55e" : risk === "medium" ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (risk === "low" ? 0.15 : risk === "medium" ? 0.45 : 0.8)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                {risk === "low" ? <CheckCircle2 size={28} className="text-green-400" /> : risk === "medium" ? <AlertTriangle size={28} className="text-amber-400" /> : <XCircle size={28} className="text-red-400" />}
              </span>
            </div>
            <span className="text-[#64748B] text-xs">residual risk</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${risk === "low" ? "bg-green-500/10 border-green-500/25 text-green-400" : risk === "medium" ? "bg-amber-500/10 border-amber-500/25 text-amber-400" : "bg-red-500/10 border-red-500/25 text-red-400"}`}>
              {risk === "low" ? <CheckCircle2 size={13} /> : risk === "medium" ? <AlertTriangle size={13} /> : <XCircle size={13} />}
              {risk === "high" ? "High Risk — ICO Consultation Required" : risk === "medium" ? "Medium Risk — Monitor & Review" : "Low Risk — Proportionate Processing"}
            </span>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              {risk === "high"
                ? "Your DPIA identifies high residual risk. You must consult the ICO before proceeding with this processing activity under Article 36 UK GDPR."
                : risk === "medium"
                ? "Residual risk is at an acceptable level with mitigations in place. Ensure ongoing monitoring and review this DPIA if processing changes materially."
                : "Processing appears proportionate and well-mitigated. Document this DPIA, obtain sign-off, and schedule your review date."}
            </p>
          </div>
        </GlassCard>

        {/* Full summary */}
        <GlassCard>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText size={14} className="text-amber-400" /> DPIA Summary
          </h3>
          <div className="flex flex-col gap-5">
            {steps.map((s) => (
              <div key={s.id}>
                <p className="text-amber-400 text-[0.65rem] uppercase tracking-widest font-semibold mb-2">{s.title}</p>
                <div className="flex flex-col gap-2">
                  {s.fields.map((f) => {
                    const val = answers[f.id];
                    if (!val || (Array.isArray(val) && val.length === 0)) return null;
                    return (
                      <div key={f.id} className="flex flex-col gap-0.5">
                        <span className="text-[#475569] text-[0.6rem] uppercase tracking-wider">{f.label}</span>
                        <span className={`text-xs leading-relaxed ${f.id.startsWith("risk_") ? riskColor(val as string) : "text-[#CBD5E1]"}`}>
                          {Array.isArray(val) ? val.join(", ") : val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <Certificate
          meta={meta}
          toolName="DPIA Wizard"
          score={risk === "low" ? 85 : risk === "medium" ? 55 : 25}
          rating={risk === "low" ? "Low Risk" : risk === "medium" ? "Medium Risk" : "High Risk — ICO Consultation Required"}
          ratingColor={risk === "low" ? "#22c55e" : risk === "medium" ? "#f59e0b" : "#ef4444"}
          accentColor="#FCD34D"
          areas={steps.map(s => ({ name: s.title }))}
        />

        <div className="flex gap-3">
          <button
            onClick={() => { setDone(false); setStepIndex(0); setAnswers({}); setShowMeta(true); setMeta(defaultMeta); }}
            className="text-[#38BDF8] text-sm hover:text-white transition-colors"
          >
            ← Start new DPIA
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.25)] text-amber-300 text-sm font-medium hover:bg-[rgba(251,191,36,0.18)] transition-all"
          >
            <FileText size={13} /> Print / Save PDF
          </button>
        </div>
      </div>
    );
  }

  if (showMeta) {
    return (
      <div className="flex flex-col gap-5">
        <ReportMeta value={meta} onChange={setMeta} accentColor="#FCD34D" accentDim="rgba(251,191,36,0.12)" accentBorder="rgba(251,191,36,0.25)" />
        <div className="flex justify-end">
          <button onClick={() => setShowMeta(false)} disabled={!metaValid}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", color: "#FCD34D" }}>
            Start DPIA <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Step progress */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => i < stepIndex && setStepIndex(i)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === stepIndex
                ? "bg-[rgba(251,191,36,0.15)] border border-[rgba(251,191,36,0.35)] text-amber-300"
                : i < stepIndex
                ? "text-[#34D399] hover:text-white cursor-pointer"
                : "text-[#475569] cursor-default"
            }`}
          >
            {i < stepIndex && <CheckCircle2 size={10} className="inline mr-1" />}
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step card */}
      <GlassCard>
        <p className="text-amber-400 text-[0.65rem] uppercase tracking-widest font-semibold mb-1">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h2 className="text-white font-semibold text-lg mb-1">{step.title}</h2>
        <p className="text-[#64748B] text-xs mb-6 leading-relaxed">{step.description}</p>

        <div className="flex flex-col gap-6">
          {step.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-[#CBD5E1] text-sm leading-relaxed mb-1">
                {field.label}
                {field.required && <span className="text-amber-400 ml-1">*</span>}
              </label>
              {field.hint && <p className="text-[#475569] text-xs mb-1.5">{field.hint}</p>}

              {field.type === "text" && (
                <input
                  type="text"
                  value={get(field.id)}
                  onChange={(e) => set(field.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:border-amber-400/40 focus:outline-none transition-colors placeholder:text-[#475569]"
                  placeholder="Type here..."
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  value={get(field.id)}
                  onChange={(e) => set(field.id, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:border-amber-400/40 focus:outline-none transition-colors resize-none placeholder:text-[#475569]"
                  placeholder="Type here..."
                />
              )}

              {field.type === "radio" && (
                <RadioGroup
                  field={field}
                  value={get(field.id)}
                  onChange={(v) => set(field.id, v)}
                />
              )}

              {field.type === "checkbox" && (
                <CheckboxGroup
                  field={field}
                  value={getArr(field.id)}
                  onChange={(v) => set(field.id, v)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/5">
          <button
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-[#64748B] text-sm font-medium hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Back
          </button>

          {isLast ? (
            <button
              onClick={() => setDone(true)}
              disabled={!requiredFilled}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[rgba(251,191,36,0.15)] border border-[rgba(251,191,36,0.3)] text-amber-300 text-sm font-medium hover:bg-[rgba(251,191,36,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={14} /> Complete DPIA
            </button>
          ) : (
            <button
              onClick={() => setStepIndex((i) => i + 1)}
              disabled={!requiredFilled}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.25)] text-amber-300 text-sm font-medium hover:bg-[rgba(251,191,36,0.2)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
