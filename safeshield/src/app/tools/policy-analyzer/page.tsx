"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import PolicyAnalyzer from "@/components/forms/PolicyAnalyzer";
import GlassCard from "@/components/ui/GlassCard";
import { FileSearch } from "lucide-react";

const ACCENT = "#A78BFA";

export default function PolicyAnalyzerPage() {
  return (
    <AuthGuard toolSlug="policy-analyzer">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="pt-10 pb-10 flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${ACCENT}1a`, border: `1px solid ${ACCENT}33` }}
            >
              <FileSearch size={22} style={{ color: ACCENT }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: ACCENT }}>
                Policy Review
              </p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                Policy Analyzer
              </h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Upload a school policy (.docx), receive a structured compliance report against current UK legislation and statutory guidance, then preview and apply AI-generated fixes before downloading the revised document.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <PolicyAnalyzer />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>
                  Legislation Checked
                </h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "UK GDPR / DPA 2018",
                    "Data (Use & Access) Act 2025",
                    "Online Safety Act 2023",
                    "Keeping Children Safe in Education",
                    "Working Together to Safeguard Children",
                    "DfE Filtering & Monitoring Standards",
                    "ICO Children's Code",
                    "SEND Code of Practice",
                    "Martyn's Law 2025",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text)" }}>
                  Policy Types Supported
                </h2>
                <ul className="flex flex-col gap-2">
                  {[
                    "Data Protection", "Online Safety", "ICT / AUP",
                    "Filtering & Monitoring", "AI Policy", "CCTV",
                    "Photographs of Children", "Freedom of Information", "Privacy Notice",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#34D399" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>
                  Privacy by design
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Policy text is extracted in your browser and sent only for analysis. Nothing is stored server-side. The revised document is generated and returned directly to you.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
