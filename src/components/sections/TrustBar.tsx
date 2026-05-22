import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { trustItems } from "@/data/trust-bar";
import { Award, Users, Target, Lock } from "lucide-react";
import type { TrustItem } from "@/data/trust-bar";

const iconMap: Record<TrustItem["icon"], React.ElementType> = {
  award: Award,
  users: Users,
  target: Target,
  lock: Lock,
};

export default function TrustBar() {
  return (
    <>
      <SectionDivider />
      <section className="py-10 bg-[#0B1118]" aria-label="Trust indicators">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="glass-subtle px-6 py-8 reveal">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {trustItems.map((item, i) => {
                  const Icon = iconMap[item.icon];
                  return (
                    <div key={i} className={`flex flex-col items-center text-center gap-2 py-4 reveal reveal-delay-${i + 1 as 1|2|3|4}`}>
                      <Icon
                        size={20}
                        className="text-[#C9A84C]"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      {item.value && (
                        <span className="font-cinzel font-bold text-[#C9A84C] text-2xl">
                          {item.value}
                        </span>
                      )}
                      <span className="font-cinzel text-white text-xs tracking-wider uppercase font-bold leading-snug">
                        {item.label}
                      </span>
                      <span className="font-inter text-[#A7B1BE] text-xs leading-snug">
                        {item.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <SectionDivider />
    </>
  );
}
