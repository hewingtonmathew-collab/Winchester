import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/insights";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactCTA from "@/components/sections/ContactCTA";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/schema";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.href.replace("/insights/", "") }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const article = articles.find((a) => a.href === `/insights/${params.slug}`);
  if (!article) return {};
  return {
    title: `${article.title} | Winchester Consultancy`,
    description: article.excerpt.slice(0, 160),
    twitter: { card: "summary_large_image" },
    openGraph: {
      title: article.title,
      description: article.excerpt.slice(0, 160),
    },
  };
}

const serviceLinks: Record<string, { label: string; href: string }[]> = {
  Safeguarding: [
    { label: "Safeguarding Assurance", href: "/services/safeguarding" },
    { label: "Cyber Resilience", href: "/services/cyber-resilience" },
  ],
  "AI Governance": [
    { label: "AI Governance", href: "/services/ai-governance" },
    { label: "Data Protection", href: "/services/data-protection" },
  ],
  Governance: [
    { label: "Governance Advisory", href: "/services/governance" },
    { label: "Strategic Consultancy", href: "/services/strategic" },
  ],
};

export default function ArticlePage({ params }: { params: Params }) {
  const article = articles.find((a) => a.href === `/insights/${params.slug}`);
  if (!article) notFound();

  const otherArticles = articles.filter((a) => a.id !== article.id);
  const paragraphs = article.content.split("\n\n").filter(Boolean);
  const related = serviceLinks[article.category] ?? [];

  return (
    <>
      <JsonLd data={articleSchema(article)} />

      {/* Section 1 — Article Hero */}
      <section className="pt-36 pb-16 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 font-inter text-[#A7B1BE] text-sm mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-[#2A3340]">/</span>
            <Link href="/insights" className="hover:text-white transition-colors">
              Insights
            </Link>
            <span className="text-[#2A3340]">/</span>
            <span
              className="text-[#C9A84C] max-w-[260px] truncate"
              aria-current="page"
            >
              {article.title}
            </span>
          </nav>

          {/* Category badge */}
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(201,168,76,0.12)",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            {article.category}
          </span>

          {/* Heading */}
          <h1 className="font-cinzel font-bold text-white text-3xl lg:text-5xl leading-tight mb-8 max-w-4xl">
            {article.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 font-inter text-[#A7B1BE] text-sm">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#C9A84C]" aria-hidden="true" />
              {article.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#C9A84C]" aria-hidden="true" />
              {article.date}
            </span>
            <span className="text-[#E6E9ED] font-medium">
              By {article.author}
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 2 — Article Body */}
      <section className="py-20 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Article content */}
            <article className="flex-1 min-w-0">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-inter text-[#E6E9ED] text-base leading-relaxed mb-5"
                >
                  {para}
                </p>
              ))}

              {/* Back link */}
              <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.06)]">
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-1.5 font-inter text-[#A7B1BE] text-sm hover:text-white transition-colors group"
                >
                  <ArrowLeft
                    size={14}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                  Back to Insights
                </Link>
              </div>
            </article>

            {/* Right: Sidebar */}
            <aside className="lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-6">
              {/* Related Services */}
              <GlassCard>
                <h2 className="font-cinzel font-bold text-white text-sm uppercase tracking-wider mb-4">
                  Related Services
                </h2>
                <ul className="flex flex-col gap-3">
                  {related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 font-inter text-[#A7B1BE] text-sm hover:text-white transition-colors group"
                      >
                        <ArrowRight
                          size={13}
                          className="text-[#C9A84C] transition-transform duration-200 group-hover:translate-x-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Get in Touch */}
              <GlassCard>
                <h2 className="font-cinzel font-bold text-white text-sm uppercase tracking-wider mb-3">
                  Get in Touch
                </h2>
                <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed mb-5">
                  Discuss this topic with our team.
                </p>
                <ButtonPrimary href="/contact" className="w-full justify-center">
                  Contact Us
                </ButtonPrimary>
              </GlassCard>
            </aside>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 3 — More Insights */}
      <section className="py-16 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-cinzel font-bold text-white text-2xl mb-8">
            More Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherArticles.map((a) => (
              <GlassCard key={a.id} hover as="article" className="flex flex-col gap-4">
                {/* Category badge */}
                <span
                  className="inline-block self-start px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest"
                  style={{
                    background: "rgba(201,168,76,0.12)",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  {a.category}
                </span>

                {/* Title */}
                <h3 className="font-cinzel font-bold text-white text-base leading-snug flex-1">
                  {a.title}
                </h3>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <span className="flex items-center gap-1 font-inter text-[#A7B1BE] text-xs">
                    <Clock size={11} className="text-[#C9A84C]" aria-hidden="true" />
                    {a.readTime}
                  </span>
                  <Link
                    href={a.href}
                    className="inline-flex items-center gap-1 text-[#C9A84C] text-xs font-inter font-semibold group transition-all duration-200"
                  >
                    Read
                    <ArrowRight
                      size={12}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
