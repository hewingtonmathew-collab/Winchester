import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  FileText,
  Cpu,
  Eye,
  Users,
  Landmark,
  ArrowRight,
  GraduationCap,
  BarChart3,
} from "lucide-react";

import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import ServiceCard from "@/components/ui/ServiceCard";
import AudienceCard from "@/components/ui/AudienceCard";
import StatusCard from "@/components/ui/StatusCard";
import EvidenceStream from "@/components/ui/EvidenceStream";
import CTASection from "@/components/ui/CTASection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CountUp from "@/components/ui/CountUp";

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

const audienceCards = [
  {
    role: "Headteachers",
    description: "Strategic oversight, assurance and inspection readiness.",
    icon: <GraduationCap size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/schools-governors",
    benefits: [
      "RAG compliance dashboard",
      "Governor-ready reporting",
      "Clear evidence trail",
      "Inspection-conscious wording",
    ],
  },
  {
    role: "DSLs / DPOs",
    description: "Safeguarding, privacy and monitoring evidence in one place.",
    icon: <Shield size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/services/digital-safeguarding",
    benefits: [
      "KCSIE policy checker",
      "DPIA and SAR workflow",
      "Evidence library",
      "Filtering oversight",
    ],
  },
  {
    role: "MAT Directors / Governors",
    description: "Trust-wide accountability and board-level compliance visibility.",
    icon: <Landmark size={20} strokeWidth={1.5} aria-hidden="true" />,
    href: "/mats-las",
    benefits: [
      "Multi-school overview",
      "Statutory assurance tracking",
      "Board-level reporting",
      "Action accountability",
    ],
  },
];

const keyMetrics = [
  {
    value: 98,
    decimals: 0,
    suffix: "%",
    label: "KCSIE Alignment",
    sub: "Average across SafeShield schools",
    color: "rgba(74,222,128,0.9)",
  },
  {
    value: 1247,
    decimals: 0,
    suffix: "",
    label: "Evidence Entries",
    sub: "Logged per school per year",
    color: "rgba(0,212,255,0.9)",
  },
  {
    value: 6,
    decimals: 0,
    suffix: "",
    label: "Compliance Domains",
    sub: "Fully integrated in GuardianOS",
    color: "rgba(167,139,250,0.9)",
  },
  {
    value: 94,
    decimals: 0,
    suffix: "%",
    label: "Trust Assurance",
    sub: "Platform confidence score",
    color: "rgba(251,191,36,0.9)",
  },
];

export default function HomePage() {
  const displayedServices = services.slice(0, 6);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#040608]"
        aria-label="SafeShield digital safeguarding intelligence"
      >
        {/* Particle network — fills the entire hero */}
        <ParticleCanvas
          className="-z-10 opacity-70"
          count={80}
          rgb="0,212,255"
          connectDist={160}
          speed={0.22}
        />

        {/* Very subtle radial vignette — darkens corners */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 30%, rgba(4,6,8,0.65) 100%)",
          }}
        />

        {/* Cyan sweep from top */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[50vh] -z-10"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,212,255,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 -z-10"
          aria-hidden="true"
          style={{ background: "linear-gradient(to bottom, transparent, #040608)" }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-20 items-center">

            {/* LEFT — text */}
            <div className="flex flex-col gap-7 max-w-2xl">
              {/* Status pill */}
              <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(0,212,255,0.06)",
                  border: "0.75px solid rgba(0,212,255,0.25)",
                }}>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none"
                  style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-semibold tracking-widest uppercase text-primary/90">
                  GuardianOS Active
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-black text-on-surface leading-[1.03] tracking-[-0.035em]"
                style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              >
                Digital safeguarding{" "}
                <span
                  className="text-primary"
                  style={{
                    textShadow:
                      "0 0 20px rgba(0,212,255,0.55), 0 0 60px rgba(0,212,255,0.20)",
                  }}
                >
                  intelligence
                </span>{" "}
                for UK schools.
              </h1>

              {/* Subhead */}
              <p
                className="text-on-surface-variant leading-relaxed max-w-xl"
                style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", fontWeight: 300 }}
              >
                GuardianOS-powered compliance oversight — safeguarding, cyber, GDPR, AI governance
                and governor accountability structured in a single evidence-first platform.
              </p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/book-review" className="btn-primary">
                  Book a Readiness Review
                </Link>
                <Link href="/guardian-os" className="btn-secondary">
                  Explore GuardianOS
                </Link>
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-4 pt-2">
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                {["KCSIE 2024", "UK GDPR", "NCSC Aligned"].map((t) => (
                  <span key={t} className="text-[10px] font-semibold tracking-widest uppercase text-on-surface-variant/50">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — product visual */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
              <GuardianCommandVisual
                variant="full"
                trustScore={94}
                kcsieScore={98}
                activeNodes={14}
                totalNodes={14}
                alerts={2}
                className="w-full max-w-[420px] lg:max-w-[460px]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section
        className="w-full py-5"
        style={{
          background: "rgba(6,8,14,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
        }}
        aria-label="Compliance framework alignments"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-on-surface-variant/35 shrink-0 hidden lg:block">
              Aligned to UK frameworks
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
              {[
                { label: "KCSIE 2024", desc: "Safeguarding", color: "rgba(0,212,255,0.9)" },
                { label: "UK GDPR", desc: "Data Protection", color: "rgba(74,222,128,0.9)" },
                { label: "NCSC Aligned", desc: "Cyber Security", color: "rgba(0,212,255,0.9)" },
                { label: "MAT Ready", desc: "Multi-academy", color: "rgba(167,139,250,0.9)" },
                { label: "ISO 27001", desc: "Security Std", color: "rgba(251,191,36,0.9)" },
                { label: "KCSIE Part 1", desc: "Online Safety", color: "rgba(0,212,255,0.9)" },
              ].map(({ label, desc, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 5px ${color}` }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-semibold text-on-surface tracking-wide">{label}</span>
                  <span className="hidden sm:inline text-[10px] text-on-surface-variant/45">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY METRICS STRIP ── */}
      <section
        className="w-full py-16 relative overflow-hidden"
        style={{ background: "#050710", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        aria-label="Platform impact metrics"
      >
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.06] rounded-2xl overflow-hidden ring-1 ring-white/[0.06]">
              {keyMetrics.map(({ value, decimals, suffix, label, sub, color }, i) => (
                <div
                  key={label}
                  className={`reveal reveal-delay-${i + 1} relative px-8 py-10 flex flex-col gap-2 group`}
                  style={{ background: "rgba(8,9,14,0.8)" }}
                >
                  {/* Top accent line matching metric color */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                    aria-hidden="true"
                  />
                  <div
                    className="text-metric-lg font-black metric-number leading-none"
                    style={{ color, filter: `drop-shadow(0 0 12px ${color})` }}
                  >
                    <CountUp end={value} decimals={decimals} suffix={suffix} duration={2000} />
                  </div>
                  <div className="text-sm font-bold text-on-surface tracking-tight">{label}</div>
                  <div className="text-[11px] text-on-surface-variant/50 leading-snug">{sub}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
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
          <ScrollReveal>
            <div className="mb-12 reveal">
              <p className="eyebrow mb-3">SafeShield Services</p>
              <h2
                id="services-heading"
                className="text-display-md font-bold text-on-surface max-w-2xl text-balance"
              >
                Structured compliance across every critical area.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedServices.map((service, i) => (
                <div key={service.slug} className={`reveal reveal-delay-${i + 1}`}>
                  <ServiceCard
                    title={service.title}
                    tagline={service.tagline}
                    description={service.description}
                    icon={serviceIcons[service.slug]}
                    href={service.href}
                    colour={service.colour}
                    pillars={service.pillars.slice(0, 2)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center reveal">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-tint transition-colors"
              >
                View all services
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
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
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div className="flex flex-col gap-6 reveal reveal-left">
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
                  {[
                    { val: 6, lbl: "Domains" },
                    { val: 94, lbl: "Avg Score %" },
                    { val: 14, lbl: "Nodes" },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} className="flex flex-col gap-0.5">
                      <span className="text-2xl font-black text-primary text-glow metric-number">
                        <CountUp end={val} duration={1600} />
                      </span>
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

              <div className="flex justify-center lg:justify-end reveal reveal-scale">
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
          </ScrollReveal>
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
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="reveal reveal-delay-1">
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
              </div>
              <div className="reveal reveal-delay-2">
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
              </div>
              <div className="reveal reveal-delay-3">
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
          </ScrollReveal>
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
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              <div className="flex flex-col gap-6 lg:pt-4 reveal reveal-left">
                <p className="eyebrow">Evidence &amp; Audit</p>
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

              <div className="reveal reveal-scale">
                <EvidenceStream
                  animated
                  title="Recent compliance activity"
                  maxVisible={6}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SOLUTIONS BY ROLE ── */}
      <section className="py-24 relative overflow-hidden" aria-labelledby="audience-heading">
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
              background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="mb-12 text-center reveal">
              <p className="eyebrow mb-3 justify-center">Solutions by Role</p>
              <h2
                id="audience-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                The right tool for every role in your school.
              </h2>
              <p className="text-body-lg text-on-surface-variant mt-4 max-w-2xl mx-auto">
                SafeShield is built around the actual responsibilities of school leaders — not generic compliance checklists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {audienceCards.map((card, i) => (
                <div key={card.role} className={`reveal reveal-delay-${i + 1}`}>
                  <AudienceCard
                    role={card.role}
                    description={card.description}
                    benefits={card.benefits}
                    icon={card.icon}
                    href={card.href}
                  />
                </div>
              ))}
            </div>

            {/* Bottom path chooser prompt */}
            <div
              className="reveal mt-10 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: "rgba(0,212,255,0.04)",
                border: "0.5px solid rgba(0,212,255,0.18)",
              }}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-primary shrink-0" aria-hidden="true" />
                <span className="text-body-sm text-on-surface-variant">
                  Not sure where to start? A Readiness Review maps your current position across all domains.
                </span>
              </div>
              <Link href="/book-review" className="btn-primary shrink-0 text-sm">
                Book a Review
              </Link>
            </div>
          </ScrollReveal>
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
