import type { Metadata } from "next";
import {
  Cpu,
  TriangleAlert,
  FileSearch,
  ScrollText,
  ShoppingCart,
  Users,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import RAGPanel from "@/components/ui/RAGPanel";
import EvidenceStream from "@/components/ui/EvidenceStream";

export const metadata: Metadata = {
  title: "AI Governance Readiness | SafeShield",
  description:
    "A structured approach to evaluating, documenting and governing AI tool deployments in your school — before they become a compliance, safeguarding or data protection concern.",
};

const coverageAreas = [
  {
    icon: Cpu,
    title: "AI tool inventory",
    description:
      "Identifying which AI tools are currently in use across your school — including tools adopted informally by staff or pupils. You cannot govern what you have not mapped.",
  },
  {
    icon: TriangleAlert,
    title: "Risk assessment",
    description:
      "Evaluating the safeguarding, privacy and accuracy risks of each tool in use. We assess each deployment against a consistent risk framework appropriate for the school context.",
  },
  {
    icon: FileSearch,
    title: "DPIA requirements",
    description:
      "Identifying which AI deployments require a formal Data Protection Impact Assessment under UK GDPR — and supporting the completion of those assessments where needed.",
  },
  {
    icon: ScrollText,
    title: "Policy framework",
    description:
      "Supporting development of an AI acceptable use policy for staff and pupils — covering permitted uses, prohibited activities, academic integrity and data handling expectations.",
  },
  {
    icon: ShoppingCart,
    title: "Ed-tech procurement",
    description:
      "A due diligence framework for evaluating AI-powered ed-tech before adoption — covering data processing, supplier security, safeguarding implications and contractual obligations.",
  },
  {
    icon: Users,
    title: "Governor awareness",
    description:
      "Briefing materials to help governors fulfil their oversight responsibilities for AI — enabling informed board-level scrutiny without requiring technical expertise.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "AI inventory audit",
    description:
      "We identify all AI tools currently used or under consideration across your school — including tools in use by teaching staff, support staff and pupils, whether formally adopted or not.",
  },
  {
    step: "02",
    title: "Risk classification",
    description:
      "Each tool is assessed for safeguarding, privacy and academic integrity risks — producing a structured AI register with risk ratings, DPIA flags and recommended controls.",
  },
  {
    step: "03",
    title: "Governance framework",
    description:
      "You receive a documented AI register, completed or initiated risk assessments and policy recommendations — giving you a defensible governance position.",
  },
];

const ragItems = [
  {
    area: "AI tool inventory",
    status: "amber" as const,
    detail: "14 tools identified — 6 without documented risk assessments",
    action: "Complete risk assessments for unreviewed tools",
  },
  {
    area: "DPIA coverage",
    status: "red" as const,
    detail: "3 AI tools identified requiring DPIA — none currently completed",
    action: "Initiate DPIAs before continued use of identified tools",
  },
  {
    area: "Acceptable use policy",
    status: "amber" as const,
    detail: "Draft policy in place — staff training not yet evidenced",
    action: "Deliver staff awareness session and retain attendance records",
  },
  {
    area: "Governor awareness",
    status: "red" as const,
    detail: "No formal AI governance report presented to governors",
    action: "Prepare governor briefing for inclusion at next full board meeting",
  },
];

const evidenceEntries = [
  {
    id: "a1",
    timestamp: "This week",
    action: "AI tool register updated",
    actor: "ICT Manager",
    area: "ai" as const,
    status: "pending" as const,
    detail: "14 tools logged — risk assessments in progress for 6 unreviewed tools",
  },
  {
    id: "a2",
    timestamp: "This week",
    action: "DPIA flagged — generative AI writing tool",
    actor: "DPO",
    area: "ai" as const,
    status: "flagged" as const,
    detail: "Pupil data submitted to third-party model — DPIA required before continued use",
  },
  {
    id: "a3",
    timestamp: "Last month",
    action: "AI acceptable use policy — draft reviewed",
    actor: "Headteacher",
    area: "ai" as const,
    status: "pending" as const,
    detail: "Governor approval sought — staff training session to follow",
  },
  {
    id: "a4",
    timestamp: "Last month",
    action: "Ed-tech procurement review — AI marking tool",
    actor: "Deputy Head",
    area: "ai" as const,
    status: "complete" as const,
    detail: "Supplier DPA reviewed — data processing confirmed as UK-based",
  },
  {
    id: "a5",
    timestamp: "Last term",
    action: "Governor AI briefing — scheduled",
    actor: "Clerk to Governors",
    area: "governance" as const,
    status: "pending" as const,
    detail: "Briefing paper to be presented at next full board meeting",
  },
];

const audiences = [
  {
    role: "Headteacher",
    description:
      "Understand which AI tools are in use across your school, what risks they carry and what governance structures you need to have in place to demonstrate responsible oversight.",
  },
  {
    role: "Data Protection Officer (DPO)",
    description:
      "Receive a structured AI register with DPIA flags, risk ratings and supplier assessment records — giving you the documentation base you need to discharge your UK GDPR accountability obligations.",
  },
  {
    role: "ICT Manager",
    description:
      "Gain a clear view of the AI tools in use across the school, with a structured framework for assessing new tools before adoption and maintaining an up-to-date AI inventory.",
  },
  {
    role: "Governor / Chair of Governors",
    description:
      "Receive accessible briefing materials on AI use in your school — enabling you to ask the right questions, fulfil your oversight responsibilities and minute your scrutiny appropriately.",
  },
];

export default function AiGovernancePage() {
  return (
    <>
      <PageHero
        eyebrow="AI GOVERNANCE"
        title="Practical AI governance for school leaders"
        titleHighlight="for school leaders"
        description="A structured approach to evaluating, documenting and governing AI tool deployments in your school — before they become a compliance, safeguarding or data protection risk."
        badge={{ label: "AI Readiness", variant: "neutral" }}
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
              Our AI governance review covers six areas — from building your initial tool
              inventory through to governor-level oversight and procurement due diligence.
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
              following an AI governance review. Ratings and findings are tailored to your
              specific tool landscape and governance context.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RAGPanel
              title="AI governance — illustrative review output"
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
        title="Book your AI Governance Review"
        description="Understand what AI tools are being used in your school, what risks they carry, and what governance structures you need to put in place."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
