import type { Metadata } from "next";
import Link from "next/link";
import {
  UserSearch,
  ShieldAlert,
  Wand2,
  Archive,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  FileText,
  ClipboardList,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";

export const metadata: Metadata = {
  title: "SAR Planner | SafeShield Platform",
  description:
    "Structured SAR workflow with statutory deadline tracking, data source mapping and complete response evidence — keeping your school compliant with UK GDPR obligations.",
};

type SARStatus = "in-progress" | "complete" | "new";

const sarEntries: {
  ref: string;
  subject: string;
  type: string;
  status: SARStatus;
  daysRemaining: number;
  maxDays: number;
  action: string;
}[] = [
  {
    ref: "SAR-2024-018",
    subject: "Parent request",
    type: "Pupil records",
    status: "in-progress",
    daysRemaining: 14,
    maxDays: 30,
    action: "Map data sources",
  },
  {
    ref: "SAR-2024-017",
    subject: "Staff member",
    type: "HR data",
    status: "complete",
    daysRemaining: 30,
    maxDays: 30,
    action: "Review response",
  },
  {
    ref: "SAR-2024-016",
    subject: "Former pupil",
    type: "Historical records",
    status: "new",
    daysRemaining: 30,
    maxDays: 30,
    action: "Begin workflow",
  },
];

const statusConfig: Record<
  SARStatus,
  { badge: string; label: string; icon: React.ReactNode }
> = {
  "in-progress": {
    badge: "badge badge-amber",
    label: "In progress",
    icon: <Clock size={12} aria-hidden="true" />,
  },
  complete: {
    badge: "badge badge-green",
    label: "Responded within deadline",
    icon: <CheckCircle2 size={12} aria-hidden="true" />,
  },
  new: {
    badge: "badge badge-cyan",
    label: "New",
    icon: <AlertCircle size={12} aria-hidden="true" />,
  },
};

export default function SARPlannerPage() {
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
        eyebrow="GUARDIAN OS — SAR PLANNER"
        title="Subject Access Request"
        titleHighlight="Management"
        description="Structured SAR workflow with statutory deadline tracking, data source mapping and complete response evidence — keeping your school compliant with UK GDPR obligations."
        badge={{ label: "UK GDPR", variant: "neutral" }}
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "View all modules", href: "/platform/tools" }}
      />

      {/* ── HUD preview mock ── */}
      <section className="pb-section" aria-label="SAR Planner interface preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divider-cyan mb-12" aria-hidden="true" />
          <p className="eyebrow text-center mb-6">INTERFACE PREVIEW</p>

          <div
            className="glass-panel hud-corners rounded-xl overflow-hidden max-w-4xl mx-auto"
            role="img"
            aria-label="SAR Planner HUD interface mockup showing subject access request workflow"
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
                  <UserSearch size={16} className="text-secondary" aria-hidden="true" />
                  <span className="text-body-sm font-semibold text-on-surface">
                    SAR Planner
                  </span>
                  <span className="badge badge-neutral">3 active requests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rag-amber" aria-hidden="true" />
                  <span className="text-[10px] text-rag-amber font-semibold uppercase tracking-wider">
                    1 in progress
                  </span>
                </div>
              </div>

              {/* SAR rows */}
              <div className="divide-y divide-outline-variant/20">
                {sarEntries.map((sar) => {
                  const config = statusConfig[sar.status];
                  const progressPct =
                    sar.status === "complete"
                      ? 100
                      : Math.round(((sar.maxDays - sar.daysRemaining) / sar.maxDays) * 100);
                  const progressColour =
                    sar.status === "complete"
                      ? "bg-rag-green"
                      : sar.daysRemaining <= 7
                      ? "bg-error"
                      : sar.daysRemaining <= 14
                      ? "bg-rag-amber"
                      : "bg-secondary";

                  return (
                    <div key={sar.ref} className="px-5 py-5 hover:bg-white/[0.02] transition-colors">
                      {/* Row header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-on-surface-variant">
                              {sar.ref}
                            </span>
                            <span className={config.badge}>
                              <span className="flex items-center gap-1">
                                {config.icon}
                                {config.label}
                              </span>
                            </span>
                          </div>
                          <p className="text-body-sm font-semibold text-on-surface">
                            {sar.subject} — {sar.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-[12px] font-semibold ${
                              sar.status === "complete"
                                ? "text-rag-green"
                                : sar.daysRemaining <= 7
                                ? "text-error"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {sar.status === "complete"
                              ? "Responded within deadline"
                              : `${sar.daysRemaining} days remaining`}
                          </p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">
                            30-day statutory deadline
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3" aria-hidden="true">
                        <div className="h-1.5 bg-surface-high rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${progressColour}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {sar.status === "in-progress" && (
                          <>
                            <button
                              type="button"
                              className="flex items-center gap-1.5 text-[11px] font-medium text-secondary bg-secondary/10 border border-secondary/20 rounded px-2.5 py-1 hover:bg-secondary/20 transition-colors"
                              aria-label={`Map data sources for ${sar.ref}`}
                            >
                              <MapPin size={11} aria-hidden="true" />
                              Map data sources
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-1.5 text-[11px] font-medium text-on-surface-variant bg-surface-high border border-outline-variant/30 rounded px-2.5 py-1 hover:text-on-surface transition-colors"
                              aria-label={`Log exemption for ${sar.ref}`}
                            >
                              <ClipboardList size={11} aria-hidden="true" />
                              Log exemption
                            </button>
                          </>
                        )}
                        {sar.status === "complete" && (
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-[11px] font-medium text-rag-green bg-rag-green/10 border border-rag-green/20 rounded px-2.5 py-1 hover:bg-rag-green/20 transition-colors"
                            aria-label={`Review response for ${sar.ref}`}
                          >
                            <FileText size={11} aria-hidden="true" />
                            Review response
                          </button>
                        )}
                        {sar.status === "new" && (
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 rounded px-2.5 py-1 hover:bg-primary/20 transition-colors"
                            aria-label={`Begin workflow for ${sar.ref}`}
                          >
                            <ClipboardList size={11} aria-hidden="true" />
                            Begin workflow
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-outline-variant/30 bg-surface-high/40 flex items-center justify-between">
                <span className="text-[10px] text-on-surface-variant font-mono">
                  Deadline tracking · UK GDPR Article 15 compliance
                </span>
                <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider">
                  Evidence log active
                </span>
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
                icon: <Clock size={20} strokeWidth={1.5} />,
                title: "Deadline tracking",
                description:
                  "Automatic 30-day countdown from the date of receipt of each request, with escalation alerts as deadlines approach — ensuring your school never breaches its statutory obligations.",
              },
              {
                icon: <MapPin size={20} strokeWidth={1.5} />,
                title: "Data source mapping",
                description:
                  "Identify which systems, records and third parties hold data relevant to each request. Structured mapping tools ensure nothing is missed during the response process.",
              },
              {
                icon: <ClipboardList size={20} strokeWidth={1.5} />,
                title: "Response workflow",
                description:
                  "A structured review and sign-off process for SAR responses — covering redactions, exemptions and third-party consultations — with clear role assignments at each stage.",
              },
              {
                icon: <Archive size={20} strokeWidth={1.5} />,
                title: "Evidence log",
                description:
                  "A complete, timestamped audit trail of every SAR from receipt to response. The evidence log provides your school with a demonstrable record of compliance for any ICO investigation.",
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
                title: "Log the request",
                description:
                  "When a SAR is received, log it in the planner. The 30-day statutory countdown begins automatically, and the request is assigned a reference and owner.",
              },
              {
                step: "02",
                title: "Map and review",
                description:
                  "Work through the structured data source mapping checklist. Identify relevant records, apply any exemptions and prepare the response package — with every decision logged.",
              },
              {
                step: "03",
                title: "Respond and evidence",
                description:
                  "Issue the response before the statutory deadline. The complete evidence log — including the request, mapping notes, response and any exemptions — is retained in the audit trail.",
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
              <span className="text-primary text-glow">SAR evidence log</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mt-3 text-balance">
              The following is a representative extract from a completed SAR evidence log. Names and details are illustrative.
            </p>
          </div>

          <div className="glass-panel hud-corners rounded-xl overflow-hidden max-w-3xl">
            <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <p className="text-body-sm font-semibold text-on-surface">
                  SAR Evidence Log — SAR-2024-017
                </p>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  Staff member — HR data · Received 14 October 2024
                </p>
              </div>
              <span className="badge badge-green">Responded within deadline</span>
            </div>

            <div className="divide-y divide-outline-variant/20">
              {[
                { date: "14 Oct", event: "Request received", detail: "Written request received via school office. 30-day deadline: 13 November 2024.", status: "complete" },
                { date: "15 Oct", event: "Request logged and owner assigned", detail: "Assigned to DPO. Data source mapping checklist initiated.", status: "complete" },
                { date: "16–18 Oct", event: "Data source mapping", detail: "MIS records, HR file, email archive and payroll system identified as relevant. CCTV excluded — not within scope.", status: "complete" },
                { date: "22 Oct", event: "Exemption applied", detail: "Third-party references redacted under Schedule 2, DPA 2018. Decision logged.", status: "complete" },
                { date: "30 Oct", event: "Response issued", detail: "Response package issued to requester. Responded within statutory deadline (Day 16 of 30).", status: "approved" },
              ].map((row, i) => (
                <div key={i} className="px-6 py-4 flex items-start gap-4">
                  <span className="text-[11px] font-mono text-on-surface-variant flex-shrink-0 w-16 pt-0.5">
                    {row.date}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-on-surface mb-0.5">
                      {row.event}
                    </p>
                    <p className="text-[12px] text-on-surface-variant leading-relaxed">
                      {row.detail}
                    </p>
                  </div>
                  <span
                    className={`badge flex-shrink-0 ${
                      row.status === "approved" ? "badge-green" : "badge-cyan"
                    }`}
                  >
                    {row.status === "approved" ? "Complete" : "Logged"}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-surface-high border-t border-outline-variant/30">
              <p className="text-[11px] text-on-surface-variant">
                <span className="text-rag-green font-semibold">Compliant response</span>
                {" "}· Responded Day 16 of 30 · Evidence log retained · GuardianOS SAR Planner
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
              { icon: <Wand2 size={18} strokeWidth={1.5} />, title: "DPIA Wizard", href: "/platform/dpia-wizard", desc: "Step-by-step DPIA with proportionate risk assessment and DPO sign-off." },
              { icon: <Archive size={18} strokeWidth={1.5} />, title: "Evidence & Audit Trail", href: "/platform/evidence-audit", desc: "Immutable timestamped record of every compliance action." },
              { icon: <ShieldAlert size={18} strokeWidth={1.5} />, title: "Risk Register", href: "/platform/risk-register", desc: "Live RAG risk tracking across all compliance domains." },
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
        title="Access the SAR Planner"
        description="The SAR Planner is available as part of a SafeShield GuardianOS engagement. Book a Readiness Review to discuss your GDPR obligations and platform access."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all modules", href: "/platform/tools" }}
      />
    </>
  );
}
