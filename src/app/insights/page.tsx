import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactCTA from "@/components/sections/ContactCTA";
import { articles } from "@/data/insights";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insights | Winchester Consultancy",
  description:
    "Expert insights and practical resources for school leaders navigating compliance, governance, and digital risk.",
};

export default function InsightsPage() {
  return (
    <>
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Insights &amp; Resources</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6">
            Expert Insights.
            <br />
            Practical Resources.
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Stay ahead of the compliance curve with our latest thinking on governance,
            safeguarding, AI, and operational assurance.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h2 className="font-cinzel font-bold text-white text-base leading-snug">
                  {article.title}
                </h2>
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

      <ContactCTA />
    </>
  );
}
