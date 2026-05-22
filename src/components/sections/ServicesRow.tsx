import GlassCard from "@/components/ui/GlassCard";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const coreServiceIds = ["safeguarding", "governance", "ai-governance", "operational", "strategic"];

export default function ServicesRow() {
  const coreServices = services.filter((s) => coreServiceIds.includes(s.id));

  return (
    <section className="py-16 bg-[#111A23]" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="eyebrow mb-3 reveal">Our Services</p>
            <h2 id="services-heading" className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
              Comprehensive Assurance.
              <br />
              <span style={{ color: "#C9A84C" }}>Tailored to Your Needs.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreServices.map((service, i) => (
              <GlassCard
                key={service.id}
                hover
                className={`flex flex-col gap-5 p-5 [border-top-color:rgba(201,168,76,0.75)] reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
              >
                {/* Icon — larger, more prominent */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(11,17,24,0.7)",
                    border: "1px solid rgba(201,168,76,0.35)",
                    boxShadow: "0 0 20px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.06)",
                  }}
                >
                  <ServiceIcon name={service.icon} size={28} />
                </div>

                {/* Title — uppercase, more prominent */}
                <h3 className="font-cinzel font-bold text-white text-xs leading-snug tracking-[0.08em] uppercase">
                  {service.title}
                </h3>

                <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed flex-1">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1.5 text-[#C9A84C] text-xs font-inter font-medium group transition-all duration-200 mt-auto"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn More
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </GlassCard>
            ))}
          </div>

          <div className="flex justify-center mt-10 reveal reveal-delay-5">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-inter text-sm text-[#C9A84C] hover:text-white transition-colors duration-200 group"
            >
              View All Services
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
