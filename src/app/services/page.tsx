import type { Metadata } from "next";
import { Shield, Lock, FileText, Cpu, Eye, Users, Landmark } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import ServiceCard from "@/components/ui/ServiceCard";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";

import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — School Digital Safeguarding & Compliance | SafeShield",
  description:
    "Seven specialist service areas covering every aspect of UK school digital compliance — from KCSIE safeguarding and NCSC cyber to GDPR, AI governance and governor accountability.",
};

const serviceIcons: Record<string, React.ReactNode> = {
  "digital-safeguarding": <Shield size={22} strokeWidth={1.5} aria-hidden="true" />,
  "cyber-security": <Lock size={22} strokeWidth={1.5} aria-hidden="true" />,
  "gdpr-dpia": <FileText size={22} strokeWidth={1.5} aria-hidden="true" />,
  "ai-governance": <Cpu size={22} strokeWidth={1.5} aria-hidden="true" />,
  "filtering-monitoring": <Eye size={22} strokeWidth={1.5} aria-hidden="true" />,
  "accessibility-send": <Users size={22} strokeWidth={1.5} aria-hidden="true" />,
  "governor-oversight": <Landmark size={22} strokeWidth={1.5} aria-hidden="true" />,
};

const reviewSteps = [
  {
    number: "01",
    title: "Request a Readiness Review",
    description:
      "Book online or by phone. Tell us about your school or trust — size, context and which compliance areas are most pressing. No commitment required at this stage.",
  },
  {
    number: "02",
    title: "Initial diagnostic",
    description:
      "SafeShield reviews your current position across the relevant compliance domains — policies, evidence records, filtering arrangements and governance documentation.",
  },
  {
    number: "03",
    title: "Structured report",
    description:
      "You receive a clear, RAG-rated findings report with prioritised actions. Written for headteachers and governors, not compliance specialists.",
  },
  {
    number: "04",
    title: "Ongoing support",
    description:
      "Platform access and specialist guidance to help your team act on the findings, maintain evidence and prepare for inspection or board reporting.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── PAGE HERO ── */}
      <PageHero
        palette="violet"
        variant="centered"
        eyebrow="SAFESHIELD SERVICES"
        title="Structured compliance across every domain"
        titleHighlight="every domain"
        description="Seven specialist service areas — digital safeguarding, cyber security, GDPR, AI governance, filtering & monitoring, accessibility and governor oversight — built for UK schools."
        ctaPrimary={{ label: "See All Services", href: "#services" }}
        ctaSecondary={{ label: "Book a Review", href: "/book-review" }}
        badge={{ label: "7 Service Domains", variant: "neutral" }}
        scrollIndicator
      />

      {/* ── SERVICES GRID ── */}
      <section className="py-24 relative overflow-hidden" aria-labelledby="all-services-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,212,255,0.18) 1px, transparent 1px), linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
              backgroundSize: "80px 80px, 80px 80px, 80px 80px",
              backgroundPosition: "-1px -1px, -1px -1px, -1px -1px",
            }}
          />
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[400px]"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)" }}
          />
          <div
            className="absolute right-0 bottom-0 w-[500px] h-[400px]"
            style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(186,195,255,0.05) 0%, transparent 60%)" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-12">
            <p className="eyebrow mb-3">All services</p>
            <h2
              id="all-services-heading"
              className="text-display-md font-bold text-on-surface text-balance max-w-2xl"
            >
              Every compliance domain, structured and evidenced.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                tagline={service.tagline}
                description={service.description}
                icon={serviceIcons[service.slug]}
                href={service.href}
                colour={service.colour}
                pillars={service.pillars}
                compact={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW A REVIEW WORKS ── */}
      <section
        className="py-24 relative overflow-hidden glass-panel border-y border-white/[0.06]"
        aria-labelledby="review-process-heading"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.022) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="eyebrow mb-3">The process</p>
            <h2
              id="review-process-heading"
              className="text-display-md font-bold text-on-surface text-balance max-w-xl"
            >
              How a{" "}
              <span className="text-primary text-glow">Readiness Review</span>{" "}
              works
            </h2>
          </div>

          {/* Desktop: horizontal. Mobile: vertical stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviewSteps.map((step) => (
              <GlassPanel
                key={step.number}
                className="relative rounded-xl p-6 overflow-hidden"
              >
                {/* Background digit */}
                <span
                  className="absolute top-2 right-4 text-[5.5rem] font-black leading-none pointer-events-none select-none text-primary/[0.04]"
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Top edge glow */}
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"
                  aria-hidden="true"
                />

                <div className="relative flex flex-col gap-4 h-full">
                  <span className="text-3xl font-black text-primary/30 metric-number leading-none">
                    {step.number}
                  </span>
                  <h3 className="text-headline-md font-semibold text-on-surface">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed flex-1">
                    {step.description}
                  </p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        eyebrow="NEXT STEP"
        title="Request your Readiness Review"
        description="A structured SafeShield Readiness Review identifies gaps across your digital safeguarding, cyber and compliance position — with clear, prioritised next actions for your school."
        variant="prominent"
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "Explore GuardianOS Framework", href: "/guardian-os" }}
      />
    </>
  );
}
