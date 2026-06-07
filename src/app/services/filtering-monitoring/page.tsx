import type { Metadata } from "next";
import {
  Filter,
  Activity,
  AlertCircle,
  Smartphone,
  ClipboardList,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import RAGPanel from "@/components/ui/RAGPanel";
import AuditTimeline from "@/components/ui/AuditTimeline";

export const metadata: Metadata = {
  title: "Filtering & Monitoring Oversight | SafeShield",
  description:
    "A structured review of your school's internet filtering and monitoring provision — ensuring your systems meet DfE minimum standards and that governors have the evidence to fulfil their oversight duty.",
};

const reviewAreas = [
  {
    icon: Filter,
    title: "Filter configuration",
    description:
      "Whether your filtering solution meets DfE minimum standards and KCSIE requirements — including category coverage, age-appropriate restrictions and the ability to prevent access to harmful content.",
  },
  {
    icon: Activity,
    title: "Monitoring systems",
    description:
      "How your school monitors internet use, what alert thresholds are in place and whether monitoring activity is reviewed regularly by an appropriate member of staff.",
  },
  {
    icon: AlertCircle,
    title: "Incident response",
    description:
      "How filtering and monitoring incidents are recorded, escalated and reviewed. We assess whether your school has a consistent, documented process from alert to resolution.",
  },
  {
    icon: Smartphone,
    title: "BYOD and mobile devices",
    description:
      "Whether school-issued and personally owned devices used on school premises are subject to appropriate filtering and monitoring — including mobile phones and tablets.",
  },
  {
    icon: ClipboardList,
    title: "Governor evidence",
    description:
      "Whether governors have received a formal filtering and monitoring report this academic year — as required by the DfE's filtering and monitoring standards for schools.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Configuration review",
    description:
      "We review your current filtering and monitoring setup against the DfE's filtering and monitoring standards — identifying gaps in category coverage, alert configuration and review processes.",
  },
  {
    step: "02",
    title: "Gap identification",
    description:
      "We identify where your provision falls short of DfE minimum standards or KCSIE requirements — including device coverage, incident recording and governor reporting.",
  },
  {
    step: "03",
    title: "Evidence report",
    description:
      "You receive a structured RAG-rated report for governor discussion, with prioritised actions and a summary suitable for inclusion in your school's safeguarding evidence file.",
  },
];

const ragItems = [
  {
    area: "Filter configuration",
    status: "green" as const,
    detail: "DfE minimum standards met — category review recommended",
    action: "Review category list annually and document outcome",
  },
  {
    area: "Monitoring alert thresholds",
    status: "amber" as const,
    detail: "Basic monitoring in place — alert categories require review",
    action: "Review and update alert thresholds with filtering provider",
  },
  {
    area: "Incident recording",
    status: "amber" as const,
    detail: "Incidents logged — formal review process not documented",
    action: "Establish documented escalation pathway from alert to DSL review",
  },
  {
    area: "Governor oversight",
    status: "red" as const,
    detail: "No filtering and monitoring report presented to governors this academic year",
    action: "Prepare governor briefing before end of current term",
  },
];

const timelineEntries = [
  {
    date: "This term",
    title: "Filtering standards reviewed",
    description:
      "DfE minimum filtering standards checked against current configuration. Category list reviewed and updated — four additional categories enabled.",
    area: "Filtering",
    actor: "ICT Manager",
    status: "complete" as const,
    isLatest: true,
  },
  {
    date: "This term",
    title: "Monitoring alert review — pending",
    description:
      "Alert threshold review scheduled with filtering provider. Current thresholds identified as requiring update following configuration audit.",
    area: "Filtering",
    actor: "ICT Manager",
    status: "pending" as const,
  },
  {
    date: "Last term",
    title: "BYOD policy reviewed",
    description:
      "School BYOD policy updated to reflect current device landscape. Personal device filtering expectations clarified for staff and pupils.",
    area: "Filtering",
    actor: "DSL",
    status: "approved" as const,
  },
  {
    date: "Last academic year",
    title: "Governor filtering and monitoring briefing",
    description:
      "Filtering and monitoring report presented to full governing body. Governor questions recorded and minuted. Approval for ICT investment noted.",
    area: "Governance",
    actor: "Headteacher",
    status: "approved" as const,
  },
];

const audiences = [
  {
    role: "Designated Safeguarding Lead",
    description:
      "Understand whether your filtering and monitoring provision meets KCSIE requirements — and receive clear, prioritised actions you can present to the headteacher and governors.",
  },
  {
    role: "ICT Manager",
    description:
      "Receive a structured technical assessment of your filtering and monitoring configuration against DfE minimum standards, with specific recommendations for your provider.",
  },
  {
    role: "Headteacher",
    description:
      "Understand your current filtering and monitoring position at a strategic level, with a report written for governor-level discussion rather than technical audiences.",
  },
  {
    role: "Governor / Safeguarding Governor",
    description:
      "Receive the formal filtering and monitoring evidence the DfE requires governors to have — with RAG ratings and a structured summary appropriate for minuting at board level.",
  },
];

export default function FilteringMonitoringPage() {
  return (
    <>
      <PageHero
        palette="cyan"
        eyebrow="FILTERING & MONITORING"
        title="DfE-compliant filtering and monitoring oversight"
        titleHighlight="and monitoring oversight"
        description="A structured review of your school's internet filtering and monitoring provision — ensuring your systems meet the DfE minimum standards and that governors have the evidence to fulfil their oversight duty."
        badge={{ label: "DfE Standards", variant: "cyan" }}
        ctaPrimary={{ label: "Book a Review", href: "/book-review" }}
        ctaSecondary={{ label: "See How It Works", href: "#how-it-works" }}
        scrollIndicator
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
              Our filtering and monitoring review covers five areas drawn directly from the
              DfE&apos;s filtering and monitoring standards and KCSIE requirements.
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
              following a filtering and monitoring review. All areas and ratings are tailored
              to your specific configuration and governance context.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RAGPanel
              title="Filtering & monitoring — illustrative review output"
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
        title="Book your Filtering & Monitoring Review"
        description="Ensure your internet filtering and monitoring provision meets DfE minimum standards — and give governors the evidence they need to fulfil their oversight duty."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
