import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  FileCheck,
  Wand2,
  Archive,
  User,
  Clock,
  ChevronRight,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import RAGPanel from "@/components/ui/RAGPanel";

export const metadata: Metadata = {
  title: "Risk Register | SafeShield Platform",
  description:
    "A live risk register with RAG status across all your compliance domains. Track actions, assign named owners, set deadlines and maintain a complete audit trail of every risk decision.",
};

type RAGStatus = "green" | "amber" | "red";

const riskRows: {
  area: string;
  description: string;
  status: RAGStatus;
  owner: string;
  deadline: string;
  action: string;
}[] = [
  {
    area: "Online safety policy currency",
    description: "Annual policy review overdue — requires DSL sign-off",
    status: "amber",
    owner: "DSL",
    deadline: "30 Nov",
    action: "Review policy",
  },
  {
    area: "Biometric DPIA outstanding",
    description: "New biometric system deployed without completed DPIA",
    status: "red",
    owner: "DPO",
    deadline: "Immediate",
    action: "Complete DPIA",
  },
  {
    area: "Staff cyber awareness training",
    description: "Autumn term training not yet completed by all staff",
    status: "amber",
    owner: "HT",
    deadline: "14 Dec",
    action: "Chase completion",
  },
  {
    area: "Governor safeguarding report",
    description: "Termly report to governors — in preparation",
    status: "amber",
    owner: "Headteacher",
    deadline: "Board meeting",
    action: "Draft report",
  },
  {
    area: "Filter configuration review",
    description: "DfE filtering standards reviewed and confirmed current",
    status: "green",
    owner: "ICT Manager",
    deadline: "Completed",
    action: "View record",
  },
];

const statusBadgeClass: Record<RAGStatus, string> = {
  green: "badge badge-green",
  amber: "badge badge-amber",
  red: "badge badge-red",
};

const statusLabel: Record<RAGStatus, string> = {
  green: "Assured",
  amber: "Under review",
  red: "Action required",
};

const statusDotClass: Record<RAGStatus, string> = {
  green: "bg-rag-green",
  amber: "bg-rag-amber",
  red: "bg-error animate-pulse motion-reduce:animate-none",
};

export default function RiskRegisterPage() {
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
        eyebrow="GUARDIAN OS — RISK REGISTER"
        title="Live RAG"
        titleHighlight="Risk Tracking"
        description="A live risk register with RAG status across all your compliance domains. Track actions, assign named owners, set deadlines and maintain a complete audit trail of every risk decision."
        badge={{ label: "Live Tracking", variant: "cyan" }}
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "View all modules", href: "/platform/tools" }}
      />

      {/* ── HUD preview mock ── */}
      <section className="pb-section" aria-label="Risk Register interface preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divider-cyan mb-12" aria-hidden="true" />
          <p className="eyebrow text-center mb-6">INTERFACE PREVIEW</p>

          <div
            className="glass-panel hud-corners rounded-xl overflow-hidden max-w-5xl mx-auto"
            role="img"
            aria-label="Risk Register HUD interface mockup showing live RAG risk table"
          >
            {/* HUD grid overlay */}
            <div
              className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] pointer-events-none opacity-40"
              aria-hidden="true"
            />

            <div className="relative z-10">
              {/* Table header */}
              <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={16} className="text-primary" aria-hidden="true" />
                  <span className="text-body-sm font-semibold text-on-surface">
                    Live Risk Register
                  </span>
                  <span className="badge badge-cyan">5 risks tracked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-error animate-pulse motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  <span className="text-[10px] text-error font-semibold uppercase tracking-wider">
                    1 action required
                  </span>
                </div>
              </div>

              {/* Column headers */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-5 py-2.5 border-b border-outline-variant/20 bg-surface-high/40">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Risk area</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Status</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Owner</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Deadline</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Action</span>
              </div>

              {/* Risk rows */}
              <div className="divide-y divide-outline-variant/20" role="table" aria-label="Risk register entries">
                {riskRows.map((row) => (
                  <div
                    key={row.area}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                    role="row"
                  >
                    <div className="flex items-start gap-2.5" role="cell">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${statusDotClass[row.status]}`}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-body-sm font-medium text-on-surface">
                          {row.area}
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                          {row.description}
                        </p>
                      </div>
                    </div>

                    <div role="cell">
                      <span className={statusBadgeClass[row.status]}>
                        {statusLabel[row.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" role="cell">
                      <User size={11} className="text-on-surface-variant flex-shrink-0" aria-hidden="true" />
                      <span className="text-[12px] text-on-surface-variant">{row.owner}</span>
                    </div>

                    <div className="flex items-center gap-1.5" role="cell">
                      <Clock size={11} className="text-on-surface-variant flex-shrink-0" aria-hidden="true" />
                      <span
                        className={`text-[12px] font-medium ${
                          row.deadline === "Immediate"
                            ? "text-error"
                            : row.deadline === "Completed"
                            ? "text-rag-green"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {row.deadline}
                      </span>
                    </div>

                    <div role="cell">
                      <button
                        type="button"
                        className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:text-primary-tint transition-colors"
                        aria-label={`${row.action} for ${row.area}`}
                      >
                        {row.action}
                        <ChevronRight size={11} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-outline-variant/30 bg-surface-high/40 flex items-center justify-between">
                <span className="text-[10px] text-on-surface-variant font-mono">
                  Last updated: Today, 10:42 · Auto-refresh enabled
                </span>
                <span className="text-[10px] text-rag-green font-semibold uppercase tracking-wider">
                  Audit trail active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RAG overview ── */}
      <section className="py-section bg-surface-lowest" aria-labelledby="rag-overview-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">DOMAIN SUMMARY</p>
            <h2 id="rag-overview-heading" className="text-display-md font-bold text-on-surface">
              Compliance domain{" "}
              <span className="text-primary text-glow">overview</span>
            </h2>
          </div>
          <div className="max-w-2xl">
            <RAGPanel
              eyebrow="LIVE RAG STATUS"
              title="Compliance domains"
              showLegend={true}
              items={[
                { area: "Safeguarding & KCSIE", status: "green", detail: "Policy current — KCSIE 2024 aligned. Next review: January." },
                { area: "Online safety & filtering", status: "amber", detail: "Policy currency review outstanding.", action: "Review due 30 Nov" },
                { area: "GDPR & data protection", status: "red", detail: "Biometric DPIA not completed.", action: "Immediate action required" },
                { area: "Cyber security", status: "amber", detail: "Staff training completion rate: 71%.", action: "Chase remaining staff" },
                { area: "Governance", status: "green", detail: "Governor training logged. Board report in preparation." },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="py-section" aria-labelledby="capabilities-heading">
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
                icon: <ShieldAlert size={20} strokeWidth={1.5} />,
                title: "RAG risk tracking",
                description:
                  "Real-time green, amber and red status across every compliance domain — safeguarding, GDPR, cyber, filtering and governance — with instant visual assurance for senior leaders.",
              },
              {
                icon: <User size={20} strokeWidth={1.5} />,
                title: "Named ownership",
                description:
                  "Every risk has a named owner and clear accountability. Owners are notified when their risks change status or deadlines approach, keeping action moving without manual chasing.",
              },
              {
                icon: <Clock size={20} strokeWidth={1.5} />,
                title: "Deadline tracking",
                description:
                  "Statutory and internal deadlines tracked with automatic flagging. Red risks with immediate deadlines surface to the top of the register with clear escalation prompts.",
              },
              {
                icon: <Archive size={20} strokeWidth={1.5} />,
                title: "Audit trail",
                description:
                  "A complete, timestamped history of every risk decision, status change and action taken — providing an immutable evidence record for inspection, review or accountability.",
              },
            ].map((cap) => (
              <div
                key={cap.title}
                className="glass-panel glass-panel-hover hud-corners rounded-xl p-6 relative overflow-hidden group"
              >
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
      <section className="py-section bg-surface-lowest" aria-labelledby="how-it-works-heading">
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
                title: "Configure your register",
                description:
                  "Risk areas, owners and deadlines are configured during onboarding — mapped to your school or trust structure and the compliance domains that apply to you.",
              },
              {
                step: "02",
                title: "Monitor and act",
                description:
                  "Risk owners update their areas directly in the register. Status changes are logged automatically, with escalation alerts when risks move to red or deadlines are missed.",
              },
              {
                step: "03",
                title: "Evidence and report",
                description:
                  "The complete audit trail of every risk decision is available for export — giving you a structured evidence record for any review, inspection or board paper.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-panel hud-corners rounded-xl p-6 relative overflow-hidden"
              >
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
              { icon: <FileCheck size={18} strokeWidth={1.5} />, title: "Policy Review Checker", href: "/platform/policy-checker", desc: "KCSIE 2024 automated policy cross-reference and gap analysis." },
              { icon: <Archive size={18} strokeWidth={1.5} />, title: "Evidence & Audit Trail", href: "/platform/evidence-audit", desc: "Immutable timestamped record of every compliance action." },
              { icon: <Wand2 size={18} strokeWidth={1.5} />, title: "DPIA Wizard", href: "/platform/dpia-wizard", desc: "Step-by-step DPIA with risk matrix and DPO sign-off workflow." },
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
        title="Access the Risk Register"
        description="The Risk Register module is available as part of a SafeShield GuardianOS engagement. Book a Readiness Review to discuss configuration, onboarding and ongoing assurance support."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all modules", href: "/platform/tools" }}
      />
    </>
  );
}
