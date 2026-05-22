import GlassCard from "@/components/ui/GlassCard";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { articles } from "@/data/insights";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function InsightsPreview() {
  return (
    <section className="py-24 bg-[#0B1118]" aria-labelledby="insights-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
            <div>
              <p className="eyebrow mb-3 reveal">Latest Thinking</p>
              <h2 id="insights-heading" className="heading-display text-3xl lg:text-4xl reveal reveal-delay-1">
                Insights &amp; Resources
              </h2>
            </div>
            <div className="reveal reveal-delay-2">
              <ButtonSecondary href="/insights">View All Insights</ButtonSecondary>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <GlassCard
                key={article.id}
                hover
                as="article"
                className={`flex flex-col gap-4 reveal reveal-delay-${i + 1 as 1 | 2 | 3}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest"
                    style={{
                      background: "rgba(201,168,76,0.12)",
                      color: "#C9A84C",
                      border: "1px solid rgba(201,168,76,0.25)",
                    }}
                  >
                    {article.category}
                  </span>
                  <p className="font-inter text-[#A7B1BE] text-xs">{article.date}</p>
                </div>

                <h3 className="font-cinzel font-bold text-white text-base leading-snug">
                  {article.title}
                </h3>

                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed flex-1">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-[#2A3340]">
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-[#A7B1BE] text-xs">{article.author}</span>
                    <span className="inline-flex items-center gap-1 font-inter text-[#A7B1BE] text-xs">
                      <Clock size={10} strokeWidth={1.5} />
                      {article.readTime}
                    </span>
                  </div>
                  <Link
                    href={article.href}
                    className="inline-flex items-center gap-1.5 text-[#C9A84C] text-sm font-inter font-medium group transition-all duration-200"
                  >
                    Read More
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
