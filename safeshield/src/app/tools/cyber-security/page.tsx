"use client";
import { Shield } from "lucide-react";
import ToolPageHeader from "@/components/ui/ToolPageHeader";
import GlassCard from "@/components/ui/GlassCard";

export default function CyberSecurityPage() {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ToolPageHeader
          title="Cyber Security Checker"
          description="Assess your school's cyber security posture against NCSC guidance, DfE requirements, and Cyber Essentials. Covers network security, access controls, incident response, and staff awareness."
          accentColor="#F87171"
          icon={<Shield size={28} style={{ color: "#F87171" }} />}
        />
        <GlassCard>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#F8717118", border: "1px solid #F8717135" }}>
              <Shield size={28} style={{ color: "#F87171" }} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed">
              Assess your school's cyber security posture against NCSC guidance, DfE requirements, and Cyber Essentials. Covers network security, access controls, incident response, and staff awareness.
            </p>
            <p className="text-xs text-[#334155] mt-4">This tool is currently in development and will be available soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
