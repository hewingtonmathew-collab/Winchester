"use client";
import Link from "next/link";
import {
  ArrowRight, Gauge, ListChecks, Building2, GraduationCap, Monitor, Brain,
  Accessibility, Filter, Database, LayoutDashboard, GraduationCap as TrainingIcon,
  TrendingUp, FileText, ChevronRight, Clock, AlertCircle, AlertTriangle, Info,
  User, Shield, UserCheck, Heart, Users, FileSearch,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToolBanner } from "@/hooks/useToolBanner";
import { useEditableContent } from "@/hooks/useEditableContent";
import BannerUploadButton from "@/components/ui/BannerUploadButton";
import EditableText from "@/components/ui/EditableText";
import ToolIconWrapper from "@/components/ui/ToolIconWrapper";
import { supabase, ALL_TOOLS } from "@/lib/supabase";
import SeasonalBanner from "@/components/ui/SeasonalBanner";
import type { Report } from "@/lib/supabase";
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
      { slug: "safeguarding",      Icon: IconSafeguarding,   title: "Safeguarding Risk Checker",                description: "Structured questions across your digital safeguarding provision — instant risk rating and priority actions aligned to KCSIE.", href: "/tools/safeguarding",      color: "#34D399", badge: "Assessment" },
      { slug: "governance",        Icon: IconGovernance,     title: "Governance Compliance Checker",            description: "Check your governance against the DfE Governance Handbook. Identify gaps across committee structure, skills, policies, and accountability.", href: "/tools/governance",        color: "#A78BFA", badge: "Compliance" },
      { slug: "ofsted",            Icon: IconOfsted,         title: "Ofsted Ready Checker",                     description: "Self-evaluate across all four Ofsted EIF judgement areas plus SEND. Identify strengths, risks, and areas for improvement.", href: "/tools/ofsted",            color: "#4ADE80", badge: "Inspection" },
      { slug: "health-safety",     Icon: IconHealthSafety,   title: "Health & Safety Checker",                  description: "Assess compliance across fire safety, COSHH, premises, policies, staff welfare, and contractor management.", href: "/tools/health-safety",     color: "#F97316", badge: "H&S" },
      { slug: "policy-analyzer",   Icon: IconPolicyAnalyzer, title: "Policy Analyzer",                          description: "Upload any school policy (.docx) for an AI-powered compliance review against current UK legislation. Accept findings and download a revised document.", href: "/tools/policy-analyzer",   color: "#A78BFA", badge: "Policy" },
      { slug: "cyber-security",    Icon: Shield,             title: "Cyber Security Checker",                   description: "Assess your school's cyber security posture against NCSC guidance, DfE requirements, and Cyber Essentials. Covers network security, access controls, incident response, and staff awareness.", href: "/tools/cyber-security",    color: "#F87171", badge: "Cyber" },
      { slug: "prevent",           Icon: AlertTriangle,      title: "Prevent & Radicalisation Self-Assessment", description: "Structured self-assessment of your school's Prevent duty compliance — risk assessment, staff training, curriculum, and reporting procedures.", href: "/tools/prevent",           color: "#FBBF24", badge: "Prevent" },
      { slug: "safer-recruitment", Icon: UserCheck,          title: "Safer Recruitment Audit",                  description: "Audit your Single Central Record and safer recruitment procedures against KCSIE requirements. Identify gaps in DBS checks, references, and pre-employment vetting.", href: "/tools/safer-recruitment", color: "#34D399", badge: "Recruitment" },
    ],
  },
  {
    heading: "Digital",
    headingAccent: "& Technology",
    sub: "Measure compliance with DfE digital standards, data protection requirements, and accessibility obligations.",
    tools: [
      { slug: "digital-standards",    Icon: IconDigitalStandards, title: "Digital & Technology Standards",    description: "Compliance across safeguarding, cyber security, data protection, Ofsted readiness, accessibility, and infrastructure.", href: "/tools/digital-standards",    color: "#818CF8", badge: "Standards" },
      { slug: "dpia",                  Icon: IconDPIA,             title: "DPIA Wizard",                       description: "Data Protection Impact Assessment in six guided steps, aligned to UK GDPR Article 35. Produces a risk-rated summary.", href: "/tools/dpia",                  color: "#FCD34D", badge: "Data Protection" },
      { slug: "accessibility",         Icon: IconAccessibility,    title: "Web Accessibility Checker",         description: "Assess your school website against WCAG 2.1 and public sector accessibility obligations. Generate a prioritised action plan.", href: "/tools/accessibility",         color: "#F472B6", badge: "Accessibility" },
      { slug: "data-privacy",          Icon: Database,             title: "Data Protection & AI Privacy",     description: "Evaluate your data protection practices and AI-related privacy obligations under UK GDPR.", href: "/tools/data-privacy",          color: "#FCD34D", badge: "Data & Privacy" },
      { slug: "filtering-monitoring",  Icon: Filter,               title: "Filtering & Monitoring Assurance",  description: "Assess your filtering and monitoring provision against the DfE statutory requirements for online safety.", href: "/tools/filtering-monitoring",  color: "#38BDF8", badge: "Online Safety" },
      { slug: "sar-tracker",           Icon: FileSearch,           title: "Subject Access Request Tracker",    description: "Track and manage Subject Access Requests under UK GDPR. Automated deadline tracking, response templating, and compliance reporting.", href: "/tools/sar-tracker",           color: "#38BDF8", badge: "SAR" },
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
    heading: "Wellbeing",
    headingAccent: "& Inclusion",
    sub: "Support staff and pupil wellbeing, mental health provision, and parental engagement.",
    tools: [
      { slug: "mental-health",       Icon: Heart,  title: "Mental Health & Wellbeing Audit",  description: "Evaluate your school's mental health provision against the DfE Senior Mental Health Lead guidance. Assess whole-school approach, staff training, and pupil support structures.", href: "/tools/mental-health",       color: "#F472B6", badge: "Wellbeing" },
      { slug: "parental-engagement", Icon: Users,  title: "Parental Engagement Tracker",      description: "Evidence and improve your parental engagement strategy. Track communication channels, involvement in school life, and demonstrate impact for Ofsted.", href: "/tools/parental-engagement", color: "#A78BFA", badge: "Engagement" },
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
  const href = tool.href;

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

function scoreColor(score: number): string {
  if (score >= 80) return "#34D399";
  if (score >= 55) return "#FBBF24";
  return "#F87171";
}

export default function HomePage() {
  const { user, enabledTools, profile } = useAuth();
  const { bannerUrl, setBannerUrl, isVideo, uploadBanner, clearBanner, uploading } = useToolBanner("home");
  const { value: heroLine1, save: saveHeroLine1 } = useEditableContent("home-hero-line1", "Your School Tools,");
  const { value: heroLine2, save: saveHeroLine2 } = useEditableContent("home-hero-line2", "One Place.");
  const { value: heroSub, save: saveHeroSub } = useEditableContent("home-hero-sub", "Professional compliance tools for safeguarding, governance, AI, digital standards, data protection, accessibility, and Ofsted.");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [actionCounts, setActionCounts] = useState({ open: 0, in_progress: 0, done: 0 });

  const isAdmin = profile?.role === "admin" || enabledTools.includes("*");
  const loggedIn = !!user;

  useEffect(() => {
    if (!user) { setIdentity(null); setReports([]); return; }
    (async () => {
      const { data: membership } = await supabase
        .from("org_members").select("org_id, school_id")
        .eq("user_id", user.id).limit(1).maybeSingle();

      if (!membership) { setIdentity(null); } else {
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

        // Load reports
        const m2 = membership as { org_id: string | null; school_id: string | null };
        let q = supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(20);
        if (m2?.school_id) q = q.eq("school_id", m2.school_id);
        else if (m2?.org_id) q = q.eq("org_id", m2.org_id);
        else q = q.eq("created_by", user.id);
        const { data: reps } = await q;
        setReports((reps as Report[]) ?? []);
      }
    })();

    // Load action counts from localStorage
    try {
      const states = JSON.parse(localStorage.getItem("safeshield_action_states") ?? "{}") as Record<string, string>;
      const vals = Object.values(states);
      setActionCounts({
        open: vals.filter(v => v === "open").length,
        in_progress: vals.filter(v => v === "in_progress").length,
        done: vals.filter(v => v === "done").length,
      });
    } catch { /* ignore */ }
  }, [user]);

  const allAccess = !loggedIn || enabledTools.includes("*");

  const visibleSections = sections.map(section => ({
    ...section,
    tools: section.tools.filter(tool => {
      if (allAccess) return true;
      const slug = tool.href.split("/").pop()!;
      return enabledTools.includes(slug);
    }),
  })).filter(s => s.tools.length > 0);

  // Stats
  const avgScore = reports.length ? Math.round(reports.reduce((a: number, r: Report) => a + r.score, 0) / reports.length) : null;
  const toolsAvailable = enabledTools.includes("*") ? ALL_TOOLS.length : enabledTools.length;
  const recentReports = reports.slice(0, 4);
  const totalActions = actionCounts.open + actionCounts.in_progress + actionCounts.done;
  const donePercent = totalActions > 0 ? Math.round((actionCounts.done / totalActions) * 100) : 0;

  const firstName = profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="min-h-[100dvh] pb-24">

      {/* ── Seasonal theme banner ────────────────────────────────────── */}
      {loggedIn && (
        <SeasonalBanner
          schoolName={identity?.schoolName}
          schoolLogo={identity?.schoolLogo}
          orgName={identity?.orgName}
          orgLogo={identity?.orgLogo}
          ethos={identity?.schoolEthos ?? identity?.orgEthos}
          isMat={identity?.isMat}
        />
      )}

      {/* ── Hero banner (not logged in only) ────────────────────────── */}
      {!loggedIn && (
        <div style={{ position: "relative", overflow: "hidden", paddingTop: "clamp(320px, calc(400 / 1920 * 100%), 500px)" }}>
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
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
            />
          ) : (
            <img
              src={bannerUrl}
              alt=""
              aria-hidden="true"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
            />
          )}

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

              <div className="flex items-center justify-center gap-3 mt-8">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "var(--accent)", color: "#000" }}
                >
                  Get started free <ArrowRight size={15} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "var(--text)" }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Dashboard (logged in) ────────────────────────────────────── */}
      {loggedIn && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24">

          {/* 1. IDENTITY HEADER */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-6 rise-in" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Logos + school info */}
              <div className="flex items-center gap-5 flex-1 min-w-0">
                {/* Logo stack */}
                <div className="flex items-center gap-3 shrink-0">
                  {identity?.isMat && (identity.orgLogo ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
                      <img src={identity.orgLogo} alt={identity.orgName ?? ""} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.25)] flex items-center justify-center">
                      <Building2 size={22} className="text-[#A78BFA]" />
                    </div>
                  ))}
                  {identity?.schoolLogo ? (
                    <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2">
                      <img src={identity.schoolLogo} alt={identity.schoolName ?? ""} className="w-full h-full object-contain" />
                    </div>
                  ) : (identity?.orgLogo && !identity.isMat) ? (
                    <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-2">
                      <img src={identity.orgLogo} alt={identity.orgName ?? ""} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-2xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.25)] flex items-center justify-center">
                      <GraduationCap size={32} className="text-[#38BDF8]" />
                    </div>
                  )}
                </div>

                {/* Name + ethos */}
                <div className="flex-1 min-w-0">
                  {identity?.isMat && identity.orgName && (
                    <p className="text-[0.65rem] font-semibold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>
                      {identity.orgName}
                    </p>
                  )}
                  <h1 className="heading-luxury text-2xl sm:text-3xl text-white truncate">
                    {identity?.schoolName ?? identity?.orgName ?? "Your Dashboard"}
                  </h1>
                  {(identity?.schoolEthos ?? identity?.orgEthos) && (
                    <p className="text-sm italic mt-1 truncate" style={{ color: "var(--text-dim)" }}>
                      &ldquo;{identity?.schoolEthos ?? identity?.orgEthos}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Welcome + quick actions */}
              <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[rgba(56,189,248,0.15)] flex items-center justify-center">
                    <User size={13} className="text-[#38BDF8]" />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                    Welcome back, <span className="text-white font-semibold">{firstName}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/command-centre"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)", color: "#38BDF8" }}>
                    <Gauge size={12} /> Command Centre
                  </Link>
                  <Link href="/action-tracker"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34D399" }}>
                    <ListChecks size={12} /> Action Tracker
                  </Link>
                  <Link href="/profile"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#A78BFA" }}>
                    <FileText size={12} /> My Reports
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2. STATS ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Avg Compliance Score */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: avgScore !== null ? scoreColor(avgScore) : "#475569" }} />
                <p className="text-xs font-medium text-[#475569] uppercase tracking-wide">Avg Score</p>
              </div>
              {avgScore !== null ? (
                <p className="text-3xl font-bold" style={{ color: scoreColor(avgScore) }}>{avgScore}<span className="text-lg">%</span></p>
              ) : (
                <p className="text-3xl font-bold text-[#334155]">—</p>
              )}
              <p className="text-xs text-[#334155] mt-1">Compliance score</p>
            </div>

            {/* Open Actions */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-[#FBBF24]" />
                <p className="text-xs font-medium text-[#475569] uppercase tracking-wide">Open Actions</p>
              </div>
              <p className="text-3xl font-bold text-[#FBBF24]">{actionCounts.open}</p>
              <p className="text-xs text-[#334155] mt-1">Awaiting action</p>
            </div>

            {/* Total Assessments */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-[#818CF8]" />
                <p className="text-xs font-medium text-[#475569] uppercase tracking-wide">Assessments</p>
              </div>
              <p className="text-3xl font-bold text-white">{reports.length}</p>
              <p className="text-xs text-[#334155] mt-1">Total completed</p>
            </div>

            {/* Tools Available */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-[#38BDF8]" />
                <p className="text-xs font-medium text-[#475569] uppercase tracking-wide">Tools</p>
              </div>
              <p className="text-3xl font-bold text-white">{toolsAvailable}</p>
              <p className="text-xs text-[#334155] mt-1">Available to you</p>
            </div>
          </div>

          {/* 3. TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-10">
            {/* Left: Recent Assessments (3 cols) */}
            <div className="lg:col-span-3 glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Recent Assessments</h2>
                <Link href="/command-centre" className="text-xs text-[#38BDF8] hover:opacity-80 transition-opacity">View all →</Link>
              </div>
              {recentReports.length > 0 ? (
                <div className="py-1">
                  {recentReports.map(r => (
                    <Link href={`/tools/${r.tool_slug}`} key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group mx-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{r.tool_name}</p>
                        <p className="text-xs text-[#475569]">{r.school_name} · {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold" style={{ color: scoreColor(r.score) }}>{r.score}%</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: scoreColor(r.score) + "18", color: scoreColor(r.score) }}>{r.rating}</span>
                        <ChevronRight size={12} className="text-[#475569] group-hover:text-white transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-[#475569]">No assessments yet — run your first tool below</p>
                </div>
              )}
            </div>

            {/* Right: Priority Actions (2 cols) */}
            <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">Action Tracker</h2>
                <Link href="/action-tracker" className="text-xs text-[#34D399] hover:opacity-80 transition-opacity">View all →</Link>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {/* Counts */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    <p className="text-2xl font-bold text-[#F87171]">{actionCounts.open}</p>
                    <p className="text-[10px] text-[#475569] mt-0.5 uppercase tracking-wide">Open</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <p className="text-2xl font-bold text-[#FBBF24]">{actionCounts.in_progress}</p>
                    <p className="text-[10px] text-[#475569] mt-0.5 uppercase tracking-wide">In Progress</p>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                    <p className="text-2xl font-bold text-[#34D399]">{actionCounts.done}</p>
                    <p className="text-[10px] text-[#475569] mt-0.5 uppercase tracking-wide">Done</p>
                  </div>
                </div>

                {/* Progress bar */}
                {totalActions > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-[#475569]">Completion</p>
                      <p className="text-xs font-semibold text-[#34D399]">{donePercent}%</p>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#34D399] transition-all duration-700" style={{ width: `${donePercent}%` }} />
                    </div>
                  </div>
                )}

                {totalActions === 0 && (
                  <p className="text-xs text-[#334155] text-center py-2">Run a tool assessment to generate actions</p>
                )}

                <Link href="/action-tracker"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 mt-auto"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }}>
                  <ListChecks size={13} /> View Action Tracker
                </Link>
              </div>
            </div>
          </div>

          {/* 4. TOOL CATALOGUE */}
          <div className="flex items-center gap-3 mb-8">
            <h2 className="heading-luxury text-2xl sm:text-3xl">
              <span style={{ color: "var(--text)" }}>Available </span>
              <span className="gradient-text">Tools</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", color: "#38BDF8" }}>
              {visibleSections.reduce((a, s) => a + s.tools.length, 0)}
            </span>
          </div>
        </div>
      )}

      {/* ── Tool sections ────────────────────────────────────────────── */}
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 ${loggedIn ? "" : "pt-16"}`}>
        <div className="flex flex-col gap-20">
          {visibleSections.map((section, si) => (
            <div key={section.heading + section.headingAccent}>
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
