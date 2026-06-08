"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ─────────────────────────────────────────
   Custom modern SVG icons — each has its own
   character rather than generic Lucide icons.
───────────────────────────────────────────*/
function IconSafeguarding({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L5 7v7c0 5.25 3.85 10.15 9 11.35C19.15 24.15 23 19.25 23 14V7L14 3Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill={`${color}18`} />
      <path d="M10 14l2.5 2.5L18 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGovernance({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="7" y="5" width="14" height="18" rx="2" stroke={color} strokeWidth="1.6" fill={`${color}12`} />
      <path d="M11 10h6M11 14h6M11 18h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="21" cy="21" r="4" fill={`${color}25`} stroke={color} strokeWidth="1.4" />
      <path d="M19.5 21l1 1 2-2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconAIReadiness({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* chip body */}
      <rect x="8" y="8" width="12" height="12" rx="2" stroke={color} strokeWidth="1.6" fill={`${color}15`} />
      {/* pins */}
      <path d="M11 8V5M14 8V5M17 8V5M11 20v3M14 20v3M17 20v3M8 11H5M8 14H5M8 17H5M20 11h3M20 14h3M20 17h3"
        stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      {/* AI text */}
      <text x="14" y="16" textAnchor="middle" fontSize="5" fontWeight="800" fill={color} fontFamily="system-ui">AI</text>
    </svg>
  );
}

function IconAIDetector({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="13" cy="13" r="7" stroke={color} strokeWidth="1.6" fill={`${color}12`} />
      <path d="M18.5 18.5L23 23" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* scan lines */}
      <path d="M10 11h6M10 13h4M10 15h5" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function IconDPIA({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="6" y="4" width="16" height="20" rx="2.5" stroke={color} strokeWidth="1.6" fill={`${color}10`} />
      <rect x="11" y="13" width="6" height="7" rx="1" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      <path d="M11.5 13v-2a2.5 2.5 0 015 0v2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="16" r="1" fill={color} />
      <path d="M9 8h4M9 10.5h6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconAccessibility({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="6" r="2.2" stroke={color} strokeWidth="1.6" fill={`${color}20`} />
      <path d="M8 11h16M14 11v9M14 15l-3 5M14 15l3 5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="11" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" opacity="0.35" />
    </svg>
  );
}

function IconDigitalStandards({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="13" rx="2" stroke={color} strokeWidth="1.6" fill={`${color}12`} />
      <path d="M10 23h8M14 19v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 12l2.5 2.5L19 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconOfsted({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L14 17.2 8.4 20.3l1.1-6.2L5 9.7l6.2-.9L14 3Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={`${color}15`} />
      <path d="M11 14l2 2 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHealthSafety({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      {/* hard hat */}
      <path d="M6 17h16" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 17v-1a6 6 0 0112 0v1" stroke={color} strokeWidth="1.6" fill={`${color}15`} />
      <rect x="5" y="17" width="18" height="3" rx="1.5" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      {/* cross */}
      <path d="M13 9v4M11 11h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type Tool = {
  Icon: React.ComponentType<{ color: string }>;
  title: string;
  description: string;
  href: string;
  color: string;
  badge: string;
};

const sections: { heading: string; headingAccent: string; sub: string; tools: Tool[] }[] = [
  {
    heading: "Safeguarding",
    headingAccent: "& Compliance",
    sub: "Assess and evidence your school's safeguarding, governance, and statutory compliance obligations.",
    tools: [
      { Icon: IconSafeguarding, title: "Safeguarding Risk Checker", description: "Structured questions across your digital safeguarding provision — instant risk rating and priority actions aligned to KCSIE.", href: "/tools/safeguarding", color: "#34D399", badge: "Assessment" },
      { Icon: IconGovernance,   title: "Governance Compliance Checker", description: "Check your governance against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.", href: "/tools/governance", color: "#A78BFA", badge: "Compliance" },
      { Icon: IconOfsted,       title: "Ofsted Ready Checker", description: "Self-evaluate across all four Ofsted EIF judgement areas plus SEND. Identify strengths, risks, and areas for improvement.", href: "/tools/ofsted", color: "#4ADE80", badge: "Inspection" },
      { Icon: IconHealthSafety, title: "Health & Safety Checker", description: "Assess compliance across fire safety, COSHH, premises, policies, staff welfare, and contractor management.", href: "/tools/health-safety", color: "#F97316", badge: "H&S" },
    ],
  },
  {
    heading: "Digital",
    headingAccent: "& Technology",
    sub: "Measure compliance with DfE digital standards, data protection requirements, and accessibility obligations.",
    tools: [
      { Icon: IconDigitalStandards, title: "Digital & Technology Standards", description: "Compliance across safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.", href: "/tools/digital-standards", color: "#818CF8", badge: "Standards" },
      { Icon: IconDPIA,             title: "DPIA Wizard", description: "Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary.", href: "/tools/dpia", color: "#FCD34D", badge: "Data Protection" },
      { Icon: IconAccessibility,    title: "Web Accessibility Checker", description: "Assess your school website against WCAG 2.1 and public sector accessibility obligations. Generate a prioritised action plan.", href: "/tools/accessibility", color: "#F472B6", badge: "Accessibility" },
    ],
  },
  {
    heading: "Artificial",
    headingAccent: "Intelligence",
    sub: "Evaluate AI use in your school and detect AI-generated content with confidence.",
    tools: [
      { Icon: IconAIReadiness, title: "AI Readiness Assessment", description: "Score your school's readiness to adopt AI responsibly — policy, procurement, staff capability, data protection, and safeguarding.", href: "/tools/ai-readiness", color: "#FB923C", badge: "Readiness" },
      { Icon: IconAIDetector,  title: "AI Content Detector", description: "Detect whether text was written by AI or a human using six statistical signals. Indicative 0–100 confidence score.", href: "/tools/ai-detector", color: "#38BDF8", badge: "Detection" },
    ],
  },
];

function ToolCard({ tool, delay }: { tool: Tool; delay: number }) {
  const delayClass = ["rise-in", "rise-in-1", "rise-in-2", "rise-in-3", "rise-in-4", "rise-in-5"][Math.min(delay, 5)];

  return (
    <Link href={tool.href} className={`block ${delayClass} group`}>
      <div
        className="glass glass-hover rounded-2xl p-6 flex flex-col gap-5 h-full"
        style={{ "--icon-glow": `${tool.color}50` } as React.CSSProperties}
      >
        <span className="shimmer-run" aria-hidden />

        {/* icon + badge */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 icon-pulse"
            style={{
              background: `${tool.color}14`,
              border: `1px solid ${tool.color}30`,
              boxShadow: `0 0 16px ${tool.color}28`,
            }}
          >
            <tool.Icon color={tool.color} />
          </div>
          <span
            className="text-[0.58rem] font-black uppercase tracking-[0.16em] px-2.5 py-1 rounded-full border mt-1 shrink-0"
            style={{ color: tool.color, background: `${tool.color}14`, borderColor: `${tool.color}35` }}
          >
            {tool.badge}
          </span>
        </div>

        {/* text */}
        <div className="flex-1">
          <h3 className="heading-luxury text-[1.05rem] mb-2" style={{ color: "var(--text)" }}>
            {tool.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {tool.description}
          </p>
        </div>

        {/* cta */}
        <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: tool.color }}>
          Open tool
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1.5" />
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
  })).filter(s => s.tools.length > 0);

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero */}
        <div className="pt-14 pb-20 text-center rise-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] dot-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              SafeShield Tool Suite
            </span>
          </div>

          <h1 className="heading-luxury text-5xl sm:text-6xl lg:text-7xl mb-6">
            <span style={{ color: "var(--text)" }}>Your School Tools,</span>
            <br />
            <span className="gradient-text">One Place.</span>
          </h1>

          <p className="text-lg max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Professional compliance tools for safeguarding, governance, AI, digital standards, data protection, accessibility, and Ofsted.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-20">
          {visibleSections.map((section, si) => (
            <div key={section.heading}>
              {/* BIG premium section heading */}
              <div className="mb-10">
                <h2 className="heading-luxury text-3xl sm:text-4xl mb-3">
                  <span style={{ color: "var(--text)" }}>{section.heading} </span>
                  <span className="gradient-text">{section.headingAccent}</span>
                </h2>
                <p className="text-sm max-w-xl leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                  {section.sub}
                </p>
                <div className="h-px bg-gradient-to-r from-[rgba(56,189,248,0.4)] via-[rgba(129,140,248,0.2)] to-transparent" />
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
              <p className="font-semibold mb-1" style={{ color: "var(--text)" }}>No tools available</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Contact your administrator to request access.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
