import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";
import { Shield, CheckCircle, Lightbulb, Handshake } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Assurance",
    description: "Clarity and confidence in every decision.",
  },
  {
    icon: CheckCircle,
    title: "Compliance",
    description: "Meeting today's standards. Preparing for tomorrow.",
  },
  {
    icon: Lightbulb,
    title: "Intelligence",
    description: "Turning data and insight into better outcomes.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description: "Working alongside schools as a trusted partner.",
  },
];

export default function ValuesSection() {
  return (
    <>
      <SectionDivider />
      <section className="py-16 bg-[#0B1118]" aria-label="Our values">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="eyebrow mb-3 reveal">Our Principles</p>
              <h2 className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                What We Stand For
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className={`flex flex-col items-center text-center gap-3 reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4}`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(27,36,48,0.6)",
                        border: "1px solid rgba(201,168,76,0.25)",
                      }}
                    >
                      <Icon size={20} className="text-[#C9A84C]" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <p className="font-cinzel font-bold text-white text-sm tracking-widest uppercase">
                      {value.title}
                    </p>
                    <p className="font-inter text-[#A7B1BE] text-xs leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>
      <SectionDivider />
    </>
  );
}
