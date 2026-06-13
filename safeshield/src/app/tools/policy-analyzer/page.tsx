"use client";
import { useState, useCallback } from "react";
import AuthGuard from "@/components/ui/AuthGuard";
import PolicyAnalyzer from "@/components/forms/PolicyAnalyzer";
import PolicyTemplateLibrary from "@/components/policy/PolicyTemplateLibrary";
import GlassCard from "@/components/ui/GlassCard";
import { FileSearch, LayoutGrid, FileText } from "lucide-react";

const ACCENT = "#A78BFA";
type PageTab = "templates" | "analyse" | "register";

export default function PolicyAnalyzerPage() {
  const [tab, setTab] = useState<PageTab>("templates");
  // When a generated template is sent to the analyzer, switch tab and pre-load text
  const [injectText, setInjectText] = useState<string | null>(null);

  const handleSendToAnalyzer = useCallback((text: string) => {
    setInjectText(text);
    setTab("analyse");
  }, []);

  const TABS = [
    { key: "templates" as const, label: "Template Library", Icon: LayoutGrid },
    { key: "analyse"   as const, label: "Analyse Policy",   Icon: FileSearch },
  ];

  return (
    <AuthGuard toolSlug="policy-analyzer">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="pt-10 pb-8 flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${ACCENT}1a`, border: `1px solid ${ACCENT}33` }}
            >
              <FileSearch size={22} style={{ color: ACCENT }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: ACCENT }}>
                Policy Suite
              </p>
              <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)" }}>
                Policy Analyzer & Templates
              </h1>
              <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Generate school-branded policies from DfE-aligned templates, or upload an existing policy for a compliance review against current UK legislation. Both tools feed into your school's policy register.
              </p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 mb-8">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                style={tab === key
                  ? { background: `${ACCENT}18`, borderColor: `${ACCENT}40`, color: ACCENT }
                  : { background: "rgba(255,255,255,0.03)", borderColor: "transparent", color: "var(--text-muted)" }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* ── Template library ────────────────────────────────────── */}
          {tab === "templates" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-1">
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Select a template, fill in your school details (pre-filled from your profile), upload your logo, and download a complete branded policy. Use <strong style={{ color: "var(--text)" }}>Send to Analyser</strong> to immediately run a compliance check on the generated document.
                </p>
              </div>
              <PolicyTemplateLibrary onSendToAnalyzer={handleSendToAnalyzer} />
            </div>
          )}

          {/* ── Analyse tab ─────────────────────────────────────────── */}
          {tab === "analyse" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <PolicyAnalyzer injectedText={injectText} onInjectedTextConsumed={() => setInjectText(null)} />
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
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>
                    Privacy by design
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Policy text is extracted in your browser and sent only for analysis. Nothing is stored server-side. The revised document is returned directly to you.
                  </p>
                </GlassCard>

                <GlassCard>
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text)" }}>
                    Tip
                  </h2>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Generate a policy from the Template Library, then use <strong style={{ color: "var(--text)" }}>Send to Analyser</strong> to check it instantly — great for verifying the template is up to date with your reference documents.
                  </p>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
