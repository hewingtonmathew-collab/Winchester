import type { Metadata } from "next";
import {
  LayoutDashboard,
  PresentationIcon,
  Share2,
  ListOrdered,
  School,
  ClipboardCheck,
  Network,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import GlassPanel from "@/components/ui/GlassPanel";
import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";

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

      {/* MAT-specific features */}
      <section className="py-section" aria-labelledby="mat-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">MULTI-ACADEMY TRUSTS</p>
            <h2
              id="mat-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              MAT-specific{" "}
              <span className="text-primary text-glow">features</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              SafeShield is designed to work at trust level — providing the executive
              team and board with the consolidated oversight they need, while giving
              individual schools the detail they require to act.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matFeatures.map(({ icon: Icon, title, description }) => (
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

      {/* LA support */}
      <section className="py-section" aria-labelledby="la-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="eyebrow mb-3">LOCAL AUTHORITIES</p>
            <h2
              id="la-heading"
              className="text-display-md font-bold text-on-surface text-balance"
            >
              LA support and{" "}
              <span className="text-primary text-glow">oversight</span>
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant max-w-2xl">
              SafeShield works with local authorities to support their role in monitoring
              and improving digital compliance across maintained schools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {laSupport.map(({ icon: Icon, title, description }) => (
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

      {/* Multi-school visual */}
      <section className="py-section" aria-labelledby="platform-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <p className="eyebrow">GUARDIANCOMMAND</p>
              <h2
                id="platform-heading"
                className="text-display-md font-bold text-on-surface text-balance"
              >
                One view across{" "}
                <span className="text-primary text-glow">every school</span>
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                The GuardianOS framework gives trust executives and LA officers a single,
                consolidated compliance view — with school-level drill-down, RAG status
                and alert tracking across every site in your portfolio.
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {[
                  "Consolidated RAG status across all schools",
                  "Drill-down to individual school detail",
                  "Alerts and flagged actions with named owners",
                  "Trust-level and school-level reporting in one platform",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-body-sm text-on-surface"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
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
