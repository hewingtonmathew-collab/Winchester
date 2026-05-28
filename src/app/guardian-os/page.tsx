import type { Metadata } from "next";
import { Shield, Lock, FileText, Cpu, Eye, Landmark } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";
import FrameworkPillarCard from "@/components/ui/FrameworkPillarCard";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";

import { frameworkPillars, frameworkStats } from "@/data/framework";

export const metadata: Metadata = {
  title: "GuardianOS Framework — SafeShield",
  description:
    "GuardianOS is SafeShield's structured compliance framework — six interconnected domains covering every aspect of UK school digital safety, privacy and accountability.",
};

const pillarIcons: Record<string, React.ReactNode> = {
  safeguarding: <Shield size={22} strokeWidth={1.5} aria-hidden="true" />,
  cyber: <Lock size={22} strokeWidth={1.5} aria-hidden="true" />,
  privacy: <FileText size={22} strokeWidth={1.5} aria-hidden="true" />,
  ai: <Cpu size={22} strokeWidth={1.5} aria-hidden="true" />,
  filtering: <Eye size={22} strokeWidth={1.5} aria-hidden="true" />,
  governance: <Landmark size={22} strokeWidth={1.5} aria-hidden="true" />,
};

const howItWorksItems = [
  {
    title: "Evidence-first",
    description:
      "Every compliance action, policy decision and governance event is logged in a timestamped, searchable audit trail. GuardianOS doesn't just advise — it records. That evidence is available at any point for internal review, governor reporting or inspection preparation.",
  },
  {
    title: "Inspection-ready",
    description:
      "Reporting is structured for governor oversight and inspection conversations. RAG-rated dashboards, annotated gap analyses and board-ready summaries mean your leadership team always has a clear, credible account of your compliance position.",
  },
  {
    title: "School-appropriate",
    description:
      "GuardianOS is designed for school leaders, not corporate legal teams. Plain English summaries, prioritised next actions and workflows that reflect how schools actually operate — not how enterprise compliance software assumes they do.",
  },
];

export default function GuardianOSPage() {
  return (
    <>
      {/* ── PAGE HERO ── */}
      <PageHero
        eyebrow="GUARDIAN OS FRAMEWORK"
        title="The compliance operating system for UK schools"
        titleHighlight="for UK schools"
        description="GuardianOS is SafeShield's structured compliance framework — six interconnected domains covering every aspect of UK school digital safety, privacy and accountability."
      >
        <GuardianCommandVisual
          variant="full"
          trustScore={96}
          kcsieScore={99}
          activeNodes={14}
          totalNodes={14}
          alerts={1}
          className="w-full max-w-md"
        />
      </PageHero>

      {/* ── FRAMEWORK STATS ── */}
      <section
        className="py-12 glass-panel border-y border-white/[0.06]"
        aria-label="Framework statistics"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {frameworkStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-xl p-6 flex flex-col gap-2 text-center"
              >
                <span className="metric-number text-4xl font-black text-primary text-glow">
                  {stat.value}
                </span>
                <span className="text-body-sm text-on-surface-variant">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRAMEWORK PILLARS ── */}
      <section className="py-24 relative overflow-hidden" aria-labelledby="pillars-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(0,212,255,0.20) 1px, transparent 1px), linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)",
              backgroundSize: "80px 80px, 80px 80px, 80px 80px, 20px 20px, 20px 20px",
              backgroundPosition: "-1px -1px, -1px -1px, -1px -1px, -1px -1px, -1px -1px",
            }}
          />
          <div
            className="absolute right-0 top-1/4 w-[500px] h-[600px]"
            style={{ background: "radial-gradient(ellipse at 100% 50%, rgba(0,212,255,0.07) 0%, transparent 60%)" }}
          />
          <div
            className="absolute left-0 bottom-1/4 w-[500px] h-[600px]"
            style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(186,195,255,0.05) 0%, transparent 60%)" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mb-14">
            <p className="eyebrow mb-3">Six compliance domains</p>
            <h2
              id="pillars-heading"
              className="text-display-md font-bold text-on-surface text-balance max-w-2xl"
            >
              Every critical area of UK school{" "}
              <span className="text-primary text-glow">digital compliance</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              GuardianOS organises compliance across six interconnected domains. Each domain has
              structured evidence requirements, clear review cycles and outputs designed for
              governor reporting and inspection discussions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {frameworkPillars.map((pillar, i) => (
              <FrameworkPillarCard
                key={pillar.id}
                id={pillar.id}
                title={pillar.title}
                description={pillar.description}
                icon={pillarIcons[pillar.id]}
                metrics={pillar.metrics}
                colour={pillar.colour}
                index={i + 1}
                href={`/services/${pillar.id === "cyber" ? "cyber-security" : pillar.id === "privacy" ? "gdpr-dpia" : pillar.id === "governance" ? "governor-oversight" : pillar.id === "filtering" ? "filtering-monitoring" : pillar.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW GUARDIANOS WORKS ── */}
      <section
        className="py-24 relative overflow-hidden glass-panel border-y border-white/[0.06]"
        aria-labelledby="how-it-works-heading"
      >
        {/* Fine sub-grid overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="eyebrow mb-3">The approach</p>
            <h2
              id="how-it-works-heading"
              className="text-display-md font-bold text-on-surface text-balance max-w-2xl"
            >
              How GuardianOS works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {howItWorksItems.map((item) => (
              <GlassPanel
                key={item.title}
                className="rounded-xl p-7 flex flex-col gap-4 relative overflow-hidden"
                topEdgeGlow
              >
                <h3 className="text-headline-md font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed flex-1">
                  {item.description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        eyebrow="NEXT STEP"
        title="See GuardianOS in the context of your school"
        description="A Readiness Review maps your school's current compliance position against the GuardianOS framework — giving you a structured picture of where you stand and what to address first."
        variant="prominent"
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "Explore our services", href: "/services" }}
      />
    </>
  );
}
