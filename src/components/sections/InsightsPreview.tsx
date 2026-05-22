import GlassCard from "@/components/ui/GlassCard";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import { articles } from "@/data/insights";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InsightsPreview() {
  return (
    <section className="py-24 bg-[#0B1118]" aria-labelledby="insights-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Latest Thinking</p>
            <h2 id="insights-heading" className="heading-display text-3xl lg:text-4xl">
              Insights &amp; Resources
            </h2>
          </div>
          <ButtonSecondary href="/insights">View All Insights</ButtonSecondary>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <GlassCard key={article.id} hover as="article" className="flex flex-col gap-4">
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

              <Link
                href={article.href}
                className="inline-flex items-center gap-1.5 text-[#C9A84C] text-sm font-inter font-medium group mt-auto transition-all duration-200"
              >
                Read More
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
