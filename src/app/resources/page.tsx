import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactCTA from "@/components/sections/ContactCTA";
import { Shield, Columns2, Cpu, CheckCircle, FileDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources | Winchester Consultancy",
  description:
    "Practical guides, frameworks, and templates to support school compliance, governance, and digital safeguarding across your school or trust.",
  twitter: { card: "summary_large_image" },
};

const categories = [
  {
    icon: Shield,
    title: "Safeguarding & Online Safety",
    description:
      "Guidance on KCSIE compliance, digital safeguarding reviews, and online safety frameworks for schools and trusts.",
    items: [
      "KCSIE 2024 Compliance Checklist",
      "Digital Safeguarding Self-Evaluation Template",
      "Online Filtering Review Framework",
    ],
  },
  {
    icon: Columns2,
    title: "Governance & Compliance",
    description:
      "Governor skills matrices, compliance mapping tools, and governance effectiveness resources.",
    items: [
      "Governor Skills & Knowledge Audit Template",
      "Statutory Policy Review Schedule",
      "Governance Effectiveness Self-Assessment",
    ],
  },
  {
    icon: Cpu,
    title: "AI Governance & Digital Risk",
    description:
      "Frameworks for responsible AI adoption, staff guidance templates, and digital risk assessment tools.",
    items: [
      "AI Governance Policy Framework",
      "Staff Acceptable Use Guide for AI Tools",
      "AI Risk Assessment Template",
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="eyebrow mb-4 reveal">Tools &amp; Guidance</p>
            <h1 className="heading-display text-4xl lg:text-6xl mb-6 reveal reveal-delay-1">
              Resources for School Leaders.
            </h1>
            <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed reveal reveal-delay-2">
              Practical guides, reference frameworks, and templates drawn from our work with schools
              and trusts across England and Wales.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 2 — Resource Categories */}
      <section className="py-20 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-cinzel font-bold text-white text-2xl mb-10 reveal">
              Browse by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <GlassCard
                    key={cat.title}
                    hover
                    className={`flex flex-col gap-5 reveal reveal-delay-${i + 1}`}
                  >
                    {/* Icon container */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(11,17,24,0.6)",
                        border: "1px solid rgba(201,168,76,0.3)",
                      }}
                    >
                      <Icon size={22} className="text-[#C9A84C]" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="font-cinzel font-bold text-white text-lg leading-snug">
                      {cat.title}
                    </h3>

                    {/* Description */}
                    <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Items list */}
                    <ul className="flex flex-col gap-2.5 mt-auto">
                      {cat.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle
                            size={15}
                            className="text-[#C9A84C] flex-shrink-0 mt-0.5"
                            strokeWidth={1.75}
                          />
                          <span className="font-inter text-[#A7B1BE] text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 3 — Capability Statement */}
      <section className="py-16 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <GlassCard className="reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left */}
                <div className="flex flex-col gap-4">
                  <h2 className="font-cinzel font-bold text-white text-2xl lg:text-3xl">
                    Our Capability Statement
                  </h2>
                  <p className="font-inter text-[#A7B1BE] text-base leading-relaxed">
                    Download our capability statement to share with governors, trustees, or
                    procurement teams. It outlines our services, experience, and approach in a
                    format designed for formal presentations and tender processes.
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col items-start md:items-end gap-3">
                  <ButtonPrimary href="/capability-statement.pdf" download>
                    <FileDown size={15} className="mr-1" />
                    Download Capability Statement
                  </ButtonPrimary>
                  <p className="font-inter text-[#A7B1BE] text-xs tracking-wide">
                    PDF &middot; Updated 2024
                  </p>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 4 — Looking for something specific? */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center gap-5 reveal">
              <h2 className="font-cinzel font-bold text-white text-2xl lg:text-3xl">
                Looking for something specific?
              </h2>
              <p className="font-inter text-[#A7B1BE] text-base leading-relaxed max-w-2xl">
                Our resources are drawn from real client engagements. If you&apos;re looking for
                guidance on a specific compliance area or regulatory framework, get in touch
                &mdash; we&apos;re happy to point you in the right direction.
              </p>
              <div className="mt-2">
                <ButtonPrimary href="/contact">Get in Touch</ButtonPrimary>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
