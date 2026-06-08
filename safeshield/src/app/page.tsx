"use client";
import Link from "next/link";
import { Bot, ShieldCheck, ClipboardList, Cpu, FileSearch, Globe, CheckSquare, Monitor, HardHat, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
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

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Icon = tool.icon;
  return (
    <Link href={tool.href}
      className={cn(
        "glass glass-hover glass-shimmer rounded-2xl p-6 flex flex-col gap-4 group",
        "animate-float-in-delay-" + Math.min(index + 1, 3)
      )}
      style={{ textDecoration: "none" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: tool.colorDim, border: `1px solid ${tool.colorBorder}`, boxShadow: `0 0 20px ${tool.color}20` }}>
          <Icon size={22} style={{ color: tool.color }} strokeWidth={1.5} />
        </div>
        <span className="text-[0.6rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
          style={{ color: tool.color, background: tool.colorDim, borderColor: tool.colorBorder }}>
          {tool.badge}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-base mb-2 tracking-tight" style={{ color: "var(--text)" }}>{tool.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
      </div>
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
        style={{ color: tool.color }}>
        Open tool <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
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
        <div className="pt-14 pb-20 text-center">
          <div className="animate-float-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
            style={{ border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse-dot" />
            <span className="text-xs font-semibold tracking-widest uppercase">SafeShield Tool Suite</span>
          </div>
          <h1 className="animate-float-in-delay-1 heading-luxury text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.1]"
            style={{ color: "var(--text)" }}>
            Your School Tools,<br />
            <span style={{
              background: "linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #A78BFA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(56,189,248,0.4))"
            }}>
              One Place.
            </span>
          </h1>
          <p className="animate-float-in-delay-2 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--text-muted)" }}>
            Professional tools for safeguarding, governance, AI readiness, digital standards,<br className="hidden sm:block" />
            data protection, accessibility, and Ofsted preparation.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-16 animate-float-in-delay-3">
          {visibleSections.map((section) => (
            <div key={section.heading}>
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
                    {section.heading}
                  </p>
                  <p className="text-sm max-w-xl" style={{ color: "var(--text-muted)" }}>{section.sub}</p>
                </div>
                <div className="h-px flex-1 max-w-[160px]" style={{
                  background: "linear-gradient(90deg, var(--glass-border), transparent)"
                }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {section.tools.map((tool, i) => (
                  <ToolCard key={tool.href} tool={tool} index={i} />
                ))}
              </div>
            </div>
          ))}
          {visibleSections.length === 0 && (
            <GlassCard className="text-center py-20">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No tools have been enabled for your account yet. Contact your administrator to request access.
              </p>
            </GlassCard>
          )}
        </div>

      </div>
    </div>
  );
}
