"use client";
import Link from "next/link";
import { ArrowRight, Gauge, ListChecks, Building2, GraduationCap, Monitor, Brain, Accessibility, Filter, Database, LayoutDashboard, GraduationCap as TrainingIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToolBanner } from "@/hooks/useToolBanner";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import EditableText from "@/components/ui/EditableText";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";
import { supabase } from "@/lib/supabase";
import {
  IconSafeguarding, IconGovernance, IconAIReadiness, IconAIDetector,
  IconDPIA, IconAccessibility, IconDigitalStandards, IconOfsted, IconHealthSafety,
  IconPolicyAnalyzer,
} from "@/components/ui/ToolIcons";

type Tool = {
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
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
      { slug: "safeguarding",    Icon: IconSafeguarding,   title: "Safeguarding Risk Checker",     description: "Structured questions across your digital safeguarding provision — instant risk rating and priority actions aligned to KCSIE.", href: "/tools/safeguarding",    color: "#34D399", badge: "Assessment" },
      { slug: "governance",      Icon: IconGovernance,     title: "Governance Compliance Checker", description: "Check your governance against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.", href: "/tools/governance",      color: "#A78BFA", badge: "Compliance" },
      { slug: "ofsted",          Icon: IconOfsted,         title: "Ofsted Ready Checker",          description: "Self-evaluate across all four Ofsted EIF judgement areas plus SEND. Identify strengths, risks, and areas for improvement.", href: "/tools/ofsted",          color: "#4ADE80", badge: "Inspection" },
      { slug: "health-safety",   Icon: IconHealthSafety,   title: "Health & Safety Checker",       description: "Assess compliance across fire safety, COSHH, premises, policies, staff welfare, and contractor management.", href: "/tools/health-safety",   color: "#F97316", badge: "H&S" },
      { slug: "policy-analyzer", Icon: IconPolicyAnalyzer, title: "Policy Analyzer",               description: "Upload any school policy (.docx) for an AI-powered compliance review against current UK legislation. Accept findings and download a revised document.", href: "/tools/policy-analyzer", color: "#A78BFA", badge: "Policy" },
    ],
  },
  {
    heading: "Digital",
    headingAccent: "& Technology",
    sub: "Measure compliance with DfE digital standards, data protection requirements, and accessibility obligations.",
    tools: [
      { slug: "digital-standards", Icon: IconDigitalStandards, title: "Digital & Technology Standards",  description: "Compliance across safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.", href: "/tools/digital-standards", color: "#818CF8", badge: "Standards" },
      { slug: "dpia",              Icon: IconDPIA,             title: "DPIA Wizard",                     description: "Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary.", href: "/tools/dpia",              color: "#FCD34D", badge: "Data Protection" },
      { slug: "accessibility",     Icon: IconAccessibility,    title: "Web Accessibility Checker",       description: "Assess your school website against WCAG 2.1 and public sector accessibility obligations. Generate a prioritised action plan.", href: "/tools/accessibility",     color: "#F472B6", badge: "Accessibility" },
      { slug: "data-privacy",      Icon: Database,             title: "Data Protection & AI Privacy",    description: "Evaluate your data protection practices and AI-related privacy obligations under UK GDPR.", href: "/tools/data-privacy",      color: "#FCD34D", badge: "Data & Privacy" },
      { slug: "filtering-monitoring", Icon: Filter,            title: "Filtering & Monitoring Assurance", description: "Assess your filtering and monitoring provision against the DfE statutory requirements for online safety.", href: "/tools/filtering-monitoring", color: "#38BDF8", badge: "Online Safety" },
    ],
  },
  {
    heading: "Artificial",
    headingAccent: "Intelligence",
    sub: "Evaluate AI use in your school and detect AI-generated content with confidence.",
    tools: [
      { slug: "ai-readiness", Icon: IconAIReadiness, title: "AI Readiness Assessment", description: "Score your school's readiness to adopt AI responsibly — policy, procurement, staff capability, data protection, and safeguarding.", href: "/tools/ai-readiness", color: "#FB923C", badge: "Readiness" },
      { slug: "ai-detector",  Icon: IconAIDetector,  title: "AI Content Detector",     description: "Detect whether text was written by AI or a human using six statistical signals. Indicative 0–100 confidence score.", href: "/tools/ai-detector",  color: "#38BDF8", badge: "Detection" },
      { slug: "ai-risk",      Icon: Brain,           title: "AI Use Risk Assessment",  description: "Identify and mitigate risks from AI use across teaching, assessment, and administration.", href: "/tools/ai-risk",      color: "#F87171", badge: "Risk" },
    ],
  },
  {
    heading: "Digital",
    headingAccent: "Safety Suite",
    sub: "Dedicated tools for screen use, SEND digital inclusion, and online safety assurance.",
    tools: [
      { slug: "screen-use",   Icon: Monitor,      title: "Screen Use & Wellbeing Review",  description: "Assess your school's approach to screen time, digital wellbeing, and device policies aligned to DfE guidance.", href: "/tools/screen-use",   color: "#34D399", badge: "Wellbeing" },
      { slug: "send-digital", Icon: Accessibility, title: "SEND Digital Impact Review",    description: "Evaluate how technology supports SEND pupils — access, inclusion, assistive tech, and digital equality.", href: "/tools/send-digital", color: "#F472B6", badge: "SEND" },
    ],
  },
  {
    heading: "Leadership",
    headingAccent: "& Governance",
    sub: "Tools designed specifically for governors and senior leaders to gain oversight at a glance.",
    tools: [
      { slug: "governor-dashboard", Icon: LayoutDashboard, title: "Governor Digital Dashboard", description: "A governor-facing summary of your school's digital maturity, compliance scores, and strategic priorities.", href: "/tools/governor-dashboard", color: "#A78BFA", badge: "Governance" },
    ],
  },
  {
    heading: "Training",
    headingAccent: "& Certification",
    sub: "CPD-aligned online training for staff across safeguarding, data protection, and digital safety.",
    tools: [
      { slug: "training", Icon: TrainingIcon, title: "Training & Certification", description: "Structured CPD courses with assessments, progress tracking, and certificates of completion for safeguarding and digital safety.", href: "/tools/training", color: "#FBBF24", badge: "CPD" },
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

type Identity = {
  schoolName: string | null;
  schoolLogo: string | null;
  schoolEthos: string | null;
  orgName: string | null;
  orgLogo: string | null;
  orgEthos: string | null;
  orgType: "mat" | "school" | null;
  isMat: boolean;
};

export default function HomePage() {
  const { user, enabledTools, profile } = useAuth();
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, clearBanner, uploading } = useToolBanner("home");
  const { value: heroLine1, save: saveHeroLine1 } = useEditableContent("home-hero-line1", "Your School Tools,");
  const { value: heroLine2, save: saveHeroLine2 } = useEditableContent("home-hero-line2", "One Place.");
  const { value: heroSub, save: saveHeroSub } = useEditableContent("home-hero-sub", "Professional compliance tools for safeguarding, governance, AI, digital standards, data protection, accessibility, and Ofsted.");
  const [identity, setIdentity] = useState<Identity | null>(null);

  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const loggedIn = !!user;

  useEffect(() => {
    if (!user) { setIdentity(null); return; }
    (async () => {
      const { data: membership } = await supabase
        .from("org_members").select("org_id, school_id")
        .eq("user_id", user.id).limit(1).maybeSingle();
      if (!membership) { setIdentity(null); return; }
      const m = membership as { org_id: string | null; school_id: string | null };

      let schoolName: string | null = null;
      let schoolLogo: string | null = null;
      let schoolEthos: string | null = null;
      let orgName: string | null = null;
      let orgLogo: string | null = null;
      let orgEthos: string | null = null;
      let orgType: "mat" | "school" | null = null;

      if (m.school_id) {
        const { data: s } = await supabase.from("schools").select("name,logo_url,ethos").eq("id", m.school_id).maybeSingle();
        if (s) { schoolName = (s as { name: string; logo_url: string | null; ethos: string | null }).name; schoolLogo = (s as { logo_url: string | null }).logo_url; schoolEthos = (s as { ethos: string | null }).ethos; }
      }
      if (m.org_id) {
        const { data: o } = await supabase.from("organisations").select("name,logo_url,ethos,type").eq("id", m.org_id).maybeSingle();
        if (o) { orgName = (o as { name: string }).name; orgLogo = (o as { logo_url: string | null }).logo_url; orgEthos = (o as { ethos: string | null }).ethos; orgType = (o as { type: "mat" | "school" }).type; }
      }

      setIdentity({ schoolName, schoolLogo, schoolEthos, orgName, orgLogo, orgEthos, orgType, isMat: orgType === "mat" });
    })();
  }, [user]);

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
            preload="none"
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.4,
            }}
          />
        ) : (
          <img
            src={bannerUrl}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.4,
            }}
          />
        )}

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

      {/* ── Logged-in identity banner + dashboard shortcuts ─────────── */}
      {loggedIn && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-2">
          {/* Identity card */}
          {identity && (
            <div className="glass rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
              {/* MAT logo + school logo stack */}
              <div className="flex items-center gap-3 shrink-0">
                {identity.isMat && (identity.orgLogo ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
                    <img src={identity.orgLogo} alt={identity.orgName ?? ""} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.25)] flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-[#A78BFA]" />
                  </div>
                ))}
                {identity.schoolLogo ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
                    <img src={identity.schoolLogo} alt={identity.schoolName ?? ""} className="w-full h-full object-contain" />
                  </div>
                ) : (identity.orgLogo && !identity.isMat) ? (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
                    <img src={identity.orgLogo} alt={identity.orgName ?? ""} className="w-full h-full object-contain" />
                  </div>
                ) : !identity.isMat ? (
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.25)] flex items-center justify-center shrink-0">
                    <GraduationCap size={24} className="text-[#38BDF8]" />
                  </div>
                ) : null}
              </div>

              {/* Name + ethos */}
              <div className="flex-1 min-w-0">
                {identity.isMat && identity.orgName && (
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#A78BFA" }}>
                    {identity.orgName}
                  </p>
                )}
                <h2 className="text-lg font-bold text-white truncate">
                  {identity.schoolName ?? identity.orgName ?? "Your Dashboard"}
                </h2>
                {(identity.schoolEthos ?? identity.orgEthos) && (
                  <p className="text-sm italic mt-0.5 truncate" style={{ color: "var(--text-dim)" }}>
                    &ldquo;{identity.schoolEthos ?? identity.orgEthos}&rdquo;
                  </p>
                )}
                <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                  Welcome back, {profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0]}
                </p>
              </div>

              {/* Dashboard shortcuts */}
              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
                <Link href="/command-centre"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
                  style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
                  <Gauge size={12} /> Command Centre
                </Link>
                <Link href="/action-tracker"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90"
                  style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }}>
                  <ListChecks size={12} /> Action Tracker
                </Link>
              </div>
            </div>
          )}

          {/* No org membership — just dashboard shortcuts */}
          {!identity && (
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="/command-centre"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
                <Gauge size={14} /> Command Centre
              </Link>
              <Link href="/action-tracker"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }}>
                <ListChecks size={14} /> Action Tracker
              </Link>
            </div>
          )}
        </div>
      )}

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
