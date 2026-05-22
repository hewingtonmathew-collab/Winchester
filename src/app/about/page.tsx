import type { Metadata } from "next";
import ContactCTA from "@/components/sections/ContactCTA";
import SectionDivider from "@/components/ui/SectionDivider";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { CheckCircle, Lightbulb, Target, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Winchester Consultancy",
  description:
    "Winchester Consultancy was founded by education practitioners with deep roots in school business management and ICT leadership. Learn about our approach, experience, and values.",
  twitter: { card: "summary_large_image" },
};

const principles = [
  {
    icon: Lightbulb,
    title: "Strategic Intelligence",
    body: "We don't traffic in generic frameworks. Every engagement begins with deep listening — understanding your specific context, pressures, and goals — so the intelligence we deliver is immediately relevant and actionable.",
  },
  {
    icon: Target,
    title: "Practical Outcomes",
    body: "Our work is measured by what changes, not what we produce. Every review, report, and recommendation is designed to be implemented, not filed. We stay with clients through the action phase, not just the analysis phase.",
  },
  {
    icon: Users,
    title: "Partnership Mindset",
    body: "We work alongside your team, not above them. Our approach builds internal capability so that when an engagement ends, your leaders have the knowledge and confidence to sustain what we've built together.",
  },
];

const differentiators = [
  "Practitioner-led: our consultants have held senior roles in schools and MATs — not just advised them",
  "Compliance-first: we understand the regulatory landscape schools operate in, from KCSIE to the DfE Governance Handbook",
  "Technology-informed: we understand how digital risk, AI, and data management intersect with compliance obligations",
  "Sector-specific: all our work is exclusively in education — we're not generic management consultants",
  "Outcome-focused: every piece of work includes a prioritised, implementable action plan",
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    body: "We begin with a structured discovery conversation to understand your organisation, current challenges, and what success looks like for you.",
  },
  {
    number: "02",
    title: "Assessment",
    body: "A structured review against relevant frameworks, standards, and best practice — generating evidence and identifying gaps.",
  },
  {
    number: "03",
    title: "Intelligence",
    body: "We synthesise findings into a clear, accessible report that tells the story of your current position and what it means.",
  },
  {
    number: "04",
    title: "Action",
    body: "A prioritised, time-bound action plan with clear ownership, success criteria, and practical guidance to drive implementation.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
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
          <p className="eyebrow mb-4">Our Story</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6 text-balance max-w-2xl">
            Built by Practitioners.
            <br />
            <span style={{ color: "#C9A84C" }}>For School Leaders.</span>
          </h1>
          <div className="divider-gold w-16 my-4" />
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Winchester Consultancy was founded by practitioners with deep roots in school
            business management and ICT leadership — because we believed school leaders
            deserved better than generic consultancy.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* Our Story */}
      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <p className="eyebrow reveal">Our Background</p>
              <h2 className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                Experience That
                <br />Understands Education.
              </h2>
              <p className="font-inter text-[#E6E9ED] leading-relaxed reveal reveal-delay-2">
                Winchester Consultancy was established by practitioners who have worked
                within schools and multi-academy trusts at a senior level. With combined
                experience spanning school business management and ICT leadership, we
                understand the operational realities facing today&apos;s school leaders —
                the regulatory pressures, the resource constraints, and the need to make
                confident, well-informed decisions.
              </p>
              <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-3">
                That insider understanding is what makes our work different. We&apos;ve sat in
                the rooms where these decisions get made. We&apos;ve felt the weight of a
                safeguarding audit, the complexity of a governor skills review, the
                pressure of an Ofsted visit. We bring that lived experience to every
                engagement.
              </p>
              <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-3">
                Today, Winchester Consultancy works with single schools, small trusts, and
                large multi-academy trusts across England and Wales — delivering
                intelligence that builds genuine confidence.
              </p>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal threshold={0.08}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "16+", label: "Years Combined Experience" },
                { value: "100+", label: "Schools & Trusts Supported" },
                { value: "50+", label: "MATs & Multi-site Orgs" },
                { value: "98%", label: "Client Satisfaction Rate" },
              ].map((stat, i) => (
                <GlassCard
                  key={stat.label}
                  className={`flex flex-col gap-2 reveal reveal-delay-${i + 1 as 1|2|3|4}`}
                >
                  <span className="font-cinzel font-black text-[#C9A84C] text-4xl">
                    {stat.value}
                  </span>
                  <span className="font-inter text-[#A7B1BE] text-xs leading-snug">
                    {stat.label}
                  </span>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Our 3 Principles */}
      <section className="py-24 bg-[#0B1118]" aria-labelledby="principles-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3 reveal">How We Work</p>
              <h2
                id="principles-heading"
                className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
              >
                Our Three Principles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {principles.map((p, i) => {
                const Icon = p.icon;
                return (
                  <GlassCard
                    key={p.title}
                    className={`flex flex-col gap-5 reveal reveal-delay-${i + 1 as 1|2|3}`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(11,17,24,0.6)",
                        border: "1px solid rgba(201,168,76,0.3)",
                      }}
                    >
                      <Icon size={22} className="text-[#C9A84C]" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="font-cinzel font-bold text-white text-lg">{p.title}</h3>
                    <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                      {p.body}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Our Process */}
      <section className="py-24 bg-[#111A23]" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-14">
              <p className="eyebrow mb-3 reveal">How an Engagement Works</p>
              <h2
                id="process-heading"
                className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
              >
                Our Four-Stage Process
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => (
                <div
                  key={step.number}
                  className={`flex flex-col gap-4 reveal reveal-delay-${i + 1 as 1|2|3|4}`}
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

      {/* Differentiators */}
      <section className="py-24 bg-[#0B1118]" aria-labelledby="diff-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal>
            <div className="flex flex-col gap-6">
              <p className="eyebrow reveal">Why Winchester</p>
              <h2
                id="diff-heading"
                className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
              >
                What Makes Us
                <br />Different
              </h2>
              <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-2">
                There are many consultancies. There are few that genuinely understand the
                daily reality of running a school or a trust. Here&apos;s what sets Winchester
                Consultancy apart.
              </p>
              <div className="pt-2 reveal reveal-delay-3">
                <ButtonPrimary href="/services">Explore Our Services</ButtonPrimary>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal threshold={0.08}>
            <GlassCard className="flex flex-col gap-4">
              {differentiators.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 reveal reveal-delay-${Math.min(i + 1, 5) as 1|2|3|4|5}`}
                >
                  <CheckCircle
                    size={16}
                    className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <p className="font-inter text-[#E6E9ED] text-sm leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Services CTA strip */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 reveal">
              <div>
                <p className="font-cinzel font-bold text-white text-xl mb-2">
                  Ready to see how we can help?
                </p>
                <p className="font-inter text-[#A7B1BE] text-sm">
                  Explore our full range of services or get in touch to discuss your needs.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 flex-shrink-0">
                <ButtonPrimary href="/contact">Get in Touch</ButtonPrimary>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 font-inter text-sm text-[#A7B1BE] hover:text-white transition-colors"
                >
                  View Services
                  <ArrowRight size={14} aria-hidden="true" />
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
