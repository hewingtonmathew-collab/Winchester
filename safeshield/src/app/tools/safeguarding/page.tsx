"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import SafeguardingChecker from "@/components/forms/SafeguardingChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { ShieldCheck } from "lucide-react";

const COLOR = "#34D399";
const AREAS = ["Online Filtering", "Online Monitoring", "Policy & AUPs", "DSL & Staff Training", "Curriculum Delivery", "Governor Oversight", "Devices & BYOD"];

export default function SafeguardingPage() {
  return (
    <AuthGuard toolSlug="safeguarding">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={ShieldCheck}
            badge="Risk Assessment"
            title="Safeguarding Risk Checker"
            description="Answer 15 structured questions across key safeguarding areas to receive an instant risk rating and prioritised action list aligned to KCSIE expectations."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <SafeguardingChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {AREAS.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Framework Alignment</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Questions are aligned to KCSIE, the UK Council for Internet Safety (UKCIS) framework, and Ofsted inspection expectations.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
