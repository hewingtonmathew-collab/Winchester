"use client";
import { Shield } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import GlassCard from "@/components/ui/GlassCard";

const COLOR = "#F87171";
const DESC = "Assess your school's cyber security posture against NCSC guidance, DfE requirements, and Cyber Essentials. Covers network security, access controls, incident response, and staff awareness.";

export default function CyberSecurityPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader slug="cyber-security" icon={Shield} badge="Cyber" title="Cyber Security Checker" description={DESC} color={COLOR} />
        <GlassCard>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: COLOR + "18", border: `1px solid ${COLOR}35` }}>
              <Shield size={28} style={{ color: COLOR }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">{DESC}</p>
            <p className="text-xs text-[#334155] mt-4">This tool is currently in development and will be available soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
