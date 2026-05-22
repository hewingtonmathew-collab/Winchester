import { stats } from "@/data/stats";
import SectionDivider from "@/components/ui/SectionDivider";

export default function StatsSection() {
  return (
    <>
      <SectionDivider />
      <section className="py-20 bg-[#111A23]" aria-label="Company statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-center mb-14">By the Numbers</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center flex flex-col gap-2">
                <span className="font-cinzel font-black text-[#C9A84C] text-5xl lg:text-6xl">
                  {stat.value}
                </span>
                <span className="font-inter text-[#A7B1BE] text-sm tracking-wide leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SectionDivider />
    </>
  );
}
