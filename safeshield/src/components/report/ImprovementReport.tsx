"use client";
import React, { useState, useEffect } from "react";
import { Mail, Printer, ChevronDown, ChevronUp, Sparkles, Sun, Moon } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const GUIDANCE_LINKS: Record<string, { label: string; url: string }[]> = {
  "Online Filtering": [
    { label: "DfE Filtering & Monitoring Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges" },
  ],
  "Online Monitoring": [
    { label: "DfE Filtering & Monitoring Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges" },
  ],
  "Policy": [
    { label: "UK Council for Internet Safety (UKCIS)", url: "https://www.gov.uk/government/organisations/uk-council-for-internet-safety" },
    { label: "DfE Online Safety Guidance", url: "https://www.gov.uk/government/publications/teaching-online-safety-in-schools" },
  ],
  "DSL & Staff": [
    { label: "KCSiE 2024 – Safeguarding Roles", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
  ],
  "Curriculum": [
    { label: "Relationships & Sex Education Guidance", url: "https://www.gov.uk/government/publications/relationships-education-relationships-and-sex-education-rse-and-health-education" },
    { label: "Online Safety Teaching Resources", url: "https://www.gov.uk/government/publications/teaching-online-safety-in-schools" },
  ],
  "Governance": [
    { label: "DfE Governance Handbook", url: "https://www.gov.uk/government/publications/governance-handbook" },
    { label: "Ofsted School Inspection Handbook", url: "https://www.gov.uk/government/publications/school-inspection-handbook-eif" },
  ],
  "Devices": [
    { label: "DfE Device & Technology Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges" },
  ],
  "Data Protection": [
    { label: "ICO Guide to UK GDPR", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/" },
    { label: "DfE Data Protection Toolkit", url: "https://www.gov.uk/government/publications/data-protection-toolkit-for-schools" },
  ],
  "Safeguarding": [
    { label: "KCSiE 2024", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
    { label: "Working Together to Safeguard Children", url: "https://www.gov.uk/government/publications/working-together-to-safeguard-children--2" },
  ],
  "Procurement": [
    { label: "DfE EdTech Procurement Guidance", url: "https://www.gov.uk/guidance/buying-for-schools/digital-devices-and-technology" },
    { label: "ICO Accountability Framework", url: "https://ico.org.uk/for-organisations/accountability-framework/" },
  ],
  "Staff Capability": [
    { label: "DfE Teacher CPD Standard", url: "https://www.gov.uk/government/publications/standard-for-teachers-professional-development" },
  ],
  "Board Structure": [
    { label: "DfE Governance Handbook", url: "https://www.gov.uk/government/publications/governance-handbook" },
  ],
  "Skills & Membership": [
    { label: "Competency Framework for Governance", url: "https://www.gov.uk/government/publications/governance-handbook" },
  ],
  "Statutory Compliance": [
    { label: "DfE Statutory Policies for Schools", url: "https://www.gov.uk/government/publications/statutory-policies-for-schools-and-academy-trusts" },
  ],
  "Accountability": [
    { label: "Ofsted School Inspection Handbook", url: "https://www.gov.uk/government/publications/school-inspection-handbook-eif" },
  ],
  "Financial Oversight": [
    { label: "DfE Schools Financial Value Standard", url: "https://www.gov.uk/guidance/schools-financial-value-standard-sfvs" },
  ],
  "Quality of Education": [
    { label: "Ofsted EIF – Quality of Education", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
    { label: "DfE Curriculum Guidance", url: "https://www.gov.uk/government/collections/national-curriculum" },
  ],
  "Behaviour & Attitudes": [
    { label: "DfE Behaviour in Schools Guidance", url: "https://www.gov.uk/government/publications/behaviour-in-schools--2" },
  ],
  "Personal Development": [
    { label: "Ofsted EIF – Personal Development", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
  ],
  "Leadership & Management": [
    { label: "Ofsted EIF – Leadership & Management", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
  ],
  "SEND & Inclusion": [
    { label: "SEND Code of Practice", url: "https://www.gov.uk/government/publications/send-code-of-practice-0-to-25" },
  ],
  "Perceivable": [
    { label: "WCAG 2.1 – Perceivable Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/perceivable" },
  ],
  "Operable": [
    { label: "WCAG 2.1 – Operable Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/operable" },
  ],
  "Understandable": [
    { label: "WCAG 2.1 – Understandable Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/understandable" },
  ],
  "Robust": [
    { label: "WCAG 2.1 – Robust Principles", url: "https://www.w3.org/WAI/WCAG21/Understanding/robust" },
  ],
  "Legal & Compliance": [
    { label: "Public Sector Bodies Accessibility Regulations", url: "https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps" },
  ],
  // H&S categories
  "Fire Safety": [
    { label: "Regulatory Reform (Fire Safety) Order 2005", url: "https://www.legislation.gov.uk/uksi/2005/1541/contents/made" },
    { label: "HSE Fire Safety in Educational Premises", url: "https://www.hse.gov.uk/risk/firesafety.htm" },
  ],
  "COSHH": [
    { label: "HSE COSHH Guidance", url: "https://www.hse.gov.uk/coshh/" },
    { label: "COSHH Regulations 2002", url: "https://www.legislation.gov.uk/uksi/2002/2677/contents/made" },
  ],
  "Premises & Facilities": [
    { label: "HSE Legionella Guidance", url: "https://www.hse.gov.uk/legionnaires/" },
    { label: "HSE Asbestos in Schools", url: "https://www.hse.gov.uk/asbestos/schools.htm" },
    { label: "Electricity at Work Regs 1989", url: "https://www.legislation.gov.uk/uksi/1989/635/contents/made" },
  ],
  "Policies & Documentation": [
    { label: "Health & Safety at Work Act 1974", url: "https://www.legislation.gov.uk/ukpga/1974/37/contents" },
    { label: "RIDDOR 2013 – HSE Guidance", url: "https://www.hse.gov.uk/riddor/" },
    { label: "Management of H&S at Work Regs 1999", url: "https://www.legislation.gov.uk/uksi/1999/3242/contents/made" },
  ],
  "Staff & Pupil Welfare": [
    { label: "HSE First Aid at Work", url: "https://www.hse.gov.uk/firstaid/" },
    { label: "Manual Handling Operations Regs 1992", url: "https://www.hse.gov.uk/pubns/indg143.htm" },
    { label: "HSE Work-related Stress Guidance", url: "https://www.hse.gov.uk/stress/" },
  ],
  "Contractors & Visitors": [
    { label: "HSE Managing Contractors", url: "https://www.hse.gov.uk/involvement/contractors.htm" },
    { label: "DfE Keeping Children Safe in Education", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
  ],
  // Digital standards categories
  "Digital Safeguarding": [
    { label: "DfE Filtering & Monitoring Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-standards-for-schools-and-colleges" },
    { label: "KCSiE 2024 – Online Safety", url: "https://www.gov.uk/government/publications/keeping-children-safe-in-education--2" },
  ],
  "Cyber Security": [
    { label: "DfE Cyber Security Standards for Schools", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/cyber-security-standards-for-schools-and-colleges" },
    { label: "NCSC Cyber Security for Schools", url: "https://www.ncsc.gov.uk/section/education-skills/schools" },
  ],
  "Data & GDPR": [
    { label: "ICO Guide to UK GDPR", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/" },
    { label: "DfE Data Protection Toolkit for Schools", url: "https://www.gov.uk/government/publications/data-protection-toolkit-for-schools" },
  ],
  "Ofsted Readiness": [
    { label: "Ofsted Education Inspection Framework", url: "https://www.gov.uk/government/publications/education-inspection-framework" },
    { label: "DfE Digital Standards for Schools", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges" },
  ],
  "Accessibility": [
    { label: "Public Sector Bodies Accessibility Regulations", url: "https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps" },
    { label: "WCAG 2.1 Guidelines", url: "https://www.w3.org/WAI/WCAG21/quickref/" },
  ],
  "Infrastructure": [
    { label: "DfE Digital & Technology Standards", url: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges" },
    { label: "ICO Guidance on Cloud Services", url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/accountability-and-governance/data-protection-by-design-and-default/" },
  ],
  "AI Signal": [
    { label: "DfE Generative AI in Education", url: "https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education" },
  ],
};

function generateRecommendations(
  toolName: string,
  schoolName: string,
  score: number,
  rating: string,
  gaps: Gap[]
): string {
  const high = gaps.filter((g) => g.priority === "high");
  const med = gaps.filter((g) => g.priority === "medium");
  const low = gaps.filter((g) => g.priority === "low");
  const cats = [...new Set(gaps.map((g) => g.category))];

  const urgency = score < 45 ? "significant and urgent" : score < 70 ? "moderate" : "minor";
  const timeframe = score < 45 ? "within the next 30 days" : score < 70 ? "within the next term" : "within the next 6 months";

  let text = `Following the completion of the ${toolName} for ${schoolName || "this school"}, the assessment returned a score of ${score}% (${rating}). `;
  text += `${gaps.length} area${gaps.length !== 1 ? "s" : ""} for improvement ${gaps.length !== 1 ? "have" : "has"} been identified, representing ${urgency} gaps in current provision.\n\n`;

  if (high.length > 0) {
    text += `IMMEDIATE ACTIONS (${high.length} High Priority)\n`;
    text += `The following areas require attention ${timeframe}:\n`;
    high.forEach((g) => {
      text += `• ${g.category}: ${g.text}\n`;
      const links = GUIDANCE_LINKS[g.category];
      if (links?.length) {
        links.forEach((l) => { text += `  → ${l.label}: ${l.url}\n`; });
      }
    });
    text += "\n";
  }

  if (med.length > 0) {
    text += `MEDIUM-TERM IMPROVEMENTS (${med.length} Medium Priority)\n`;
    med.forEach((g) => {
      text += `• ${g.category}: ${g.text}\n`;
      const links = GUIDANCE_LINKS[g.category];
      if (links?.length) {
        links.forEach((l) => { text += `  → ${l.label}: ${l.url}\n`; });
      }
    });
    text += "\n";
  }

  if (low.length > 0) {
    text += `ONGOING IMPROVEMENTS (${low.length} Lower Priority)\n`;
    low.forEach((g) => {
      text += `• ${g.category}: ${g.text}\n`;
    });
    text += "\n";
  }

  const uniqueLinks = cats
    .flatMap((c) => GUIDANCE_LINKS[c] ?? [])
    .filter((v, i, a) => a.findIndex((x) => x.url === v.url) === i)
    .slice(0, 6);

  if (uniqueLinks.length > 0) {
    text += `KEY GUIDANCE & RESOURCES\n`;
    uniqueLinks.forEach((l) => { text += `• ${l.label}: ${l.url}\n`; });
    text += "\n";
  }

  text += `RECOMMENDED NEXT STEPS\n`;
  text += `1. Share this report with the senior leadership team and governing board.\n`;
  text += `2. Assign a named lead for each high-priority action with a clear deadline.\n`;
  text += `3. Schedule a follow-up review in ${score < 55 ? "6-8 weeks" : "one term"} to assess progress.\n`;
  text += `4. Contact your SafeShield consultant for targeted support on any of the above areas.`;

  return text;
}

export type Gap = {
  category: string;
  text: string;
  priority: "high" | "medium" | "low";
};

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  gaps: Gap[];
  accentColor?: string;
  accentDim?: string;
  accentBorder?: string;
};

function priorityLabel(p: Gap["priority"]) {
  if (p === "high") return { label: "High Priority", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" };
  if (p === "medium") return { label: "Medium Priority", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
  return { label: "Lower Priority", bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" };
}

export default function ImprovementReport({
  meta,
  toolName,
  score,
  rating,
  ratingColor,
  gaps,
  accentColor = "#38BDF8",
  accentDim = "rgba(56,189,248,0.12)",
  accentBorder = "rgba(56,189,248,0.25)",
}: Props) {
  const [consultantNotes, setConsultantNotes] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [printMode, setPrintMode] = useState<"dark" | "light">("dark");
  const [schoolLogoUrl, setSchoolLogoUrl] = useState<string | null>(null);
  const [orgLogoUrl, setOrgLogoUrl] = useState<string | null>(null);
  const { enabledTools, user } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");

  useEffect(() => {
    if (!user) return;
    supabase.from("org_members").select("org_id, school_id").eq("user_id", user.id).maybeSingle().then(({ data: membership }) => {
      if (!membership) return;
      if (membership.org_id) {
        supabase.from("organisations").select("logo_url").eq("id", membership.org_id).single().then(({ data: org }) => {
          if (org?.logo_url) setOrgLogoUrl(org.logo_url);
        });
      }
      if (membership.school_id) {
        supabase.from("schools").select("logo_url").eq("id", membership.school_id).single().then(({ data: school }) => {
          if (school?.logo_url) setSchoolLogoUrl(school.logo_url);
        });
      }
    });
  }, [user]);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const displaySchoolLogo = meta.logoDataUrl || schoolLogoUrl;
  const displayOrgLogo = orgLogoUrl && orgLogoUrl !== displaySchoolLogo ? orgLogoUrl : null;

  const highGaps = gaps.filter((g) => g.priority === "high");
  const medGaps = gaps.filter((g) => g.priority === "medium");
  const lowGaps = gaps.filter((g) => g.priority === "low");

  const categories = [...new Set(gaps.map((g) => g.category))];

  function buildEmailBody() {
    const lines = [
      `${toolName} — School Improvement Report`,
      `School: ${meta.schoolName}`,
      `Staff Member: ${meta.staffMember}`,
      `Consultant: ${meta.consultantName}`,
      `Date: ${today}`,
      `Score: ${score}% — ${rating}`,
      "",
      "EXECUTIVE SUMMARY",
      `This report presents the findings from the ${toolName} completed on ${today} for ${meta.schoolName}.`,
      `The assessment returned a score of ${score}% (${rating}).`,
      "",
      "PRIORITY ACTIONS",
      ...highGaps.map((g, i) => `${i + 1}. [HIGH] ${g.category}: ${g.text}`),
      ...medGaps.map((g, i) => `${highGaps.length + i + 1}. [MEDIUM] ${g.category}: ${g.text}`),
      ...lowGaps.map((g, i) => `${highGaps.length + medGaps.length + i + 1}. [LOW] ${g.category}: ${g.text}`),
      "",
      consultantNotes ? `CONSULTANT NOTES\n${consultantNotes}` : "",
      "",
      "Generated by SafeShield Tools · SafeShield",
    ];
    return encodeURIComponent(lines.filter(Boolean).join("\n"));
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Improvement Report — ${meta.schoolName}`);
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${buildEmailBody()}`;
  }

  function handlePrintRecommendations() {
    if (!consultantNotes.trim()) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const dark = printMode === "dark";
    const bg = dark ? "linear-gradient(160deg,#060A12 0%,#0C0A1C 60%,rgba(56,189,248,0.08) 100%)" : "#fff";
    const textColor = dark ? "rgba(255,255,255,0.9)" : "#1E293B";
    const mutedColor = dark ? "rgba(255,255,255,0.5)" : "#64748B";
    const panelBg = dark ? "rgba(255,255,255,0.05)" : "#F8FAFC";
    const panelBorder = dark ? "rgba(255,255,255,0.10)" : "#E2E8F0";
    const footerColor = dark ? "rgba(255,255,255,0.25)" : "#94A3B8";

    // Format the plain text into paragraphs/sections
    const formatted = consultantNotes
      .split("\n")
      .map(line => {
        if (!line.trim()) return `<div style="height:8px"></div>`;
        if (/^[A-Z][A-Z\s&()]+$/.test(line.trim()) && line.trim().length < 80) {
          return `<p style="font-size:9px;font-weight:800;color:${accentColor};letter-spacing:0.18em;text-transform:uppercase;margin:16px 0 6px;padding-bottom:4px;border-bottom:1px solid ${accentColor}40">${line.trim()}</p>`;
        }
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          return `<div style="display:flex;gap:8px;margin-bottom:4px"><span style="color:${accentColor};flex-shrink:0">•</span><span style="font-size:12px;color:${textColor};line-height:1.6">${line.trim().replace(/^[•\-]\s*/, "")}</span></div>`;
        }
        if (/^\d+\./.test(line.trim())) {
          const num = line.trim().match(/^(\d+)\./)?.[1];
          const text = line.trim().replace(/^\d+\.\s*/, "");
          return `<div style="display:flex;gap:8px;margin-bottom:4px;align-items:flex-start"><span style="flex-shrink:0;width:18px;height:18px;border-radius:50%;background:${accentColor};display:inline-flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#000">${num}</span><span style="font-size:12px;color:${textColor};line-height:1.6">${text}</span></div>`;
        }
        if (line.trim().startsWith("→")) {
          return `<div style="margin-left:16px;margin-bottom:3px;font-size:11px;color:${mutedColor};line-height:1.5">${line.trim()}</div>`;
        }
        return `<p style="font-size:12px;color:${textColor};line-height:1.7;margin-bottom:4px">${line.trim()}</p>`;
      })
      .join("");

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Recommendations — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;min-height:297mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{width:210mm;min-height:297mm;background:${bg};padding:14mm 16mm 12mm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6mm}
.title-block p:first-child{font-size:9px;font-weight:700;color:${accentColor};letter-spacing:.2em;text-transform:uppercase;margin-bottom:4px}
.title-block p:last-child{font-size:24px;font-weight:700;color:${dark ? "#fff" : "#0F172A"};letter-spacing:-.3px}
.right-block{text-align:right}
.right-block p:first-child{font-size:12px;font-weight:600;color:${dark ? "rgba(255,255,255,0.8)" : "#1E293B"}}
.right-block p:last-child{font-size:9px;color:${mutedColor};text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
.rule{height:2px;border-radius:2px;background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.5),transparent);margin-bottom:6mm}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:3mm 8mm;padding:4mm 5mm;border-radius:12px;background:${panelBg};border:1px solid ${panelBorder};margin-bottom:6mm}
.meta-field p:first-child{font-size:8px;font-weight:700;color:${mutedColor};text-transform:uppercase;letter-spacing:.12em;margin-bottom:2px}
.meta-field p:last-child{font-size:12px;color:${dark ? "#fff" : "#1E293B"};font-weight:500}
.section-label{font-size:9px;font-weight:800;color:${accentColor};letter-spacing:.18em;text-transform:uppercase;margin-bottom:4mm;padding-bottom:3mm;border-bottom:1px solid ${accentColor}30}
.content{font-size:12px;line-height:1.7}
.footer{display:flex;justify-content:space-between;align-items:center;padding-top:4mm;margin-top:8mm;border-top:1px solid ${dark ? "rgba(255,255,255,0.07)" : "#E2E8F0"}}
.footer span{font-size:8px;color:${footerColor};letter-spacing:.1em;text-transform:uppercase}
</style></head><body>
<div class="page">
  <div class="header">
    <div class="title-block">
      <p>Consultant Recommendations</p>
      <p>${toolName}</p>
    </div>
    <div class="right-block">
      <p>${meta.consultantName || "Mathew Hewington"}</p>
      <p>Education Consultant</p>
    </div>
  </div>
  <div class="rule"></div>
  <div class="meta">
    <div class="meta-field"><p>School / Trust</p><p>${meta.schoolName || "—"}</p></div>
    <div class="meta-field"><p>Score</p><p style="color:${ratingColor};font-weight:700">${score}% — ${rating}</p></div>
    <div class="meta-field"><p>Completed By</p><p>${meta.staffMember || "—"}</p></div>
    <div class="meta-field"><p>Date</p><p>${today}</p></div>
  </div>
  <p class="section-label">Recommendations & Guidance</p>
  <div class="content">${formatted}</div>
  <div class="footer">
    <span>SafeShield · Consultant Recommendations</span>
    <span>${today}</span>
  </div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;

    const dark = printMode === "dark";
    const pc = (p: string) => p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#22c55e";
    const pl = (p: string) => p === "high" ? "High Priority" : p === "medium" ? "Medium Priority" : "Lower Priority";

    const catSections = categories.map((cat) => {
      const catGaps = gaps.filter((g) => g.category === cat);
      return `<div class="cat-block">
        <p class="cat-label">${cat}</p>
        ${catGaps.map((g) => `
          <div class="gap-row" style="border-left-color:${pc(g.priority)}">
            <span class="gap-badge" style="color:${pc(g.priority)};border-color:${pc(g.priority)}55;background:${pc(g.priority)}18">${pl(g.priority)}</span>
            <p class="gap-text">${g.text}</p>
          </div>`).join("")}
      </div>`;
    }).join("");

    const css = dark ? `
.page{background:linear-gradient(160deg,#060A12 0%,#0C0A1C 60%,${accentColor}14 100%)}
.report-tag{color:rgba(255,255,255,0.65)}
.report-title{color:#fff}
.report-sub{color:rgba(255,255,255,0.70)}
.consultant-name{color:#fff}
.consultant-role{color:rgba(255,255,255,0.65)}
.accent-rule{background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent)}
.meta-panel{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-top-color:rgba(255,255,255,0.20)}
.meta-field label{color:rgba(255,255,255,0.65)}
.meta-field span{color:#fff}
.section-heading{color:rgba(255,255,255,0.70);border-bottom:1px solid rgba(255,255,255,0.12)}
.summary-panel{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);color:rgba(255,255,255,0.85)}
.summary-panel strong{color:#fff}
.cat-label{color:rgba(255,255,255,0.70)}
.gap-row{background:rgba(255,255,255,0.04)}
.gap-text{color:rgba(255,255,255,0.85)}
.notes-panel{background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);color:rgba(255,255,255,0.85)}
.steps-panel{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09)}
.step-text{color:rgba(255,255,255,0.85)}
.footer{border-top:1px solid rgba(255,255,255,0.12)}
.footer span{color:rgba(255,255,255,0.65)}
` : `
.page{background:#fff}
.report-tag{color:#64748B}
.report-title{color:#0F172A}
.report-sub{color:#64748B}
.consultant-name{color:#1E293B}
.consultant-role{color:#64748B}
.accent-rule{background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.5),transparent)}
.meta-panel{background:#F8FAFC;border:1px solid #E2E8F0}
.meta-field label{color:#64748B}
.meta-field span{color:#1E293B}
.section-heading{color:#475569;border-bottom:1px solid #E2E8F0}
.summary-panel{background:#F8FAFC;border:1px solid #E2E8F0;color:#334155}
.summary-panel strong{color:#0F172A}
.cat-label{color:#475569}
.gap-row{background:#F8FAFC}
.gap-text{color:#334155}
.notes-panel{background:#FFFBEB;border:1px solid #FDE68A;color:#334155}
.steps-panel{background:#F8FAFC;border:1px solid #E2E8F0}
.step-text{color:#334155}
.footer{border-top:1px solid #E2E8F0}
.footer span{color:#94A3B8}
`;

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Improvement Report — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{width:210mm;min-height:297mm;padding:12mm 14mm 12mm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm}
.report-tag{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:4px}
.report-title{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1.1}
.report-sub{font-size:11px;margin-top:4px}
.header-right{text-align:right}
.consultant-name{font-size:13px;font-weight:600}
.consultant-role{font-size:9px;text-transform:uppercase;letter-spacing:.1em;margin-top:2px}
.accent-rule{height:2px;border-radius:2px;margin-bottom:7mm}
.meta-panel{border-radius:14px;padding:5mm 6mm;margin-bottom:7mm;display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm}
.meta-field label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;display:block;margin-bottom:3px}
.meta-field span{font-size:12px;font-weight:500}
.score-pill{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;color:${ratingColor};background:${ratingColor}18;border:1.5px solid ${ratingColor}88}
.section-heading{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:4mm;padding-bottom:3mm}
.summary-panel{border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;font-size:11px;line-height:1.65}
.cat-block{margin-bottom:6mm}
.cat-label{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:3mm}
.gap-row{padding:8px 12px;border-left:3px solid;border-radius:0 10px 10px 0;margin-bottom:4px}
.gap-badge{display:inline-block;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:2px 8px;border-radius:999px;border:1px solid;margin-bottom:4px}
.gap-text{font-size:11px;line-height:1.5}
.notes-panel{border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;margin-top:2mm;font-size:11px;line-height:1.6;white-space:pre-wrap}
.steps-panel{border-radius:12px;padding:4mm 5mm;margin-bottom:7mm}
.step-row{display:flex;gap:10px;margin-bottom:5px;align-items:flex-start}
.step-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#000;background:${accentColor};flex-shrink:0;margin-top:1px}
.step-text{font-size:11px;line-height:1.5}
.footer{display:flex;justify-content:space-between;align-items:center;padding-top:4mm;margin-top:6mm}
.footer span{font-size:8px;letter-spacing:.1em;text-transform:uppercase}
${css}
</style></head><body>
<div class="page">
  <div class="header">
    <div>
      <p class="report-tag">School Improvement Report</p>
      <p class="report-title">${toolName}</p>
      <p class="report-sub">${today}</p>
    </div>
    <div class="header-right">
      ${displaySchoolLogo ? `<img src="${displaySchoolLogo}" style="height:48px;max-width:120px;object-fit:contain;display:block;margin-bottom:6px;margin-left:auto"/>` : ""}
      ${displayOrgLogo ? `<img src="${displayOrgLogo}" style="height:40px;max-width:110px;object-fit:contain;display:block;margin-bottom:6px;margin-left:auto"/>` : ""}
      <p class="consultant-name">${meta.consultantName || "Mathew Hewington"}</p>
      <p class="consultant-role">Education Consultant</p>
    </div>
  </div>
  <div class="accent-rule"></div>
  <div class="meta-panel">
    <div class="meta-field"><label>School / Trust</label><span>${meta.schoolName || "—"}</span></div>
    <div class="meta-field"><label>Assessment Score</label><span class="score-pill">${score}% — ${rating}</span></div>
    <div class="meta-field"><label>Completed By</label><span>${meta.staffMember || "—"}</span></div>
    <div class="meta-field"><label>Consultant</label><span>${meta.consultantName || "Mathew Hewington"}</span></div>
  </div>
  <p class="section-heading">Executive Summary</p>
  <div class="summary-panel">
    This report presents findings from the <strong>${toolName}</strong> completed on <strong>${today}</strong> for <strong>${meta.schoolName}</strong>.
    The assessment returned a score of <strong>${score}%</strong>, rated <strong style="color:${ratingColor}">${rating}</strong>.
    <strong>${gaps.length}</strong> area${gaps.length !== 1 ? "s" : ""} for improvement ${gaps.length !== 1 ? "were" : "was"} identified,
    of which <strong style="color:#ef4444">${highGaps.length} high priority</strong>, <strong style="color:#f59e0b">${medGaps.length} medium</strong>, and <strong style="color:#22c55e">${lowGaps.length} lower priority</strong>.
  </div>
  <p class="section-heading">Priority Actions (${gaps.length})</p>
  ${catSections || `<div class="summary-panel" style="color:#22c55e">No gaps identified — excellent compliance across all areas.</div>`}
  ${consultantNotes ? `<p class="section-heading">Consultant Notes</p><div class="notes-panel">${consultantNotes}</div>` : ""}
  <p class="section-heading">Recommended Next Steps</p>
  <div class="steps-panel">
    <div class="step-row"><span class="step-num">1</span><span class="step-text">Share this report with the senior leadership team and governing board.</span></div>
    <div class="step-row"><span class="step-num">2</span><span class="step-text">Assign a named lead for each high-priority action with a clear deadline.</span></div>
    <div class="step-row"><span class="step-num">3</span><span class="step-text">Schedule a follow-up review in ${score < 55 ? "6–8 weeks" : "one term"} to assess progress.</span></div>
    <div class="step-row"><span class="step-num">4</span><span class="step-text">Contact your SafeShield consultant for targeted support on any of the above areas.</span></div>
  </div>
  <div class="footer">
    <span>SafeShield · Verified Assessment Report</span>
    <span>${today}</span>
  </div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  const glassPanel: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderTopColor: "rgba(255,255,255,0.20)",
    borderRadius: 16,
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 20px rgba(0,0,0,0.3)",
  };

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 14px",
    borderRadius: 999,
    background: `linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04)) padding-box,
      conic-gradient(from 130deg at 50% 50%,
        rgba(56,189,248,0.8), rgba(167,139,250,0.7),
        rgba(52,211,153,0.6), rgba(251,146,60,0.5),
        rgba(244,114,182,0.6), rgba(56,189,248,0.8)
      ) border-box`,
    border: "1.5px solid transparent",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#fff",
    textTransform: "uppercase" as const,
  };

  const priorityColor = (p: string) => p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#22c55e";
  const priorityText = (p: string) => p === "high" ? "High Priority" : p === "medium" ? "Medium Priority" : "Lower Priority";

  return (
    <div style={{
      position: "relative",
      borderRadius: 24,
      overflow: "hidden",
      background: `linear-gradient(145deg, #060A12 0%, #0D0A1A 50%, ${accentColor}18 100%)`,
      boxShadow: `0 0 0 1px rgba(255,255,255,0.07), 0 20px 60px rgba(0,0,0,0.6), 0 0 50px ${accentColor}18`,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Ambient glow blobs */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: "28px 28px 0", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>
              School Improvement Report
            </p>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.4px", lineHeight: 1.15 }}>{toolName}</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.70)", marginTop: 3 }}>{today}</p>
          </div>
          {/* Logos */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 16 }}>
            {displaySchoolLogo && (
              <img src={displaySchoolLogo} alt="School logo"
                style={{ height: 44, maxWidth: 110, objectFit: "contain" }} />
            )}
            {displayOrgLogo && (
              <img src={displayOrgLogo} alt="Org logo"
                style={{ height: 44, maxWidth: 110, objectFit: "contain" }} />
            )}
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ ...glassPanel, padding: "6px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.85)", flexShrink: 0, marginLeft: 12 }}>
            {expanded ? <><ChevronUp size={14} /> Collapse</> : <><ChevronDown size={14} /> Expand</>}
          </button>
        </div>

        {/* Accent rule */}
        <div style={{ height: 2, borderRadius: 2, background: `linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent)`, marginBottom: 20 }} />
      </div>

      {expanded && (
        <div style={{ padding: "0 28px 28px", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Meta grid */}
          <div style={{ ...glassPanel, padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            {[
              { label: "School / Trust", value: meta.schoolName || "—" },
              { label: "Assessment Score", value: null, pill: true },
              { label: "Completed By", value: meta.staffMember || "—" },
              { label: "Consultant", value: meta.consultantName || "Mathew Hewington" },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>{item.label}</p>
                {item.pill ? (
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 12px", borderRadius: 999,
                    fontSize: 11, fontWeight: 700, color: ratingColor, background: `${ratingColor}18`, border: `1.5px solid ${ratingColor}88` }}>
                    {score}% — {rating}
                  </span>
                ) : (
                  <p style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Executive summary */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Executive Summary
            </p>
            <div style={{ ...glassPanel, padding: "14px 18px", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>
              Assessment completed for <strong style={{ color: "rgba(255,255,255,0.85)" }}>{meta.schoolName}</strong> on {today}.
              Score: <strong style={{ color: "rgba(255,255,255,0.85)" }}>{score}%</strong> — <strong style={{ color: ratingColor }}>{rating}</strong>.{" "}
              <strong style={{ color: "#ef4444" }}>{highGaps.length} high</strong>,{" "}
              <strong style={{ color: "#f59e0b" }}>{medGaps.length} medium</strong>, and{" "}
              <strong style={{ color: "#22c55e" }}>{lowGaps.length} lower</strong> priority areas identified.
            </div>
          </div>

          {/* Priority actions */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Priority Actions ({gaps.length})
            </p>
            {categories.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {categories.map((cat) => (
                  <div key={cat}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>{cat}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {gaps.filter(g => g.category === cat).map((g, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px",
                          borderLeft: `3px solid ${priorityColor(g.priority)}`,
                          borderRadius: "0 12px 12px 0",
                          background: `${priorityColor(g.priority)}0A` }}>
                          <span style={{ flexShrink: 0, fontSize: 8, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
                            padding: "2px 8px", borderRadius: 999,
                            color: priorityColor(g.priority),
                            background: `${priorityColor(g.priority)}18`,
                            border: `1px solid ${priorityColor(g.priority)}55`,
                            whiteSpace: "nowrap", marginTop: 1 }}>
                            {priorityText(g.priority)}
                          </span>
                          <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.6, margin: 0 }}>{g.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ ...glassPanel, padding: "14px 18px", color: "#22c55e", fontSize: 12 }}>
                No gaps identified — excellent compliance across all areas.
              </div>
            )}
          </div>

          {/* Consultant notes */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Consultant Notes <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>(optional)</span>
              </p>
              {isSuperAdmin && (
                <button
                  onClick={() => setConsultantNotes(generateRecommendations(toolName, meta.schoolName, score, rating, gaps))}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 10, cursor: "pointer",
                    background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, fontSize: 11, fontWeight: 600 }}>
                  <Sparkles size={11} /> Generate Recommendations
                </button>
              )}
            </div>
            <textarea
              value={consultantNotes}
              onChange={(e) => setConsultantNotes(e.target.value)}
              rows={6}
              placeholder="Click 'Generate Recommendations' to auto-fill, or type your own notes here..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 12, color: "#fff",
                background: "rgba(255,255,255,0.04)", border: `1px solid ${consultantNotes ? accentBorder : "rgba(255,255,255,0.10)"}`,
                outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }}
            />
            {consultantNotes.trim() && (
              <button
                onClick={handlePrintRecommendations}
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}35`, color: accentColor }}
              >
                <Printer size={12} /> Print Recommendations
              </button>
            )}
          </div>

          {/* Recommended next steps */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.80)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Recommended Next Steps
            </p>
            <div style={{ ...glassPanel, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Share this report with the senior leadership team and governing board.",
                "Assign a named lead for each high-priority action with a clear deadline.",
                `Schedule a follow-up review in ${score < 55 ? "6–8 weeks" : "one term"} to assess progress.`,
                "Contact your SafeShield consultant for targeted support on any of the above areas.",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: accentColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: "#000", marginTop: 1 }}>{i + 1}</span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, paddingTop: 4 }}>
            {/* Print mode toggle */}
            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.10)", flexShrink: 0 }}>
              <button onClick={() => setPrintMode("dark")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", cursor: "pointer", border: "none",
                  background: printMode === "dark" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: printMode === "dark" ? "#fff" : "#64748B", fontSize: 11, fontWeight: 600 }}>
                <Moon size={11} /> Dark
              </button>
              <button onClick={() => setPrintMode("light")}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", cursor: "pointer", border: "none",
                  background: printMode === "light" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: printMode === "light" ? "#fff" : "#64748B", fontSize: 11, fontWeight: 600 }}>
                <Sun size={11} /> Light
              </button>
            </div>
            <button onClick={handlePrint}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor, fontSize: 13, fontWeight: 600 }}>
              <Printer size={14} /> Print / Save PDF
            </button>
            {(meta.schoolEmail || meta.consultantEmail) && (
              <button onClick={handleEmail}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, cursor: "pointer",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>
                <Mail size={14} /> Email Report
              </button>
            )}
          </div>

          {/* Footer ref */}
          <div style={{ paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.10)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.70)", letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>SafeShield · Verified Assessment Report</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.70)", letterSpacing: "0.08em" }}>{today}</span>
          </div>
        </div>
      )}
    </div>
  );
}
