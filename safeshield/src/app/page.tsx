"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToolBanner } from "@/hooks/useToolBanner";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import EditableText from "@/components/ui/EditableText";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";
import {
  IconSafeguarding, IconGovernance, IconAIReadiness, IconAIDetector,
  IconDPIA, IconAccessibility, IconDigitalStandards, IconOfsted, IconHealthSafety,
} from "@/components/ui/ToolIcons";

type Tool = {
  slug: string;
  Icon: React.ComponentType<{ size?: number }>;
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
      { slug: "safeguarding",     Icon: IconSafeguarding,    title: "Safeguarding Risk Checker",      description: "Structured questions across your digital safeguarding provision — instant risk rating and priority actions aligned to KCSIE.", href: "/tools/safeguarding",     color: "#34D399", badge: "Assessment" },
      { slug: "governance",       Icon: IconGovernance,      title: "Governance Compliance Checker",  description: "Check your governance against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.", href: "/tools/governance",       color: "#A78BFA", badge: "Compliance" },
      { slug: "ofsted",           Icon: IconOfsted,          title: "Ofsted Ready Checker",           description: "Self-evaluate across all four Ofsted EIF judgement areas plus SEND. Identify strengths, risks, and areas for improvement.", href: "/tools/ofsted",           color: "#4ADE80", badge: "Inspection" },
      { slug: "health-safety",    Icon: IconHealthSafety,    title: "Health & Safety Checker",        description: "Assess compliance across fire safety, COSHH, premises, policies, staff welfare, and contractor management.", href: "/tools/health-safety",    color: "#F97316", badge: "H&S" },
    ],
  },
  {
    heading: "Digital",
    headingAccent: "& Technology",
    sub: "Measure compliance with DfE digital standards, data protection requirements, and accessibility obligations.",
    tools: [
      { slug: "digital-standards",  Icon: IconDigitalStandards, title: "Digital & Technology Standards", description: "Compliance across safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.", href: "/tools/digital-standards", color: "#818CF8", badge: "Standards" },
      { slug: "dpia",               Icon: IconDPIA,             title: "DPIA Wizard",                    description: "Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary.", href: "/tools/dpia",             color: "#FCD34D", badge: "Data Protection" },
      { slug: "accessibility",      Icon: IconAccessibility,    title: "Web Accessibility Checker",      description: "Assess your school website against WCAG 2.1 and public sector accessibility obligations. Generate a prioritised action plan.", href: "/tools/accessibility",    color: "#F472B6", badge: "Accessibility" },
    ],
  },
  {
    heading: "Artificial",
    headingAccent: "Intelligence",
    sub: "Evaluate AI use in your school and detect AI-generated content with confidence.",
    tools: [
      { slug: "ai-readiness",  Icon: IconAIReadiness, title: "AI Readiness Assessment", description: "Score your school's readiness to adopt AI responsibly — policy, procurement, staff capability, data protection, and safeguarding.", href: "/tools/ai-readiness", color: "#FB923C", badge: "Readiness" },
      { slug: "ai-detector",   Icon: IconAIDetector,  title: "AI Content Detector",    description: "Detect whether text was written by AI or a human using six statistical signals. Indicative 0–100 confidence score.", href: "/tools/ai-detector", color: "#38BDF8", badge: "Detection" },
    ],
  },
];

function ToolCard({ tool, delay, loggedIn }: { tool: Tool; delay: number; loggedIn: boolean }) {
  const delayClass = ["rise-in", "rise-in-1", "rise-in-2", "rise-in-3", "rise-in-4", "rise-in-5"][Math.min(delay, 5)];
  const href = tool.href;  // always go to the tool page; guests see the preview panel

  return (
    <Link href={href} className={`block ${delayClass} group`}>
      <div className="glass glass-hover rounded-2xl p-6 flex flex-col gap-5 h-full overflow-hidden">
        <span className="shimmer-run" aria-hidden />

        {/* icon + badge */}
        <div className="flex items-start justify-between gap-3">
          <ToolIconWrapper slug={tool.slug} Icon={tool.Icon} size={60} />
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
          {loggedIn ? "Open tool" : "Get started"}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { user, enabledTools, profile } = useAuth();
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, clearBanner, uploading } = useToolBanner("home");
  const { value: heroLine1, save: saveHeroLine1 } = useEditableContent("home-hero-line1", "Your School Tools,");
  const { value: heroLine2, save: saveHeroLine2 } = useEditableContent("home-hero-line2", "One Place.");
  const { value: heroSub, save: saveHeroSub } = useEditableContent("home-hero-sub", "Professional compliance tools for safeguarding, governance, AI, digital standards, data protection, accessibility, and Ofsted.");

  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const loggedIn = !!user;

  // Show all tools to unauthenticated visitors; filter by entitlement when logged in
  const allAccess = !loggedIn || enabledTools.includes("*");

  const visibleSections = sections.map(section => ({
    ...section,
    tools: section.tools.filter(tool => {
      if (allAccess) return true;
      const slug = tool.href.split("/").pop()!;
      return enabledTools.includes(slug);
    }),
  })).filter(s => s.tools.length > 0);

  return (
    <div className="min-h-[100dvh] pt-16 pb-24">

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: "clamp(320px, calc(400 / 1920 * 100%), 500px)" }}>
        {/* Background media */}
        {isVideo(bannerUrl) ? (
          <video
            key={bannerUrl}
              src={bannerUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.22,
            }}
          />
        ) : (
          <img
            src={bannerUrl}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.32,
            }}
          />
        )}

        {/* Subtle gradient overlay so text stays readable */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.38) 100%)",
          }}
        />

        {/* Admin upload button */}
        {isAdmin && (
          <BannerUploadButton
            toolSlug="home"
            onUploaded={(url) => setBannerUrl(url)}
            uploadBanner={uploadBanner}
            clearBanner={clearBanner}
            uploading={uploading}
            hasCustomBanner={bannerUrl !== "/banner-bg.mp4"}
          />
        )}

        {/* Hero content */}
        <div
          className="rise-in max-w-6xl mx-auto px-4 sm:px-6"
          style={{ position: "absolute", inset: 0, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 72, paddingBottom: 80 }}
        >
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] dot-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
                SafeShield Tool Suite
              </span>
            </div>

            <h1 className="heading-luxury text-5xl sm:text-6xl lg:text-7xl mb-6">
              <EditableText
                as="span"
                value={heroLine1}
                onSave={saveHeroLine1}
                style={{ color: "var(--text)", display: "block" }}
              />
              <EditableText
                as="span"
                value={heroLine2}
                onSave={saveHeroLine2}
                className="gradient-text"
                style={{ display: "block" }}
              />
            </h1>

            <EditableText
              as="p"
              value={heroSub}
              onSave={saveHeroSub}
              multiline
              className="text-lg max-w-lg mx-auto leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            />

            {!loggedIn && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "var(--accent)",
                    color: "#000",
                  }}
                >
                  Get started free <ArrowRight size={15} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "var(--text)",
                  }}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tool sections ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="flex flex-col gap-20">
          {visibleSections.map((section, si) => (
            <div key={section.heading}>
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
                  <ToolCard key={tool.href} tool={tool} delay={si * 3 + ti} loggedIn={loggedIn} />
                ))}
              </div>
            </div>
          ))}

          {/* Should only show to logged-in users with genuinely no entitlements */}
          {loggedIn && visibleSections.length === 0 && (
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
