import { stats } from "@/data/stats";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function StatsSection() {
  return (
    <>
      <SectionDivider />
      <section className="py-16 bg-[#111A23] relative overflow-hidden" aria-labelledby="stats-heading">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(201,168,76,0.07) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3 reveal">By the Numbers</p>
              <h2 id="stats-heading" className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                Proven at{" "}
                <span style={{ color: "#C9A84C" }}>Scale.</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center flex flex-col gap-2 reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4}`}
                >
                  <span
                    className="font-cinzel font-black text-[#C9A84C] text-5xl lg:text-6xl"
                    style={{ textShadow: "0 0 40px rgba(201,168,76,0.40), 0 0 16px rgba(201,168,76,0.22), 0 2px 8px rgba(0,0,0,0.40)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="font-inter text-[#E6E9ED] text-sm tracking-wide leading-snug font-semibold">
                    {stat.label}
                  </span>
                  {stat.description && (
                    <span className="font-inter text-[#A7B1BE] text-xs leading-snug">
                      {stat.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
      <SectionDivider />
    </>
  );
}
