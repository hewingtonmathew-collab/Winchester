import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { services } from "@/data/services";

export default function AboutPreview() {
  return (
    <section className="py-24 bg-[#0B1118]" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT — Text */}
        <div className="flex flex-col gap-6">
          <p className="eyebrow">About Us</p>
          <h2
            id="about-heading"
            className="heading-display text-3xl lg:text-4xl"
          >
            Experience That
            <br />
            Understands Education.
          </h2>
          <p className="font-inter text-[#E6E9ED] leading-relaxed">
            Winchester Consultancy was founded by practitioners with deep roots in
            school business management and ICT leadership. We understand the pressures
            facing school leaders because we&apos;ve lived them — and we build our
            advice around practical outcomes, not theoretical frameworks.
          </p>
          <p className="font-inter text-[#A7B1BE] leading-relaxed">
            Whether you&apos;re a single school navigating a complex compliance landscape
            or a growing multi-academy trust seeking strategic clarity, we deliver
            intelligence that builds genuine confidence.
          </p>
          <div className="pt-2">
            <ButtonPrimary href="/about">Learn More</ButtonPrimary>
          </div>
        </div>

        {/* RIGHT — Service capability list */}
        <div className="flex flex-col gap-3">
          <h3 className="font-cinzel font-bold text-white text-sm tracking-wider uppercase mb-3">
            Our Capabilities
          </h3>
          {services.map((service) => (
            <div
              key={service.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-[#2A3340] hover:border-[rgba(201,168,76,0.35)] transition-colors duration-200 group"
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
      </div>
    </section>
  );
}
