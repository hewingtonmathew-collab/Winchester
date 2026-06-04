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
};

export default function Certificate({ meta, toolName, score, rating, ratingColor, date, accentColor = "#38BDF8" }: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const today = date ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const certId = `SS-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${toolName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4 portrait; margin: 0; }
  html, body { width: 210mm; height: 297mm; background: #fff; font-family: 'EB Garamond', Georgia, serif; color: #1a1a1a; }
  .page { width: 210mm; height: 297mm; padding: 18mm 20mm 16mm; display: flex; flex-direction: column; position: relative; background: #fff; }
  .top-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18mm; }
  .school-logo img { height: 70px; object-fit: contain; }
  .school-logo-placeholder { width: 70px; height: 70px; }
  .brand-logo { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .brand-icon-row { display: flex; align-items: center; gap: 7px; }
  .brand-icon-box { width: 28px; height: 28px; border: 2px solid #1a1a1a; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
  .brand-name { font-size: 15px; font-weight: 600; color: #1a1a1a; letter-spacing: 0.3px; font-family: 'EB Garamond', serif; }
  .brand-sub { font-size: 10px; color: #666; letter-spacing: 0.5px; font-family: Georgia, serif; }
  .cert-body { flex: 1; }
  .the-text { font-size: 14px; color: #1a1a1a; margin-bottom: 5mm; font-family: 'EB Garamond', serif; }
  .cert-title { font-size: 22px; font-weight: 600; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3; margin-bottom: 8mm; font-family: 'EB Garamond', serif; max-width: 140mm; }
  .awarded-line { font-size: 14px; font-style: italic; color: #444; margin-bottom: 5mm; font-family: 'EB Garamond', serif; }
  .recipient-name { font-size: 32px; font-weight: 600; color: #1a1a1a; margin-bottom: 8mm; font-family: 'Cormorant Garamond', 'EB Garamond', serif; font-style: italic; }
  .detail-line { font-size: 13px; color: #333; margin-bottom: 3mm; font-family: 'EB Garamond', serif; }
  .detail-label { color: #666; }
  .score-line { font-size: 13px; color: #333; margin-bottom: 10mm; font-family: 'EB Garamond', serif; }
  .date-text { font-size: 13px; color: #1a1a1a; margin-bottom: 16mm; font-family: 'EB Garamond', serif; }
  .sig-section { display: flex; justify-content: flex-end; gap: 14mm; margin-bottom: 10mm; }
  .sig-block { text-align: left; min-width: 50mm; }
  .sig-line-rule { width: 50mm; height: 1px; background: #1a1a1a; margin-bottom: 3px; }
  .sig-name { font-size: 12px; font-style: italic; color: #1a1a1a; font-family: 'EB Garamond', serif; }
  .sig-role { font-size: 10px; color: #666; letter-spacing: 0.3px; font-family: Georgia, serif; margin-top: 1px; }
  .bottom-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; }
  .hologram { width: 28mm; height: 20mm; border: 1px solid #ccc; border-radius: 2px; background: linear-gradient(135deg, #e8e0d0, #f5f0e8, #ddd8c8, #ede8dc); display: flex; align-items: center; justify-content: center; }
  .hologram-inner { width: 22mm; height: 14mm; border: 1px solid #b8b0a0; border-radius: 1px; background: linear-gradient(45deg, rgba(100,150,200,0.2), rgba(150,200,100,0.2), rgba(200,100,150,0.2)); display: flex; align-items: center; justify-content: center; }
  .hologram-text { font-size: 6px; color: #888; letter-spacing: 0.5px; font-family: Georgia, serif; text-align: center; }
  .cert-ref { font-size: 9px; color: #999; letter-spacing: 1px; font-family: Georgia, serif; text-align: right; }
</style>
</head><body>
<div class="page">
  <div class="top-bar">
    <div class="school-logo">
      ${meta.logoDataUrl
        ? `<img src="${meta.logoDataUrl}" alt="School logo" />`
        : `<div class="school-logo-placeholder"></div>`
      }
    </div>
    <div class="brand-logo">
      <div class="brand-icon-row">
        <div class="brand-icon-box">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1.5l4.5 2.25v4c0 2.25-1.8 4-4.5 5C4.3 11.75 2.5 10 2.5 7.75v-4L7 1.5z" fill="none" stroke="#1a1a1a" stroke-width="1.3"/></svg>
        </div>
        <span class="brand-name">SafeShield</span>
      </div>
      <span class="brand-sub">Assessment Tools</span>
    </div>
  </div>

  <div class="cert-body">
    <p class="the-text">The</p>
    <p class="cert-title">${toolName}<br/>Assessment Certificate</p>
    <p class="awarded-line">has been awarded to</p>
    <p class="recipient-name">${meta.schoolName || "School Name"}</p>
    <p class="detail-line"><span class="detail-label">Completed by: </span>${meta.staffMember || "—"}</p>
    <p class="score-line"><span class="detail-label">Assessment score: </span><strong>${score}% — ${rating}</strong></p>
    <p class="date-text">${today}</p>
  </div>

  <div class="sig-section">
    <div class="sig-block">
      <div class="sig-line-rule"></div>
      <p class="sig-name">${meta.consultantName || "Consultant"}</p>
      <p class="sig-role">Consultant, SafeShield</p>
    </div>
  </div>

  <div class="bottom-row">
    <div class="hologram">
      <div class="hologram-inner">
        <span class="hologram-text">VERIFIED<br/>ASSESSMENT</span>
      </div>
    </div>
    <p class="cert-ref">${certId}</p>
  </div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 800);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find below your ${toolName} assessment certificate.\n\nTo save as PDF: open the tool, complete the assessment, then click "Print / Save PDF" and choose "Save as PDF".\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nScore:        ${score}%\nRating:       ${rating}\nCompleted by: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nDate:         ${today}\nCertificate:  ${certId}\n\nKind regards,\n${meta.consultantName}\nSafeShield`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      <div ref={certRef}
        style={{ background: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "36px 40px", fontFamily: "Georgia, serif", color: "#1a1a1a", minHeight: 480 }}>

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
        <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 10 }}>The</p>
        <p style={{ fontSize: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", lineHeight: 1.35, color: "#1a1a1a", marginBottom: 24, maxWidth: 380 }}>
          {toolName}<br />Assessment Certificate
        </p>
        <p style={{ fontSize: 14, fontStyle: "italic", color: "#555", marginBottom: 14 }}>has been awarded to</p>
        <p style={{ fontSize: 28, fontStyle: "italic", fontWeight: 600, color: "#1a1a1a", marginBottom: 20 }}>{meta.schoolName || "School Name"}</p>
        <p style={{ fontSize: 13, color: "#444", marginBottom: 6 }}>
          <span style={{ color: "#888" }}>Completed by: </span>{meta.staffMember || "—"}
        </p>
        <p style={{ fontSize: 13, color: "#444", marginBottom: 24 }}>
          <span style={{ color: "#888" }}>Assessment score: </span>
          <strong style={{ color: ratingColor }}>{score}% — {rating}</strong>
        </p>
        <p style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 32 }}>{today}</p>

        {/* Signature */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <div style={{ textAlign: "left", minWidth: 160 }}>
            <div style={{ width: "100%", height: 1, background: "#1a1a1a", marginBottom: 4 }} />
            <p style={{ fontSize: 12, fontStyle: "italic", color: "#1a1a1a" }}>{meta.consultantName || "Consultant"}</p>
            <p style={{ fontSize: 10, color: "#888", marginTop: 1 }}>Consultant, SafeShield</p>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ width: 80, height: 52, border: "1px solid #ccc", borderRadius: 2, background: "linear-gradient(135deg, #e8e0d0, #f5f0e8, #ddd8c8, #ede8dc)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 64, height: 38, border: "1px solid #b8b0a0", borderRadius: 1, background: "linear-gradient(45deg, rgba(100,150,200,0.2), rgba(150,200,100,0.2), rgba(200,100,150,0.2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 6, color: "#999", letterSpacing: "0.5px", textAlign: "center", fontFamily: "system-ui" }}>VERIFIED<br/>ASSESSMENT</span>
            </div>
          </div>
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
