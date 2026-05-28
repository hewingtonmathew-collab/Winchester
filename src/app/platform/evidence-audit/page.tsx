import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  FileCheck,
  ShieldAlert,
  UserSearch,
  Wand2,
  Clock,
  Search,
  Download,
  Lock,
  Filter,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import AuditTimeline from "@/components/ui/AuditTimeline";

export const metadata: Metadata = {
  title: "Evidence & Audit Trail | SafeShield Platform",
  description:
    "A timestamped, searchable audit trail of every compliance action, policy decision and governance event. Your first line of defence in any review, inspection or accountability question.",
};

const filterChips = ["All", "Safeguarding", "GDPR", "Cyber", "Governance"] as const;

export default function EvidenceAuditPage() {
  return (
    <>
      {/* ── Platform preview banner ── */}
      <div className="bg-surface-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
          <span className="badge badge-green">Platform Preview</span>
          <span className="text-body-sm text-on-surface-variant">
            This is a platform preview — GuardianOS is available as part of a SafeShield engagement.{" "}
            <Link href="/book-review" className="text-rag-green hover:text-on-surface underline underline-offset-2 transition-colors">
              Book a Readiness Review to request access.
            </Link>
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <PageHero
        eyebrow="GUARDIAN OS — EVIDENCE TRAIL"
        title="Immutable compliance"
        titleHighlight="audit record"
        description="A timestamped, searchable audit trail of every compliance action, policy decision and governance event. Your first line of defence in any review, inspection or accountability question."
        statusDot={true}
        badge={{ label: "Inspection Ready", variant: "green" }}
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "View all modules", href: "/platform/tools" }}
      />

      {/* ── Audit timeline preview ── */}
      <section className="pb-section" aria-label="Evidence audit trail interface preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divider-cyan mb-12" aria-hidden="true" />
          <p className="eyebrow text-center mb-6">INTERFACE PREVIEW</p>

          <div className="max-w-4xl mx-auto">
            <AuditTimeline
              showViewAll={false}
              title="Sample audit trail"
              maxEntries={6}
            />
          </div>
        </div>
      </section>

      {/* ── Search and filter mock ── */}
      <section className="py-section bg-surface-lowest" aria-labelledby="search-filter-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">SEARCH & FILTER</p>
            <h2 id="search-filter-heading" className="text-display-md font-bold text-on-surface">
              Search and filter{" "}
              <span className="text-primary text-glow">your evidence</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mt-3 text-balance">
              The evidence archive is fully searchable by date range, compliance area, actor or keyword — enabling rapid retrieval of any record during an inspection or review.
            </p>
          </div>

          {/* Search/filter mock UI */}
          <div
            className="glass-panel hud-corners rounded-xl p-6 max-w-3xl"
            role="img"
            aria-label="Search and filter interface mockup for the evidence audit trail"
          >
            <div
              className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] pointer-events-none opacity-30 rounded-xl"
              aria-hidden="true"
            />
            <div className="relative z-10">
              {/* Search bar */}
              <div className="flex items-center gap-3 glass-panel rounded-lg px-4 py-3 mb-4">
                <Search size={15} className="text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-body-sm text-on-surface-variant/60 flex-1 select-none">
                  Search by keyword, actor, area or date…
                </span>
                <Filter size={14} className="text-on-surface-variant flex-shrink-0" aria-hidden="true" />
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2 mb-5" aria-label="Filter chips">
                {filterChips.map((chip, i) => (
                  <button
                    key={chip}
                    type="button"
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      i === 0
                        ? "bg-primary/20 border border-primary/40 text-primary"
                        : "glass-panel border border-outline-variant/30 text-on-surface-variant hover:text-on-surface"
                    }`}
                    aria-pressed={i === 0}
                    aria-label={`Filter by ${chip}`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Result count + export */}
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant">
                  <span className="text-on-surface font-semibold">47 records</span> in current filter
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[11px] font-medium text-rag-green bg-rag-green/10 border border-rag-green/20 rounded px-3 py-1.5 hover:bg-rag-green/20 transition-colors"
                  aria-label="Export filtered audit report"
                >
                  <Download size={11} aria-hidden="true" />
                  Export report
                </button>
              </div>
            </div>
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
                icon: <Clock size={20} strokeWidth={1.5} />,
                title: "Timestamped records",
                description:
                  "Every compliance action, policy decision and governance event is logged automatically with an accurate date, time and actor — building an unambiguous evidence record from day one.",
              },
              {
                icon: <Search size={20} strokeWidth={1.5} />,
                title: "Searchable archive",
                description:
                  "Search the full compliance archive by date range, area, actor or keyword. Retrieve any record in seconds — whether you are responding to an inspection question or an FOI request.",
              },
              {
                icon: <Download size={20} strokeWidth={1.5} />,
                title: "Export for inspection",
                description:
                  "Generate a formatted audit report filtered by date, area or actor — ready to present to Ofsted, the ICO, governors or the local authority at short notice.",
              },
              {
                icon: <Lock size={20} strokeWidth={1.5} />,
                title: "Tamper-evident",
                description:
                  "Audit records cannot be edited or deleted retroactively. The immutable ledger provides inspectors and trustees with confidence that your evidence reflects what actually happened.",
              },
            ].map((cap) => (
              <div
                key={cap.title}
                className="glass-panel glass-panel-hover hud-corners rounded-xl p-6 relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-rag-green/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-rag-green/10 border border-rag-green/30 text-rag-green shrink-0">
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
                title: "Automatic logging",
                description:
                  "Every action taken across all GuardianOS modules is automatically written to the audit trail — no manual logging required. Policy reviews, risk updates, SARs, DPIAs and sign-offs all appear automatically.",
              },
              {
                step: "02",
                title: "Search and retrieve",
                description:
                  "Use the search and filter tools to locate any record instantly — whether preparing for an inspection, responding to a trustee question or supporting a data subject access request.",
              },
              {
                step: "03",
                title: "Export and present",
                description:
                  "Generate a formatted, dated audit report for any period or area. Share it with governors, inspectors or the ICO as evidence of your school's active, documented compliance programme.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-panel hud-corners rounded-xl p-6 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-rag-green/40 to-transparent"
                  aria-hidden="true"
                />
                <span className="metric-number text-metric-lg font-bold text-rag-green/30 select-none block mb-3">
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

      {/* ── Inspection readiness callout ── */}
      <section className="py-section" aria-labelledby="inspection-readiness-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel hud-corners rounded-xl p-8 relative overflow-hidden max-w-3xl">
            <div
              className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-rag-green/50 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-grid-hud bg-[size:40px_40px] pointer-events-none opacity-30"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-rag-green/10 border border-rag-green/30 flex-shrink-0">
                  <Archive size={22} className="text-rag-green" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <h2 id="inspection-readiness-heading" className="text-headline-lg font-bold text-on-surface mb-1">
                    Inspection-ready evidence
                  </h2>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Ofsted, the ICO and the DfE can request evidence of your compliance programme at short notice. The Evidence Trail gives you a structured, retrievable record — so you are never caught unprepared.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: "100%", label: "Actions logged automatically" },
                  { value: "< 30s", label: "Average record retrieval time" },
                  { value: "5 yrs", label: "Default evidence retention" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-panel rounded-lg p-3 text-center">
                    <p className="metric-number text-xl font-bold text-rag-green mb-1">
                      {stat.value}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related modules ── */}
      <section className="py-section bg-surface-lowest" aria-labelledby="related-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-2">RELATED MODULES</p>
          <h2 id="related-heading" className="text-display-md font-bold text-on-surface mb-8">
            Continue with{" "}
            <span className="text-primary text-glow">GuardianOS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <FileCheck size={18} strokeWidth={1.5} />, title: "Policy Review Checker", href: "/platform/policy-checker", desc: "KCSIE 2024 gap analysis and governor report." },
              { icon: <ShieldAlert size={18} strokeWidth={1.5} />, title: "Risk Register", href: "/platform/risk-register", desc: "Live RAG risk tracking across all domains." },
              { icon: <UserSearch size={18} strokeWidth={1.5} />, title: "SAR Planner", href: "/platform/sar-planner", desc: "Structured SAR workflow with deadline tracking." },
              { icon: <Wand2 size={18} strokeWidth={1.5} />, title: "DPIA Wizard", href: "/platform/dpia-wizard", desc: "Step-by-step DPIA with DPO sign-off." },
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
        title="Access the Evidence Trail"
        description="The Evidence Trail is available as part of a SafeShield GuardianOS engagement. Book a Readiness Review to discuss access and how the audit trail integrates with your compliance programme."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all modules", href: "/platform/tools" }}
      />
    </>
  );
}
