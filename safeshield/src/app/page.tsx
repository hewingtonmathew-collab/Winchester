import Link from "next/link";
import { Bot, ShieldCheck, ClipboardList, Cpu, FileSearch, Globe, CheckSquare, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const tools = [
  { icon: Bot, title: "AI Content Detector", description: "Paste any text to detect whether it was written by AI or a human. Uses five statistical signals for an indicative 0–100 confidence score.", href: "/tools/ai-detector", color: "#38BDF8", colorDim: "rgba(56,189,248,0.12)", colorBorder: "rgba(56,189,248,0.25)", badge: "Detection" },
  { icon: ShieldCheck, title: "Safeguarding Risk Checker", description: "Answer a structured set of questions about your school's digital safeguarding provision and receive an instant risk rating with priority actions.", href: "/tools/safeguarding", color: "#34D399", colorDim: "rgba(52,211,153,0.12)", colorBorder: "rgba(52,211,153,0.25)", badge: "Assessment" },
  { icon: ClipboardList, title: "Governance Compliance Checker", description: "Check your governance arrangements against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.", href: "/tools/governance", color: "#A78BFA", colorDim: "rgba(167,139,250,0.12)", colorBorder: "rgba(167,139,250,0.25)", badge: "Compliance" },
  { icon: Cpu, title: "AI Readiness Assessment", description: "Score your school's readiness to adopt AI responsibly. Covers policy, procurement, staff capability, data protection, and safeguarding dimensions.", href: "/tools/ai-readiness", color: "#FB923C", colorDim: "rgba(251,146,60,0.12)", colorBorder: "rgba(251,146,60,0.25)", badge: "Readiness" },
  { icon: FileSearch, title: "DPIA Wizard", description: "Complete a Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary you can print or save.", href: "/tools/dpia", color: "#FCD34D", colorDim: "rgba(251,191,36,0.12)", colorBorder: "rgba(251,191,36,0.25)", badge: "Data Protection" },
  { icon: Globe, title: "Web Accessibility Checker", description: "Assess your school website against WCAG 2.1 and public sector accessibility obligations. Identify barriers and generate a prioritised action plan.", href: "/tools/accessibility", color: "#F472B6", colorDim: "rgba(244,114,182,0.12)", colorBorder: "rgba(244,114,182,0.25)", badge: "Accessibility" },
  { icon: CheckSquare, title: "Ofsted Ready Checker", description: "Self-evaluate your school's readiness across the Ofsted Education Inspection Framework. Identify strengths, areas for improvement, and inspection risks.", href: "/tools/ofsted", color: "#4ADE80", colorDim: "rgba(74,222,128,0.12)", colorBorder: "rgba(74,222,128,0.25)", badge: "Inspection" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-[rgba(56,189,248,0.2)] text-[#38BDF8] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            SafeShield Personal Suite
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight" style={{ color: "var(--text)" }}>
            Your School Tools,<br />
            <span className="text-[#38BDF8] glow-text">One Place.</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            A personal suite of free tools for safeguarding, governance, AI readiness, accessibility, and Ofsted preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <GlassCard key={tool.href} hover className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: tool.colorDim, border: `1px solid ${tool.colorBorder}` }}>
                    <Icon size={20} style={{ color: tool.color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border" style={{ color: tool.color, background: tool.colorDim, borderColor: tool.colorBorder }}>
                    {tool.badge}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-base mb-2" style={{ color: "var(--text)" }}>{tool.title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{tool.description}</p>
                </div>
                <Link href={tool.href} className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-150" style={{ color: tool.color }}>
                  Open tool <ArrowRight size={13} />
                </Link>
              </GlassCard>
            );
          })}
        </div>

        <p className="text-center text-xs mt-12" style={{ color: "var(--text-faint)" }}>
          All tools run entirely in your browser — no data is sent to any server.
        </p>
      </div>
    </div>
  );
}
