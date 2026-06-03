import type { Metadata } from "next";
import {
  LayoutDashboard,
  PresentationIcon,
  Share2,
  ListOrdered,
  School,
  ClipboardCheck,
  Network,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CountUp from "@/components/ui/CountUp";

export const metadata: Metadata = {
  title: "For MATs & Local Authorities | SafeShield",
  description:
    "SafeShield's GuardianOS framework scales to multi-academy trusts and local authorities — providing consistent compliance evidence across multiple schools from a single oversight position.",
};

const matFeatures = [
  {
    icon: LayoutDashboard,
    title: "Multi-school overview",
    description:
      "A consolidated RAG view across all schools in your trust — giving the executive team and trust board a single, coherent picture of compliance position without needing to aggregate reports manually.",
  },
  {
    icon: PresentationIcon,
    title: "Trust board reporting",
    description:
      "Structured compliance evidence packaged for trustee oversight — with clear RAG ratings, named actions and a narrative summary appropriate for board-level discussion.",
  },
  {
    icon: Share2,
    title: "Consistent standards",
    description:
      "Shared policy frameworks and evidence standards applied consistently across all schools in the trust — reducing variation and giving the executive team confidence in the reliability of reported positions.",
  },
  {
    icon: ListOrdered,
    title: "MAT-level risk register",
    description:
      "Trust-wide risk tracking with school-level drill-down, so executives can identify which schools carry the greatest compliance risk and direct support accordingly.",
  },
];

const laSupport = [
  {
    icon: School,
    title: "LA-maintained school support",
    description:
      "Compliance support for schools in your local authority — covering digital safeguarding, cyber, GDPR and filtering obligations under KCSIE and DfE guidance.",
  },
  {
    icon: ClipboardCheck,
    title: "Statutory monitoring",
    description:
      "Supporting LAs' role in monitoring school compliance with statutory digital obligations — providing structured evidence that schools have reviewed their position.",
  },
  {
    icon: Network,
    title: "Aggregated oversight",
    description:
      "An LA-level view of compliance position across maintained schools — giving the authority a clear picture of where support is most needed, without requiring individual school visits.",
  },
];

const matStats = [
  { end: 17, suffix: "", label: "Nodes monitored", color: "rgba(167,139,250,0.9)" },
  { end: 91, suffix: "%", label: "Trust assurance", color: "rgba(0,212,255,0.9)" },
  { end: 6, suffix: "", label: "Domains covered", color: "rgba(74,222,128,0.9)" },
];

export default function MatsLAsPage() {
  return (
    <>
      <PageHero
        palette="violet"
        variant="default"
        eyebrow="FOR MATs & LOCAL AUTHORITIES"
        title="Compliance oversight at scale"
        titleHighlight="at scale"
        description="GuardianOS scales across multi-academy trusts and local authorities — consistent compliance evidence and RAG-rated oversight across every school from a single command position."
        ctaPrimary={{ label: "Book a MAT Review", href: "/book-review" }}
        ctaSecondary={{ label: "Explore GuardianOS", href: "/guardian-os" }}
        badge={{ label: "Multi-school ready", variant: "neutral" }}
        statusDot
        scrollIndicator
      >
        <GuardianCommandVisual
          variant="full"
          activeNodes={14}
          totalNodes={17}
          alerts={3}
          trustScore={91}
          kcsieScore={96}
        />
      </PageHero>

      {/* ── MAT STATS STRIP ── */}
      <section
        className="py-12 relative overflow-hidden"
        style={{
          background: "rgba(6,8,14,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
        aria-label="MAT platform metrics"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
              {matStats.map(({ end, suffix, label, color }, i) => (
                <div key={label} className={`reveal reveal-delay-${i + 1} px-8 py-4 text-center`}>
                  <div
                    className="text-4xl font-black metric-number leading-none mb-1"
                    style={{ color, filter: `drop-shadow(0 0 10px ${color})` }}
                  >
                    <CountUp end={end} suffix={suffix} duration={1800} />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/50">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── MAT FEATURES ── */}
      <section className="py-28 relative overflow-hidden" aria-labelledby="mat-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(167,139,250,0.14) 1px, transparent 1px), linear-gradient(rgba(167,139,250,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.025) 1px, transparent 1px)",
              backgroundSize: "80px 80px, 80px 80px, 80px 80px",
            }}
          />
          <div
            className="absolute right-0 top-0 w-[600px] h-[500px]"
            style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(167,139,250,0.08) 0%, transparent 65%)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="mb-14 reveal">
              <p className="eyebrow mb-4">Multi-Academy Trusts</p>
              <h2
                id="mat-heading"
                className="text-on-surface text-balance max-w-2xl"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
              >
                MAT-specific{" "}
                <span
                  style={{
                    background: "linear-gradient(130deg, #a78bfa 0%, #c4b5fd 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  features.
                </span>
              </h2>
              <p className="mt-5 text-body-lg text-on-surface-variant max-w-2xl">
                SafeShield is designed to work at trust level — providing the executive
                team and board with the consolidated oversight they need, while giving
                individual schools the detail they require to act.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matFeatures.map(({ icon: Icon, title, description }, i) => (
                <div key={title} className={`reveal reveal-delay-${i + 1}`}>
                  <GlassPanel
                    variant="hover"
                    as="article"
                    className="p-7 flex flex-col gap-5 h-full"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex items-center justify-center h-12 w-12 rounded-xl shrink-0"
                        style={{
                          background: "rgba(167,139,250,0.08)",
                          border: "1px solid rgba(167,139,250,0.25)",
                          color: "rgba(167,139,250,0.9)",
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                    </div>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed">
                      {description}
                    </p>
                  </GlassPanel>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── LA SUPPORT ── */}
      <section
        className="py-28 relative overflow-hidden glass-panel border-y border-white/[0.06]"
        aria-labelledby="la-heading"
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
            <div className="mb-14 reveal">
              <p className="eyebrow mb-4">Local Authorities</p>
              <h2
                id="la-heading"
                className="text-on-surface text-balance max-w-2xl"
                style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
              >
                LA support and{" "}
                <span
                  style={{
                    background: "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  oversight.
                </span>
              </h2>
              <p className="mt-5 text-body-lg text-on-surface-variant max-w-2xl">
                SafeShield works with local authorities to support their role in monitoring
                and improving digital compliance across maintained schools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {laSupport.map(({ icon: Icon, title, description }, i) => (
                <div key={title} className={`reveal reveal-delay-${i + 1}`}>
                  <GlassPanel
                    variant="hover"
                    as="article"
                    className="p-7 flex flex-col gap-5 h-full"
                  >
                    <div
                      className="flex items-center justify-center h-12 w-12 rounded-xl shrink-0"
                      style={{
                        background: "rgba(0,212,255,0.07)",
                        border: "1px solid rgba(0,212,255,0.22)",
                        color: "rgba(0,212,255,0.85)",
                      }}
                      aria-hidden="true"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-body-lg font-semibold text-on-surface">{title}</h3>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </GlassPanel>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PLATFORM VISUAL ── */}
      <section className="py-28 relative overflow-hidden" aria-labelledby="platform-heading">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-background" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,212,255,0.12) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[500px]"
            style={{
              background: "radial-gradient(ellipse at 0% 50%, rgba(167,139,250,0.07) 0%, transparent 65%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div className="flex flex-col gap-6 reveal reveal-left">
                <p className="eyebrow">GuardianCommand</p>
                <h2
                  id="platform-heading"
                  className="text-on-surface text-balance"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.07 }}
                >
                  One view across{" "}
                  <span
                    style={{
                      background: "linear-gradient(130deg, #3cd7ff 0%, #a8e8ff 50%, #ffffff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    every school.
                  </span>
                </h2>
                <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
                  The GuardianOS framework gives trust executives and LA officers a single,
                  consolidated compliance view — with school-level drill-down, RAG status
                  and alert tracking across every site in your portfolio.
                </p>
                <ul className="flex flex-col gap-3 pt-2" role="list">
                  {[
                    "Consolidated RAG status across all schools",
                    "Drill-down to individual school detail",
                    "Alerts and flagged actions with named owners",
                    "Trust-level and school-level reporting in one platform",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-body-sm text-on-surface-variant">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-1">
                  <Link href="/guardian-os" className="inline-flex items-center gap-2 text-body-sm font-semibold text-primary hover:text-primary-tint transition-colors group">
                    Explore the GuardianOS framework
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200 motion-reduce:translate-x-0" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end reveal reveal-scale">
                <GuardianCommandVisual
                  variant="full"
                  activeNodes={14}
                  totalNodes={17}
                  alerts={3}
                  trustScore={91}
                  kcsieScore={96}
                  className="w-full max-w-md"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTASection
        title="Discuss your MAT or LA requirements"
        description="SafeShield works with multi-academy trusts and local authorities to design a compliance support model that works across multiple schools. Contact us to discuss your specific requirements."
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
        secondaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
      />
    </>
  );
}
