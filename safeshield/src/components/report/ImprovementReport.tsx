"use client";
import { useState } from "react";
import { Mail, Printer, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { ReportMetaData } from "./ReportMeta";

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
    const catSections = categories.map((cat) => {
      const catGaps = gaps.filter((g) => g.category === cat);
      return `
        <div style="margin-bottom:16px">
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px">${cat}</p>
          ${catGaps.map((g) => `
            <div style="padding:10px 12px;border-left:3px solid ${g.priority === "high" ? "#ef4444" : g.priority === "medium" ? "#f59e0b" : "#22c55e"};margin-bottom:8px;background:#f8fafc;border-radius:0 6px 6px 0">
              <span style="font-size:9px;font-weight:700;color:${g.priority === "high" ? "#ef4444" : g.priority === "medium" ? "#f59e0b" : "#22c55e"};text-transform:uppercase">${g.priority} priority</span>
              <p style="font-size:12px;color:#1e293b;margin-top:3px">${g.text}</p>
            </div>
          `).join("")}
        </div>
      `;
    }).join("");

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Improvement Report — ${toolName}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; color: #1e293b; padding: 20mm 24mm; font-size: 12px; }
        h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
        h2 { font-size: 14px; font-weight: 700; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 2px; color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin: 16px 0; padding: 16px; background: #f8fafc; border-radius: 8px; }
        .meta-item label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 2px; }
        .score-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 14px; margin: 12px 0; }
        .notes { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px; margin-top: 8px; white-space: pre-wrap; font-size: 12px; }
        .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
      </style>
      </head><body>
        <h1>${toolName}</h1>
        <p style="color:#64748b;font-size:12px">School Improvement Report · ${today}</p>
        <div class="meta-grid">
          <div class="meta-item"><label>School / Trust</label><strong>${meta.schoolName}</strong></div>
          <div class="meta-item"><label>Rating</label><strong style="color:${ratingColor};background:#000;border:2px solid ${ratingColor};padding:2px 10px;border-radius:4px;display:inline-block">${score}% — ${rating}</strong></div>
          <div class="meta-item"><label>Staff Member</label>${meta.staffMember}</div>
          <div class="meta-item"><label>Consultant</label>${meta.consultantName}, SafeShield</div>
        </div>

        <h2>Executive Summary</h2>
        <p>This report presents the findings from the ${toolName} completed on ${today} for ${meta.schoolName}. The assessment returned a score of <strong>${score}%</strong>, rated as <strong style="color:${ratingColor}">${rating}</strong>. ${gaps.length} area${gaps.length !== 1 ? "s" : ""} for improvement ${gaps.length !== 1 ? "were" : "was"} identified, of which ${highGaps.length} ${highGaps.length !== 1 ? "are" : "is"} high priority.</p>

        <h2>Priority Actions (${gaps.length})</h2>
        ${catSections || "<p style='color:#64748b'>No gaps identified — excellent compliance.</p>"}

        ${consultantNotes ? `<h2>Consultant Notes</h2><div class="notes">${consultantNotes}</div>` : ""}

        <h2>Next Steps</h2>
        <p>SafeShield recommends that ${meta.schoolName} addresses the high-priority actions within 30 days and schedules a follow-up review within 3 months. The consultant named above is available to provide targeted support across all identified areas.</p>

        <div class="footer">
          <span>Generated by SafeShield Tools · SafeShield</span>
          <span>${today}</span>
        </div>
      </body></html>
    `);
    w.document.close();
    w.print();
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
              <button
                onClick={() => setConsultantNotes(generateRecommendations(toolName, meta.schoolName, score, rating, gaps))}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}
              >
                <Sparkles size={12} /> Generate Recommendations
              </button>
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
