import type { Metadata } from "next";
import {
  AlertTriangle,
  Users,
  ClipboardList,
  BookOpen,
  BarChart3,
  ShieldCheck,
  Shield,
  Landmark,
  GraduationCap,
  FileText,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import AudienceCard from "@/components/ui/AudienceCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

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
    colour: "cyan" as const,
    description: "Strategic compliance oversight for school leaders",
    icon: <GraduationCap size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/schools-governors",
    benefits: [
      "RAG dashboard across all compliance domains",
      "Governor-ready termly reports",
      "Inspection evidence — structured and current",
      "Clear priorities — not overwhelming checklists",
    ],
  },
  {
    role: "DSL",
    colour: "violet" as const,
    description: "Safeguarding and online safety evidence",
    icon: <Shield size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/services/digital-safeguarding",
    benefits: [
      "KCSIE 2024 alignment checker",
      "Online safety policy review",
      "Incident log and response framework",
      "Staff training records and gap analysis",
    ],
  },
  {
    role: "DPO",
    colour: "green" as const,
    description: "Data protection and privacy evidence",
    icon: <FileText size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/services/gdpr-dpia",
    benefits: [
      "DPIA workflow and sign-off tracking",
      "SAR planner with deadline tracking",
      "Supplier risk and data processor register",
      "Audit trail for ICO accountability",
    ],
  },
  {
    role: "Governor / Trustee",
    colour: "cyan" as const,
    description: "Accountability and assurance",
    icon: <Landmark size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/mats-las",
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
      <section className="py-28 relative overflow-hidden" aria-labelledby="challenges-heading">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-55"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,212,255,0.12) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.06) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="mb-12 reveal">
              <p className="eyebrow mb-3">THE CHALLENGE</p>
              <h2
                id="challenges-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                Challenges school leaders{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  face
                </span>
              </h2>
              <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
                Digital compliance is genuinely complex. These are the pressures SafeShield
                is designed to address.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map(({ icon: Icon, title, description }, i) => (
                <GlassPanel
                  key={title}
                  as="article"
                  className={`reveal reveal-delay-${i + 1} p-6 flex flex-col gap-4`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(251,191,36,0.07)",
                        border: "1px solid rgba(251,191,36,0.22)",
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        style={{ color: "rgba(251,191,36,0.9)" }}
                      />
                    </div>
                    <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </GlassPanel>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider-cyan" aria-hidden="true" />

      {/* What SafeShield does differently */}
      <section
        className="py-section relative overflow-hidden glass-panel border-y border-white/[0.06]"
        aria-labelledby="differentiators-heading"
      >
        {/* Fine grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="mb-12 reveal">
              <p className="eyebrow mb-3">OUR APPROACH</p>
              <h2
                id="differentiators-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                What SafeShield does{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  differently
                </span>
              </h2>
              <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
                SafeShield is built for schools, not corporate compliance departments. Here
                is what that means in practice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {differentiators.map(({ icon: Icon, title, description }, i) => (
                <GlassPanel
                  key={title}
                  variant="hover"
                  as="article"
                  className={`reveal reveal-delay-${i + 1} p-6 flex flex-col gap-4`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(0,212,255,0.07)",
                        border: "1px solid rgba(0,212,255,0.22)",
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        style={{ color: "rgba(0,212,255,0.85)" }}
                      />
                    </div>
                    <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                  </div>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </GlassPanel>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider-cyan" aria-hidden="true" />

      {/* Audience Cards */}
      <section className="py-28 relative overflow-hidden" aria-labelledby="audience-heading">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,212,255,0.12) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px, 60px 60px, 60px 60px",
            }}
          />
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="mb-12 reveal">
              <p className="eyebrow mb-3">FOR EVERY ROLE</p>
              <h2
                id="audience-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                Built for{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  every role
                </span>
              </h2>
              <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
                SafeShield is designed to support the specific needs of every person in
                your school who carries digital compliance responsibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {audienceCards.map(({ role, colour, description, icon, href, benefits }, i) => (
                <div key={role} className={`reveal reveal-delay-${i + 1}`}>
                  <AudienceCard
                    role={role}
                    colour={colour}
                    description={description}
                    icon={icon}
                    href={href}
                    benefits={benefits}
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
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
