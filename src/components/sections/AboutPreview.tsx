import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { services } from "@/data/services";

export default function AboutPreview() {
  return (
    <section className="py-24 bg-[#0B1118]" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT — Text */}
        <ScrollReveal>
          <div className="flex flex-col gap-6">
            <p className="eyebrow reveal">About Us</p>
            <h2
              id="about-heading"
              className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1"
            >
              Experience That
              <br />
              Understands Education.
            </h2>
            <p className="font-inter text-[#E6E9ED] leading-relaxed reveal reveal-delay-2">
              Winchester Consultancy was founded by practitioners with deep roots in
              school business management and ICT leadership. We understand the pressures
              facing school leaders because we&apos;ve lived them — and we build our
              advice around practical outcomes, not theoretical frameworks.
            </p>
            <p className="font-inter text-[#A7B1BE] leading-relaxed reveal reveal-delay-3">
              Whether you&apos;re a single school navigating a complex compliance landscape
              or a growing multi-academy trust seeking strategic clarity, we deliver
              intelligence that builds genuine confidence.
            </p>
            <div className="pt-2 reveal reveal-delay-4">
              <ButtonPrimary href="/about">Learn More</ButtonPrimary>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT — Service capability list */}
        <ScrollReveal threshold={0.06}>
          <div className="flex flex-col gap-3">
            <h3 className="font-cinzel font-bold text-white text-xs tracking-widest uppercase mb-3 reveal">
              Our Capabilities
            </h3>
            {services.map((service, i) => (
              <div
                key={service.id}
                className={`flex items-start gap-4 p-4 rounded-lg border border-[#2A3340] hover:border-[rgba(201,168,76,0.35)] transition-colors duration-200 group reveal reveal-delay-${Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}`}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mt-0.5"
                  style={{
                    background: "rgba(11,17,24,0.6)",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  <ServiceIcon name={service.icon} size={15} />
                </div>
                <div>
                  <p className="font-cinzel font-bold text-white text-xs group-hover:text-[#C9A84C] transition-colors duration-200 leading-snug">
                    {service.title}
                  </p>
                  <p className="font-inter text-[#A7B1BE] text-xs mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
