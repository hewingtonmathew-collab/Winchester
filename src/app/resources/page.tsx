import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import SectionDivider from "@/components/ui/SectionDivider";
import ContactCTA from "@/components/sections/ContactCTA";
import { FileDown, BookOpen, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources | Winchester Consultancy",
  description:
    "Practical tools, templates and guidance documents for school compliance and governance professionals.",
};

const resources = [
  {
    icon: FileDown,
    title: "Capability Statement",
    description:
      "An overview of Winchester Consultancy's service offering, approach, and team expertise.",
    cta: "Download PDF",
    href: "/capability-statement.pdf",
  },
  {
    icon: BookOpen,
    title: "Compliance Health Check Guide",
    description:
      "A self-assessment framework to help school leaders identify compliance gaps and prioritise action.",
    cta: "Coming Soon",
    href: "#",
  },
  {
    icon: ClipboardList,
    title: "AI Readiness Checklist",
    description:
      "A practical checklist for schools and trusts beginning their journey toward responsible AI adoption.",
    cta: "Coming Soon",
    href: "#",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="pt-36 pb-20 bg-[#0B1118]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">Resources</p>
          <h1 className="heading-display text-4xl lg:text-6xl mb-6">
            Tools &amp; Guidance
            <br />
            for School Leaders.
          </h1>
          <p className="font-inter text-[#A7B1BE] text-lg max-w-2xl leading-relaxed">
            Practical resources designed to support schools and trusts in navigating
            compliance and governance challenges.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="py-24 bg-[#111A23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <GlassCard key={resource.title} hover className="flex flex-col gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(11,17,24,0.6)",
                      border: "1px solid rgba(201,168,76,0.3)",
                    }}
                  >
                    <Icon size={22} className="text-[#C9A84C]" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-cinzel font-bold text-white text-lg">{resource.title}</h2>
                  <p className="font-inter text-[#A7B1BE] text-sm leading-relaxed flex-1">
                    {resource.description}
                  </p>
                  <a
                    href={resource.href}
                    className="inline-flex items-center gap-2 text-[#C9A84C] text-sm font-inter font-medium"
                  >
                    {resource.cta}
                  </a>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
