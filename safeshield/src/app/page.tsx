"use client";
import Link from "next/link";
import { Bot, ShieldCheck, ClipboardList, Cpu, FileSearch, Globe, CheckSquare, Monitor, HardHat, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Tool = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  color: string;
  colorDim: string;
  colorBorder: string;
  badge: string;
};

const sections: { heading: string; sub: string; tools: Tool[] }[] = [
  {
    heading: "Safeguarding & Compliance",
    sub: "Assess and evidence your school's safeguarding, governance, and statutory compliance obligations.",
    tools: [
      { icon: ShieldCheck, title: "Safeguarding Risk Checker", description: "Answer a structured set of questions about your school's digital safeguarding provision and receive an instant risk rating with priority actions.", href: "/tools/safeguarding", color: "#34D399", colorDim: "rgba(52,211,153,0.12)", colorBorder: "rgba(52,211,153,0.25)", badge: "Assessment" },
      { icon: ClipboardList, title: "Governance Compliance Checker", description: "Check your governance arrangements against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.", href: "/tools/governance", color: "#A78BFA", colorDim: "rgba(167,139,250,0.12)", colorBorder: "rgba(167,139,250,0.25)", badge: "Compliance" },
      { icon: CheckSquare, title: "Ofsted Ready Checker", description: "Self-evaluate your school's readiness across the Ofsted Education Inspection Framework. Identify strengths, areas for improvement, and inspection risks.", href: "/tools/ofsted", color: "#4ADE80", colorDim: "rgba(74,222,128,0.12)", colorBorder: "rgba(74,222,128,0.25)", badge: "Inspection" },
      { icon: HardHat, title: "Health & Safety Checker", description: "Assess compliance across fire safety, COSHH, premises, policies, staff and pupil welfare, and contractor management. Aligned to HSE and statutory school obligations.", href: "/tools/health-safety", color: "#F97316", colorDim: "rgba(249,115,22,0.12)", colorBorder: "rgba(249,115,22,0.25)", badge: "H&S" },
    ],
  },
  {
    heading: "Digital & Technology Standards",
    sub: "Measure compliance with DfE digital standards, data protection requirements, and accessibility obligations.",
    tools: [
      { icon: Monitor, title: "Digital & Technology Standards", description: "Assess your school's compliance with DfE digital and technology standards across safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.", href: "/tools/digital-standards", color: "#818CF8", colorDim: "rgba(129,140,248,0.12)", colorBorder: "rgba(129,140,248,0.25)", badge: "Standards" },
      { icon: FileSearch, title: "DPIA Wizard", description: "Complete a Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary you can print or save.", href: "/tools/dpia", color: "#FCD34D", colorDim: "rgba(251,191,36,0.12)", colorBorder: "rgba(251,191,36,0.25)", badge: "Data Protection" },
      { icon: Globe, title: "Web Accessibility Checker", description: "Assess your school website against WCAG 2.1 and public sector accessibility obligations. Identify barriers and generate a prioritised action plan.", href: "/tools/accessibility", color: "#F472B6", colorDim: "rgba(244,114,182,0.12)", colorBorder: "rgba(244,114,182,0.25)", badge: "Accessibility" },
    ],
  },
  {
    heading: "Artificial Intelligence",
    sub: "Evaluate AI use in your school and detect AI-generated content with confidence.",
    tools: [
      { icon: Cpu, title: "AI Readiness Assessment", description: "Score your school's readiness to adopt AI responsibly. Covers policy, procurement, staff capability, data protection, and safeguarding dimensions.", href: "/tools/ai-readiness", color: "#FB923C", colorDim: "rgba(251,146,60,0.12)", colorBorder: "rgba(251,146,60,0.25)", badge: "Readiness" },
      { icon: Bot, title: "AI Content Detector", description: "Paste any text to detect whether it was written by AI or a human. Uses five statistical signals for an indicative 0–100 confidence score.", href: "/tools/ai-detector", color: "#38BDF8", colorDim: "rgba(56,189,248,0.12)", colorBorder: "rgba(56,189,248,0.25)", badge: "Detection" },
    ],
  },
];

function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
  const Icon = tool.icon;
  const delayClass = ["rise-in", "rise-in-1", "rise-in-2", "rise-in-3", "rise-in-4", "rise-in-5"][Math.min(delay, 5)];

  return (
    <Link href={tool.href} className={`block ${delayClass}`}>
      <div
        className="glass glass-hover rounded-2xl p-6 flex flex-col gap-5 h-full cursor-pointer"
        style={{ "--icon-glow": `${tool.color}40` } as React.CSSProperties}
      >
        {/* shimmer bar */}
        <span className="shimmer-run" aria-hidden />

        {/* header row */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 icon-pulse"
            style={{
              background: tool.colorDim,
              border: `1px solid ${tool.colorBorder}`,
              boxShadow: `0 0 18px ${tool.color}30`,
            }}
          >
            <Icon size={22} style={{ color: tool.color }} strokeWidth={1.5} />
          </div>
          <span
            className="text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 mt-0.5"
            style={{ color: tool.color, background: tool.colorDim, borderColor: tool.colorBorder }}
          >
            {tool.badge}
          </span>
        </div>

        {/* text */}
        <div className="flex-1 relative z-10">
          <h3 className="heading-luxury text-base mb-2" style={{ color: "var(--text)" }}>
            {tool.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {tool.description}
          </p>
        </div>

        {/* cta */}
        <div className="flex items-center gap-1.5 text-sm font-semibold relative z-10 group/cta" style={{ color: tool.color }}>
          Open tool
          <ArrowRight size={14} className="transition-transform duration-200 group-hover/cta:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { enabledTools } = useAuth();
  const allAccess = enabledTools.includes("*");

  const visibleSections = sections.map(section => ({
    ...section,
    tools: section.tools.filter(tool => {
      const slug = tool.href.split("/").pop()!;
      return allAccess || enabledTools.includes(slug);
    }),
  })).filter(section => section.tools.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="pt-12 pb-16 text-center rise-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-[rgba(56,189,248,0.22)] text-[#38BDF8] text-xs font-semibold mb-8 relative overflow-hidden">
            <span className="shimmer-run" aria-hidden />
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] dot-pulse shrink-0" />
            SafeShield Tool Suite
          </div>

          <h1 className="heading-luxury text-4xl sm:text-5xl lg:text-6xl mb-5">
            <span style={{ color: "var(--text)" }}>Your School Tools,</span>
            <br />
            <span className="gradient-text">One Place.</span>
          </h1>

          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Professional tools for safeguarding, governance, AI readiness, digital standards, data protection, accessibility, and Ofsted preparation.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-16">
          {visibleSections.map((section, si) => (
            <div key={section.heading}>
              {/* section heading */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-[#38BDF8]" />
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#38BDF8]">
                    {section.heading}
                  </p>
                </div>
                <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--text-muted)" }}>
                  {section.sub}
                </p>
                <div className="mt-3 h-px bg-gradient-to-r from-[rgba(56,189,248,0.3)] via-[rgba(129,140,248,0.2)] to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.tools.map((tool, ti) => (
                  <ToolCard key={tool.href} tool={tool} delay={si * 3 + ti} />
                ))}
              </div>
            </div>
          ))}

          {visibleSections.length === 0 && (
            <div className="glass rounded-2xl p-16 text-center rise-in">
              <ShieldCheck size={32} className="mx-auto mb-4 opacity-30 text-[#38BDF8]" />
              <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No tools available</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Contact your administrator to request access.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
