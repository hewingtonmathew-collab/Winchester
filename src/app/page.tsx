import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileText, Cpu, Eye, Users, Landmark, ArrowRight } from "lucide-react";

import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";
import HeroBackground from "@/components/ui/HeroBackground";
import ServiceCard from "@/components/ui/ServiceCard";
import AudienceCard from "@/components/ui/AudienceCard";
import StatusCard from "@/components/ui/StatusCard";
import EvidenceStream from "@/components/ui/EvidenceStream";
import CTASection from "@/components/ui/CTASection";

import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Digital Safeguarding Intelligence for Schools | SafeShield",
  description:
    "GuardianOS-powered compliance oversight for UK schools, MATs and local authorities — safeguarding, cyber, GDPR, AI governance and governor accountability in one structured platform.",
};

const serviceIcons: Record<string, React.ReactNode> = {
  "digital-safeguarding": <Shield size={20} strokeWidth={1.5} aria-hidden="true" />,
  "cyber-security": <Lock size={20} strokeWidth={1.5} aria-hidden="true" />,
  "gdpr-dpia": <FileText size={20} strokeWidth={1.5} aria-hidden="true" />,
  "ai-governance": <Cpu size={20} strokeWidth={1.5} aria-hidden="true" />,
  "filtering-monitoring": <Eye size={20} strokeWidth={1.5} aria-hidden="true" />,
  "accessibility-send": <Users size={20} strokeWidth={1.5} aria-hidden="true" />,
  "governor-oversight": <Landmark size={20} strokeWidth={1.5} aria-hidden="true" />,
};

const trustBarItems = [
  { label: "KCSIE 2024", description: "Safeguarding framework" },
  { label: "UK GDPR", description: "Data protection standard" },
  { label: "NCSC Aligned", description: "Cyber security guidance" },
  { label: "MAT Ready", description: "Multi-academy trust support" },
];

const audienceCards = [
  {
    role: "Headteachers",
    description: "Strategic oversight and assurance",
    benefits: [
      "RAG compliance dashboard",
      "Governor-ready reporting",
      "Clear evidence trail",
      "Inspection-conscious wording",
    ],
  },
  {
    role: "DSLs / DPOs",
    description: "Safeguarding and privacy evidence",
    benefits: [
      "KCSIE policy checker",
      "DPIA and SAR workflow",
      "Evidence library",
      "Filtering oversight",
    ],
  },
  {
    role: "MAT Directors / Governors",
    description: "Trust-wide accountability",
    benefits: [
      "Multi-school overview",
      "Statutory assurance tracking",
      "Board-level reporting",
      "Action accountability",
    ],
  },
];

export default function HomePage() {
  const displayedServices = services.slice(0, 6);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative w-full pt-32 pb-24 overflow-hidden"
        aria-label="SafeShield digital safeguarding intelligence"
      >
        {/* Animated aurora background */}
        <HeroBackground
          className="-z-10"
          intensity="intense"
          showOrbs
          showGrid
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <p className="eyebrow">Digital Safeguarding Intelligence</p>
              <h1 className="text-6xl sm:text-7xl font-black text-on-surface tracking-tight leading-none">
                Safe<span className="text-primary text-glow-strong">Shield</span>
              </h1>
              <p className="text-xl font-semibold text-on-surface max-w-lg leading-snug">
                Digital safeguarding intelligence for schools that need more than basic compliance.
              </p>
              <p className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                GuardianOS-powered compliance oversight for UK schools, MATs and local authorities
                — safeguarding, cyber, GDPR, AI governance and governor accountability in one
                structured platform.
              </p>
              {/* Fine HUD detail line */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
                <span className="hud-label">GuardianOS v2.4</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <Link href="/book-review" className="btn-primary">
                  Book a Readiness Review
                </Link>
                <Link href="/guardian-os" className="btn-secondary">
                  Explore GuardianOS
                </Link>
              </div>
            </div>

            {/* Right — GuardianOS visual */}
            <div className="flex justify-center lg:justify-end">
              <GuardianCommandVisual
                variant="hero"
                trustScore={94}
                kcsieScore={98}
                activeNodes={14}
                totalNodes={14}
                alerts={2}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section
        className="w-full py-5 glass-panel border-y border-white/[0.06]"
        aria-label="Framework alignments"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2">
            <p className="eyebrow text-on-surface-variant shrink-0 mr-4 hidden sm:block">
              Designed for UK schools
            </p>
            <div className="w-px h-6 bg-white/10 hidden sm:block" aria-hidden="true" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-0 flex-1">
              {trustBarItems.map((item, i) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center sm:items-start sm:px-6 gap-0.5"
                >
                  {i > 0 && (
                    <div
                      className="hidden sm:block absolute h-6 w-px bg-white/10 -left-0.5"
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-body-sm font-bold text-primary tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">{item.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE MODULES GRID ── */}
      <section className="py-24 relative overflow-hidden" aria-labelledby="services-heading">
        {/* Section depth background */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,212,255,0.14) 1px, transparent 1px), linear-gradient(rgba(0,212,255,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.032) 1px, transparent 1px)",
              backgroundSize: "80px 80px, 80px 80px, 80px 80px",
              backgroundPosition: "-1px -1px, -1px -1px, -1px -1px",
            }}
          />
          <div
            className="absolute right-0 top-0 w-[600px] h-[400px]"
            style={{
              background: "radial-gradient(ellipse at 100% 0%, rgba(0,212,255,0.06) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute left-0 bottom-0 w-[500px] h-[400px]"
            style={{
              background: "radial-gradient(ellipse at 0% 100%, rgba(186,195,255,0.05) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-12">
            <p className="eyebrow mb-3">SafeShield Services</p>
            <h2
              id="services-heading"
              className="text-display-md font-bold text-on-surface max-w-2xl text-balance"
            >
              Structured compliance across every critical area.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                tagline={service.tagline}
                description={service.description}
                icon={serviceIcons[service.slug]}
                href={service.href}
                colour={service.colour}
                pillars={service.pillars.slice(0, 2)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-tint transition-colors"
            >
              View all services
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GUARDIAN COMMAND VISUAL (full-width split) ── */}
      <section
        className="py-24 relative overflow-hidden glass-panel border-y border-white/[0.06]"
        aria-labelledby="guardianOS-heading"
      >
        {/* Fine grid overlay inside glass section */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="flex flex-col gap-6">
              <p className="eyebrow">The Platform</p>
              <h2
                id="guardianOS-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                Introducing{" "}
                <span className="text-primary text-glow">GuardianOS</span>
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
                GuardianOS is the compliance operating system that powers every SafeShield
                service. Six interconnected domains — safeguarding, cyber, GDPR, AI governance,
                filtering and governor accountability — give your school a structured, evidence-first
                view of its compliance position.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed max-w-lg">
                Built for how school leaders actually work: plain English reporting, RAG-rated
                summaries and inspection-conscious evidence trails that hold up to scrutiny.
              </p>
              {/* Domain count detail */}
              <div className="flex items-center gap-6 pt-2">
                {[["6", "Domains"], ["94%", "Avg Score"], ["14", "Nodes"]].map(([val, lbl]) => (
                  <div key={lbl} className="flex flex-col gap-0.5">
                    <span className="text-2xl font-black text-primary text-glow">{val}</span>
                    <span className="hud-label">{lbl}</span>
                  </div>
                ))}
              </div>
              <div className="pt-1">
                <Link href="/guardian-os" className="btn-secondary">
                  Explore the framework
                </Link>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <GuardianCommandVisual
                variant="full"
                trustScore={94}
                kcsieScore={98}
                activeNodes={14}
                totalNodes={14}
                alerts={2}
                className="w-full max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── RAG RISK STRIP ── */}
      <section className="py-16 relative overflow-hidden" aria-label="Current compliance metrics">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,212,255,0.12) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatusCard
              label="Trust Assurance"
              value="94"
              unit="%"
              status="cyan"
              variant="gauge"
              gaugePercent={94}
              animated
              trend={{ direction: "up", label: "+2.4% this cycle" }}
              description="Overall platform confidence score across all active compliance domains."
            />
            <StatusCard
              label="KCSIE Alignment"
              value="98"
              unit="%"
              status="green"
              variant="gauge"
              gaugePercent={98}
              animated
              trend={{ direction: "stable", label: "Stable" }}
              description="Proportion of current KCSIE requirements evidenced and documented."
            />
            <StatusCard
              label="Active Domains"
              value="7/7"
              status="cyan"
              variant="metric"
              trend={{ direction: "stable", label: "All operational" }}
              description="All seven compliance domains are active and receiving regular review."
            />
          </div>
        </div>
      </section>

      {/* ── EVIDENCE STREAM ── */}
      <section
        className="py-24 relative overflow-hidden glass-panel border-y border-white/[0.06]"
        aria-labelledby="evidence-heading"
      >
        {/* Diagonal fine lines overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,212,255,0.025) 40px, rgba(0,212,255,0.025) 41px)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div className="flex flex-col gap-6 lg:pt-4">
              <p className="eyebrow">Evidence & Audit</p>
              <h2
                id="evidence-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                Real-time compliance evidence
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-md">
                Every action, policy review and governance decision is logged in an immutable,
                timestamped evidence trail. When an inspection question is asked, your answer
                is already documented.
              </p>
              <ul className="flex flex-col gap-3 pt-2">
                {[
                  "Timestamped audit entries across all compliance domains",
                  "Safeguarding, GDPR, cyber and governance events in one stream",
                  "RAG-rated status on every recorded action",
                  "Exportable for governor reporting and inspection preparation",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-body-sm text-on-surface-variant"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <EvidenceStream
                animated
                title="Recent compliance activity"
                maxVisible={6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE SECTION ── */}
      <section className="py-24 relative overflow-hidden" aria-labelledby="audience-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          {/* Subtle dot grid */}
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
              background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-12 text-center">
            <p className="eyebrow mb-3">Who it&apos;s for</p>
            <h2
              id="audience-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              Built for every role in your school.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {audienceCards.map((card) => (
              <AudienceCard
                key={card.role}
                role={card.role}
                description={card.description}
                benefits={card.benefits}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        eyebrow="NEXT STEP"
        title="Start with a Readiness Review"
        description="A structured SafeShield Readiness Review identifies gaps across your digital safeguarding, cyber and compliance position — with clear, prioritised next actions for your school."
        variant="prominent"
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "Explore GuardianOS Framework", href: "/guardian-os" }}
      />
    </>
  );
}
