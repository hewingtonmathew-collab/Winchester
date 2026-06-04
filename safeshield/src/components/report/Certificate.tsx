"use client";
import { useRef } from "react";
import { Printer, Mail } from "lucide-react";
import type { ReportMetaData } from "./ReportMeta";

type Props = {
  meta: ReportMetaData;
  toolName: string;
  score: number;
  rating: string;
  ratingColor: string;
  date?: string;
  accentColor?: string;
  areas?: { name: string; score?: number }[];
};

export default function Certificate({ meta, toolName, score, rating, ratingColor, date, accentColor = "#38BDF8", areas }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `MH-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    const areasHtml = areas && areas.length > 0
      ? `<div class="areas-block">
          <p class="areas-heading">Audit areas covered</p>
          <table class="areas-table">
            ${areas.map(a => `<tr><td class="area-name">${a.name}</td>${a.score !== undefined ? `<td class="area-score">${a.score}%</td>` : "<td></td>"}</tr>`).join("")}
          </table>
        </div>`
      : "";
    const logoHtml = meta.logoDataUrl
      ? `<img src="${meta.logoDataUrl}" alt="School logo" class="school-logo-img" />`
      : `<div class="school-logo-placeholder"></div>`;

    w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Certificate — ${toolName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    html, body {
      width: 210mm;
      height: 297mm;
      background: #ffffff;
      font-family: Georgia, 'Times New Roman', serif;
      color: #1a1a1a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      padding: 18mm 20mm 14mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14mm;
    }
    .school-logo-img { height: 64px; object-fit: contain; }
    .school-logo-placeholder { width: 64px; height: 64px; }
    .consultant-brand {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }
    .consultant-name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.3px;
    }
    .consultant-title {
      font-size: 10px;
      color: #888888;
      letter-spacing: 0.5px;
    }

    .cert-body { flex: 1; display: flex; gap: 14mm; }
    .cert-main { flex: 1; }

    .the-text { font-size: 14px; color: #1a1a1a; margin-bottom: 6px; }
    .cert-title {
      font-size: 22px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1.3;
      color: #1a1a1a;
      margin-bottom: 8mm;
      max-width: 120mm;
    }
    .completed-line { font-size: 14px; font-style: italic; color: #555555; margin-bottom: 5mm; }
    .school-name { font-size: 30px; font-style: italic; font-weight: 600; color: #1a1a1a; margin-bottom: 6mm; }
    .detail-line { font-size: 13px; color: #444444; margin-bottom: 4px; }
    .label { color: #888888; }
    .score-wrap {
      font-size: 13px; color: #444444; margin-bottom: 8mm;
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    }
    .score-badge {
      color: ${ratingColor};
      background: #000000;
      border: 2px solid ${ratingColor};
      padding: 3px 12px;
      border-radius: 5px;
      font-weight: 700;
      font-size: 13px;
      display: inline-block;
    }
    .date-line { font-size: 13px; color: #1a1a1a; margin-top: 8mm; }

    /* Areas panel */
    .areas-block {
      width: 62mm;
      flex-shrink: 0;
      border-left: 3px solid #e5e7eb;
      padding-left: 8mm;
      padding-top: 2mm;
    }
    .areas-heading {
      font-size: 10px;
      font-weight: 700;
      color: #888888;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
      margin-bottom: 5mm;
    }
    .areas-table { border-collapse: collapse; width: 100%; }
    .areas-table tr { border-bottom: 1px solid #f0f0f0; }
    .areas-table tr:last-child { border-bottom: none; }
    .area-name { font-size: 11px; color: #333333; padding: 3px 0; }
    .area-score { font-size: 11px; font-weight: 700; color: #1a1a1a; text-align: right; padding: 3px 0; white-space: nowrap; }

    /* Signature */
    .sig-section { display: flex; justify-content: flex-end; margin-top: 10mm; }
    .sig-block { text-align: left; min-width: 52mm; }
    .sig-rule { width: 52mm; height: 1px; background: #1a1a1a; margin-bottom: 4px; }
    .sig-name { font-size: 12px; font-style: italic; color: #1a1a1a; }
    .sig-role { font-size: 10px; color: #888888; margin-top: 2px; }

    /* Cert ref */
    .cert-ref {
      text-align: right;
      font-size: 9px;
      color: #bbbbbb;
      letter-spacing: 1px;
      font-family: Arial, sans-serif;
      margin-top: auto;
      padding-top: 8mm;
    }
  </style>
</head>
<body>
<div class="page">

  <div class="top-bar">
    <div>${logoHtml}</div>
    <div class="consultant-brand">
      <span class="consultant-name">Mathew Hewington</span>
      <span class="consultant-title">Education Consultant</span>
    </div>
  </div>

  <div class="cert-body">
    <div class="cert-main">
      <p class="the-text">The</p>
      <p class="cert-title">${toolName}<br/>Assessment Certificate</p>
      <p class="completed-line">has been completed by</p>
      <p class="school-name">${meta.schoolName || "School Name"}</p>
      <p class="detail-line"><span class="label">Completed by: </span>${meta.staffMember || "—"}</p>
      <div class="score-wrap">
        <span class="label">Assessment score:</span>
        <span class="score-badge">${score}% — ${rating}</span>
      </div>
      <p class="date-line">${today}</p>
    </div>

    ${areasHtml}
  </div>

  <div class="sig-section">
    <div class="sig-block">
      <div class="sig-rule"></div>
      <p class="sig-name">${meta.consultantName || "Mathew Hewington"}</p>
      <p class="sig-role">Education Consultant</p>
    </div>
  </div>

  <p class="cert-ref">${certId}</p>

</div>
</body>
</html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const areasLine = areas && areas.length > 0 ? `\nAudit areas covered:\n${areas.map(a => `  • ${a.name}${a.score !== undefined ? ` — ${a.score}%` : ""}`).join("\n")}` : "";
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find attached your ${toolName} assessment certificate.\n\nTo save as PDF: open the tool, complete the assessment, click "Print / Save PDF" and choose "Save as PDF" from the print dialog.\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nCompleted by: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nScore:        ${score}% — ${rating}${areasLine}\nDate:         ${today}\nCertificate:  ${certId}\n\nKind regards,\n${meta.consultantName || "Mathew Hewington"}\nEducation Consultant`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      <div ref={certRef}
        style={{ background: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "36px 40px", fontFamily: "Georgia, serif", color: "#1a1a1a", minHeight: 560, display: "flex", flexDirection: "column" }}>

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            {meta.logoDataUrl
              ? <img src={meta.logoDataUrl} alt="Logo" style={{ height: 60, objectFit: "contain" }} />
              : <div style={{ width: 60, height: 60 }} />
            }
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Mathew Hewington</span>
            <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.5px" }}>Education Consultant</span>
          </div>
        </div>

        {/* Body — main + areas panel side by side */}
        <div style={{ flex: 1, display: "flex", gap: 40 }}>

          {/* Main content */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 10 }}>The</p>
            <p style={{ fontSize: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", lineHeight: 1.35, color: "#1a1a1a", marginBottom: 24, maxWidth: 320 }}>
              {toolName}<br />Assessment Certificate
            </p>
            <p style={{ fontSize: 14, fontStyle: "italic", color: "#555", marginBottom: 14 }}>has been completed by</p>
            <p style={{ fontSize: 28, fontStyle: "italic", fontWeight: 600, color: "#1a1a1a", marginBottom: 20 }}>{meta.schoolName || "School Name"}</p>
            <p style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>
              <span style={{ color: "#888" }}>Completed by: </span>{meta.staffMember || "—"}
            </p>
            <p style={{ fontSize: 13, color: "#444", marginBottom: 24, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: "#888" }}>Assessment score:</span>
              <span style={{ color: ratingColor, background: "#000", border: `2px solid ${ratingColor}`, padding: "3px 12px", borderRadius: 5, fontWeight: 700, fontSize: 13 }}>{score}% — {rating}</span>
            </p>
            <p style={{ fontSize: 13, color: "#1a1a1a" }}>{today}</p>
          </div>

          {/* Areas panel */}
          {areas && areas.length > 0 && (
            <div style={{ width: 200, flexShrink: 0, borderLeft: "3px solid #e5e7eb", paddingLeft: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "system-ui, sans-serif", marginBottom: 14 }}>Audit areas covered</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {areas.map((a) => (
                  <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0f0f0", paddingBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "#333" }}>{a.name}</span>
                    {a.score !== undefined && <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", marginLeft: 8 }}>{a.score}%</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32, marginBottom: 16 }}>
          <div style={{ textAlign: "left", minWidth: 160 }}>
            <div style={{ width: "100%", height: 1, background: "#1a1a1a", marginBottom: 4 }} />
            <p style={{ fontSize: 12, fontStyle: "italic", color: "#1a1a1a" }}>{meta.consultantName || "Mathew Hewington"}</p>
            <p style={{ fontSize: 10, color: "#888", marginTop: 1 }}>Education Consultant</p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 9, color: "#bbb", letterSpacing: "1px", fontFamily: "system-ui" }}>{certId}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
          <Printer size={14} /> Print / Save PDF
        </button>
        {(meta.schoolEmail || meta.consultantEmail) && (
          <button onClick={handleEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20">
            <Mail size={14} /> Email Certificate
          </button>
        )}
      </div>
      <p className="text-[#475569] text-xs">To email the PDF: use "Print / Save PDF" first, then attach the saved file to your email.</p>
    </div>
  );
}
