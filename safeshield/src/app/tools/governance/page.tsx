"use client";
import AuthGuard from "@/components/ui/AuthGuard";
import GovernanceChecker from "@/components/forms/GovernanceChecker";
import GlassCard from "@/components/ui/GlassCard";
import ToolPageIcon from "@/components/ui/ToolPageIcon";
import { ClipboardList } from "lucide-react";

export default function GovernancePage() {
  return (
    <AuthGuard toolSlug="governance">
    <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-10 pb-10 flex items-start gap-4">
            <ToolPageIcon slug="governance" DefaultIcon={ClipboardList} color="#A78BFA" colorDim="rgba(167,139,250,0.1)" colorBorder="rgba(167,139,250,0.2)" />
            <div>
              <p className="text-[#A78BFA] text-xs font-medium uppercase tracking-widest mb-1">Compliance Checker</p>
              <h1 className="text-white text-3xl font-bold mb-2">Governance Compliance Checker</h1>
              <p className="text-[#94A3B8] text-sm max-w-xl leading-relaxed">
                Check your governance arrangements against the DfE Governance Handbook. Identify gaps across board structure, skills, statutory compliance, accountability, and financial oversight.
              </p>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <GovernanceChecker />
            </div>
            <div className="flex flex-col gap-4">
              <GlassCard>
                <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Areas Covered</h2>
                <ul className="flex flex-col gap-2">
                  {["Board structure & delegation", "Skills, membership & CPD", "Statutory policy compliance", "Website publication requirements", "Accountability & challenge", "Financial oversight", "Register of interests"].map((a) => (
                    <li key={a} className="flex items-center gap-2 text-[#64748B] text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard>
                <h2 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Framework Alignment</h2>
                <p className="text-[#475569] text-xs leading-relaxed">Aligned to the DfE Governance Handbook, the Academy Trust Handbook, and Ofsted's school inspection handbook expectations for governance.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}