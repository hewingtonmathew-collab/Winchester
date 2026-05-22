import type { Metadata } from "next";
import { articles } from "@/data/insights";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import SectionDivider from "@/components/ui/SectionDivider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactCTA from "@/components/sections/ContactCTA";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Insights | Winchester Consultancy",
  description:
    "Expert analysis on school compliance, digital safeguarding, AI governance, and governance from the Winchester Consultancy team.",
  twitter: { card: "summary_large_image" },
};

export default function InsightsPage() {
  const featured = articles[0];

  return (
    <>
      {/* Section 1 — Hero */}
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="eyebrow mb-4 reveal">Intelligence &amp; Analysis</p>
            <h1 className="heading-display text-4xl lg:text-6xl mb-6 reveal reveal-delay-1">
              Insights from the Field.
            </h1>
            <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed reveal reveal-delay-2">
              Expert commentary on the compliance, governance, and digital challenges facing school
              leaders today.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 2 — Featured Article */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-inter text-[#A7B1BE] text-sm uppercase tracking-widest mb-6 reveal">
              Featured
            </p>
            <GlassCard hover as="article" variant="prominent" className="reveal reveal-delay-1">
              <div className="flex flex-col gap-5">
                {/* Category badge */}
                <span
                  className="inline-block self-start px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest"
                  style={{
                    background: "rgba(201,168,76,0.12)",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  {featured.category}
                </span>

                {/* Heading */}
                <h2 className="font-cinzel font-bold text-white text-2xl lg:text-3xl leading-tight">
                  {featured.title}
                </h2>

                {/* Excerpt */}
                <p className="font-inter text-[#A7B1BE] text-base leading-relaxed max-w-4xl">
                  {featured.excerpt}
                </p>

                {/* Footer row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center gap-5 text-[#A7B1BE] text-sm font-inter">
                    <span className="font-medium text-white">{featured.author}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#C9A84C]" />
                      {featured.readTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#C9A84C]" />
                      {featured.date}
                    </span>
                  </div>
                  <Link
                    href={featured.href}
                    className="inline-flex items-center gap-1.5 text-[#C9A84C] text-sm font-inter font-semibold group transition-all duration-200"
                  >
                    Read Insight
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 3 — All Insights Grid */}
      <section className="py-16 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-cinzel font-bold text-white text-2xl mb-10 reveal">
              All Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <GlassCard
                  key={article.id}
                  hover
                  as="article"
                  className={`flex flex-col gap-4 reveal reveal-delay-${i + 1}`}
                >
                  {/* Category badge */}
                  <span
                    className="inline-block self-start px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest"
                    style={{
                      background: "rgba(201,168,76,0.12)",
                      color: "#C9A84C",
                      border: "1px solid rgba(201,168,76,0.25)",
                    }}
                  >
                    {article.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-cinzel font-bold text-white text-base leading-snug">
                    {article.title}
                  </h3>

                  {/* Excerpt — natural clamp at ~3 lines */}
                  <p
                    className="font-inter text-[#A7B1BE] text-sm leading-relaxed flex-1 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-3 text-[#A7B1BE] text-xs font-inter">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#C9A84C]" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} className="text-[#C9A84C]" />
                        {article.date}
                      </span>
                    </div>
                    <Link
                      href={article.href}
                      className="inline-flex items-center gap-1 text-[#C9A84C] text-xs font-inter font-semibold group transition-all duration-200"
                    >
                      Read Insight
                      <ArrowRight
                        size={12}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />

      {/* Section 4 — Newsletter/Alert strip */}
      <section className="py-16 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <GlassCard className="reveal">
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <h2 className="font-cinzel font-bold text-white text-2xl lg:text-3xl">
                  Stay Ahead of Compliance Changes.
                </h2>
                <p className="font-inter text-[#A7B1BE] text-base leading-relaxed max-w-2xl">
                  Winchester Consultancy publishes regular insights on the latest regulatory
                  developments, statutory guidance updates, and sector best practice. Get in touch
                  to be added to our distribution list.
                </p>
                <div className="mt-2">
                  <ButtonPrimary href="/contact">Get in Touch</ButtonPrimary>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
