import type { Metadata } from "next";
import {
  AlertTriangle,
  Users,
  ClipboardList,
  BookOpen,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import AudienceCard from "@/components/ui/AudienceCard";

export const metadata: Metadata = {
  title: "For Schools & Governors | SafeShield",
  description:
    "SafeShield is designed for the real pressures that school leaders, DSLs, DPOs and governors face — complex compliance obligations, limited time and a need for evidence that holds up to scrutiny.",
};

const challenges = [
  {
    icon: AlertTriangle,
    title: "Complex and changing obligations",
    description:
      "KCSIE, DfE, NCSC and UK GDPR all place obligations on school leaders that change regularly. Keeping pace whilst running a school is genuinely difficult — and the consequences of falling behind are real.",
  },
  {
    icon: Users,
    title: "Limited specialist resource",
    description:
      "Most schools do not have in-house cyber security, data protection or digital safety specialists. Responsibility falls on headteachers, DSLs and governors who are already stretched.",
  },
  {
    icon: ClipboardList,
    title: "Evidence for inspection",
    description:
      "Governors and Ofsted inspectors need to see documented evidence, not just good intentions. Assembling that evidence from disparate sources takes time that most schools simply do not have.",
  },
];

const differentiators = [
  {
    icon: BookOpen,
    title: "School-appropriate language",
    description:
      "Every SafeShield report and output is written for headteachers and governors, not corporate compliance teams. You will not receive a document that requires a specialist to interpret it.",
  },
  {
    icon: BarChart3,
    title: "Prioritised actions",
    description:
      "Clear RAG ratings and ranked next steps, not overwhelming technical reports. We tell you what matters most, in what order, and why — so your limited time goes where it counts.",
  },
  {
    icon: ShieldCheck,
    title: "Inspection-conscious",
    description:
      "Every output is structured to support governor discussion and inspection readiness. Our reports are designed to be put in front of governors, DSLs and Ofsted inspectors without translation.",
  },
];

const audienceCards = [
  {
    role: "Headteacher",
    description: "Strategic compliance oversight for school leaders",
    benefits: [
      "RAG dashboard across all compliance domains",
      "Governor-ready termly reports",
      "Inspection evidence — structured and current",
      "Clear priorities — not overwhelming checklists",
    ],
  },
  {
    role: "DSL",
    description: "Safeguarding and online safety evidence",
    benefits: [
      "KCSIE 2024 alignment checker",
      "Online safety policy review",
      "Incident log and response framework",
      "Staff training records and gap analysis",
    ],
  },
  {
    role: "DPO",
    description: "Data protection and privacy evidence",
    benefits: [
      "DPIA workflow and sign-off tracking",
      "SAR planner with deadline tracking",
      "Supplier risk and data processor register",
      "Audit trail for ICO accountability",
    ],
  },
  {
    role: "Governor / Trustee",
    description: "Accountability and assurance",
    benefits: [
      "Statutory compliance tracking",
      "Board-level reporting — termly",
      "Named action ownership and deadlines",
      "Risk overview across all digital domains",
    ],
  },
];

export default function SchoolsGovernorsPage() {
  return (
    <>
      <PageHero
        palette="cyan"
        variant="default"
        eyebrow="FOR SCHOOLS & GOVERNORS"
        title="Compliance evidence that holds up to scrutiny"
        titleHighlight="holds up to scrutiny"
        description="SafeShield gives headteachers, DSLs, DPOs and governors a structured, inspection-ready evidence trail across every digital compliance obligation — without the administrative burden."
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "See What We Cover", href: "/services" }}
        badge={{ label: "Inspection-ready", variant: "cyan" }}
        statusDot
        scrollIndicator
      />

      {/* Challenges */}
      <section className="py-section" aria-labelledby="challenges-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">THE CHALLENGE</p>
            <h2
              id="challenges-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Challenges school leaders{" "}
              <span className="text-primary text-glow">face</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              Digital compliance is genuinely complex. These are the pressures SafeShield
              is designed to address.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map(({ icon: Icon, title, description }) => (
              <GlassPanel key={title} as="article" className="p-6 flex flex-col gap-4">
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

      {/* What SafeShield does differently */}
      <section className="py-section" aria-labelledby="differentiators-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">OUR APPROACH</p>
            <h2
              id="differentiators-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              What SafeShield does{" "}
              <span className="text-primary text-glow">differently</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              SafeShield is built for schools, not corporate compliance departments. Here
              is what that means in practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map(({ icon: Icon, title, description }) => (
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

      {/* Audience Cards */}
      <section className="py-section" aria-labelledby="audience-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">FOR EVERY ROLE</p>
            <h2
              id="audience-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Built for{" "}
              <span className="text-primary text-glow">every role</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              SafeShield is designed to support the specific needs of every person in
              your school who carries digital compliance responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {audienceCards.map(({ role, description, benefits }) => (
              <AudienceCard
                key={role}
                role={role}
                description={description}
                benefits={benefits}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="See how SafeShield can help your school"
        description="Book a Readiness Review and get a clear, evidence-based picture of your school's compliance position — with prioritised next steps for every role."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "Explore our services", href: "/services" }}
      />
    </>
  );
}
