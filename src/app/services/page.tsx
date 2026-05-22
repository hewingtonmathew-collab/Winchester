import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/sections/ContactCTA";
import GlassCard from "@/components/ui/GlassCard";
import ServiceIcon from "@/components/ui/ServiceIcon";
import SectionDivider from "@/components/ui/SectionDivider";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Winchester Consultancy",
  description:
    "Comprehensive assurance services tailored to your school or trust — from safeguarding and governance to AI readiness and operational resilience.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Our Services</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6 text-balance">
            Comprehensive Assurance.
            <br />
            Tailored to Your Needs.
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Every school and trust faces unique challenges. Our services are designed to
            meet you where you are and deliver outcomes that matter.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <GlassCard
                key={service.id}
                hover
                className="flex flex-col gap-5"
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
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
