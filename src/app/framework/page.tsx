import type { Metadata } from "next";
import { frameworkData } from "@/data/framework";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactCTA from "@/components/sections/ContactCTA";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ScrollReveal from "@/components/ui/ScrollReveal";
import JsonLd from "@/components/seo/JsonLd";
import { frameworkSchema } from "@/lib/schema";
import {
  Shield,
  Columns2,
  Cpu,
  Lock,
  Database,
  Layers,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Winchester Digital Assurance Framework | Winchester Consultancy",
  description:
    "Winchester's Digital Assurance Framework is a structured school compliance methodology covering KCSIE compliance, digital safeguarding, AI governance, cyber resilience, data protection, and governance — giving schools and trusts a rigorous, evidence-based assurance cycle.",
  openGraph: {
    type: "website",
    title: "Winchester Digital Assurance Framework | Winchester Consultancy",
    description:
      "Winchester's Digital Assurance Framework is a structured school compliance methodology covering KCSIE compliance, digital safeguarding, AI governance, cyber resilience, data protection, and governance — giving schools and trusts a rigorous, evidence-based assurance cycle.",
    url: "https://winchesterconsultancy.co.uk/framework",
    siteName: "Winchester Consultancy",
  },
  twitter: { card: "summary_large_image" },
};

const pillarIconMap: Record<string, React.ElementType> = {
  shield: Shield,
  columns: Columns2,
  cpu: Cpu,
  lock: Lock,
  database: Database,
  layers: Layers,
};

export default function FrameworkPage() {
  return (
    <>
      <JsonLd data={frameworkSchema()} />

      {/* Section 1 — Hero */}
      <section className="pt-36 pb-20 bg-[#0B1118] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(201,168,76,0.10) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 10% 50%, #0c1e2e 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Our Methodology</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6 text-balance max-w-3xl">
            Winchester Digital
            <br />
            <span style={{ color: "#C9A84C" }}>Assurance Framework</span>
          </h1>
          <div className="divider-gold w-16 my-4" />
          <p className="font-cinzel text-[#A7B1BE] text-sm lg:text-base tracking-[0.15em] uppercase mb-6">
            {frameworkData.subtitle}
          </p>
          <p className="font-inter text-[#E6E9ED] text-base lg:text-lg leading-relaxed max-w-2xl">
            {frameworkData.description}
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* Section 2 — Framework Overview (2 col) */}
      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <p className="eyebrow reveal">What is the Framework</p>
              <h2 className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                A Rigorous.
                <br />
                Evidence-Based.
                <br />
                <span style={{ color: "#C9A84C" }}>Methodology.</span>
              </h2>
              <p className="font-inter text-[#E6E9ED] leading-relaxed reveal reveal-delay-2">
                The Winchester Digital Assurance Framework is not an off-the-shelf audit
                template. It is a structured methodology developed specifically for the
                education sector — one that reflects the real regulatory landscape facing
                schools and trusts, and the operational realities of the leaders who run
                them.
              </p>
              <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-3">
                Built on statutory frameworks, sector-specific guidance, and the lived
                experience of education practitioners, the framework creates a consistent,
                repeatable way to assess compliance posture across the six domains that
                matter most — and translate those findings into actionable intelligence.
              </p>
              <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-3">
                Unlike one-off audits that produce a report and disappear, our methodology
                is designed to create a continuous assurance cycle — giving schools and
                trusts a living picture of their compliance posture that adapts as
                regulatory demands evolve.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal threshold={0.08}>
            <GlassCard variant="prominent" className="flex flex-col gap-5">
              <p className="eyebrow reveal">Six Pillars of Assurance</p>
              <div className="flex flex-col gap-3 mt-2">
                {frameworkData.pillars.map((pillar, i) => (
                  <div
                    key={pillar.id}
                    className={`flex items-center gap-4 reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                  >
                    <span className="font-cinzel font-black text-[#C9A84C] text-sm w-6 flex-shrink-0">
                      {pillar.number}
                    </span>
                    <div
                      className="w-px h-4 flex-shrink-0"
                      style={{ background: "rgba(201,168,76,0.3)" }}
                    />
                    <span className="font-cinzel font-bold text-white text-sm">
                      {pillar.title}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 3 — Six Pillars */}
      <section className="py-24 bg-[#0B1118]" aria-labelledby="pillars-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3 reveal">The Six Domains</p>
              <h2
                id="pillars-heading"
                className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
              >
                Six Domains of{" "}
                <span style={{ color: "#C9A84C" }}>Assurance</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frameworkData.pillars.map((pillar, i) => {
                const Icon = pillarIconMap[pillar.icon] ?? Shield;
                return (
                  <GlassCard
                    key={pillar.id}
                    hover
                    className={`flex flex-col gap-4 reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                  >
                    {/* Number */}
                    <span className="font-cinzel font-black text-[#C9A84C] text-5xl leading-none">
                      {pillar.number}
                    </span>

                    {/* Gold divider */}
                    <div className="divider-gold w-10" />

                    {/* Icon + Title */}
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className="text-[#C9A84C] flex-shrink-0"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="font-cinzel font-bold text-white text-base leading-snug">
                        {pillar.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                      {pillar.description}
                    </p>

                    {/* Standards alignment */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <span className="font-inter text-[#A7B1BE] text-xs uppercase tracking-wider">
                        Standards Alignment
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pillar.standards.map((s) => (
                          <span
                            key={s}
                            className="badge badge-neutral"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Assessment areas */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-[#2A3340]">
                      <span className="font-inter text-[#A7B1BE] text-xs uppercase tracking-wider">
                        Assessment Areas
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {pillar.assessmentAreas.map((area) => (
                          <li key={area} className="flex items-start gap-2">
                            <CheckCircle
                              size={13}
                              className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                            <span className="font-inter text-[#A7B1BE] text-xs leading-relaxed">
                              {area}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 4 — Four-Stage Methodology */}
      <section className="py-20 bg-[#111A23]" aria-labelledby="methodology-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14">
              <p className="eyebrow mb-3 reveal">How It Works</p>
              <h2
                id="methodology-heading"
                className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
              >
                Our Assessment Methodology
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {frameworkData.methodology.map((step, i) => (
                <div
                  key={step.number}
                  className={`flex flex-col gap-4 reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4}`}
                >
                  <span className="font-cinzel font-black text-[#C9A84C] text-5xl leading-none">
                    {step.number}
                  </span>
                  <div className="divider-gold w-10" />
                  <h3 className="font-cinzel font-bold text-white text-lg">
                    {step.title}
                  </h3>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 5 — Standards Alignment */}
      <section className="py-20 bg-[#0B1118]" aria-labelledby="standards-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3 reveal">Our Foundations</p>
              <h2
                id="standards-heading"
                className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
              >
                Built on the Right Foundations
              </h2>
              <p className="font-inter text-[#A7B1BE] text-base max-w-2xl mx-auto mt-4 leading-relaxed reveal reveal-delay-2">
                Every aspect of our framework is aligned to the statutory guidance, regulatory
                frameworks, and sector-specific standards that schools and trusts are held to
                account against.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworkData.standardsAlignment.map((standard, i) => (
                <GlassCard
                  key={standard.framework}
                  className={`flex flex-col gap-3 reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                >
                  <h3 className="font-cinzel font-bold text-white text-base">
                    {standard.framework}
                  </h3>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                    {standard.description}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 6 — CTA Strip */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 reveal">
              <div>
                <p className="font-cinzel font-bold text-white text-xl mb-2">
                  Ready to be assessed against the framework?
                </p>
                <p className="font-inter text-[#A7B1BE] text-sm">
                  Book an assessment and get a clear, evidence-based view of your compliance posture.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 flex-shrink-0">
                <ButtonPrimary href="/contact">Book an Assessment</ButtonPrimary>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 font-inter text-sm text-[#A7B1BE] hover:text-white transition-colors"
                >
                  Explore Our Services
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
