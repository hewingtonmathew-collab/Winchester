import type { Metadata } from "next";
import { ShieldCheck, BookOpen, Scale, School, Building2, Landmark } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import ScrollReveal from "@/components/ui/ScrollReveal";

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
    color: { bg: "rgba(0,212,255,0.07)", border: "rgba(0,212,255,0.22)", text: "rgba(0,212,255,0.85)" },
  },
  {
    icon: BookOpen,
    title: "Clarity",
    description: "Plain English for headteachers and governors. Not legal boilerplate, not technical jargon — structured, readable guidance.",
    color: { bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.22)", text: "rgba(167,139,250,0.85)" },
  },
  {
    icon: Scale,
    title: "Accountability",
    description: "Evidence trails that hold up to scrutiny. Every action logged, every decision documented, every report ready when it's needed.",
    color: { bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.22)", text: "rgba(74,222,128,0.85)" },
  },
];

const whoWeWorkWith = [
  {
    icon: School,
    title: "Schools",
    description:
      "Single schools and academies — from small primaries to large secondaries. SafeShield scales to your context, not the other way around. Whether you have a dedicated ICT manager or a headteacher wearing five hats, the platform is designed to be usable.",
    color: { bg: "rgba(0,212,255,0.07)", border: "rgba(0,212,255,0.22)", text: "rgba(0,212,255,0.85)" },
  },
  {
    icon: Building2,
    title: "Multi-Academy Trusts",
    description:
      "MATs managing multiple sites need a cross-school compliance overview, not a separate review for every school. SafeShield supports trust-wide visibility with individual school granularity — one platform, structured accountability at every level.",
    color: { bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.22)", text: "rgba(167,139,250,0.85)" },
  },
  {
    icon: Landmark,
    title: "Local Authorities",
    description:
      "Supporting LA-maintained schools with safeguarding oversight, GDPR advisory and compliance evidence. SafeShield gives local authorities a structured way to support their schools without duplicating effort across every site.",
    color: { bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.22)", text: "rgba(74,222,128,0.85)" },
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── PAGE HERO ── */}
      <PageHero
        palette="amber"
        variant="centered"
        eyebrow="ABOUT SAFESHIELD"
        title="Purpose-built for UK schools"
        titleHighlight="UK schools"
        description="SafeShield exists because complex digital compliance obligations shouldn't overwhelm school leaders. We make KCSIE, NCSC and UK GDPR evidence simple, structured and inspection-ready."
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "Explore GuardianOS", href: "/guardian-os" }}
        badge={{ label: "Built in the UK", variant: "amber" }}
        scrollIndicator
      />

      {/* ── OUR MISSION ── */}
      <section
        className="py-28 glass-panel border-y border-white/[0.06] relative overflow-hidden"
        aria-labelledby="mission-heading"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: mission statement */}
              <div className="flex flex-col gap-6 reveal reveal-left">
                <p className="eyebrow">Our mission</p>
                <h2
                  id="mission-heading"
                  className="text-on-surface text-balance"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
                >
                  Why SafeShield{" "}
                  <span
                    style={{
                      background: "linear-gradient(130deg, #fbbf24 0%, #fde68a 50%, #ffffff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    exists.
                  </span>
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
                {missionPillars.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={pillar.title} className={`reveal reveal-delay-${i + 1}`}>
                      <GlassPanel
                        className="rounded-xl p-6 flex items-start gap-5 relative overflow-hidden"
                        topEdgeGlow
                      >
                        <div
                          className="flex items-center justify-center h-12 w-12 rounded-xl shrink-0"
                          style={{
                            background: pillar.color.bg,
                            border: `1px solid ${pillar.color.border}`,
                            color: pillar.color.text,
                          }}
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
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── THE GUARDIANOS APPROACH ── */}
      <section className="py-28 relative overflow-hidden" aria-labelledby="guardianOS-approach-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(251,191,36,0.12) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[500px]"
            style={{
              background: "radial-gradient(ellipse at 100% 50%, rgba(251,191,36,0.06) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="max-w-3xl reveal">
              <p className="eyebrow mb-4">The platform</p>
              <h2
                id="guardianOS-approach-heading"
                className="text-on-surface mb-6 text-balance"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
              >
                The{" "}
                <span
                  style={{
                    background: "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 0 20px rgba(0,212,255,0.4))",
                  }}
                >
                  GuardianOS
                </span>{" "}
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section
        className="py-28 glass-panel border-y border-white/[0.06] relative overflow-hidden"
        aria-labelledby="who-we-work-with-heading"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,212,255,0.10) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.3,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="mb-14 reveal">
              <p className="eyebrow mb-3">Our clients</p>
              <h2
                id="who-we-work-with-heading"
                className="text-on-surface text-balance max-w-xl"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
              >
                Who we{" "}
                <span
                  style={{
                    background: "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  work with.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {whoWeWorkWith.map((group, i) => {
                const Icon = group.icon;
                return (
                  <div key={group.title} className={`reveal reveal-delay-${i + 1}`}>
                    <GlassPanel
                      className="rounded-xl p-7 flex flex-col gap-5 relative overflow-hidden h-full"
                      topEdgeGlow
                      hudCorners
                    >
                      <div
                        className="flex items-center justify-center h-12 w-12 rounded-xl"
                        style={{
                          background: group.color.bg,
                          border: `1px solid ${group.color.border}`,
                          color: group.color.text,
                        }}
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
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHAT WE DON'T CLAIM ── */}
      <section className="py-28 relative overflow-hidden" aria-labelledby="honest-limits-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, rgba(0,212,255,0.04) 50%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="max-w-3xl reveal">
              <p className="eyebrow mb-4">Honest about our limits</p>
              <h2
                id="honest-limits-heading"
                className="text-on-surface mb-6 text-balance"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
              >
                What we{" "}
                <span
                  style={{
                    background: "linear-gradient(130deg, #fbbf24 0%, #fde68a 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  don&apos;t claim.
                </span>
              </h2>

              <GlassPanel
                className="rounded-2xl p-8 sm:p-10 relative overflow-hidden"
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
                    className="pt-4 mt-2 border-t border-white/[0.06]"
                    aria-label="Summary commitment"
                  >
                    <p className="text-body-sm font-bold text-primary">
                      Structured evidence. Clear gaps. Practical support.
                    </p>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      That&apos;s what SafeShield delivers — and what we&apos;ll always be honest about.
                    </p>
                  </div>
                </div>
              </GlassPanel>
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
