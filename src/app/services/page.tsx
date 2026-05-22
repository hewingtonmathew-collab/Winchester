import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/sections/ContactCTA";
import GlassCard from "@/components/ui/GlassCard";
import ServiceIcon from "@/components/ui/ServiceIcon";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";
import { ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Winchester Consultancy",
  description:
    "Comprehensive assurance services tailored to your school or trust — from safeguarding and governance to AI readiness and operational resilience.",
};

const serviceCategories = [
  {
    label: "Digital & Compliance",
    ids: ["safeguarding", "governance", "ai-governance", "cyber-resilience", "data-protection"],
    description: "Core statutory compliance, digital safeguarding, and regulatory assurance.",
  },
  {
    label: "Operational",
    ids: ["operational", "hr-finance", "health-safety"],
    description: "Operational efficiency, HR compliance, finance, and estates management.",
  },
  {
    label: "Strategic",
    ids: ["strategic", "compliance-intelligence"],
    description: "Trust-wide strategic intelligence and compliance visibility systems.",
  },
];

export default function ServicesPage() {
  return (
    <>
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
          <p className="eyebrow mb-4">Our Services</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6 text-balance">
            Comprehensive Assurance.
            <br />
            <span style={{ color: "#C9A84C" }}>Tailored to Your Needs.</span>
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Every school and trust faces unique challenges. Our ten services are designed to
            meet you where you are and deliver outcomes that matter — from statutory compliance
            to strategic transformation.
          </p>
        </div>
      </section>

      <SectionDivider />

      {/* Category groupings */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="eyebrow mb-3 reveal">Service Areas</p>
              <h2 className="heading-display text-2xl lg:text-3xl reveal reveal-delay-1">
                Three Areas of{" "}
                <span style={{ color: "#C9A84C" }}>Expertise</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceCategories.map((cat, i) => (
                <GlassCard
                  key={cat.label}
                  className={`flex flex-col gap-3 reveal reveal-delay-${i + 1 as 1 | 2 | 3}`}
                >
                  <h3 className="font-cinzel font-bold text-white text-base">
                    {cat.label}
                  </h3>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {cat.ids.map((id) => {
                      const svc = services.find((s) => s.id === id);
                      return svc ? (
                        <Link
                          key={id}
                          href={svc.href}
                          className="badge badge-neutral hover:badge-gold transition-colors"
                        >
                          {svc.title.split(" ").slice(0, 2).join(" ")}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* All 10 services */}
      <section className="py-24 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12">
              <p className="eyebrow mb-3 reveal">All Services</p>
              <h2 className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                Every Service{" "}
                <span style={{ color: "#C9A84C" }}>We Offer</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <GlassCard
                  key={service.id}
                  hover
                  className={`flex flex-col gap-5 reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
                  as="article"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(11,17,24,0.6)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <ServiceIcon name={service.icon} size={22} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="eyebrow text-[0.6rem]">{service.detail.tagline}</p>
                    <h2 className="font-cinzel font-bold text-white text-lg leading-snug">
                      {service.title}
                    </h2>
                  </div>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-[#C9A84C] text-sm font-inter font-medium group transition-all duration-200 mt-auto"
                  >
                    View Service
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Framework callout */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <GlassCard variant="prominent" className="reveal">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(11,17,24,0.6)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <Layers size={22} className="text-[#C9A84C]" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="eyebrow text-[0.65rem]">Our Methodology</p>
                    <h3 className="font-cinzel font-bold text-white text-xl">
                      Winchester Digital Assurance Framework
                    </h3>
                    <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed max-w-lg mt-1">
                      All our services are structured around the Winchester Digital Assurance
                      Framework — a six-pillar methodology that gives schools and trusts a
                      rigorous, consistent view of their compliance posture.
                    </p>
                  </div>
                </div>
                <Link
                  href="/framework"
                  className="inline-flex items-center gap-2 font-inter text-sm text-[#C9A84C] hover:text-white transition-colors flex-shrink-0 group"
                >
                  Explore the Framework
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
