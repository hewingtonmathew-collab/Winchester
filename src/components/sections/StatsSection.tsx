import { stats } from "@/data/stats";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function StatsSection() {
  return (
    <>
      <SectionDivider />
      <section className="py-20 bg-[#111A23]" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="eyebrow mb-3 reveal">By the Numbers</p>
              <h2 id="stats-heading" className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                Proven at Scale
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center flex flex-col gap-2 reveal reveal-delay-${i + 1 as 1 | 2 | 3 | 4}`}
                >
                  <span className="font-cinzel font-black text-[#C9A84C] text-5xl lg:text-6xl">
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
