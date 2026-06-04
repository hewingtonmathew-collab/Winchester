"use client";
import { useRef } from "react";
import { Printer, Mail, ShieldCheck } from "lucide-react";
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

  function handlePrint() {
    const content = certRef.current?.innerHTML;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html>
<html><head><title>Certificate — ${toolName}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #F5F0E8; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
  .cert-page { width: 210mm; min-height: 148mm; background: #FAF6EE; position: relative; padding: 14mm 18mm; }
  .outer-border { position: absolute; inset: 6mm; border: 2px solid #C9A96E; pointer-events: none; }
  .inner-border { position: absolute; inset: 8.5mm; border: 0.5px solid #C9A96E; pointer-events: none; }
  .corner { position: absolute; width: 12mm; height: 12mm; }
  .corner svg { width: 100%; height: 100%; }
  .corner-tl { top: 5mm; left: 5mm; }
  .corner-tr { top: 5mm; right: 5mm; transform: scaleX(-1); }
  .corner-bl { bottom: 5mm; left: 5mm; transform: scaleY(-1); }
  .corner-br { bottom: 5mm; right: 5mm; transform: scale(-1); }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8mm; }
  .logo-wrap img { height: 44px; object-fit: contain; }
  .logo-placeholder { width: 44px; height: 44px; background: #EDE8DF; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #B8A98A; text-align: center; line-height: 1.3; }
  .brand { display: flex; align-items: center; gap: 7px; }
  .brand-icon { width: 26px; height: 26px; background: #1e293b; border-radius: 5px; display: flex; align-items: center; justify-content: center; }
  .brand-name { font-size: 12px; font-weight: 600; color: #4A3F30; letter-spacing: 0.5px; }
  .divider { width: 100%; height: 1px; background: linear-gradient(90deg, transparent, #C9A96E 30%, #C9A96E 70%, transparent); margin: 4mm 0; }
  .title-section { text-align: center; margin: 5mm 0; }
  .cert-label { font-size: 8px; letter-spacing: 5px; text-transform: uppercase; color: #9A8560; margin-bottom: 5px; font-family: 'Inter', sans-serif; font-weight: 400; }
  .cert-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #2C2215; line-height: 1.2; margin-bottom: 3px; }
  .cert-sub { font-size: 10px; color: #9A8560; font-style: italic; }
  .present-text { font-family: 'Inter', sans-serif; font-size: 10px; color: #7A6A50; text-align: center; margin: 4mm 0 2mm; letter-spacing: 1px; }
  .school-name { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: #2C2215; text-align: center; margin: 3mm 0; padding: 4mm 8mm; border-top: 1px solid #DDD0B5; border-bottom: 1px solid #DDD0B5; }
  .for-text { font-size: 10px; color: #9A8560; text-align: center; margin: 3mm 0 1mm; font-style: italic; }
  .assessment-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 600; color: #4A3F30; text-align: center; margin-bottom: 4mm; }
  .score-row { display: flex; justify-content: center; align-items: center; gap: 20mm; margin: 4mm 0; }
  .score-block { text-align: center; }
  .score-circle { width: 60px; height: 60px; border-radius: 50%; border: 2px solid #C9A96E; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 4px; background: #FAF6EE; }
  .score-num { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; }
  .score-tag { font-size: 7px; text-transform: uppercase; letter-spacing: 2px; color: #9A8560; margin-top: 3px; }
  .rating-block { text-align: center; }
  .rating-text { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
  .sig-section { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8mm; margin-top: 6mm; padding-top: 5mm; border-top: 1px solid #DDD0B5; align-items: start; }
  .sig-block { }
  .sig-line { width: 100%; height: 1px; background: #C9A96E; margin-bottom: 4px; }
  .sig-name { font-size: 11px; font-weight: 600; color: #2C2215; }
  .sig-role { font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #9A8560; margin-top: 2px; }
  .seal { text-align: center; }
  .seal-circle { width: 52px; height: 52px; border-radius: 50%; border: 2px solid #C9A96E; background: #FAF6EE; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; }
  .seal-text { font-size: 6px; text-transform: uppercase; letter-spacing: 1.5px; color: #9A8560; text-align: center; line-height: 1.6; }
  .date-text { font-size: 9px; color: #9A8560; text-align: center; margin-top: 5mm; font-style: italic; }
  @media print {
    body { background: #FAF6EE; }
    .cert-page { margin: 0; }
  }
</style>
</head><body>
<div class="cert-page">
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  ${content}
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 800);
  }

  function handleEmail() {
    const subject = encodeURIComponent(`${toolName} Certificate — ${meta.schoolName}`);
    const body = encodeURIComponent(
      `Dear ${meta.schoolName},\n\nPlease find below the ${toolName} assessment certificate completed on ${today}.\n\nTo save the certificate as a PDF:\n1. Open the SafeShield tool\n2. Complete the assessment\n3. Click "Print / Save PDF" on the certificate\n4. Choose "Save as PDF" in the print dialog\n\nAssessment Summary\n──────────────────\nSchool:       ${meta.schoolName}\nScore:        ${score}%\nRating:       ${rating}\nStaff Member: ${meta.staffMember}\nConsultant:   ${meta.consultantName}\nDate:         ${today}\n\nKind regards,\n${meta.consultantName}\nWinchester Consultancy`
    );
    const recipients = [meta.schoolEmail, meta.consultantEmail].filter(Boolean).join(",");
    window.location.href = `mailto:${recipients}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Certificate preview */}
      <div
        ref={certRef}
        style={{
          background: "#FAF6EE",
          border: "2px solid #C9A96E",
          borderRadius: 4,
          padding: "40px 52px",
          fontFamily: "Georgia, serif",
          position: "relative",
          color: "#2C2215",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            {meta.logoDataUrl ? (
              <img src={meta.logoDataUrl} alt="School logo" style={{ height: 44, objectFit: "contain" }} />
            ) : (
              <div style={{ width: 44, height: 44, background: "#EDE8DF", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "#B8A98A", textAlign: "center", lineHeight: 1.4 }}>School<br/>Logo</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 26, height: 26, background: "#1e293b", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#4A3F30", fontFamily: "system-ui, sans-serif", letterSpacing: "0.5px" }}>SafeShield · Winchester Consultancy</span>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, #C9A96E 25%, #C9A96E 75%, transparent)", marginBottom: 20 }} />

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 9, letterSpacing: 5, textTransform: "uppercase", color: "#9A8560", marginBottom: 8, fontFamily: "system-ui, sans-serif", fontWeight: 400 }}>Certificate of Assessment</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2C2215", marginBottom: 4, fontFamily: "Georgia, serif" }}>{toolName}</h1>
          <p style={{ fontSize: 11, color: "#9A8560", fontStyle: "italic" }}>This is to certify that the following institution has completed a formal assessment</p>
        </div>

        <p style={{ textAlign: "center", fontSize: 10, color: "#7A6A50", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Presented to</p>

        {/* School name */}
        <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid #DDD0B5", borderBottom: "1px solid #DDD0B5", marginBottom: 16 }}>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#2C2215", fontFamily: "Georgia, serif" }}>{meta.schoolName || "—"}</p>
        </div>

        {/* Score & Rating */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 48, margin: "16px 0" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid #C9A96E`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", background: "#FAF6EE" }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: ratingColor, fontFamily: "Georgia, serif" }}>{score}%</span>
            </div>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#9A8560", fontFamily: "system-ui, sans-serif" }}>Score</span>
          </div>
          <div style={{ width: 1, height: 48, background: "#DDD0B5" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: ratingColor, fontFamily: "Georgia, serif", marginBottom: 6 }}>{rating}</p>
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#9A8560", fontFamily: "system-ui, sans-serif" }}>Rating</span>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, #C9A96E 25%, #C9A96E 75%, transparent)", margin: "16px 0" }} />

        {/* Signatures */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "end" }}>
          <div>
            <div style={{ width: "100%", height: 1, background: "#C9A96E", marginBottom: 5 }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: "#2C2215", fontFamily: "Georgia, serif" }}>{meta.staffMember || "—"}</p>
            <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#9A8560", marginTop: 2, fontFamily: "system-ui, sans-serif" }}>Staff Member</p>
          </div>
          <div style={{ textAlign: "center", paddingBottom: 2 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid #C9A96E", background: "#FAF6EE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="#C9A96E" />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ width: "100%", height: 1, background: "#C9A96E", marginBottom: 5 }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: "#2C2215", fontFamily: "Georgia, serif" }}>{meta.consultantName || "—"}</p>
            <p style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: 2, color: "#9A8560", marginTop: 2, fontFamily: "system-ui, sans-serif" }}>Consultant</p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 9, color: "#B8A98A", marginTop: 14, fontStyle: "italic", fontFamily: "system-ui, sans-serif" }}>
          Completed: {today}
        </p>
      </div>

      {/* Action buttons */}
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
      <p className="text-[#475569] text-xs">
        Note: To email the PDF, first use "Print / Save PDF" to save it, then attach it manually to your email.
      </p>
    </div>
  );
}
