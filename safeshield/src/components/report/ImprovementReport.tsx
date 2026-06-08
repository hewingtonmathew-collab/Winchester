"use client";
import { useState } from "react";
import { Mail, Printer, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { ReportMetaData } from "./ReportMeta";
import { useAuth } from "@/context/AuthContext";

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
  const { enabledTools } = useAuth();
  const isSuperAdmin = enabledTools.includes("*");
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

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

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;

    const priorityColor = (p: string) => p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#22c55e";
    const priorityLabel2 = (p: string) => p === "high" ? "High Priority" : p === "medium" ? "Medium Priority" : "Lower Priority";

    const catSections = categories.map((cat) => {
      const catGaps = gaps.filter((g) => g.category === cat);
      return `<div class="cat-block">
        <p class="cat-label">${cat}</p>
        ${catGaps.map((g) => `
          <div class="gap-row" style="border-left-color:${priorityColor(g.priority)}">
            <span class="gap-badge" style="color:${priorityColor(g.priority)};border-color:${priorityColor(g.priority)}55;background:${priorityColor(g.priority)}18">${priorityLabel2(g.priority)}</span>
            <p class="gap-text">${g.text}</p>
          </div>`).join("")}
      </div>`;
    }).join("");

    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Improvement Report — ${toolName}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@page{size:A4 portrait;margin:0}
html,body{width:210mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-family:system-ui,-apple-system,sans-serif}
.page{
  width:210mm;min-height:297mm;
  background:linear-gradient(160deg,#060A12 0%,#0C0A1C 60%,${accentColor}14 100%);
  padding:12mm 14mm 12mm;
  position:relative;
}
.blob-tr{position:fixed;top:-40mm;right:-40mm;width:120mm;height:120mm;border-radius:50%;
  background:radial-gradient(circle,${accentColor}25 0%,transparent 70%);pointer-events:none}
.blob-bl{position:fixed;bottom:20mm;left:-30mm;width:90mm;height:90mm;border-radius:50%;
  background:radial-gradient(circle,rgba(167,139,250,0.18) 0%,transparent 70%);pointer-events:none}

/* header */
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm;position:relative;z-index:1}
.report-tag{font-size:9px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:.18em;text-transform:uppercase;margin-bottom:4px}
.report-title{font-size:26px;font-weight:700;color:#fff;letter-spacing:-.5px;line-height:1.1}
.report-sub{font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px}
.header-right{text-align:right}
.consultant-name{font-size:13px;font-weight:600;color:rgba(255,255,255,0.75)}
.consultant-role{font-size:9px;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:.1em;margin-top:2px}

/* accent rule */
.accent-rule{height:2px;border-radius:2px;background:linear-gradient(90deg,${accentColor},rgba(167,139,250,0.6),transparent);margin-bottom:7mm;position:relative;z-index:1}

/* meta panel */
.meta-panel{
  background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
  border-top-color:rgba(255,255,255,0.20);border-radius:14px;
  padding:5mm 6mm;margin-bottom:7mm;
  display:grid;grid-template-columns:1fr 1fr;gap:4mm 8mm;
  position:relative;z-index:1;
}
.meta-field label{font-size:8px;font-weight:700;color:rgba(255,255,255,0.28);text-transform:uppercase;letter-spacing:.14em;display:block;margin-bottom:3px}
.meta-field span{font-size:12px;color:rgba(255,255,255,0.78);font-weight:500}
.score-pill{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;
  font-size:12px;font-weight:700;color:${ratingColor};
  background:${ratingColor}18;border:1.5px solid ${ratingColor}88}

/* section heading */
.section-heading{
  font-size:9px;font-weight:700;color:rgba(255,255,255,0.3);
  letter-spacing:.18em;text-transform:uppercase;
  margin-bottom:4mm;padding-bottom:3mm;
  border-bottom:1px solid rgba(255,255,255,0.07);
  position:relative;z-index:1;
}

/* summary panel */
.summary-panel{
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);
  border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;
  font-size:11px;color:rgba(255,255,255,0.65);line-height:1.65;
  position:relative;z-index:1;
}
.summary-panel strong{color:rgba(255,255,255,0.85);font-weight:600}

/* gap categories */
.cat-block{margin-bottom:6mm;position:relative;z-index:1}
.cat-label{font-size:9px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:.16em;text-transform:uppercase;margin-bottom:3mm}
.gap-row{
  padding:8px 12px;border-left:3px solid;border-radius:0 10px 10px 0;
  margin-bottom:4px;background:rgba(255,255,255,0.04);
}
.gap-badge{display:inline-block;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
  padding:2px 8px;border-radius:999px;border:1px solid;margin-bottom:4px}
.gap-text{font-size:11px;color:rgba(255,255,255,0.7);line-height:1.5}

/* notes panel */
.notes-panel{
  background:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.2);
  border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;margin-top:2mm;
  font-size:11px;color:rgba(255,255,255,0.7);line-height:1.6;white-space:pre-wrap;
  position:relative;z-index:1;
}

/* next steps */
.steps-panel{
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
  border-radius:12px;padding:4mm 5mm;margin-bottom:7mm;
  position:relative;z-index:1;
}
.step-row{display:flex;gap:10px;margin-bottom:5px;align-items:flex-start}
.step-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:9px;font-weight:700;color:#000;background:${accentColor};flex-shrink:0;margin-top:1px}
.step-text{font-size:11px;color:rgba(255,255,255,0.65);line-height:1.5}

/* footer */
.footer{
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid rgba(255,255,255,0.07);padding-top:4mm;margin-top:6mm;
  position:relative;z-index:1;
}
.footer span{font-size:8px;color:rgba(255,255,255,0.2);letter-spacing:.1em;text-transform:uppercase}
</style></head><body>
<div class="page">
  <div class="blob-tr"></div>
  <div class="blob-bl"></div>

  <div class="header">
    <div>
      <p class="report-tag">School Improvement Report</p>
      <p class="report-title">${toolName}</p>
      <p class="report-sub">${today}</p>
    </div>
    <div class="header-right">
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

  return (
    <GlassCard>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between mb-1"
      >
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
          Improvement Report
        </h3>
        {expanded ? <ChevronUp size={16} className="text-[#64748B]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
      </button>
      <p className="text-[#475569] text-xs mb-4">Tailored recommendations for {meta.schoolName || "this school"}.</p>

      {expanded && (
        <div className="flex flex-col gap-4">
          {/* Meta summary */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            {[
              { label: "School", value: meta.schoolName || "—" },
              { label: "Score", value: `${score}% — ${rating}`, color: ratingColor, pill: true },
              { label: "Staff Member", value: meta.staffMember || "—" },
              { label: "Consultant", value: meta.consultantName || "—" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[#475569] text-[0.6rem] uppercase tracking-wider mb-0.5">{item.label}</p>
                {(item as { pill?: boolean }).pill && item.color ? (
                  <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ color: item.color, background: "#000", border: `2px solid ${item.color}` }}>
                    {item.value}
                  </span>
                ) : (
                  <p className="text-xs font-medium" style={{ color: item.color ?? "#CBD5E1" }}>{item.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Gaps by category */}
          {categories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {categories.map((cat) => (
                <div key={cat}>
                  <p className="text-[#475569] text-[0.6rem] uppercase tracking-widest font-semibold mb-2">{cat}</p>
                  <div className="flex flex-col gap-2">
                    {gaps.filter((g) => g.category === cat).map((g, i) => {
                      const p = priorityLabel(g.priority);
                      return (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${p.bg} ${p.border}`}>
                          <span className={`shrink-0 text-[0.6rem] font-bold px-1.5 py-0.5 rounded uppercase ${p.bg} ${p.text} border ${p.border}`}>
                            {p.label}
                          </span>
                          <p className="text-[#94A3B8] text-xs leading-relaxed">{g.text}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#34D399] text-sm">No gaps identified — excellent compliance across all areas.</p>
          )}

          {/* Consultant notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#CBD5E1] text-sm">Consultant Notes <span className="text-[#475569] font-normal">(optional)</span></label>
              {isSuperAdmin && (
                <button
                  onClick={() => setConsultantNotes(generateRecommendations(toolName, meta.schoolName, score, rating, gaps))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}
                >
                  <Sparkles size={12} /> Generate Recommendations
                </button>
              )}
            </div>
            <p className="text-[#475569] text-xs mb-2">Auto-generate recommendations with guidance links, or write your own notes below.</p>
            <textarea
              value={consultantNotes}
              onChange={(e) => setConsultantNotes(e.target.value)}
              rows={8}
              placeholder="Click 'Generate Recommendations' to auto-fill based on the assessment gaps, or type your own consultant notes here..."
              className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/[0.04] border border-white/10 focus:outline-none transition-colors resize-none placeholder:text-[#475569]"
              style={{ borderColor: consultantNotes ? accentBorder : undefined }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: accentDim, border: `1px solid ${accentBorder}`, color: accentColor }}
            >
              <Printer size={14} /> Print / Save Report
            </button>
            {(meta.schoolEmail || meta.consultantEmail) && (
              <button
                onClick={handleEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20 transition-all"
              >
                <Mail size={14} /> Email Report
              </button>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
