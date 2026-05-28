import type { Metadata } from "next";
import {
  FileText,
  Shield,
  Users,
  BookOpen,
  AlertCircle,
  Eye,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import RAGPanel from "@/components/ui/RAGPanel";
import AuditTimeline from "@/components/ui/AuditTimeline";

export const metadata: Metadata = {
  title: "Digital Safeguarding Review | SafeShield",
  description:
    "A structured digital safeguarding review that maps your online safety provision against KCSIE requirements — producing clear, Ofsted-conscious evidence for governors and school leaders.",
};

const reviewAreas = [
  {
    icon: FileText,
    title: "Online safety policies",
    description:
      "Policy currency, coverage and alignment to KCSIE 2024. We check whether your policies reflect current DfE guidance and are accessible to all relevant staff.",
  },
  {
    icon: Shield,
    title: "Filtering and monitoring",
    description:
      "Whether your systems meet DfE minimum standards for filtering and monitoring, including category coverage and alert thresholds.",
  },
  {
    icon: Users,
    title: "Staff awareness",
    description:
      "Training records, DSL capability and whole-school safeguarding culture. We identify gaps between DSL-level knowledge and wider staff awareness.",
  },
  {
    icon: BookOpen,
    title: "Pupil education",
    description:
      "Curriculum coverage of online safety, relationships and sex education digital elements — mapped against statutory requirements.",
  },
  {
    icon: AlertCircle,
    title: "Incident response",
    description:
      "How online safety incidents are recorded, reported and reviewed. We assess whether your school has a consistent, documented response process.",
  },
  {
    icon: Eye,
    title: "Governor oversight",
    description:
      "Whether governors have the evidence, briefings and reporting they need to fulfil their statutory oversight duty for online safety.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Document and policy review",
    description:
      "We review your existing safeguarding policies, procedures, training records and supporting documentation against current KCSIE and DfE online safety guidance.",
  },
  {
    step: "02",
    title: "Gap identification",
    description:
      "We identify gaps against KCSIE 2024 and DfE online safety guidance — including filtering standards, staff training requirements and governor oversight obligations.",
  },
  {
    step: "03",
    title: "Evidence report",
    description:
      "You receive a structured report with RAG ratings and prioritised actions, written in language appropriate for governor discussion and Ofsted-ready evidence files.",
  },
];

const ragItems = [
  {
    area: "Online safety policy",
    status: "green" as const,
    detail: "KCSIE Part 1 aligned — review recommended annually",
  },
  {
    area: "Filtering configuration",
    status: "amber" as const,
    detail: "DfE minimum standards met — enhanced monitoring recommended",
    action: "Review alert thresholds and category coverage",
  },
  {
    area: "Staff training records",
    status: "amber" as const,
    detail: "DSL training current — wider staff refresh overdue",
    action: "Schedule whole-staff online safety awareness session",
  },
  {
    area: "Governor oversight evidence",
    status: "red" as const,
    detail: "Governors have not received a formal online safety report this term",
    action: "Prepare governor briefing before next full board meeting",
  },
];

const timelineEntries = [
  {
    date: "This term",
    title: "Annual safeguarding policy review",
    description:
      "Safeguarding policy cross-referenced against KCSIE 2024. Amendments logged and version-controlled for governor approval.",
    area: "Safeguarding",
    actor: "DSL",
    status: "approved" as const,
    isLatest: true,
  },
  {
    date: "Last term",
    title: "Filtering configuration review",
    description:
      "DfE minimum filtering standards reviewed. Three additional categories enabled following audit. ICT Manager sign-off recorded.",
    area: "Filtering",
    actor: "ICT Manager",
    status: "complete" as const,
  },
  {
    date: "Last term",
    title: "Staff online safety training",
    description:
      "Whole-staff online safety awareness session completed. Attendance register retained. DSL training certificate renewed.",
    area: "Safeguarding",
    actor: "DSL",
    status: "complete" as const,
  },
  {
    date: "Last academic year",
    title: "Governor online safety briefing",
    description:
      "Online safety and filtering report presented to full governing body. Governor questions and responses minuted.",
    area: "Governance",
    actor: "Headteacher",
    status: "approved" as const,
  },
];

const audiences = [
  {
    role: "Designated Safeguarding Lead",
    description:
      "Receive a clear, structured view of where your online safety provision stands against KCSIE 2024 — with prioritised actions you can act on immediately and evidence you can put in front of governors.",
  },
  {
    role: "Headteacher",
    description:
      "Understand your school's digital safeguarding posture at a leadership level, with a report that is written for strategic discussion rather than technical detail.",
  },
  {
    role: "Governor / Safeguarding Governor",
    description:
      "Receive the evidence you need to fulfil your oversight responsibilities — with clear RAG ratings and a structured summary appropriate for governor-level scrutiny.",
  },
  {
    role: "ICT Manager",
    description:
      "Understand how your filtering and monitoring configuration maps to DfE minimum standards, with specific technical recommendations where gaps are identified.",
  },
];

export default function DigitalSafeguardingPage() {
  return (
    <>
      <PageHero
        eyebrow="DIGITAL SAFEGUARDING"
        title="KCSIE-aligned oversight for your school"
        titleHighlight="for your school"
        description="A structured digital safeguarding review that maps your online safety provision against KCSIE requirements and produces clear, Ofsted-conscious evidence for governors and leaders."
        statusDot={true}
        badge={{ label: "KCSIE Aligned", variant: "cyan" }}
        ctaPrimary={{ label: "Book a Review", href: "/book-review" }}
        ctaSecondary={{ label: "See How It Works", href: "#how-it-works" }}
      />

      {/* What we review */}
      <section className="py-section" aria-labelledby="review-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">SCOPE OF REVIEW</p>
            <h2
              id="review-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              What we{" "}
              <span className="text-primary text-glow">review</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              Our digital safeguarding review covers six interconnected areas drawn directly
              from KCSIE 2024 and DfE online safety guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviewAreas.map(({ icon: Icon, title, description }) => (
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
              following a digital safeguarding review. All areas, ratings and actions are
              tailored to your specific context.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RAGPanel
              title="Digital safeguarding — illustrative review output"
              eyebrow="EXAMPLE SCHOOL"
              items={ragItems}
              showLegend={true}
            />
            <AuditTimeline
              title="Audit trail — example evidence entries"
              entries={timelineEntries}
              maxEntries={4}
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
        title="Book your Digital Safeguarding Review"
        description="Understand your current position across KCSIE, online safety and filtering — with a clear, evidence-based report for governors."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
