import type { Metadata } from "next";
import Link from "next/link";
import {
  Wand2,
  ShieldAlert,
  UserSearch,
  Archive,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";

export const metadata: Metadata = {
  title: "DPIA Wizard | SafeShield Platform",
  description:
    "Step-by-step DPIA completion designed for school systems — proportionate risk assessment, mitigation planning and DPO sign-off workflow without corporate legal complexity.",
};

type RiskLevel = "Low" | "Medium" | "High";

const riskMatrixRows: {
  risk: string;
  level: RiskLevel;
  mitigation: string;
}[] = [
  {
    risk: "Unauthorised access to pupil data",
    level: "Medium",
    mitigation: "Encryption required for all stored data",
  },
  {
    risk: "Data retention breach",
    level: "Low",
    mitigation: "Annual deletion schedule to be implemented",
  },
  {
    risk: "Third-party data sharing",
    level: "High",
    mitigation: "Data Processing Agreement review required",
  },
];

const riskBadge: Record<RiskLevel, string> = {
  Low: "badge badge-green",
  Medium: "badge badge-amber",
  High: "badge badge-red",
};

const steps = [
  { number: 1, label: "System description", status: "complete" as const },
  { number: 2, label: "Necessity & proportionality", status: "complete" as const },
  { number: 3, label: "Risk assessment", status: "active" as const },
  { number: 4, label: "Mitigation", status: "pending" as const },
  { number: 5, label: "DPO sign-off", status: "pending" as const },
];

export default function DPIAWizardPage() {
  return (
    <>
      {/* ── Platform preview banner ── */}
      <div className="bg-surface-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
          <span className="badge badge-neutral">Platform Preview</span>
          <span className="text-body-sm text-on-surface-variant">
            This is a platform preview — GuardianOS is available as part of a SafeShield engagement.{" "}
            <Link href="/book-review" className="text-secondary hover:text-on-surface underline underline-offset-2 transition-colors">
              Book a Readiness Review to request access.
            </Link>
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <PageHero
        eyebrow="GUARDIAN OS — DPIA WIZARD"
        title="Data Protection"
        titleHighlight="Impact Assessment"
        description="Step-by-step DPIA completion designed for school systems — proportionate risk assessment, mitigation planning and DPO sign-off workflow without corporate legal complexity."
        badge={{ label: "UK GDPR", variant: "neutral" }}
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "View all modules", href: "/platform/tools" }}
      />

      {/* ── HUD preview mock ── */}
      <section className="pb-section" aria-label="DPIA Wizard interface preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divider-cyan mb-12" aria-hidden="true" />
          <p className="eyebrow text-center mb-6">INTERFACE PREVIEW</p>

          <div
            className="glass-panel hud-corners rounded-xl overflow-hidden max-w-4xl mx-auto"
            role="img"
            aria-label="DPIA Wizard HUD interface mockup showing step-by-step DPIA workflow"
          >
            {/* HUD grid overlay */}
            <div
              className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] pointer-events-none opacity-40"
              aria-hidden="true"
            />

            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Wand2 size={16} className="text-secondary" aria-hidden="true" />
                  <span className="text-body-sm font-semibold text-on-surface">
                    DPIA Wizard
                  </span>
                  <span className="badge badge-amber">In progress</span>
                </div>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  DPIA-2024-012 · Biometric attendance system
                </span>
              </div>

              {/* Step progress indicator */}
              <div className="mb-6">
                <div className="flex items-center gap-0 overflow-x-auto pb-2" aria-label="DPIA completion steps">
                  {steps.map((step, i) => (
                    <div key={step.number} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center gap-1.5">
                        {/* Step dot */}
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                            step.status === "complete"
                              ? "bg-rag-green/20 border-rag-green text-rag-green"
                              : step.status === "active"
                              ? "bg-secondary/20 border-secondary text-secondary"
                              : "bg-surface-high border-outline-variant/40 text-on-surface-variant"
                          }`}
                          aria-label={`Step ${step.number}: ${step.label} — ${step.status}`}
                        >
                          {step.status === "complete" ? (
                            <CheckCircle2 size={14} aria-hidden="true" />
                          ) : (
                            <span className="text-[11px] font-bold">{step.number}</span>
                          )}
                        </div>
                        {/* Step label */}
                        <span
                          className={`text-[9px] font-medium text-center leading-tight max-w-[70px] ${
                            step.status === "complete"
                              ? "text-rag-green"
                              : step.status === "active"
                              ? "text-secondary"
                              : "text-on-surface-variant/60"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {/* Connector line */}
                      {i < steps.length - 1 && (
                        <div
                          className={`h-px w-8 mx-1 flex-shrink-0 mb-5 ${
                            step.status === "complete"
                              ? "bg-rag-green/50"
                              : "bg-outline-variant/30"
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active step panel */}
              <div className="glass-panel rounded-xl overflow-hidden mb-4">
                <div className="px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-secondary text-[10px]">Step 3 of 5</span>
                    <span className="text-body-sm font-semibold text-on-surface">
                      Risk assessment
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">
                    ICO guidance: Article 35 UK GDPR
                  </span>
                </div>

                {/* Risk matrix */}
                <div>
                  {/* Column headers */}
                  <div className="grid grid-cols-[2fr_1fr_2fr] gap-3 px-5 py-2.5 bg-surface-high/40 border-b border-outline-variant/20">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Risk</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Level</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Required mitigation</span>
                  </div>

                  {/* Risk rows */}
                  <div className="divide-y divide-outline-variant/20">
                    {riskMatrixRows.map((row) => (
                      <div
                        key={row.risk}
                        className="grid grid-cols-[2fr_1fr_2fr] gap-3 items-center px-5 py-4"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            size={12}
                            className={
                              row.level === "High"
                                ? "text-error flex-shrink-0 mt-0.5"
                                : row.level === "Medium"
                                ? "text-rag-amber flex-shrink-0 mt-0.5"
                                : "text-rag-green flex-shrink-0 mt-0.5"
                            }
                            aria-hidden="true"
                          />
                          <span className="text-[12px] text-on-surface leading-snug">
                            {row.risk}
                          </span>
                        </div>
                        <span className={riskBadge[row.level]}>{row.level}</span>
                        <span className="text-[12px] text-on-surface-variant leading-snug">
                          {row.mitigation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-[11px] text-on-surface-variant font-medium px-3 py-1.5 glass-panel rounded border border-outline-variant/30 hover:text-on-surface transition-colors"
                  aria-label="Go to previous step"
                >
                  ← Previous
                </button>
                <span className="text-[10px] text-on-surface-variant">
                  2 of 3 risks assessed
                </span>
                <button
                  type="button"
                  className="text-[11px] text-secondary font-medium px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded hover:bg-secondary/20 transition-colors"
                  aria-label="Proceed to next step"
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="py-section bg-surface-lowest" aria-labelledby="capabilities-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-2">MODULE CAPABILITIES</p>
            <h2 id="capabilities-heading" className="text-display-md font-bold text-on-surface">
              What this module{" "}
              <span className="text-primary text-glow">does</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <BookOpen size={20} strokeWidth={1.5} />,
                title: "Step-by-step workflow",
                description:
                  "Structured DPIA process mapped directly to ICO guidance and UK GDPR Article 35 requirements — without the corporate legal complexity that makes DPIAs feel inaccessible to school teams.",
              },
              {
                icon: <AlertTriangle size={20} strokeWidth={1.5} />,
                title: "Risk matrix",
                description:
                  "Proportionate risk assessment with a clear risk matrix — identifying processing risks, rating likelihood and severity, and prompting appropriate mitigation measures for each identified risk.",
              },
              {
                icon: <ClipboardCheck size={20} strokeWidth={1.5} />,
                title: "DPO sign-off",
                description:
                  "Digital DPO sign-off workflow with evidence logging — ensuring completed DPIAs are properly authorised, timestamped and retained as part of your demonstrable compliance record.",
              },
              {
                icon: <ShieldCheck size={20} strokeWidth={1.5} />,
                title: "Register integration",
                description:
                  "Completed DPIAs are automatically added to your DPIA register — maintaining an up-to-date inventory of all processing activities subject to impact assessment, as required by UK GDPR.",
              },
            ].map((cap) => (
              <div
                key={cap.title}
                className="glass-panel glass-panel-hover hud-corners rounded-xl p-6 relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-secondary/10 border border-secondary/30 text-secondary shrink-0">
                    {cap.icon}
                  </div>
                  <h3 className="text-headline-sm font-semibold text-on-surface">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-section" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-2">WORKFLOW</p>
            <h2 id="how-it-works-heading" className="text-display-md font-bold text-on-surface">
              How it{" "}
              <span className="text-primary text-glow">works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {[
              {
                step: "01",
                title: "Describe the processing",
                description:
                  "Complete the system description and necessity and proportionality sections — guided prompts help school teams provide the right level of detail without legal expertise.",
              },
              {
                step: "02",
                title: "Assess and mitigate risks",
                description:
                  "Work through the risk matrix to identify processing risks, assess likelihood and severity, and record the mitigation measures your school will implement for each risk.",
              },
              {
                step: "03",
                title: "DPO sign-off and register",
                description:
                  "Submit the completed DPIA for DPO review and digital sign-off. The approved DPIA is automatically added to your register and retained in your audit trail.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-panel hud-corners rounded-xl p-6 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
                  aria-hidden="true"
                />
                <span className="metric-number text-metric-lg font-bold text-secondary/30 select-none block mb-3">
                  {item.step}
                </span>
                <h3 className="text-headline-md font-semibold text-on-surface mb-2">
                  {item.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample output ── */}
      <section className="py-section bg-surface-lowest" aria-labelledby="sample-output-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">SAMPLE OUTPUT</p>
            <h2 id="sample-output-heading" className="text-display-md font-bold text-on-surface">
              Example{" "}
              <span className="text-primary text-glow">DPIA summary</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mt-3 text-balance">
              The following is an illustrative extract from a completed DPIA generated by the GuardianOS Wizard. Names and details are representative.
            </p>
          </div>

          <div className="glass-panel hud-corners rounded-xl overflow-hidden max-w-3xl">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <p className="text-body-sm font-semibold text-on-surface">
                  DPIA Summary — Biometric Attendance System
                </p>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  DPIA-2024-012 · Completed 22 November 2024
                </p>
              </div>
              <span className="badge badge-green">DPO Approved</span>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Summary row */}
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
                  System description
                </p>
                <p className="text-body-sm text-on-surface leading-relaxed">
                  Biometric fingerprint-based attendance system for pupil registration across all year groups. Data processed: biometric templates, attendance records, timestamps. Third-party processor: Ident Systems Ltd.
                </p>
              </div>

              <div className="divider-cyan" aria-hidden="true" />

              {/* Risk summary */}
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-3">
                  Risk assessment summary
                </p>
                <div className="space-y-2.5">
                  {riskMatrixRows.map((row) => (
                    <div
                      key={row.risk}
                      className="flex items-start justify-between gap-3 glass-panel rounded-lg px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-on-surface mb-0.5">
                          {row.risk}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Mitigation: {row.mitigation}
                        </p>
                      </div>
                      <span className={riskBadge[row.level]}>{row.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider-cyan" aria-hidden="true" />

              {/* Sign-off */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">
                    DPO sign-off
                  </p>
                  <p className="text-body-sm text-on-surface font-medium">
                    Approved — processing may proceed subject to mitigations
                  </p>
                  <p className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                    Signed: J. Patel (DPO) · 22 Nov 2024 · 14:32
                  </p>
                </div>
                <CheckCircle2 size={24} className="text-rag-green flex-shrink-0" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related modules ── */}
      <section className="py-section" aria-labelledby="related-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-2">RELATED MODULES</p>
          <h2 id="related-heading" className="text-display-md font-bold text-on-surface mb-8">
            Continue with{" "}
            <span className="text-primary text-glow">GuardianOS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <UserSearch size={18} strokeWidth={1.5} />, title: "SAR Planner", href: "/platform/sar-planner", desc: "Structured SAR workflow with statutory deadline tracking." },
              { icon: <ShieldAlert size={18} strokeWidth={1.5} />, title: "Risk Register", href: "/platform/risk-register", desc: "Live RAG risk tracking across all compliance domains." },
              { icon: <Archive size={18} strokeWidth={1.5} />, title: "Evidence & Audit Trail", href: "/platform/evidence-audit", desc: "Immutable timestamped record of every compliance action." },
            ].map((mod) => (
              <Link
                key={mod.title}
                href={mod.href}
                className="glass-panel glass-panel-hover hud-corners rounded-xl p-5 flex items-start gap-3 group transition-all"
              >
                <div className="flex items-center justify-center h-9 w-9 rounded-md bg-primary/10 border border-primary/30 text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  {mod.icon}
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                    {mod.title}
                  </p>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    {mod.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        eyebrow="REQUEST ACCESS"
        title="Access the DPIA Wizard"
        description="The DPIA Wizard is available as part of a SafeShield GuardianOS engagement. Book a Readiness Review to discuss your data protection obligations and platform onboarding."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all modules", href: "/platform/tools" }}
      />
    </>
  );
}
