import type { Metadata } from "next";
import Link from "next/link";
import { Bot } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";

export const metadata: Metadata = {
  title: "Free Tools | Winchester Consultancy",
  description:
    "Free practical tools for school leaders — AI content detector and more.",
};

const tools = [
  {
    icon: Bot,
    title: "AI Content Detector",
    description:
      "Analyse text to detect whether it was written by AI. Useful for checking student submissions, internal documents, and compliance reports.",
    href: "/tools/ai-detector",
    cta: "Use Tool →",
    badge: "Free",
  },
];

export default function ToolsPage() {
  return (
    <>
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Resources &amp; Tools</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6">
            Free Tools for
            <br />
            School Leaders.
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Practical, free tools to help school leaders, compliance teams, and governance
            professionals navigate the modern education landscape.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <GlassCard
                  key={tool.title}
                  hover
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(11,17,24,0.6)",
                        border: "1px solid rgba(201,168,76,0.3)",
                      }}
                    >
                      <Icon size={22} className="text-[#C9A84C]" strokeWidth={1.5} />
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-inter font-semibold uppercase tracking-widest bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)] text-[#C9A84C]">
                      {tool.badge}
                    </span>
                  </div>
                  <h2 className="font-cinzel font-bold text-white text-lg">
                    {tool.title}
                  </h2>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-[#C9A84C] text-sm font-inter font-medium hover:text-white transition-colors duration-200"
                  >
                    {tool.cta}
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
