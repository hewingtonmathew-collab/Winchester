import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck, ShieldAlert, UserSearch, Wand2, Archive } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CTASection from "@/components/ui/CTASection";
import ToolModuleCard from "@/components/ui/ToolModuleCard";
import GuardianCommandVisual from "@/components/ui/GuardianCommandVisual";
import { platformModules } from "@/data/platform";

export const metadata: Metadata = {
  title: "Platform Tools | SafeShield GuardianOS",
  description:
    "GuardianOS platform tools bring your compliance evidence into one structured, inspectable environment. Five specialist modules covering policy review, risk tracking, SARs, DPIAs and audit trails.",
};

const moduleIcons: Record<string, React.ReactNode> = {
  "policy-checker": <FileCheck size={22} strokeWidth={1.5} />,
  "risk-register": <ShieldAlert size={22} strokeWidth={1.5} />,
  "sar-planner": <UserSearch size={22} strokeWidth={1.5} />,
  "dpia-wizard": <Wand2 size={22} strokeWidth={1.5} />,
  "evidence-audit": <Archive size={22} strokeWidth={1.5} />,
};

export default function PlatformToolsPage() {
  return (
    <>
      {/* ── Platform preview banner ── */}
      <div className="bg-surface-low border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="relative inline-flex h-2 w-2"
              aria-hidden="true"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-body-sm text-on-surface-variant">
              <span className="badge badge-cyan mr-2">Platform Preview</span>
              GuardianOS is currently available as part of a SafeShield service engagement.{" "}
              <Link href="/book-review" className="text-primary hover:text-primary-tint underline underline-offset-2 transition-colors">
                Book a Readiness Review
              </Link>{" "}
              to discuss access.
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <PageHero
        eyebrow="GUARDIAN OS PLATFORM"
        title="Compliance tools"
        titleHighlight="built for school leaders"
        description="GuardianOS platform tools bring your compliance evidence into one structured, inspectable environment. Five specialist modules covering policy review, risk tracking, SARs, DPIAs and audit trails."
        badge={{ label: "Platform Preview", variant: "cyan" }}
        ctaPrimary={{ label: "Book a Readiness Review", href: "/book-review" }}
        ctaSecondary={{ label: "View the Framework", href: "/framework" }}
      />

      {/* ── GuardianOS command visual ── */}
      <section className="pb-section" aria-label="GuardianOS command overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="divider-cyan mb-12" aria-hidden="true" />
          <div className="text-center mb-8">
            <p className="eyebrow mb-2">GUARDIAN OS COMMAND OVERVIEW</p>
            <h2 className="text-display-md font-bold text-on-surface">
              Unified compliance{" "}
              <span className="text-primary text-glow">intelligence</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-4 text-balance">
              The GuardianOS command dashboard aggregates status from all five platform modules into a single compliance posture view — giving senior leaders and trustees instant assurance.
            </p>
          </div>
          <GuardianCommandVisual
            variant="full"
            trustScore={94}
            kcsieScore={98}
            activeNodes={14}
            totalNodes={14}
            alerts={2}
            className="max-w-3xl mx-auto"
          />
        </div>
      </section>

      {/* ── Module grid ── */}
      <section className="py-section bg-surface-lowest" aria-labelledby="modules-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="eyebrow mb-2">PLATFORM MODULES</p>
            <h2 id="modules-heading" className="text-display-md font-bold text-on-surface">
              Five specialist{" "}
              <span className="text-primary text-glow">compliance modules</span>
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mt-4 text-balance">
              Each GuardianOS module addresses a discrete area of school compliance risk — designed for school data protection officers, designated safeguarding leads and senior leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformModules.map((module) => (
              <ToolModuleCard
                key={module.slug}
                title={module.title}
                tagline={module.tagline}
                description={module.description}
                icon={moduleIcons[module.slug]}
                href={module.href}
                status={module.status}
                colour={module.colour}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How platform access works ── */}
      <section className="py-section" aria-labelledby="access-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-2">PLATFORM ACCESS</p>
            <h2 id="access-heading" className="text-display-md font-bold text-on-surface">
              How GuardianOS{" "}
              <span className="text-primary text-glow">access works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Book a Readiness Review",
                description:
                  "We start with a structured review of your current compliance posture — safeguarding, GDPR, cyber and governance — to understand your requirements.",
              },
              {
                step: "02",
                title: "Tailored onboarding",
                description:
                  "Platform modules are configured for your school or trust structure, with data sources, ownership and deadlines established from the outset.",
              },
              {
                step: "03",
                title: "Ongoing assurance",
                description:
                  "Access all five GuardianOS modules with regular review support from your SafeShield adviser — keeping evidence inspection-ready at all times.",
              },
            ].map((item) => (
              <div key={item.step} className="glass-panel hud-corners rounded-xl p-6 relative overflow-hidden">
                <div
                  className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary-container/50 to-transparent"
                  aria-hidden="true"
                />
                <span className="metric-number text-metric-lg font-bold text-primary/30 select-none block mb-3">
                  {item.step}
                </span>
                <h3 className="text-headline-md font-semibold text-on-surface mb-2">
                  {item.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection
        eyebrow="GET STARTED"
        title="Platform access by readiness review"
        description="GuardianOS platform access is provided as part of a SafeShield service engagement. Book a Readiness Review to discuss your requirements."
        primaryCTA={{ label: "Book a Readiness Review", href: "/book-review" }}
        secondaryCTA={{ label: "Explore the Framework", href: "/framework" }}
      />
    </>
  );
}
