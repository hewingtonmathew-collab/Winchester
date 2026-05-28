import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Brain, Eye, GraduationCap, Landmark, Network, Lock, ArrowRight } from "lucide-react";

import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";
import SafeShieldCommandDashboard from "@/components/ui/SafeShieldCommandDashboard";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import HUDOverlay from "@/components/ui/HUDOverlay";
import CountUp from "@/components/ui/CountUp";
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
  "digital-safeguarding": <ShieldCheck size={21} strokeWidth={1.5} aria-hidden="true" />,
  "cyber-security": <Network size={21} strokeWidth={1.5} aria-hidden="true" />,
  "gdpr-dpia": <Lock size={21} strokeWidth={1.5} aria-hidden="true" />,
  "ai-governance": <Brain size={21} strokeWidth={1.5} aria-hidden="true" />,
  "filtering-monitoring": <Eye size={21} strokeWidth={1.5} aria-hidden="true" />,
  "accessibility-send": <GraduationCap size={21} strokeWidth={1.5} aria-hidden="true" />,
  "governor-oversight": <Landmark size={21} strokeWidth={1.5} aria-hidden="true" />,
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
      {/* ── HERO — cinematic full-screen video ── */}
      <section
        className="relative w-full overflow-hidden bg-[#020406]"
        aria-label="SafeShield digital safeguarding intelligence"
        style={{ height: "100svh", minHeight: "680px" }}
      >
        {/* ── Video layer ── */}
        <video
          src="/videos/hero-home.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: "saturate(1.08) contrast(1.04)" }}
          aria-hidden="true"
        />

        {/* ── Cinematic colour grade — subtle cool-tinted scrim ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(165deg, rgba(2,10,28,0.18) 0%, rgba(0,18,40,0.10) 40%, rgba(2,6,14,0.05) 60%, transparent 75%)",
            mixBlendMode: "multiply",
          }}
        />

        {/* ── Primary overlay — video breathes in middle, dark at edges ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: [
              /* top — clear navbar */
              "linear-gradient(to bottom, rgba(2,4,8,0.60) 0%, rgba(2,4,8,0.08) 18%, transparent 35%)",
              /* bottom — text legibility ramp */
              "linear-gradient(to top,   rgba(2,4,8,1.00) 0%, rgba(2,4,8,0.82) 22%, rgba(2,4,8,0.30) 48%, transparent 65%)",
              /* left edge depth */
              "linear-gradient(to right, rgba(2,4,8,0.40) 0%, transparent 35%)",
              /* right edge depth */
              "linear-gradient(to left,  rgba(2,4,8,0.25) 0%, transparent 30%)",
            ].join(", "),
          }}
        />

        {/* ── Corner vignette ── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 95% 90% at 50% 50%, transparent 45%, rgba(2,4,8,0.55) 100%)",
          }}
        />

        {/* ── Film grain ── */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.038]"
          aria-hidden="true"
          style={{ mixBlendMode: "overlay" }}
        >
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* ── Subtle particle network — barely there ── */}
        <ParticleCanvas
          className="opacity-[0.18]"
          count={35}
          rgb="0,212,255"
          connectDist={120}
          speed={0.12}
        />

        {/* ── Cyan atmospheric glow — low frequency, centred ── */}
        <div
          className="pointer-events-none absolute"
          aria-hidden="true"
          style={{
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,180,255,0.045) 0%, transparent 70%)",
          }}
        />

        {/* ── HUD overlay ── */}
        <HUDOverlay intensity="low" scanLine corners dataReadouts />

        {/* ── Content — pinned bottom-left, editorial style ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ paddingBottom: "clamp(3rem, 7vh, 5rem)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 max-w-[780px]">

              {/* Eyebrow row — thin rule + label + thin rule */}
              <div className="flex items-center gap-4">
                <div
                  className="h-px flex-shrink-0 w-8"
                  style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.55))" }}
                  aria-hidden="true"
                />
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none flex-shrink-0"
                    style={{ boxShadow: "0 0 8px rgba(0,212,255,1)" }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[10px] font-bold tracking-[0.22em] uppercase"
                    style={{ color: "rgba(0,212,255,0.85)", letterSpacing: "0.22em" }}
                  >
                    GuardianOS &nbsp;·&nbsp; Digital Safeguarding Intelligence
                  </span>
                </div>
                <div
                  className="h-px flex-1"
                  style={{ background: "linear-gradient(to right, rgba(0,212,255,0.25), transparent)" }}
                  aria-hidden="true"
                />
              </div>

              {/* Headline */}
              <h1
                className="font-black text-white text-balance"
                style={{
                  fontSize: "clamp(2.9rem, 6.8vw, 5.6rem)",
                  lineHeight: 1.03,
                  letterSpacing: "-0.038em",
                  textShadow: "0 4px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(0,0,0,0.8)",
                }}
              >
                Digital safeguarding{" "}
                <span
                  style={{
                    color: "#00d4ff",
                    textShadow:
                      "0 0 30px rgba(0,212,255,0.70), 0 0 100px rgba(0,212,255,0.25), 0 4px 60px rgba(0,0,0,0.5)",
                  }}
                >
                  intelligence
                </span>
                <br />
                <span style={{ color: "rgba(255,255,255,0.92)" }}>for UK schools.</span>
              </h1>

              {/* Subhead */}
              <p
                style={{
                  fontSize: "clamp(0.95rem, 1.35vw, 1.15rem)",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.62)",
                  maxWidth: "56ch",
                  textShadow: "0 2px 20px rgba(0,0,0,0.6)",
                }}
              >
                GuardianOS-powered compliance oversight — safeguarding, cyber, GDPR,
                AI governance and governor accountability in one structured, evidence-first platform.
              </p>

              {/* Divider */}
              <div
                className="h-px w-24"
                style={{ background: "linear-gradient(to right, rgba(0,212,255,0.40), transparent)" }}
                aria-hidden="true"
              />

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 items-center">
                <Link href="/book-review" className="btn-primary">
                  Book a Readiness Review
                </Link>
                <Link href="/guardian-os" className="btn-secondary">
                  Explore GuardianOS
                </Link>
              </div>

              {/* Framework labels */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 pt-1">
                {["KCSIE 2024", "UK GDPR", "NCSC Aligned", "MAT Ready"].map((t, i) => (
                  <span key={t} className="flex items-center gap-2">
                    {i > 0 && (
                      <span
                        className="w-px h-3 hidden sm:block"
                        style={{ background: "rgba(255,255,255,0.12)" }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                      style={{ background: "rgba(0,212,255,0.55)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[9.5px] font-semibold tracking-[0.18em] uppercase"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {t}
                    </span>
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SAFESHIELD COMMAND DASHBOARD ── */}
      <section
        className="py-16 relative overflow-hidden"
        aria-label="SafeShield Command — live compliance dashboard"
        style={{ background: "linear-gradient(to bottom, #040608, #06080e)" }}
      >
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SafeShieldCommandDashboard />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section
        className="w-full py-4"
        style={{
          background: "rgba(8,10,16,0.9)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
        }}
        aria-label="Framework alignments"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-on-surface-variant/40 shrink-0 hidden sm:block">
              Built for UK schools
            </p>
            <div className="w-px h-5 bg-white/[0.08] hidden sm:block" aria-hidden="true" />
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-px flex-1">
              {trustBarItems.map((item, i) => (
                <div key={item.label} className="flex items-center">
                  {i > 0 && (
                    <span className="w-px h-4 bg-white/[0.08] mx-4 hidden sm:block" aria-hidden="true" />
                  )}
                  <div className="flex items-center gap-2 px-3 sm:px-0">
                    <span
                      className="w-1 h-1 rounded-full shrink-0 bg-primary"
                      style={{ boxShadow: "0 0 4px rgba(0,212,255,0.7)" }}
                      aria-hidden="true"
                    />
                    <span className="text-[12px] font-semibold text-on-surface tracking-wide">{item.label}</span>
                    <span className="text-[11px] text-on-surface-variant/55 hidden sm:inline">{item.description}</span>
                  </div>
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
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">SafeShield Services</p>
              <h2
                id="services-heading"
                className="text-display-md font-bold text-on-surface max-w-2xl text-balance"
              >
                Structured compliance across every critical area.
              </h2>
              <p className="text-body-md text-on-surface-variant mt-3 max-w-xl">
                Seven specialist domains — safeguarding, cyber, GDPR, AI governance, filtering, accessibility, and governor oversight.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary-tint transition-colors shrink-0"
            >
              View all services
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
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
              {/* Domain count detail — animated on scroll */}
              <div className="flex items-center gap-8 pt-2">
                {[
                  { end: 6, suffix: "", label: "Domains" },
                  { end: 94, suffix: "%", label: "Avg Score" },
                  { end: 14, suffix: "", label: "Active Nodes" },
                ].map(({ end, suffix, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-2xl font-black text-primary text-glow metric-number">
                      <CountUp end={end} suffix={suffix} duration={1600} />
                    </span>
                    <span className="hud-label">{label}</span>
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
      <section className="py-20 relative overflow-hidden" aria-labelledby="metrics-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,212,255,0.10) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.15) 30%, rgba(0,212,255,0.15) 70%, transparent)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.10) 30%, rgba(0,212,255,0.10) 70%, transparent)" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-10 text-center">
            <p className="eyebrow justify-center mb-2">Live Platform Metrics</p>
            <h2
              id="metrics-heading"
              className="font-bold text-on-surface"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)" }}
            >
              Current compliance position across all domains
            </h2>
          </div>
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
