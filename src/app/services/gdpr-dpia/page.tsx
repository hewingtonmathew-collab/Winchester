import type { Metadata } from "next";
import {
  FileSearch,
  Clock,
  Building2,
  Map,
  ScrollText,
  ShieldAlert,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import RAGPanel from "@/components/ui/RAGPanel";
import EvidenceStream from "@/components/ui/EvidenceStream";

export const metadata: Metadata = {
  title: "GDPR & DPIA Evidence | SafeShield",
  description:
    "Practical GDPR support for schools — DPIA preparation, SAR management, supplier risk assessment and a clear data protection evidence trail that holds up to scrutiny.",
};

const coverageAreas = [
  {
    icon: FileSearch,
    title: "DPIA preparation support",
    description:
      "Step-by-step DPIA support for new systems, services and data flows. We guide you through the ICO's recommended methodology and help you produce documentation that holds up to scrutiny.",
  },
  {
    icon: Clock,
    title: "SAR processing",
    description:
      "Subject access request workflow with statutory deadline tracking. We help you establish a consistent, documented process that keeps every SAR within the one-month statutory limit.",
  },
  {
    icon: Building2,
    title: "Supplier risk assessment",
    description:
      "Evaluating data processor agreements and supplier security standards. We identify suppliers processing personal data without adequate contractual or security safeguards in place.",
  },
  {
    icon: Map,
    title: "Data mapping and audit",
    description:
      "Understanding what personal data your school holds, why it holds it and how long it is retained. We help you build and maintain a record of processing activities (ROPA).",
  },
  {
    icon: ScrollText,
    title: "Privacy notice review",
    description:
      "Ensuring your school's privacy notices are accurate, accessible and up to date — covering pupils, parents, staff and governors, with plain-English drafting where needed.",
  },
  {
    icon: ShieldAlert,
    title: "Breach response planning",
    description:
      "Documented procedures for identifying, reporting and managing personal data breaches — including the 72-hour ICO notification requirement and internal escalation pathways.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Data audit",
    description:
      "We map your school's current data flows and identify your highest-risk processing activities — giving you a clear picture of what personal data you hold, where and why.",
  },
  {
    step: "02",
    title: "Gap analysis",
    description:
      "We identify missing DPIAs, outdated or absent privacy notices, and data processor agreements that do not meet UK GDPR Article 28 requirements.",
  },
  {
    step: "03",
    title: "Evidence package",
    description:
      "You receive structured documentation for ICO accountability purposes — including a prioritised action plan, draft DPIA templates and supplier assessment records.",
  },
];

const ragItems = [
  {
    area: "DPIA register",
    status: "amber" as const,
    detail: "3 systems identified without current DPIAs",
    action: "Initiate DPIAs for MIS, biometric and cloud storage systems",
  },
  {
    area: "SAR processing",
    status: "green" as const,
    detail: "All current SARs within statutory deadline",
  },
  {
    area: "Data processor agreements",
    status: "amber" as const,
    detail: "2 suppliers without current DPAs identified",
    action: "Issue updated data processing agreements to affected suppliers",
  },
  {
    area: "Privacy notices",
    status: "red" as const,
    detail: "Staff privacy notice requires update following policy changes",
    action: "Update staff privacy notice and reissue before next term",
  },
];

const evidenceEntries = [
  {
    id: "g1",
    timestamp: "This week",
    action: "DPIA initiated — cloud storage migration",
    actor: "DPO",
    area: "gdpr" as const,
    status: "pending" as const,
    detail: "Template issued — awaiting ICT Manager completion",
  },
  {
    id: "g2",
    timestamp: "This week",
    action: "SAR received and acknowledged",
    actor: "School Office",
    area: "gdpr" as const,
    status: "pending" as const,
    detail: "Response deadline: 28 days from receipt",
  },
  {
    id: "g3",
    timestamp: "Last month",
    action: "Supplier DPA reviewed — MIS provider",
    actor: "DPO",
    area: "gdpr" as const,
    status: "approved" as const,
    detail: "UK GDPR Article 28 clauses confirmed — agreement retained",
  },
  {
    id: "g4",
    timestamp: "Last month",
    action: "Pupil privacy notice updated",
    actor: "DPO",
    area: "gdpr" as const,
    status: "complete" as const,
    detail: "Updated to reflect new attendance data processing — published on website",
  },
  {
    id: "g5",
    timestamp: "Last term",
    action: "Breach response plan reviewed",
    actor: "Headteacher",
    area: "gdpr" as const,
    status: "approved" as const,
    detail: "Plan updated — staff awareness session completed",
  },
];

const audiences = [
  {
    role: "Data Protection Officer (DPO)",
    description:
      "Receive structured support for DPIA completion, supplier assessment and the maintenance of your record of processing activities — with documentation designed to demonstrate ICO accountability.",
  },
  {
    role: "Headteacher",
    description:
      "Understand your school's data protection obligations in practical terms, with a clear picture of where gaps exist and what actions carry the greatest compliance risk.",
  },
  {
    role: "School Business Manager",
    description:
      "Manage supplier relationships with confidence — knowing which data processor agreements are in place, which need updating and what your obligations are under UK GDPR Article 28.",
  },
  {
    role: "Governor / Data Protection Governor",
    description:
      "Receive the structured evidence you need to fulfil your oversight responsibilities — including a summary of DPIA coverage, SAR performance and breach readiness.",
  },
];

export default function GdprDpiaPage() {
  return (
    <>
      <PageHero
        eyebrow="GDPR & PRIVACY"
        title="Data protection evidence for schools"
        titleHighlight="for schools"
        description="Practical GDPR support for schools — DPIA preparation, SAR management, supplier risk assessment and a clear data protection evidence trail that holds up to scrutiny."
        badge={{ label: "UK GDPR", variant: "cyan" }}
        ctaPrimary={{ label: "Book a Review", href: "/book-review" }}
        ctaSecondary={{ label: "See How It Works", href: "#how-it-works" }}
      />

      {/* What we cover */}
      <section className="py-section" aria-labelledby="coverage-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">SCOPE</p>
            <h2
              id="coverage-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              What we{" "}
              <span className="text-primary text-glow">cover</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              Our GDPR and data protection support covers six areas of practical compliance
              — from DPIA preparation to breach response planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coverageAreas.map(({ icon: Icon, title, description }) => (
              <GlassPanel
                key={title}
                variant="hover"
                as="article"
                className="p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                </div>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-cyan" aria-hidden="true" />

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-section"
        aria-labelledby="process-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">PROCESS</p>
            <h2
              id="process-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              How it{" "}
              <span className="text-primary text-glow">works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map(({ step, title, description }) => (
              <GlassPanel key={step} as="article" className="p-6 flex flex-col gap-4">
                <span className="metric-number text-primary">{step}</span>
                <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-cyan" aria-hidden="true" />

      {/* RAG Panel + Evidence */}
      <section className="py-section" aria-labelledby="evidence-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">EXAMPLE OUTPUT</p>
            <h2
              id="evidence-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Evidence and{" "}
              <span className="text-primary text-glow">RAG ratings</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              The following illustrates the type of structured output a school might receive
              following a GDPR evidence review. All areas and ratings are tailored to your
              specific data processing activities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RAGPanel
              title="GDPR compliance — illustrative review output"
              eyebrow="EXAMPLE SCHOOL"
              items={ragItems}
              showLegend={true}
            />
            <EvidenceStream
              title="Evidence log — example entries"
              entries={evidenceEntries}
              maxVisible={5}
            />
          </div>
        </div>
      </section>

      <div className="divider-cyan" aria-hidden="true" />

      {/* Who this is for */}
      <section className="py-section" aria-labelledby="audience-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">AUDIENCE</p>
            <h2
              id="audience-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Who this is{" "}
              <span className="text-primary text-glow">for</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {audiences.map(({ role, description }) => (
              <GlassPanel key={role} as="article" className="p-6 flex flex-col gap-3">
                <h3 className="text-body-lg font-semibold text-on-surface">{role}</h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Book your GDPR Evidence Review"
        description="Gain a clear, structured view of your school's data protection compliance — with practical support for DPIAs, SAR management and the evidence trail your DPO needs."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
