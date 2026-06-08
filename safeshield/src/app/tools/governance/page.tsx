"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import GovernanceChecker from "@/components/forms/GovernanceChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import { ClipboardList } from "lucide-react";

const COLOR = "#A78BFA";
const AREAS = ["Board structure & delegation", "Skills, membership & CPD", "Statutory policy compliance", "Website publication requirements", "Accountability & challenge", "Financial oversight", "Register of interests"];

export default function GovernancePage() {
  return (
    <AuthGuard toolSlug="governance">
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ToolPageHeader
            icon={ClipboardList}
            badge="Compliance"
            title="Governance Compliance Checker"
            description="Check your governance arrangements against the DfE Governance Handbook. Identify gaps across board structure, skills, statutory compliance, accountability, and financial oversight."
            color={COLOR}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <GovernanceChecker />
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
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Aligned to the DfE Governance Handbook, the Academy Trust Handbook, and Ofsted's school inspection handbook expectations for governance.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
