import type { Metadata } from "next";
import Link from "next/link";
import {
  FileCheck,
  ShieldAlert,
  UserSearch,
  Archive,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart3,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";

export const metadata: Metadata = {
  title: "Policy Review Checker | SafeShield Platform",
  description:
    "Cross-reference your safeguarding policies against current KCSIE requirements. The Policy Checker highlights gaps, flags areas for improvement and generates Ofsted-conscious governor reports.",
};

export default function PolicyCheckerPage() {
  return (
    <>
      {/* ── Platform preview banner ── */}
      <div className="bg-surface-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
          <span className="badge badge-cyan">Platform Preview</span>
          <span className="text-body-sm text-on-surface-variant">
            This is a platform preview — GuardianOS is available as part of a SafeShield engagement.{" "}
            <Link href="/book-review" className="text-primary hover:text-primary-tint underline underline-offset-2 transition-colors">
              Book a Readiness Review to request access.
            </Link>
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <PageHero
        eyebrow="GUARDIAN OS — POLICY CHECKER"
        title="KCSIE Compliance"
        titleHighlight="Engine"
        description="Cross-reference your safeguarding policies against current KCSIE requirements. The Policy Checker highlights gaps, flags areas for improvement and generates Ofsted-conscious governor reports."
        statusDot={true}
        badge={{ label: "KCSIE 2024", variant: "cyan" }}
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "View all modules", href: "/platform/tools" }}
      />

      {/* ── HUD preview mock ── */}
      <section className="pb-section" aria-label="Policy Checker interface preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divider-cyan mb-12" aria-hidden="true" />
          <p className="eyebrow text-center mb-6">INTERFACE PREVIEW</p>

          <div className="glass-panel hud-corners rounded-xl overflow-hidden max-w-4xl mx-auto" role="img" aria-label="Policy Checker HUD interface mockup showing document scanner with KCSIE analysis">
            {/* HUD grid overlay */}
            <div
              className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] pointer-events-none opacity-40"
              aria-hidden="true"
            />

            <div className="relative z-10 p-6">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-5 glass-panel rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-primary" aria-hidden="true" />
                  <span className="text-body-sm font-medium text-on-surface font-mono">
                    v2.4_Safeguarding_Policy_Final.pdf
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="relative inline-flex h-2 w-2"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="badge badge-cyan text-[10px]">ACTIVE SCAN</span>
                </div>
              </div>

              {/* Document + annotation panel */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 mb-5">
                {/* Simulated document */}
                <div className="glass-panel rounded-lg p-5 space-y-2.5" aria-hidden="true">
                  <div className="h-3 bg-on-surface-variant/10 rounded w-full" />
                  <div className="h-3 bg-on-surface-variant/10 rounded w-5/6" />
                  <div className="h-3 bg-on-surface-variant/10 rounded w-full" />
                  <div className="h-3 bg-on-surface-variant/10 rounded w-4/5" />

                  {/* Highlighted clause */}
                  <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 my-3">
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-1">
                      Clause 4.2 — Online Safety
                    </p>
                    <div className="h-2.5 bg-primary/20 rounded w-full mb-1.5" />
                    <div className="h-2.5 bg-primary/20 rounded w-5/6 mb-1.5" />
                    <div className="h-2.5 bg-primary/20 rounded w-full" />
                  </div>

                  <div className="h-3 bg-on-surface-variant/10 rounded w-full" />
                  <div className="h-3 bg-on-surface-variant/10 rounded w-3/4" />
                  <div className="h-3 bg-on-surface-variant/10 rounded w-full" />
                  <div className="h-3 bg-on-surface-variant/10 rounded w-5/6" />
                </div>

                {/* AI annotation card */}
                <div className="glass-panel rounded-lg p-4 w-full lg:w-64 border-primary/20 flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                    <CheckCircle2 size={14} className="text-rag-green flex-shrink-0" aria-hidden="true" />
                    <span className="text-[11px] font-semibold text-on-surface uppercase tracking-wider">
                      AI Annotation
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-primary mb-1">
                      KCSIE Part 1 Aligned
                    </p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      Clause satisfies mandatory update requirements for the 2024 edition.
                    </p>
                  </div>
                  <div className="border-t border-outline-variant/20 pt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-rag-green" aria-hidden="true" />
                      <span className="text-[10px] text-on-surface-variant">Section 1 complete</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-rag-green" aria-hidden="true" />
                      <span className="text-[10px] text-on-surface-variant">Section 2 complete</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={10} className="text-rag-amber" aria-hidden="true" />
                      <span className="text-[10px] text-on-surface-variant">Section 3 — review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-3" aria-label="Policy scan results">
                <div className="glass-panel rounded-lg p-3 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                    Statutory Gaps
                  </p>
                  <p className="metric-number text-xl font-bold text-rag-green">0</p>
                </div>
                <div className="glass-panel rounded-lg p-3 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                    Assurance Level
                  </p>
                  <p className="metric-number text-xl font-bold text-primary">High</p>
                </div>
                <div className="glass-panel rounded-lg p-3 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                    Review Readiness
                  </p>
                  <p className="metric-number text-xl font-bold text-primary">94%</p>
                </div>
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
                icon: <FileCheck size={20} strokeWidth={1.5} />,
                title: "KCSIE cross-reference",
                description:
                  "Automated comparison of your uploaded safeguarding policy against the full set of KCSIE 2024 mandatory requirements — clause by clause.",
              },
              {
                icon: <AlertTriangle size={20} strokeWidth={1.5} />,
                title: "Gap identification",
                description:
                  "Clear identification of missing or insufficient policy clauses, with plain-language explanations of what each requirement demands and why it matters.",
              },
              {
                icon: <BarChart3 size={20} strokeWidth={1.5} />,
                title: "Version comparison",
                description:
                  "Compare your current policy against a previous version to track what has changed and verify that updates address the requirements raised in the prior review.",
              },
              {
                icon: <FileText size={20} strokeWidth={1.5} />,
                title: "Governor report generation",
                description:
                  "Export an Ofsted-conscious governor summary report with annotated gap analysis — ready to present at the next board meeting or during an inspection.",
              },
            ].map((cap) => (
              <div key={cap.title} className="glass-panel glass-panel-hover hud-corners rounded-xl p-6 relative overflow-hidden group">
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10 border border-primary/30 text-primary shrink-0">
                    {cap.icon}
                  </div>
                  <h3 className="text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
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
                title: "Upload your policy",
                description:
                  "Upload your current safeguarding policy document. The module accepts PDF or Word formats and extracts the full text for analysis.",
              },
              {
                step: "02",
                title: "Automated analysis",
                description:
                  "The module cross-references your policy against the complete KCSIE 2024 mandatory requirements, annotating each clause against the relevant standard.",
              },
              {
                step: "03",
                title: "Governor report",
                description:
                  "Download an annotated report with gap analysis and recommendations — formatted for governors, with plain-language explanations of any shortfalls.",
              },
            ].map((item) => (
              <div key={item.step} className="glass-panel hud-corners rounded-xl p-6 relative overflow-hidden">
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent"
                  aria-hidden="true"
                />
                <span className="metric-number text-metric-lg font-bold text-primary/30 select-none block mb-3">
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
              <span className="text-primary text-glow">analysis report</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mt-3 text-balance">
              The following is a representative extract from a Policy Checker output report. Names and details are illustrative.
            </p>
          </div>

          <div className="glass-panel hud-corners rounded-xl overflow-hidden max-w-3xl">
            {/* Report header */}
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <p className="text-body-sm font-semibold text-on-surface">
                  KCSIE 2024 Compliance Report
                </p>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  Greenfield Academy — Safeguarding Policy v2.4
                </p>
              </div>
              <span className="badge badge-green">High Assurance</span>
            </div>

            {/* Results table */}
            <div className="divide-y divide-outline-variant/20">
              {[
                {
                  area: "Part 1 — Staff responsibilities",
                  status: "green",
                  finding: "Fully aligned with KCSIE 2024 requirements. All mandatory roles and responsibilities are clearly defined.",
                },
                {
                  area: "Part 2 — Child protection policy",
                  status: "green",
                  finding: "Policy reflects current statutory guidance. Referral pathways and threshold definitions are compliant.",
                },
                {
                  area: "Part 3 — Safer recruitment",
                  status: "amber",
                  finding: "Clause 3.7 does not reference the updated pre-employment check requirements introduced September 2024. Amendment recommended.",
                },
                {
                  area: "Part 4 — Online safety",
                  status: "green",
                  finding: "DfE filtering and monitoring standards referenced. Staff training obligations clearly stated.",
                },
              ].map((row) => (
                <div key={row.area} className="px-6 py-4 flex items-start gap-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
                      row.status === "green"
                        ? "bg-rag-green"
                        : row.status === "amber"
                        ? "bg-rag-amber"
                        : "bg-error"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-on-surface mb-1">
                      {row.area}
                    </p>
                    <p className="text-[12px] text-on-surface-variant leading-relaxed">
                      {row.finding}
                    </p>
                  </div>
                  <span
                    className={`badge flex-shrink-0 ${
                      row.status === "green"
                        ? "badge-green"
                        : row.status === "amber"
                        ? "badge-amber"
                        : "badge-red"
                    }`}
                  >
                    {row.status === "green" ? "Compliant" : row.status === "amber" ? "Review" : "Gap"}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-surface-high border-t border-outline-variant/30">
              <p className="text-[11px] text-on-surface-variant">
                <span className="text-primary font-semibold">Overall assurance: High</span>
                {" "}· 1 clause requires amendment · Generated by GuardianOS Policy Checker
              </p>
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
              { icon: <ShieldAlert size={18} strokeWidth={1.5} />, title: "Risk Register", href: "/platform/risk-register", desc: "Live RAG risk tracking across all compliance domains." },
              { icon: <Archive size={18} strokeWidth={1.5} />, title: "Evidence & Audit Trail", href: "/platform/evidence-audit", desc: "Immutable timestamped record of every compliance action." },
              { icon: <UserSearch size={18} strokeWidth={1.5} />, title: "SAR Planner", href: "/platform/sar-planner", desc: "Structured SAR workflow with statutory deadline tracking." },
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
        title="Access the Policy Checker"
        description="The Policy Checker is available as part of a SafeShield GuardianOS engagement. Book a Readiness Review to discuss access and onboarding for your school or trust."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all modules", href: "/platform/tools" }}
      />
    </>
  );
}
