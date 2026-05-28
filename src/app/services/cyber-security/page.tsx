import type { Metadata } from "next";
import {
  Network,
  KeyRound,
  Monitor,
  HardDrive,
  AlertCircle,
  Link2,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import RAGPanel from "@/components/ui/RAGPanel";
import EvidenceStream from "@/components/ui/EvidenceStream";

export const metadata: Metadata = {
  title: "Cyber Security Readiness | SafeShield",
  description:
    "A structured cyber security review for schools — identifying control gaps, assessing threat exposure and helping you build inspection-ready evidence of your cyber posture.",
};

const reviewAreas = [
  {
    icon: Network,
    title: "Network security controls",
    description:
      "Firewall configuration, network segmentation and remote access security. We assess whether your perimeter controls meet current NCSC and DfE guidance for schools.",
  },
  {
    icon: KeyRound,
    title: "Access management",
    description:
      "User account governance, privileged access and authentication controls. We identify over-privileged accounts, shared credentials and gaps in multi-factor authentication.",
  },
  {
    icon: Monitor,
    title: "Device and endpoint security",
    description:
      "Device management, patching cadence and endpoint protection standards. We assess whether managed and unmanaged devices meet a consistent security baseline.",
  },
  {
    icon: HardDrive,
    title: "Data protection and backup",
    description:
      "Backup procedures, recovery testing and data classification. We check whether your school could recover from a ransomware incident within an acceptable timeframe.",
  },
  {
    icon: AlertCircle,
    title: "Incident response",
    description:
      "Cyber incident response planning and staff awareness of reporting procedures. We assess whether your school has a documented, tested response plan.",
  },
  {
    icon: Link2,
    title: "Supplier and supply chain risk",
    description:
      "Third-party software and service provider security assessment. We identify suppliers with access to school data who have not been subject to security due diligence.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Posture assessment",
    description:
      "Review of your current controls against NCSC Cyber Essentials criteria and DfE cyber security guidance for schools, identifying your baseline security position.",
  },
  {
    step: "02",
    title: "Risk mapping",
    description:
      "Identification of your highest-priority exposure areas — ranked by likelihood and impact to help you focus remediation effort where it matters most.",
  },
  {
    step: "03",
    title: "Evidence report",
    description:
      "RAG-rated findings with clear remediation priorities, written for school leaders and governors. Includes a summary suitable for board-level discussion.",
  },
];

const ragItems = [
  {
    area: "Network controls",
    status: "amber" as const,
    detail: "Firewall in place — configuration review recommended",
    action: "Review ruleset and disable unnecessary inbound access",
  },
  {
    area: "Access management",
    status: "red" as const,
    detail: "Generic admin accounts identified — immediate remediation recommended",
    action: "Disable shared accounts and enforce individual privileged access",
  },
  {
    area: "Patch management",
    status: "amber" as const,
    detail: "Core systems current — legacy devices overdue for review",
    action: "Produce asset register and establish patching schedule",
  },
  {
    area: "Backup and recovery",
    status: "green" as const,
    detail: "Daily automated backup — recovery test completed this term",
  },
];

const evidenceEntries = [
  {
    id: "c1",
    timestamp: "This week",
    action: "Firewall configuration reviewed",
    actor: "ICT Manager",
    area: "cyber" as const,
    status: "complete" as const,
    detail: "Ruleset documented — unnecessary inbound rules identified for removal",
  },
  {
    id: "c2",
    timestamp: "This week",
    action: "Generic admin accounts flagged",
    actor: "System",
    area: "cyber" as const,
    status: "flagged" as const,
    detail: "3 shared admin accounts identified — remediation required",
  },
  {
    id: "c3",
    timestamp: "Last month",
    action: "Backup recovery test completed",
    actor: "ICT Manager",
    area: "cyber" as const,
    status: "approved" as const,
    detail: "Recovery within 4-hour RTO — test results retained",
  },
  {
    id: "c4",
    timestamp: "Last month",
    action: "Endpoint patching review",
    actor: "System",
    area: "cyber" as const,
    status: "pending" as const,
    detail: "Core fleet current — 12 legacy devices scheduled for replacement",
  },
  {
    id: "c5",
    timestamp: "Last term",
    action: "Cyber incident response plan reviewed",
    actor: "Headteacher",
    area: "cyber" as const,
    status: "complete" as const,
    detail: "Plan updated and distributed to relevant staff",
  },
];

const audiences = [
  {
    role: "Headteacher",
    description:
      "Receive a clear, leadership-level view of your school's cyber security posture — with prioritised actions framed in terms of operational risk rather than technical complexity.",
  },
  {
    role: "ICT Manager",
    description:
      "Gain a structured assessment of your control environment against NCSC Cyber Essentials criteria, with specific technical recommendations and a remediation priority order.",
  },
  {
    role: "School Business Manager",
    description:
      "Understand the financial and operational risk implications of your current cyber posture, and what investment is needed to close priority gaps.",
  },
  {
    role: "MAT Operations Director",
    description:
      "Obtain a consistent, comparable view of cyber security posture across multiple schools — supporting trust-wide risk reporting and investment planning.",
  },
];

export default function CyberSecurityPage() {
  return (
    <>
      <PageHero
        palette="cyan"
        eyebrow="CYBER SECURITY"
        title="Structured cyber review aligned to NCSC guidance"
        titleHighlight="aligned to NCSC guidance"
        description="A structured cyber security review for schools — identifying control gaps, assessing your threat exposure and helping you build inspection-ready evidence of your cyber posture."
        badge={{ label: "NCSC Aligned", variant: "cyan" }}
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
              Our cyber security review covers six control domains drawn from NCSC Cyber
              Essentials and DfE cyber security guidance for schools.
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
              following a cyber security review. Ratings and actions are tailored to your
              specific control environment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RAGPanel
              title="Cyber security — illustrative review output"
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
        title="Book your Cyber Security Review"
        description="Understand your school's cyber security posture against NCSC guidance — with a structured, RAG-rated report that gives leaders and governors a clear picture of risk and priority actions."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
