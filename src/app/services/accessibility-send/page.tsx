import type { Metadata } from "next";
import {
  Globe,
  Laptop,
  FileText,
  GraduationCap,
  ShoppingCart,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";

export const metadata: Metadata = {
  title: "Accessibility & SEND Digital Inclusion | SafeShield",
  description:
    "A structured review of your school's digital accessibility and SEND technology provision — supporting compliance with the Public Sector Bodies Accessibility Regulations and your equality obligations.",
};

const reviewAreas = [
  {
    icon: Globe,
    title: "Website accessibility",
    description:
      "Whether your school website meets WCAG 2.1 AA and PSBAR requirements, including accessibility statement currency, navigability and alternative text provision.",
  },
  {
    icon: Laptop,
    title: "SEND technology audit",
    description:
      "Review of assistive technology provision across your school and its fitness for purpose — including screen readers, communication aids and adapted input devices.",
  },
  {
    icon: FileText,
    title: "Accessibility policy",
    description:
      "Currency and coverage of your accessibility statement and equality policy, assessed against the Public Sector Bodies Accessibility Regulations and the Equality Act 2010.",
  },
  {
    icon: GraduationCap,
    title: "Staff training",
    description:
      "Whether staff are trained to support pupils with SEND in digital contexts — including awareness of assistive technology and legal obligations under the Equality Act.",
  },
  {
    icon: ShoppingCart,
    title: "Procurement practice",
    description:
      "Whether accessibility is considered as a criterion in ed-tech procurement decisions, and whether suppliers are required to meet WCAG 2.1 AA as a baseline.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Accessibility audit",
    description:
      "A structured review of your digital estate — website, platforms and published documents — against WCAG 2.1 AA and the statutory requirements of the Public Sector Bodies Accessibility Regulations.",
  },
  {
    step: "02",
    title: "SEND technology review",
    description:
      "Assessment of your assistive technology provision, policy alignment and the degree to which digital tools support pupils with SEND to access the curriculum and school systems.",
  },
  {
    step: "03",
    title: "Evidence report",
    description:
      "Structured findings with prioritised actions for SENCOs, headteachers and governors — written in plain language and structured for both operational use and governor scrutiny.",
  },
];

const audiences = [
  {
    role: "SENCO",
    description:
      "Understand whether your assistive technology provision is fit for purpose and whether staff training adequately supports pupils with SEND in digital contexts — with clear next steps.",
  },
  {
    role: "Headteacher",
    description:
      "Receive a strategic view of your school's digital accessibility position, with evidence appropriate for governing body discussion and Ofsted inspection.",
  },
  {
    role: "ICT Manager",
    description:
      "Understand how your website, systems and procurement practice align to WCAG 2.1 AA and PSBAR, with specific technical actions where gaps are identified.",
  },
  {
    role: "Governor",
    description:
      "Receive the structured evidence you need to fulfil your equality oversight responsibilities, with RAG ratings across every accessibility domain.",
  },
];

export default function AccessibilitySENDPage() {
  return (
    <>
      <PageHero
        eyebrow="ACCESSIBILITY & SEND"
        title="Digital inclusion for every pupil"
        titleHighlight="for every pupil"
        description="A structured review of your school's digital accessibility and SEND technology provision — supporting compliance with the Public Sector Bodies Accessibility Regulations and your equality obligations."
        badge={{ label: "PSBAR Aligned", variant: "neutral" }}
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
              Our Accessibility &amp; SEND review covers five interconnected areas drawn
              from WCAG 2.1 AA, the Public Sector Bodies Accessibility Regulations and
              the Equality Act 2010.
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
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              A structured three-stage process designed to give you a clear picture of
              your accessibility position and a practical path to improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map(({ step, title, description }) => (
              <GlassPanel key={step} as="article" className="p-6 flex flex-col gap-4">
                <span className="metric-number text-primary" aria-hidden="true">{step}</span>
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
              Our Accessibility &amp; SEND review is designed for the people who bear
              responsibility for digital inclusion in schools.
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
        title="Book your Accessibility & SEND Review"
        description="Understand your school's digital accessibility position and SEND technology provision — with a clear, evidence-based report structured for governors and inspectors."
        primaryCTA={{ label: "Book a Review", href: "/book-review" }}
        secondaryCTA={{ label: "View all services", href: "/services" }}
      />
    </>
  );
}
