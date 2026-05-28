import type { Metadata } from "next";
import {
  BarChart3,
  ClipboardCheck,
  BookUser,
  FileBarChart,
  ListChecks,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import RAGPanel from "@/components/ui/RAGPanel";
import AuditTimeline from "@/components/ui/AuditTimeline";

export const metadata: Metadata = {
  title: "Governor Oversight | SafeShield",
  description:
    "SafeShield provides governors and trustees with the structured evidence and reporting they need to fulfil their digital safeguarding, cyber and GDPR oversight responsibilities.",
};

const provisions = [
  {
    icon: BarChart3,
    title: "RAG risk reporting",
    description:
      "Clear red, amber and green status across every compliance domain — giving governors a structured view of where the school stands and where attention is required.",
  },
  {
    icon: ClipboardCheck,
    title: "Statutory assurance tracking",
    description:
      "Evidence of compliance with KCSIE, DfE and UK GDPR obligations, structured so governors can confirm they have received and considered it.",
  },
  {
    icon: BookUser,
    title: "Governor training records",
    description:
      "Documentation of governor awareness and training in digital safeguarding, cyber security and data protection — supporting the governing body's own training obligations.",
  },
  {
    icon: FileBarChart,
    title: "Board-level reporting",
    description:
      "Termly assurance reports structured for governor discussion, written in accessible language without unnecessary technical jargon.",
  },
  {
    icon: ListChecks,
    title: "Action tracking",
    description:
      "Named ownership and deadline tracking for compliance actions, giving governors visibility of what is in progress and what has been completed.",
  },
];

const ragItems = [
  {
    area: "Digital safeguarding",
    status: "green" as const,
    detail: "KCSIE 2024 aligned — annual review evidenced and ratified by governors",
  },
  {
    area: "Cyber security",
    status: "amber" as const,
    detail: "NCSC Cyber Essentials baseline met — staff training refresh overdue",
    action: "Schedule whole-staff cyber awareness session before end of term",
  },
  {
    area: "GDPR and data protection",
    status: "amber" as const,
    detail: "Data protection policy current — two DPIAs awaiting DPO sign-off",
    action: "DPO to complete DPIA review and submit to headteacher",
  },
  {
    area: "Filtering and monitoring",
    status: "red" as const,
    detail: "DfE minimum standards not fully met — category gaps identified in audit",
    action: "ICT Manager to review configuration and report to governors this term",
  },
];

const timelineEntries = [
  {
    date: "This term",
    title: "Governor oversight report presented",
    description:
      "Termly digital safeguarding and compliance assurance report presented to full governing body. RAG ratings discussed and actions agreed.",
    area: "Governance",
    actor: "Headteacher",
    status: "approved" as const,
    isLatest: true,
  },
  {
    date: "This term",
    title: "Filtering gap identified and logged",
    description:
      "ICT audit identified DfE filtering category gap. Logged as red-rated action with named owner and deadline.",
    area: "Filtering",
    actor: "ICT Manager",
    status: "flagged" as const,
  },
  {
    date: "Last term",
    title: "Governor safeguarding training completed",
    description:
      "Board safeguarding training — Autumn term. Twelve governors attended. Certificates retained. Named in governor training register.",
    area: "Governance",
    actor: "Clerk",
    status: "complete" as const,
  },
  {
    date: "Last term",
    title: "Data protection policy ratified",
    description:
      "Updated data protection policy approved at full governing body. Aligned to UK GDPR and ICO guidance. Version-controlled.",
    area: "GDPR",
    actor: "DPO",
    status: "approved" as const,
  },
  {
    date: "Last academic year",
    title: "Annual cyber posture review",
    description:
      "NCSC Cyber Essentials baseline review completed. Report presented to governors with three amber actions, all now closed.",
    area: "Cyber",
    actor: "System",
    status: "complete" as const,
  },
];

const audiences = [
  {
    role: "Governor / Trustee",
    description:
      "Receive the structured evidence you need to fulfil your digital oversight responsibilities under KCSIE, DfE and UK GDPR — with RAG ratings and a report format designed for board-level scrutiny.",
  },
  {
    role: "Clerk to Governors",
    description:
      "Access training records, action logs and assurance reports that support robust minute-taking and evidence that the board has fulfilled its statutory oversight duties.",
  },
  {
    role: "Headteacher",
    description:
      "Present governors with clear, credible compliance evidence — structured to support discussion, identify risk and demonstrate that appropriate oversight is in place.",
  },
  {
    role: "Chair of Governors",
    description:
      "Maintain a clear view of the school's compliance position across every digital domain, with action tracking that shows what is owned, in progress and complete.",
  },
];

export default function GovernorOversightPage() {
  return (
    <>
      <PageHero
        palette="cyan"
        eyebrow="GOVERNOR OVERSIGHT"
        title="Structured accountability for school boards"
        titleHighlight="for school boards"
        description="SafeShield provides governors and trustees with the structured evidence and reporting they need to fulfil their digital safeguarding, cyber and GDPR oversight responsibilities."
        statusDot={true}
        badge={{ label: "Board Ready", variant: "green" }}
        ctaPrimary={{ label: "Book a Review", href: "/book-review" }}
        ctaSecondary={{ label: "See How It Works", href: "#how-it-works" }}
        scrollIndicator
      />

      {/* What we provide */}
      <section className="py-section" aria-labelledby="provisions-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">SCOPE OF PROVISION</p>
            <h2
              id="provisions-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              What we{" "}
              <span className="text-primary text-glow">provide</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              Governor oversight reporting covers five interconnected areas, giving boards
              the evidence and structure they need to fulfil their statutory digital
              compliance responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {provisions.map(({ icon: Icon, title, description }) => (
              <GlassPanel
                key={title}
                variant="hover"
                as="article"
                className="p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary" strokeWidth={1.5} aria-hidden="true" />
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

      {/* RAG Panel + Evidence */}
      <section
        id="how-it-works"
        className="py-section"
        aria-labelledby="evidence-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">EXAMPLE OUTPUT</p>
            <h2
              id="evidence-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Governor-ready{" "}
              <span className="text-primary text-glow">evidence</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              The following illustrates the type of structured output a governing body
              might receive following a SafeShield review. RAG ratings, actions and audit
              entries are all tailored to your school&apos;s specific position.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RAGPanel
              title="Compliance overview — illustrative review output"
              eyebrow="EXAMPLE SCHOOL"
              items={ragItems}
              showLegend={true}
            />
            <AuditTimeline
              title="Governance audit trail — example entries"
              entries={timelineEntries}
              maxEntries={5}
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
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              Governor oversight reporting is designed for everyone involved in the
              school board&apos;s accountability and assurance function.
            </p>
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
        title="Book a Governor Oversight Review"
        description="Give your governors and trustees the structured evidence they need — with clear RAG ratings, board-ready reporting and named action ownership."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
