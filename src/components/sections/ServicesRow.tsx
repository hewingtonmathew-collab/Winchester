import GlassCard from "@/components/ui/GlassCard";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesRow() {
  return (
    <section className="py-20 bg-[#111A23]" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="eyebrow mb-3 reveal">What We Do</p>
            <h2 id="services-heading" className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {services.map((service, i) => (
              <GlassCard
                key={service.id}
                hover
                className={`flex flex-col gap-4 reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(11,17,24,0.6)",
                    border: "1px solid rgba(201,168,76,0.3)",
                  }}
                >
                  <ServiceIcon name={service.icon} size={18} />
                </div>

                <h3 className="font-cinzel font-bold text-white text-xs leading-snug tracking-wide">
                  {service.title}
                </h3>

                <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed flex-1">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1.5 text-[#C9A84C] text-xs font-inter font-medium group transition-all duration-200"
                  aria-label={`Learn more about ${service.title}`}
                >
                  Learn More
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
