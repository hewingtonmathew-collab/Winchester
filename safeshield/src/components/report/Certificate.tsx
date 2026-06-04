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
  const certId = `SS-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    const areasHtml = areas && areas.length > 0
      ? `<div class="areas-block"><p class="areas-heading">Key stages assessed:</p><ul class="areas-list">${areas.map(a => `<li><span class="area-name">${a.name}</span>${a.score !== undefined ? `<span class="area-score">${a.score}%</span>` : ""}</li>`).join("")}</ul></div>`
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

    /* ── Page wrapper ── */
    .page {
      width: 210mm;
      height: 297mm;
      padding: 18mm 20mm 14mm;
      background: #ffffff;
      display: flex;
      flex-direction: column;
    }

    /* ── Top bar ── */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14mm;
    }
    .school-logo-img { height: 64px; object-fit: contain; }
    .school-logo-placeholder { width: 64px; height: 64px; }
    .brand {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .brand-icon {
      width: 26px;
      height: 26px;
      border: 2px solid #1a1a1a;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-name {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.3px;
    }
    .brand-sub {
      font-size: 10px;
      color: #888888;
      letter-spacing: 0.5px;
    }

    /* ── Body ── */
    .cert-body { flex: 1; }
    .the-text {
      font-size: 14px;
      color: #1a1a1a;
      margin-bottom: 6px;
    }
    .cert-title {
      font-size: 22px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1.3;
      color: #1a1a1a;
      margin-bottom: 8mm;
      max-width: 150mm;
    }
    .completed-line {
      font-size: 14px;
      font-style: italic;
      color: #555555;
      margin-bottom: 5mm;
    }
    .school-name {
      font-size: 30px;
      font-style: italic;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 6mm;
    }
    .detail-line {
      font-size: 13px;
      color: #444444;
      margin-bottom: 4px;
    }
    .label { color: #888888; }
    .score-wrap {
      font-size: 13px;
      color: #444444;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
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
    .areas-block {
      margin-top: 6px;
      margin-bottom: 8mm;
    }
    .areas-heading {
      font-size: 11px;
      color: #888888;
      margin-bottom: 4px;
      font-style: italic;
    }
    .areas-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
    }
    .areas-list li {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #444444;
    }
    .area-name { }
    .area-score {
      font-weight: 700;
      color: #1a1a1a;
      font-size: 10px;
    }
    .date-line {
      font-size: 13px;
      color: #1a1a1a;
      margin-top: 6mm;
      margin-bottom: 0;
    }

    /* ── Signature ── */
    .sig-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 8mm;
      margin-top: 6mm;
    }
    .sig-block { text-align: left; min-width: 52mm; }
    .sig-rule { width: 52mm; height: 1px; background: #1a1a1a; margin-bottom: 4px; }
    .sig-name { font-size: 12px; font-style: italic; color: #1a1a1a; }
    .sig-role { font-size: 10px; color: #888888; margin-top: 2px; letter-spacing: 0.3px; }

    /* ── Bottom ── */
    .bottom-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      margin-top: auto;
    }

    /* Ribbon */
    .ribbon-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 12px;
    }
    .ribbon {
      display: inline-flex;
      align-items: center;
    }
    .ribbon-tail-l {
      width: 0; height: 0;
      border-top: 13px solid #1a1a1a;
      border-bottom: 13px solid #1a1a1a;
      border-right: 9px solid transparent;
      margin-right: -1px;
    }
    .ribbon-body {
      background: #1a1a1a;
      padding: 5px 18px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .ribbon-text {
      font-size: 9px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-family: Arial, sans-serif;
    }
    .ribbon-tail-r {
      width: 0; height: 0;
      border-top: 13px solid #1a1a1a;
      border-bottom: 13px solid #1a1a1a;
      border-left: 9px solid transparent;
      margin-left: -1px;
    }

    /* Logos row */
    .logos-row {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 32px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .dfe-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dfe-rule { width: 1px; height: 40px; background: #111111; }
    .dfe-text { display: flex; flex-direction: column; }
    .dfe-text span {
      font-size: 13px;
      font-weight: 400;
      color: #111111;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.4;
      white-space: nowrap;
    }
    .ico-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    .ico-main {
      font-size: 36px;
      font-weight: 900;
      color: #003078;
      font-family: 'Arial Black', Arial, sans-serif;
      line-height: 1;
      letter-spacing: -1.5px;
    }
    .ico-sub {
      font-size: 7px;
      color: #003078;
      font-family: Arial, sans-serif;
      line-height: 1.3;
      max-width: 85px;
    }

    /* Cert ref */
    .cert-ref {
      text-align: right;
      font-size: 9px;
      color: #bbbbbb;
      letter-spacing: 1px;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Top bar -->
  <div class="top-bar">
    <div>${logoHtml}</div>
    <div class="brand">
      <div class="brand-row">
        <div class="brand-icon">
          <svg width="13" height="13" viewBox="0 0 14 14">
            <path d="M7 1.5l4.5 2.25v4c0 2.25-1.8 4-4.5 5C4.3 11.75 2.5 10 2.5 7.75v-4L7 1.5z" fill="none" stroke="#1a1a1a" stroke-width="1.3"/>
          </svg>
        </div>
        <span class="brand-name">SafeShield</span>
      </div>
      <span class="brand-sub">Assessment Tools</span>
    </div>
  </div>

  <!-- Body -->
  <div class="cert-body">
    <p class="the-text">The</p>
    <p class="cert-title">${toolName}<br/>Assessment Certificate</p>
    <p class="completed-line">has been completed by</p>
    <p class="school-name">${meta.schoolName || "School Name"}</p>
    <p class="detail-line"><span class="label">Completed by: </span>${meta.staffMember || "—"}</p>
    <div class="score-wrap">
      <span class="label">Assessment score:</span>
      <span class="score-badge">${score}% — ${rating}</span>
    </div>
    ${areasHtml}
    <p class="date-line">${today}</p>
  </div>

  <!-- Signature -->
  <div class="sig-section">
    <div class="sig-block">
      <div class="sig-rule"></div>
      <p class="sig-name">${meta.consultantName || "Consultant"}</p>
      <p class="sig-role">Consultant, SafeShield</p>
    </div>
  </div>

  <!-- Bottom -->
  <div class="bottom-section">

    <!-- Centre of Excellence ribbon -->
    <div class="ribbon-wrap">
      <div class="ribbon">
        <div class="ribbon-tail-l"></div>
        <div class="ribbon-body">
          <svg width="12" height="12" viewBox="0 0 14 14"><polygon points="7,1 8.8,5.5 13.5,5.5 9.8,8.5 11.2,13 7,10.2 2.8,13 4.2,8.5 0.5,5.5 5.2,5.5" fill="#D4AF37"/></svg>
          <span class="ribbon-text">Centre of Excellence</span>
          <svg width="12" height="12" viewBox="0 0 14 14"><polygon points="7,1 8.8,5.5 13.5,5.5 9.8,8.5 11.2,13 7,10.2 2.8,13 4.2,8.5 0.5,5.5 5.2,5.5" fill="#D4AF37"/></svg>
        </div>
        <div class="ribbon-tail-r"></div>
      </div>
    </div>

    <!-- Logos -->
    <div class="logos-row">

      <!-- Ofsted -->
      <svg viewBox="0 0 240 108" width="130" height="58" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="86" cy="17" rx="5.5" ry="6.5" fill="#3a9bc1"/>
        <line x1="86" y1="26" x2="68" y2="21" stroke="#3a9bc1" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="26" x2="104" y2="21" stroke="#3a9bc1" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="26" x2="76" y2="44" stroke="#3a9bc1" stroke-width="5" stroke-linecap="round"/>
        <line x1="86" y1="26" x2="96" y2="44" stroke="#3a9bc1" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="132" cy="11" rx="7" ry="8.5" fill="#3a9bc1"/>
        <line x1="132" y1="22" x2="109" y2="16" stroke="#3a9bc1" stroke-width="6.5" stroke-linecap="round"/>
        <line x1="132" y1="22" x2="155" y2="16" stroke="#3a9bc1" stroke-width="6.5" stroke-linecap="round"/>
        <line x1="132" y1="22" x2="119" y2="44" stroke="#3a9bc1" stroke-width="6.5" stroke-linecap="round"/>
        <line x1="132" y1="22" x2="145" y2="44" stroke="#3a9bc1" stroke-width="6.5" stroke-linecap="round"/>
        <ellipse cx="188" cy="8" rx="9.5" ry="11" fill="#3a9bc1"/>
        <line x1="188" y1="22" x2="160" y2="14" stroke="#3a9bc1" stroke-width="8.5" stroke-linecap="round"/>
        <line x1="188" y1="22" x2="216" y2="14" stroke="#3a9bc1" stroke-width="8.5" stroke-linecap="round"/>
        <line x1="188" y1="22" x2="172" y2="48" stroke="#3a9bc1" stroke-width="8.5" stroke-linecap="round"/>
        <line x1="188" y1="22" x2="204" y2="48" stroke="#3a9bc1" stroke-width="8.5" stroke-linecap="round"/>
        <text x="2" y="104" font-family="Arial Rounded MT Bold,Arial Black,sans-serif" font-weight="900" font-size="64" fill="#1a1372">Ofsted</text>
      </svg>

      <!-- DfE -->
      <div class="dfe-wrap">
        <svg viewBox="0 0 44 58" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
          <rect x="7" y="19" width="30" height="6" rx="1" fill="#111"/>
          <line x1="12" y1="19" x2="10" y2="10" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="19" x2="22" y2="7" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="32" y1="19" x2="34" y2="10" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="10" cy="9" r="3.2" fill="#111"/>
          <circle cx="22" cy="6" r="3.8" fill="#111"/>
          <circle cx="34" cy="9" r="3.2" fill="#111"/>
          <line x1="22" y1="3" x2="22" y2="5" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
          <line x1="20.5" y1="4" x2="23.5" y2="4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M7 27 L37 27 L37 48 Q37 57 22 60 Q7 57 7 48 Z" fill="#fff" stroke="#111" stroke-width="1.8"/>
          <line x1="22" y1="27" x2="22" y2="60" stroke="#111" stroke-width="1"/>
          <line x1="7" y1="43" x2="37" y2="43" stroke="#111" stroke-width="1"/>
          <rect x="9" y="29" width="10" height="2" rx="0.5" fill="#111"/>
          <rect x="9" y="33" width="10" height="2" rx="0.5" fill="#111"/>
          <rect x="9" y="37" width="10" height="2" rx="0.5" fill="#111"/>
          <path d="M25 29 C27 31 29 34 28 38 C27 41 25 42 24 43" stroke="#111" stroke-width="2" stroke-linecap="round" fill="none"/>
          <circle cx="25.5" cy="29.5" r="1.8" fill="#111"/>
          <path d="M11 45 Q9 39 15 39 L15 57" stroke="#111" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <line x1="11" y1="57" x2="15" y2="57" stroke="#111" stroke-width="1.5" stroke-linecap="round"/>
          <rect x="24" y="45" width="10" height="2" rx="0.5" fill="#111"/>
          <rect x="24" y="49" width="10" height="2" rx="0.5" fill="#111"/>
          <rect x="24" y="53" width="10" height="2" rx="0.5" fill="#111"/>
          <path d="M1 42 C1 38 4 36 5 39 L5 49 C4 52 1 50 1 46 Z" fill="#111" opacity="0.5"/>
          <path d="M43 42 C43 38 40 36 39 39 L39 49 C40 52 43 50 43 46 Z" fill="#111" opacity="0.5"/>
          <line x1="39" y1="37" x2="42" y2="32" stroke="#111" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
        </svg>
        <div class="dfe-rule"></div>
        <div class="dfe-text">
          <span>Department</span>
          <span>for Education</span>
        </div>
      </div>

      <!-- ICO -->
      <div class="ico-wrap">
        <span class="ico-main">ico.</span>
        <span class="ico-sub">Information Commissioner's Office</span>
      </div>

    </div>

    <p class="cert-ref">${certId}</p>
  </div>

</div>
</body>
</html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const areasLine = areas && areas.length > 0 ? `\nKey stages assessed: ${areas.map(a => a.score !== undefined ? `${a.name} (${a.score}%)` : a.name).join(", ")}` : "";
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find attached your ${toolName} assessment certificate from SafeShield.\n\nTo save as PDF: open the tool, complete the assessment, click "Print / Save PDF" and choose "Save as PDF" from the print dialog.\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nCompleted by: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nScore:        ${score}% — ${rating}${areasLine}\nDate:         ${today}\nCertificate:  ${certId}\n\nKind regards,\n${meta.consultantName}\nSafeShield Assessment Tools`
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 26, height: 26, border: "2px solid #1a1a1a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 14 14"><path d="M7 1.5l4.5 2.25v4c0 2.25-1.8 4-4.5 5C4.3 11.75 2.5 10 2.5 7.75v-4L7 1.5z" fill="none" stroke="#1a1a1a" strokeWidth="1.3"/></svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a" }}>SafeShield</span>
            </div>
            <span style={{ fontSize: 10, color: "#888", letterSpacing: "0.5px" }}>Assessment Tools</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 10 }}>The</p>
        <p style={{ fontSize: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", lineHeight: 1.35, color: "#1a1a1a", marginBottom: 24, maxWidth: 380 }}>
          {toolName}<br />Assessment Certificate
        </p>
        <p style={{ fontSize: 14, fontStyle: "italic", color: "#555", marginBottom: 14 }}>has been completed by</p>
        <p style={{ fontSize: 28, fontStyle: "italic", fontWeight: 600, color: "#1a1a1a", marginBottom: 20 }}>{meta.schoolName || "School Name"}</p>
        <p style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>
          <span style={{ color: "#888" }}>Completed by: </span>{meta.staffMember || "—"}
        </p>
        <p style={{ fontSize: 13, color: "#444", marginBottom: areas && areas.length > 0 ? 8 : 24, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ color: "#888" }}>Assessment score:</span>
          <span style={{ color: ratingColor, background: "#000", border: `2px solid ${ratingColor}`, padding: "3px 12px", borderRadius: 5, fontWeight: 700, fontSize: 13 }}>{score}% — {rating}</span>
        </p>
        {areas && areas.length > 0 && (
          <div style={{ marginTop: 6, marginBottom: 24 }}>
            <p style={{ fontSize: 11, color: "#888", fontStyle: "italic", marginBottom: 6 }}>Key stages assessed:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
              {areas.map((a) => (
                <span key={a.name} style={{ fontSize: 11, color: "#444", display: "flex", alignItems: "center", gap: 5 }}>
                  {a.name}{a.score !== undefined && <strong style={{ fontSize: 10, color: "#1a1a1a" }}>{a.score}%</strong>}
                </span>
              ))}
            </div>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 32 }}>{today}</p>
        </div>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div style={{ textAlign: "left", minWidth: 160 }}>
            <div style={{ width: "100%", height: 1, background: "#1a1a1a", marginBottom: 4 }} />
            <p style={{ fontSize: 12, fontStyle: "italic", color: "#1a1a1a" }}>{meta.consultantName || "Consultant"}</p>
            <p style={{ fontSize: 10, color: "#888", marginTop: 1 }}>Consultant, SafeShield</p>
          </div>
        </div>

        {/* Bottom row: ribbon + compliance badges + cert ID */}
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 8 }}>
          {/* Centre of Excellence ribbon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              {/* Left ribbon tail */}
              <div style={{ width: 0, height: 0, borderTop: "14px solid #1a1a1a", borderBottom: "14px solid #1a1a1a", borderRight: "10px solid transparent", marginRight: -1 }} />
              <div style={{ background: "#1a1a1a", padding: "6px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 8.8,5.5 13.5,5.5 9.8,8.5 11.2,13 7,10.2 2.8,13 4.2,8.5 0.5,5.5 5.2,5.5" fill="#D4AF37"/></svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "system-ui, sans-serif" }}>Centre of Excellence</span>
                <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 8.8,5.5 13.5,5.5 9.8,8.5 11.2,13 7,10.2 2.8,13 4.2,8.5 0.5,5.5 5.2,5.5" fill="#D4AF37"/></svg>
              </div>
              {/* Right ribbon tail */}
              <div style={{ width: 0, height: 0, borderTop: "14px solid #1a1a1a", borderBottom: "14px solid #1a1a1a", borderLeft: "10px solid transparent", marginLeft: -1 }} />
            </div>
          </div>

          {/* Compliance logos */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 12 }}>

            {/* Ofsted — star-person figures wide arms + bold navy wordmark */}
            <svg viewBox="0 0 240 108" style={{ width: 130, height: 58 }} xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="86" cy="17" rx="5.5" ry="6.5" fill="#3a9bc1"/>
              <line x1="86" y1="26" x2="68" y2="21" stroke="#3a9bc1" strokeWidth="5" strokeLinecap="round"/>
              <line x1="86" y1="26" x2="104" y2="21" stroke="#3a9bc1" strokeWidth="5" strokeLinecap="round"/>
              <line x1="86" y1="26" x2="76" y2="44" stroke="#3a9bc1" strokeWidth="5" strokeLinecap="round"/>
              <line x1="86" y1="26" x2="96" y2="44" stroke="#3a9bc1" strokeWidth="5" strokeLinecap="round"/>
              <ellipse cx="132" cy="11" rx="7" ry="8.5" fill="#3a9bc1"/>
              <line x1="132" y1="22" x2="109" y2="16" stroke="#3a9bc1" strokeWidth="6.5" strokeLinecap="round"/>
              <line x1="132" y1="22" x2="155" y2="16" stroke="#3a9bc1" strokeWidth="6.5" strokeLinecap="round"/>
              <line x1="132" y1="22" x2="119" y2="44" stroke="#3a9bc1" strokeWidth="6.5" strokeLinecap="round"/>
              <line x1="132" y1="22" x2="145" y2="44" stroke="#3a9bc1" strokeWidth="6.5" strokeLinecap="round"/>
              <ellipse cx="188" cy="8" rx="9.5" ry="11" fill="#3a9bc1"/>
              <line x1="188" y1="22" x2="160" y2="14" stroke="#3a9bc1" strokeWidth="8.5" strokeLinecap="round"/>
              <line x1="188" y1="22" x2="216" y2="14" stroke="#3a9bc1" strokeWidth="8.5" strokeLinecap="round"/>
              <line x1="188" y1="22" x2="172" y2="48" stroke="#3a9bc1" strokeWidth="8.5" strokeLinecap="round"/>
              <line x1="188" y1="22" x2="204" y2="48" stroke="#3a9bc1" strokeWidth="8.5" strokeLinecap="round"/>
              <text x="2" y="104" fontFamily="Arial Rounded MT Bold, Arial Black, sans-serif" fontWeight="900" fontSize="64" fill="#1a1372">Ofsted</text>
            </svg>

            {/* DfE — coat of arms + vertical rule + text */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg viewBox="0 0 44 58" style={{ width: 30, height: 40 }} xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="19" width="30" height="6" rx="1" fill="#111"/>
                <line x1="12" y1="19" x2="10" y2="10" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="22" y1="19" x2="22" y2="7" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="32" y1="19" x2="34" y2="10" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="10" cy="9" r="3.2" fill="#111"/>
                <circle cx="22" cy="6" r="3.8" fill="#111"/>
                <circle cx="34" cy="9" r="3.2" fill="#111"/>
                <line x1="22" y1="3" x2="22" y2="5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/>
                <line x1="20.5" y1="4" x2="23.5" y2="4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M7 27 L37 27 L37 48 Q37 57 22 60 Q7 57 7 48 Z" fill="#fff" stroke="#111" strokeWidth="1.8"/>
                <line x1="22" y1="27" x2="22" y2="60" stroke="#111" strokeWidth="1"/>
                <line x1="7" y1="43" x2="37" y2="43" stroke="#111" strokeWidth="1"/>
                <rect x="9" y="29" width="10" height="2" rx="0.5" fill="#111"/>
                <rect x="9" y="33" width="10" height="2" rx="0.5" fill="#111"/>
                <rect x="9" y="37" width="10" height="2" rx="0.5" fill="#111"/>
                <path d="M25 29 C27 31 29 34 28 38 C27 41 25 42 24 43" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="25.5" cy="29.5" r="1.8" fill="#111"/>
                <path d="M11 45 Q9 39 15 39 L15 57" stroke="#111" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <line x1="11" y1="57" x2="15" y2="57" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="24" y="45" width="10" height="2" rx="0.5" fill="#111"/>
                <rect x="24" y="49" width="10" height="2" rx="0.5" fill="#111"/>
                <rect x="24" y="53" width="10" height="2" rx="0.5" fill="#111"/>
                <path d="M1 42 C1 38 4 36 5 39 L5 49 C4 52 1 50 1 46 Z" fill="#111" opacity="0.5"/>
                <path d="M43 42 C43 38 40 36 39 39 L39 49 C40 52 43 50 43 46 Z" fill="#111" opacity="0.5"/>
                <line x1="39" y1="37" x2="42" y2="32" stroke="#111" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
              </svg>
              <div style={{ width: 1, height: 40, background: "#111" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 400, color: "#111", fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.4, whiteSpace: "nowrap" }}>Department</span>
                <span style={{ fontSize: 13, fontWeight: 400, color: "#111", fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.4, whiteSpace: "nowrap" }}>for Education</span>
              </div>
            </div>

            {/* ICO — bold navy wordmark + subtitle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: "#003078", fontFamily: "Arial Black, Arial, sans-serif", lineHeight: 1, letterSpacing: "-1.5px" }}>ico.</span>
              <span style={{ fontSize: 7, color: "#003078", fontFamily: "Arial, sans-serif", lineHeight: 1.3, maxWidth: 85 }}>Information Commissioner's Office</span>
            </div>

          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 9, color: "#bbb", letterSpacing: "1px", fontFamily: "system-ui" }}>{certId}</span>
          </div>
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
