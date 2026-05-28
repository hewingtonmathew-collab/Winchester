import type { Metadata } from "next";
import { ShieldCheck, BookOpen, Scale, School, Building2, Landmark } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";

export const metadata: Metadata = {
  title: "About SafeShield",
  description:
    "SafeShield exists because UK schools face increasingly complex digital compliance obligations — and most existing tools are built for corporate environments, not school leaders.",
};

const missionPillars = [
  {
    icon: ShieldCheck,
    title: "Credibility",
    description: "KCSIE, NCSC and UK GDPR aligned — structured around the frameworks your school is actually expected to meet.",
  },
  {
    icon: BookOpen,
    title: "Clarity",
    description: "Plain English for headteachers and governors. Not legal boilerplate, not technical jargon — structured, readable guidance.",
  },
  {
    icon: Scale,
    title: "Accountability",
    description: "Evidence trails that hold up to scrutiny. Every action logged, every decision documented, every report ready when it's needed.",
  },
];

const whoWeWorkWith = [
  {
    icon: School,
    title: "Schools",
    description:
      "Single schools and academies — from small primaries to large secondaries. SafeShield scales to your context, not the other way around. Whether you have a dedicated ICT manager or a headteacher wearing five hats, the platform is designed to be usable.",
  },
  {
    icon: Building2,
    title: "Multi-Academy Trusts",
    description:
      "MATs managing multiple sites need a cross-school compliance overview, not a separate review for every school. SafeShield supports trust-wide visibility with individual school granularity — one platform, structured accountability at every level.",
  },
  {
    icon: Landmark,
    title: "Local Authorities",
    description:
      "Supporting LA-maintained schools with safeguarding oversight, GDPR advisory and compliance evidence. SafeShield gives local authorities a structured way to support their schools without duplicating effort across every site.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── PAGE HERO ── */}
      <PageHero
        eyebrow="ABOUT SAFESHIELD"
        title="Purpose-built for UK schools"
        titleHighlight="for UK schools"
        description="SafeShield exists because UK schools face increasingly complex digital compliance obligations — and most existing tools are built for corporate environments, not school leaders."
      />

      {/* ── OUR MISSION ── */}
      <section
        className="py-24 glass-panel border-y border-white/[0.06]"
        aria-labelledby="mission-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Left: mission statement */}
            <div className="flex flex-col gap-6">
              <p className="eyebrow">Our mission</p>
              <h2
                id="mission-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                Why SafeShield exists
              </h2>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                SafeShield exists to give UK schools a structured, credible and practically useful
                compliance service — built around how schools actually work, not how corporate
                compliance departments work.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                The digital compliance landscape for schools has grown substantially more complex
                in recent years. KCSIE obligations, NCSC cyber expectations, UK GDPR data
                protection duties, AI governance questions and the DfE&apos;s filtering and
                monitoring requirements are all live, active obligations for school leaders.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Most tools designed to support compliance were built for corporates. They assume
                large legal teams, dedicated compliance officers and workflows that don&apos;t
                map to how a DSL, headteacher or SBM actually spends their day. SafeShield is
                different — it was designed from the start for the realities of school leadership.
              </p>
            </div>

            {/* Right: mission pillars */}
            <div className="flex flex-col gap-4">
              {missionPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <GlassPanel
                    key={pillar.title}
                    className="rounded-xl p-6 flex items-start gap-5 relative overflow-hidden"
                    topEdgeGlow
                  >
                    <div
                      className="flex items-center justify-center h-11 w-11 rounded-lg bg-primary/10 border border-primary/25 text-primary shrink-0"
                      aria-hidden="true"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-body-lg font-semibold text-on-surface">
                        {pillar.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </GlassPanel>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE GUARDIANQS APPROACH ── */}
      <section className="py-24" aria-labelledby="guardianOS-approach-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">The platform</p>
            <h2
              id="guardianOS-approach-heading"
              className="text-display-md font-bold text-on-surface mb-6 text-balance"
            >
              The{" "}
              <span className="text-primary text-glow">GuardianOS</span>{" "}
              approach
            </h2>
            <div className="flex flex-col gap-5">
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                SafeShield uses the GuardianOS framework — a six-domain compliance structure
                designed specifically for UK school contexts. The six domains are: digital
                safeguarding, cyber resilience, GDPR and privacy, AI governance, filtering
                and monitoring, and governor accountability.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Each domain has structured evidence requirements, defined review cycles and
                outputs designed to support governor oversight and inspection discussions.
                GuardianOS connects the domains — so a change in one area is reflected in
                your overall compliance picture.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                The framework doesn&apos;t replace professional judgement. It supports it — by
                giving school leaders the structured information they need to make good decisions,
                document those decisions clearly and evidence them when required.
              </p>
            </div>

            {/* Domain badges */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {[
                { label: "Digital Safeguarding", variant: "badge-cyan" },
                { label: "Cyber Resilience", variant: "badge-red" },
                { label: "GDPR & Privacy", variant: "badge-neutral" },
                { label: "AI Governance", variant: "badge-cyan" },
                { label: "Filtering & Monitoring", variant: "badge-amber" },
                { label: "Governor Accountability", variant: "badge-green" },
              ].map((domain) => (
                <span key={domain.label} className={`badge ${domain.variant}`}>
                  {domain.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section
        className="py-24 glass-panel border-y border-white/[0.06]"
        aria-labelledby="who-we-work-with-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="eyebrow mb-3">Our clients</p>
            <h2
              id="who-we-work-with-heading"
              className="text-display-md font-bold text-on-surface text-balance max-w-xl"
            >
              Who we work with
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whoWeWorkWith.map((group) => {
              const Icon = group.icon;
              return (
                <GlassPanel
                  key={group.title}
                  className="rounded-xl p-7 flex flex-col gap-5 relative overflow-hidden"
                  topEdgeGlow
                  hudCorners
                >
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 border border-primary/25 text-primary"
                    aria-hidden="true"
                  >
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-headline-md font-semibold text-on-surface">
                      {group.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT WE DON'T CLAIM ── */}
      <section className="py-24" aria-labelledby="honest-limits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Honest about our limits</p>
            <h2
              id="honest-limits-heading"
              className="text-display-md font-bold text-on-surface mb-6 text-balance"
            >
              What we don&apos;t claim
            </h2>

            <GlassPanel
              className="rounded-xl p-8 relative overflow-hidden"
              variant="active"
              topEdgeGlow
            >
              <div className="flex flex-col gap-5">
                <p className="text-body-lg text-on-surface leading-relaxed">
                  We don&apos;t claim to make your school automatically compliant. No tool can do that.
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Compliance in schools requires ongoing professional judgement, active leadership
                  and decisions that only school leaders can make. SafeShield doesn&apos;t replace that.
                  What it provides is structured evidence, clear gap identification and practical
                  support for the decisions that compliance requires of school leaders.
                </p>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  We also don&apos;t claim that using SafeShield guarantees any particular outcome
                  in an Ofsted inspection, an ICO audit or any other review process. What we do
                  claim — and stand behind — is that SafeShield gives your school a more organised,
                  more evidenced and more credible compliance position than you&apos;d have without it.
                </p>
                <div
                  className="pt-2 mt-2 border-t border-white/[0.06]"
                  aria-label="Summary commitment"
                >
                  <p className="text-body-sm font-semibold text-primary">
                    Structured evidence. Clear gaps. Practical support.
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    That&apos;s what SafeShield delivers — and what we&apos;ll always be honest about.
                  </p>
                </div>
              </div>
            </GlassPanel>
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
